import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useProgressContext } from '../hooks/useProgressContext'
import { getAllQuestions } from '../data/questions/getQuestions'
import {
  getAllNormalizedQuestions,
  getAvailableLevels,
  getTopicsForLevel,
  getSubtopicsForLevelAndTopic,
  filterQuestions,
} from '../services/questionFilterService'
import pyqQuestions from '../data/pyqQuestions'
import { queryPYQs } from '../data/pyqs/index.js'
import Badge from '../components/ui/Badge'
import Icon from '../components/ui/Icon'
import userTrackingService from '../services/userTrackingService'
import { normalizeQuestion } from '../data/questions/metadataNormalizer'

// ── Helpers (logic unchanged) ───────────────────────────────────────────────

function isObjective(q) {
  return Array.isArray(q?.options) && typeof q?.correctAnswer === 'number'
}

const pyqById = Object.fromEntries(pyqQuestions.map(q => [q.id, q]))

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function selectQuestions({ mode, topic, level, subtopic, params, revisionQueue, attempted, bookmarks, count }) {
  const normalizedQ = getAllNormalizedQuestions()
  const allQ = [...normalizedQ, ...pyqQuestions]

  if (mode === 'pyq') {
    const id = params.get('id')
    if (id) {
      const q = pyqById[id]
      return q ? [q] : []
    }
    const raw = queryPYQs({
      sourceStatus: params.get('source') || 'all',
      section: params.get('section') || 'all',
      year: params.get('year') || 'all',
      topic: params.get('topic') || 'all',
      difficulty: params.get('difficulty') || 'all',
      progress: params.get('progress') || 'all',
    }, { attempted, bookmarks })
    const adapted = raw.map(q => pyqById[q.id]).filter(Boolean)
    const un = adapted.filter(q => !attempted[q.id])
    const at = adapted.filter(q => attempted[q.id])
    return [...shuffle(un), ...shuffle(at)]
  }

  let pool
  if (mode === 'revision') {
    pool = allQ.filter(q => revisionQueue.includes(q.id))
    if (topic === 'bookmarks') pool = allQ.filter(q => bookmarks.includes(q.id))
    if (pool.length === 0) pool = allQ.filter(q => attempted[q.id] && attempted[q.id].isCorrect === false)
  } else if (mode === 'weakness') {
    const topicAcc = {}
    Object.values(attempted).forEach(({ topic: t, isCorrect }) => {
      if (isCorrect === null || isCorrect === undefined) return
      if (!topicAcc[t]) topicAcc[t] = { c: 0, t: 0 }
      topicAcc[t].t += 1
      if (isCorrect) topicAcc[t].c += 1
    })
    const weakTopics = Object.entries(topicAcc)
      .filter(([, s]) => s.t > 0 && s.c / s.t < 0.6)
      .map(([t]) => t)
    if (topic !== 'all') pool = normalizedQ.filter(q => q.topic === topic)
    else pool = weakTopics.length > 0 ? normalizedQ.filter(q => weakTopics.includes(q.topic)) : normalizedQ
  } else {
    // Default branch: quick, timed, focused — supports level + subtopic filtering
    pool = topic === 'all' ? normalizedQ : normalizedQ.filter(q => q.topic === topic)
    if (level != null)   pool = pool.filter(q => q.level === level)
    if (subtopic != null) pool = pool.filter(q => q.subtopic === subtopic)
  }

  const unattempted = pool.filter(q => !attempted[q.id])
  const wrong = pool.filter(q => attempted[q.id] && attempted[q.id].isCorrect === false)
  const correct = pool.filter(q => attempted[q.id] && attempted[q.id].isCorrect === true)
  return [...shuffle(unattempted), ...shuffle(wrong), ...shuffle(correct)].slice(0, count)
}

// ── Instruction text per question type ─────────────────────────────────────

const TYPE_INSTRUCTION = {
  'fill-blank':          'Fill in the blank with the most appropriate option.',
  'error-spotting':      'Identify the grammatically incorrect part and select the correction.',
  'sentence-correction': 'Choose the correctly structured sentence.',
  'voice-conversion':    'Select the correct transformation of voice.',
  'speech-conversion':   'Select the correct form of reported speech.',
}

// ── OptionItem ──────────────────────────────────────────────────────────────

function OptionItem({ label, text, selected, revealed, isCorrect, onClick }) {
  // Row state
  let rowCls
  if (revealed) {
    if (isCorrect)     rowCls = 'bg-success-dim border-success/40'
    else if (selected) rowCls = 'bg-error-dim border-error/40'
    else               rowCls = 'bg-surface-container border-outline-variant opacity-50'
  } else if (selected) {
    rowCls = 'bg-accent-dim border-accent/40'
  } else {
    rowCls = 'bg-surface-container border-outline-variant hover:border-accent/30 hover:bg-accent-dim/20 active:scale-[0.99]'
  }

  // Letter badge state
  let badgeCls
  if (revealed) {
    if (isCorrect)     badgeCls = 'bg-success text-white border-success'
    else if (selected) badgeCls = 'bg-error text-white border-error'
    else               badgeCls = 'border border-outline text-on-dim'
  } else if (selected) {
    badgeCls = 'bg-accent text-white border-accent'
  } else {
    badgeCls = 'border border-outline text-on-variant'
  }

  return (
    <button
      onClick={!revealed ? onClick : undefined}
      disabled={revealed}
      className={`w-full flex items-center gap-3 px-4 py-3.5 border rounded-xl text-left transition-all ${rowCls}`}
    >
      <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 border ${badgeCls}`}>
        {label}
      </span>
      <span className={`text-sm flex-1 leading-relaxed ${
        revealed && !isCorrect && !selected ? 'text-on-dim' : 'text-on'
      }`}>
        {text}
      </span>
      {revealed && isCorrect  && <Icon name="check_circle" size={16} fill className="text-success flex-shrink-0" />}
      {revealed && selected && !isCorrect && <Icon name="cancel"       size={16} fill className="text-error flex-shrink-0" />}
    </button>
  )
}

// ── ExplanationBlock ────────────────────────────────────────────────────────

function ExplanationBlock({ q, isCorrect }) {
  return (
    <div className={`rounded-xl px-4 py-3 border ${
      isCorrect ? 'bg-success-dim border-success/30' : 'bg-error-dim border-error/30'
    }`}>
      {/* Result + revision chip */}
      <div className="flex items-center gap-2 mb-2">
        <Icon
          name={isCorrect ? 'check_circle' : 'cancel'}
          size={15} fill
          className={isCorrect ? 'text-success' : 'text-error'}
        />
        <span className={`text-xs font-semibold ${isCorrect ? 'text-success' : 'text-error'}`}>
          {isCorrect ? 'Correct' : 'Incorrect'}
        </span>
        {!isCorrect && (
          <span className="ml-auto text-2xs text-on-dim bg-surface-container border border-outline-variant rounded-full px-2 py-0.5 flex-shrink-0">
            Added to Revision
          </span>
        )}
      </div>

      {/* Concept tag (Stitch lightbulb row) */}
      {q.conceptTag && (
        <div className="flex items-center gap-1.5 mb-2">
          <Icon name="lightbulb" size={13} fill className="text-on-dim" />
          <span className="text-2xs bg-surface-container border border-outline-variant text-on-variant px-2 py-0.5 rounded-sm">
            {q.conceptTag}
          </span>
        </div>
      )}

      <p className="text-sm text-on leading-relaxed">{q.explanation}</p>

      {q.trap && (
        <p className="text-xs text-warn mt-2 leading-relaxed border-t border-outline-variant/40 pt-2">
          <span className="font-semibold">Trap: </span>{q.trap}
        </p>
      )}
    </div>
  )
}

// ── ResultsScreen ───────────────────────────────────────────────────────────

function ResultsScreen({ answers, onRetry, onDone, onReviseWrong }) {
  const graded   = answers.filter(a => typeof a.isCorrect === 'boolean')
  const correct  = graded.filter(a => a.isCorrect).length
  const wrong    = graded.length - correct
  const reviewed = answers.length - graded.length
  const accuracy = graded.length > 0 ? Math.round((correct / graded.length) * 100) : null

  const color = accuracy === null ? 'text-accent'
    : accuracy >= 70 ? 'text-success' : accuracy >= 50 ? 'text-warn' : 'text-error'
  const msg = accuracy === null
    ? `${reviewed} question${reviewed !== 1 ? 's' : ''} reviewed`
    : accuracy >= 80 ? 'Strong performance.' : accuracy >= 60 ? 'Review the mistakes below.' : 'Focus on weak areas.'

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="max-w-lg mx-auto px-4 w-full pb-8">

        <div className="pt-8 pb-4 text-center">
          <p className={`font-display font-bold text-5xl mb-1 ${color}`}>
            {accuracy !== null ? `${accuracy}%` : reviewed}
          </p>
          <p className="text-sm text-on-variant">{msg}</p>
        </div>

        <div className="flex gap-2 mb-4">
          {[
            { label: 'Correct',  value: correct,  cls: 'text-success' },
            { label: 'Wrong',    value: wrong,    cls: 'text-error' },
            { label: reviewed > 0 ? 'Reviewed' : 'Total', value: reviewed > 0 ? reviewed : answers.length, cls: 'text-on' },
          ].map(({ label, value, cls }) => (
            <div key={label} className="flex-1 bg-surface-container border border-outline-variant rounded-xl p-3 text-center">
              <p className={`font-display font-bold text-xl ${cls}`}>{value}</p>
              <p className="text-2xs text-on-dim">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 mb-5">
          {wrong > 0 && (
            <button
              onClick={onReviseWrong}
              className="w-full flex items-center justify-center gap-2 bg-error-dim border border-error/20 text-error text-sm font-semibold py-3 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all"
            >
              <Icon name="replay" size={18} fill className="text-error" />
              Revise {wrong} Wrong Answer{wrong > 1 ? 's' : ''}
            </button>
          )}
          <div className="flex gap-2">
            <button
              onClick={onRetry}
              className="flex-1 bg-surface-low border border-outline-variant text-on text-sm font-medium py-2.5 rounded-xl hover:bg-outline-variant active:scale-[0.99] transition-all"
            >
              Retry
            </button>
            <button
              onClick={onDone}
              className="flex-1 bg-accent text-white text-sm font-medium py-2.5 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all"
            >
              Done
            </button>
          </div>
        </div>

        {wrong > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-on-dim uppercase tracking-widest mb-2">Mistakes</p>
            <div className="space-y-2.5">
              {graded.filter(a => !a.isCorrect).map(({ question, selected }) => (
                <div key={question.id} className="bg-surface-container border border-outline-variant rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <Badge variant="default" size="xs">{question.topic}</Badge>
                    {question.difficulty && (
                      <Badge variant={question.difficulty === 'hard' ? 'error' : question.difficulty === 'medium' ? 'warn' : 'success'} size="xs">
                        {question.difficulty}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-on leading-relaxed mb-2 whitespace-pre-line line-clamp-3">
                    {question.question || question.questionText}
                  </p>
                  <p className="text-xs text-error mb-0.5">✗ {selected >= 0 ? question.options[selected] : 'Skipped'}</p>
                  <p className="text-xs text-success mb-1.5">✓ {question.options[question.correctAnswer]}</p>
                  {question.explanation && (
                    <p className="text-xs text-on-variant leading-relaxed">{question.explanation}</p>
                  )}
                  {question.trap && (
                    <p className="text-xs text-warn mt-1 leading-relaxed">
                      <span className="font-medium">Trap: </span>{question.trap}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {answers.some(a => a.isCorrect === null && a.selfRating === 'review') && (
          <div className="mb-4">
            <p className="text-xs font-medium text-on-dim uppercase tracking-widest mb-2">Flagged for Review</p>
            <div className="space-y-2">
              {answers.filter(a => a.isCorrect === null && a.selfRating === 'review').map(({ question }) => (
                <div key={question.id} className="bg-surface-container border border-outline-variant rounded-xl p-3">
                  <Badge variant="default" size="xs">{question.topic}</Badge>
                  <p className="text-sm text-on leading-relaxed mt-1.5 line-clamp-2">
                    {(question.questionText || question.question)?.split('\n')[0]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// ── SubjectiveBlock ─────────────────────────────────────────────────────────

const WRITING_TYPES = ['essay', 'precis', 'translation']

function SubjectiveBlock({ q, revealed, onShow, onRate, onSkip }) {
  const [response, setResponse] = useState('')
  const isWriting = WRITING_TYPES.includes(q.type)
  const isSample  = q.sourceStatus !== 'real-pyq'
  const words     = response.trim() ? response.trim().split(/\s+/).length : 0

  return (
    <div className="flex flex-col gap-3">

      {/* Sample label */}
      {isSample && (
        <div className="flex items-center gap-2 px-3 py-2 bg-surface-low border border-outline-variant rounded-lg">
          <Icon name="info" size={14} className="text-on-dim flex-shrink-0" />
          <p className="text-xs text-on-variant">
            <span className="font-medium text-on">Sample Practice.</span> This is UPSC-style content, not a real PYQ.
          </p>
        </div>
      )}

      {/* Passage */}
      {q.passageText && (
        <div className="bg-surface-low border border-outline-variant rounded-xl px-4 py-3 max-h-56 overflow-y-auto">
          <p className="text-2xs font-medium text-on-dim uppercase tracking-widest mb-1.5">Passage</p>
          <p className="text-sm text-on leading-relaxed whitespace-pre-line">{q.passageText}</p>
        </div>
      )}

      {/* Question counter */}
      <div className="flex items-center justify-between mb-2 px-1">
        <p className="text-2xs font-semibold text-on-dim">Question {index + 1} of {questions.length}</p>
      </div>

      {/* Question prompt */}
      <div className="bg-surface-container border border-outline-variant rounded-xl px-4 py-3">
        <p className="text-base text-on leading-relaxed whitespace-pre-line">{q.questionText || q.question}</p>
        {q.estimatedTime && (
          <p className="text-2xs text-on-dim mt-2 flex items-center gap-1">
            <Icon name="schedule" size={12} className="text-on-dim" />
            Suggested: ~{q.estimatedTime} min
          </p>
        )}
      </div>

      {/* Writing area for essay/précis/translation */}
      {isWriting && !revealed && (
        <div className="border border-outline-variant rounded-xl overflow-hidden bg-surface-container">
          <textarea
            value={response}
            onChange={e => setResponse(e.target.value)}
            placeholder="Write your response here…"
            rows={6}
            className="w-full px-4 py-3 text-sm text-on bg-surface-container resize-none focus:outline-none placeholder:text-on-dim leading-relaxed"
          />
          <div className="flex items-center justify-between px-4 py-2 border-t border-outline-variant bg-surface-low">
            <p className="text-2xs text-on-dim">Practice response</p>
            <p className={`text-2xs font-medium tabular-nums ${words > 250 ? 'text-error' : 'text-on-dim'}`}>
              {words} words
            </p>
          </div>
        </div>
      )}

      {/* Model answer — only after reveal */}
      {revealed && (
        <div className="rounded-xl px-4 py-3 border bg-success-dim border-success/30">
          <p className="text-xs font-semibold text-success mb-1.5">Model Answer</p>
          {q.modelAnswer ? (
            <p className="text-sm text-on leading-relaxed whitespace-pre-line">{q.modelAnswer}</p>
          ) : (
            <p className="text-sm text-on-variant italic">Model answer not yet available for this question.</p>
          )}
          {q.explanation && (
            <p className="text-xs text-on-variant mt-2 leading-relaxed">
              <span className="font-medium text-on">Approach: </span>{q.explanation}
            </p>
          )}
          {q.trap && (
            <p className="text-xs text-warn mt-1.5 leading-relaxed">
              <span className="font-medium">Note: </span>{q.trap}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {!revealed ? (
          <>
            <button
              onClick={onSkip}
              className="bg-surface-low border border-outline-variant text-on-variant text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-outline-variant active:scale-[0.98] transition-all flex-shrink-0"
            >
              Skip
            </button>
            <button
              onClick={onShow}
              className="flex-1 bg-accent text-white text-sm font-semibold py-2.5 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all"
            >
              View Model Answer
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onRate('review')}
              className="flex-1 bg-warn-dim border border-warn/20 text-warn text-sm font-semibold py-2.5 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all"
            >
              Need to Review
            </button>
            <button
              onClick={() => onRate('mastered')}
              className="flex-1 bg-success-dim border border-success/20 text-success text-sm font-semibold py-2.5 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all"
            >
              Got It
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ── PracticeSelector ────────────────────────────────────────────────────────
// Shown when user arrives at /practice without a drill mode param.
// Provides two tabs: By Level (level cards) and By Topic (cascading picker).

const QUICK_FILTERS = [
  { label: 'Weak Levels',        icon: 'trending_down', to: '/practice?mode=weakness&topic=all' },
  { label: 'Answer Writing',     icon: 'edit_note',     to: '/practice?mode=focused&level=9' },
  { label: 'Connectors',         icon: 'link',          to: '/practice?mode=focused&level=4' },
  { label: 'Academic Vocab',     icon: 'school',        to: '/practice?mode=focused&level=8' },
  { label: 'Phrasal Verbs',      icon: 'translate',     to: '/practice?mode=focused&level=6' },
]

function PracticeSelector({ navigate, activeTab }) {
  const levels = getAvailableLevels()

  const [selLevel,    setSelLevel]    = useState(null)
  const [selTopic,    setSelTopic]    = useState(null)
  const [selSubtopic, setSelSubtopic] = useState(null)

  const topics    = selLevel != null ? getTopicsForLevel(selLevel) : []
  const subtopics = selLevel != null && selTopic != null
    ? getSubtopicsForLevelAndTopic(selLevel, selTopic)
    : []

  const previewCount = filterQuestions({
    ...(selLevel != null && { level: selLevel }),
    ...(selTopic != null && { topic: selTopic }),
    ...(selSubtopic != null && { subtopic: selSubtopic }),
  }).length

  function handleLevelSelect(lv) {
    if (selLevel === lv) { setSelLevel(null); setSelTopic(null); setSelSubtopic(null) }
    else { setSelLevel(lv); setSelTopic(null); setSelSubtopic(null) }
  }

  function handleTopicSelect(tp) {
    if (selTopic === tp) { setSelTopic(null); setSelSubtopic(null) }
    else { setSelTopic(tp); setSelSubtopic(null) }
  }

  function startFocused() {
    if (selLevel == null) return
    const p = new URLSearchParams({ mode: 'focused', level: String(selLevel) })
    if (selTopic)    p.set('topic', selTopic)
    if (selSubtopic) p.set('subtopic', selSubtopic)
    navigate(`/practice?${p.toString()}`)
  }

  return (
    <main className="flex-1 safe-pb overflow-y-auto">
      <div className="max-w-lg mx-auto px-4 pb-8">

        {/* Header */}
        <div className="pt-5 pb-3">
          <h1 className="font-display font-bold text-2xl text-on">Practice</h1>
          <p className="text-sm text-on-variant mt-0.5">Choose a level or topic to practise exactly what you need.</p>
        </div>

        {/* Quick-start row */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => navigate('/practice?mode=quick&topic=all')}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-3 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all min-h-[44px]"
          >
            <Icon name="bolt" size={18} fill className="text-white" />
            Quick Drill
          </button>
          <button
            onClick={() => navigate('/practice?mode=weakness&topic=all')}
            className="flex items-center justify-center gap-2 bg-warn-dim border border-warn/20 text-warn text-sm font-semibold px-4 py-3 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all min-h-[44px]"
          >
            <Icon name="trending_up" size={18} fill className="text-warn" />
            Weakness
          </button>
          <button
            onClick={() => navigate('/revision')}
            className="flex items-center justify-center gap-2 bg-error-dim border border-error/20 text-error text-sm font-semibold px-4 py-3 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all min-h-[44px]"
          >
            <Icon name="replay" size={18} fill className="text-error" />
            Revise
          </button>
        </div>

        {/* Quick filter chips — horizontal scroll, no wrap */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 mb-4" style={{ scrollbarWidth: 'none' }}>
          {QUICK_FILTERS.map(({ label, icon, to }) => (
            <button
              key={label}
              onClick={() => navigate(to)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-surface-container border border-outline-variant text-on-variant text-xs font-semibold rounded-xl hover:border-accent/40 hover:text-on active:scale-[0.98] transition-all min-h-[36px]"
            >
              <Icon name={icon} size={13} className="text-on-dim flex-shrink-0" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab switcher — By Level / By Topic */}
        <div className="flex gap-1 mb-4 p-1 bg-surface-low rounded-xl border border-outline-variant">
          {[
            { key: 'level', label: 'By Level', icon: 'layers' },
            { key: 'topic', label: 'By Topic', icon: 'category' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => navigate(`/practice?mode=${tab.key}`)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all min-h-[36px] ${
                activeTab === tab.key
                  ? 'bg-primary text-white'
                  : 'text-on-variant hover:text-on'
              }`}
            >
              <Icon name={tab.icon} size={14} fill={activeTab === tab.key} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── By Level ─────────────────────────────────────────────────────── */}
        {activeTab === 'level' && (
          <div className="space-y-2">
            {levels.map(({ level, title, difficulty, questionCount }) => {
              const statusVariant = questionCount >= 100 ? 'success' : questionCount >= 50 ? 'warn' : 'error'
              const statusLabel   = questionCount >= 100 ? 'Good'    : questionCount >= 50 ? 'Moderate' : 'Weak'
              return (
                <button
                  key={level}
                  onClick={() => navigate(`/practice?mode=focused&level=${level}`)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 bg-surface-container border border-outline-variant rounded-xl hover:border-accent/30 hover:bg-accent-dim/10 active:scale-[0.99] transition-all text-left min-h-[68px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">{level}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on truncate mb-1">{title}</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="default" size="xs">{difficulty}</Badge>
                      <Badge variant={statusVariant} size="xs">{statusLabel}</Badge>
                      <span className="text-2xs text-on-dim">{questionCount} Q</span>
                    </div>
                  </div>
                  <Icon name="arrow_forward" size={16} className="text-on-dim flex-shrink-0" />
                </button>
              )
            })}
          </div>
        )}

        {/* ── By Topic ─────────────────────────────────────────────────────── */}
        {activeTab === 'topic' && (
          <div className="space-y-5">

            {/* Step 1 — Level grid */}
            <div>
              <p className="text-xs font-medium text-on-dim uppercase tracking-widest mb-2">Select Level</p>
              <div className="grid grid-cols-5 gap-1.5">
                {levels.map(({ level: lv, questionCount }) => (
                  <button
                    key={lv}
                    onClick={() => handleLevelSelect(lv)}
                    className={`py-2.5 rounded-xl border text-xs font-bold transition-all min-h-[52px] ${
                      selLevel === lv
                        ? 'bg-primary text-white border-primary'
                        : 'bg-surface-container border-outline-variant text-on-variant hover:border-primary/40'
                    }`}
                  >
                    L{lv}
                    <span className={`block text-2xs font-normal mt-0.5 ${selLevel === lv ? 'text-white/70' : 'text-on-dim'}`}>
                      {questionCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 — Topic chips with counts */}
            {topics.length > 0 && (
              <div>
                <p className="text-xs font-medium text-on-dim uppercase tracking-widest mb-2">Select Topic</p>
                <div className="flex flex-wrap gap-1.5">
                  {topics.map(tp => {
                    const count = filterQuestions({ level: selLevel, topic: tp }).length
                    return (
                      <button
                        key={tp}
                        onClick={() => count > 0 && handleTopicSelect(tp)}
                        disabled={count === 0}
                        className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold border transition-all min-h-[44px] ${
                          selTopic === tp
                            ? 'bg-accent text-white border-accent'
                            : count === 0
                              ? 'bg-surface-low border-outline-variant text-on-dim opacity-40 cursor-not-allowed'
                              : 'bg-surface-container border-outline-variant text-on-variant hover:border-accent/40'
                        }`}
                      >
                        {tp}
                        <span className={`text-2xs tabular-nums ${selTopic === tp ? 'text-white/70' : 'text-on-dim'}`}>
                          {count}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Step 3 — Subtopic chips with counts (only if more than 1 option) */}
            {subtopics.length > 1 && (
              <div>
                <p className="text-xs font-medium text-on-dim uppercase tracking-widest mb-2">
                  Select Subtopic{' '}
                  <span className="normal-case text-on-dim font-normal">(optional)</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {subtopics.map(st => {
                    const count = filterQuestions({ level: selLevel, topic: selTopic, subtopic: st }).length
                    return (
                      <button
                        key={st}
                        onClick={() => count > 0 && setSelSubtopic(selSubtopic === st ? null : st)}
                        disabled={count === 0}
                        className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold border transition-all min-h-[44px] ${
                          selSubtopic === st
                            ? 'bg-surface-container border-accent text-accent'
                            : count === 0
                              ? 'bg-surface-low border-outline-variant text-on-dim opacity-40 cursor-not-allowed'
                              : 'bg-surface-container border-outline-variant text-on-variant hover:border-accent/40'
                        }`}
                      >
                        {st}
                        <span className={`text-2xs tabular-nums ${selSubtopic === st ? 'text-accent/70' : 'text-on-dim'}`}>
                          {count}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Preview + Start */}
            {selLevel != null ? (
              <div className="bg-surface-container border border-outline-variant rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-on">
                    {previewCount > 0 ? `${previewCount} questions available` : 'No questions for this selection'}
                  </p>
                  <p className="text-xs text-on-dim mt-0.5 truncate">
                    {[`Level ${selLevel}`, selTopic, selSubtopic].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <button
                  onClick={startFocused}
                  disabled={previewCount === 0}
                  className="flex-shrink-0 flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-[0.99] disabled:opacity-40 transition-all min-h-[44px]"
                >
                  Start
                  <Icon name="arrow_forward" size={16} fill className="text-white" />
                </button>
              </div>
            ) : (
              <div className="text-center py-6">
                <Icon name="filter_list" size={32} className="text-on-dim mx-auto mb-2" />
                <p className="text-sm text-on-variant">Select a level above to continue</p>
              </div>
            )}

          </div>
        )}

      </div>
    </main>
  )
}

// ── Main Practice screen ────────────────────────────────────────────────────

const OPTION_LABELS = ['A', 'B', 'C', 'D']
const MODE_LABEL = { quick: 'Quick', timed: 'Timed', weakness: 'Weakness', pyq: 'PYQ', revision: 'Revision', focused: 'Focused' }
const COUNT_MAP  = { quick: 10, timed: 20, weakness: 15, pyq: 999, revision: 10, focused: 15 }

export default function Practice() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { attempted, revisionQueue, bookmarks, recordAnswer, recordReview, toggleBookmark, isBookmarked } = useProgressContext()

  // Get logged-in user ID for tracking
  const userId = userTrackingService.getLoggedInUserId()
  const startTimeRef = useRef(Date.now())

  const rawMode  = params.get('mode')
  const topic    = params.get('topic') || 'all'
  const level    = params.get('level') ? parseInt(params.get('level'), 10) : null
  const subtopic = params.get('subtopic') || null

  // If level/subtopic params are given with no explicit mode, treat as focused drill.
  // Otherwise show the selection UI for unrecognised or missing mode values.
  const resolvedMode    = rawMode || (level != null || subtopic != null ? 'focused' : null)
  const DRILL_MODES     = new Set(['quick', 'timed', 'weakness', 'pyq', 'revision', 'focused'])
  const isSelectionMode = !resolvedMode || !DRILL_MODES.has(resolvedMode)
  const mode            = isSelectionMode ? 'quick' : resolvedMode  // 'quick' never used in selection path
  const activeTab       = rawMode === 'topic' ? 'topic' : 'level'   // tab within selection UI

  const isTimed    = mode === 'timed'
  const timePerQ   = 60
  const drillCount = COUNT_MAP[mode] || 10

  const [questions, setQuestions] = useState([])
  const [index,     setIndex]     = useState(0)
  const [selected,  setSelected]  = useState(null)
  const [revealed,  setRevealed]  = useState(false)
  const [answers,   setAnswers]   = useState([])
  const [done,      setDone]      = useState(false)
  const [timeLeft,  setTimeLeft]  = useState(timePerQ)
  const [timedOut,  setTimedOut]  = useState(false)
  // Per-question session state — keyed by question index
  // { selected, isCorrect, revealed, savedAttempt, selfRating? }
  const [sessionAnswers, setSessionAnswers] = useState({})
  const timerRef    = useRef(null)
  const selectedRef = useRef(null)
  useEffect(() => { selectedRef.current = selected }, [selected])

  const loadQuestions = useCallback(() => {
    if (isSelectionMode) return
    const qs = selectQuestions({ mode, topic, level, subtopic, params, revisionQueue, attempted, bookmarks, count: drillCount })
    setQuestions(qs)
    setIndex(0)
    setSelected(null)
    setRevealed(false)
    setAnswers([])
    setDone(false)
    setTimedOut(false)
    setTimeLeft(timePerQ)
    setSessionAnswers({})
  }, [isSelectionMode, mode, topic, level, subtopic, revisionQueue, attempted, bookmarks, drillCount, timePerQ])

  // Runs when component mounts or when user transitions from selection → drill
  useEffect(() => { loadQuestions() }, [isSelectionMode])

  const q         = questions[index]
  const objective = q ? isObjective(q) : true

  // Per-question countdown (timed mode)
  useEffect(() => {
    if (!isTimed || revealed || done || questions.length === 0 || !objective) return
    setTimeLeft(timePerQ)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); setTimedOut(true); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [index, isTimed, done, questions.length, objective])

  useEffect(() => {
    if (timedOut) { setTimedOut(false); doReveal(selectedRef.current) }
  }, [timedOut])

  // Save attempt to user tracking service
  function saveAttemptToTracking(question, selectedAnswer, isCorrect) {
    if (!userId) return // Only save if user is logged in

    const normalized = normalizeQuestion(question)
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000)

    userTrackingService.saveQuestionAttempt({
      user_id: userId,
      question_id: question.id,
      level: normalized.level || 1,
      topic: normalized.topic || 'Unknown',
      subtopic: normalized.subtopic || 'Unknown',
      selected_answer: selectedAnswer,
      correct_answer: question.correctAnswer ?? 0,
      is_correct: isCorrect === true,
      time_taken_seconds: timeTaken,
      mistake_type: normalized.mistake_type || null,
    })

    startTimeRef.current = Date.now() // Reset timer for next question
  }

  function advance() {
    const nextIdx = index + 1
    if (nextIdx >= questions.length) {
      setDone(true)
    } else {
      const saved = sessionAnswers[nextIdx] || {}
      setIndex(nextIdx)
      setSelected(saved.selected ?? null)
      setRevealed(saved.revealed ?? false)
      setTimeLeft(timePerQ)
    }
  }

  function goBack() {
    if (index === 0) return
    const prevIdx = index - 1
    const saved = sessionAnswers[prevIdx] || {}
    clearInterval(timerRef.current)
    setIndex(prevIdx)
    setSelected(saved.selected ?? null)
    setRevealed(saved.revealed ?? false)
    setTimeLeft(timePerQ)
  }

  function doReveal(sel) {
    const finalSel = sel ?? -1
    clearInterval(timerRef.current)
    setRevealed(true)
    const cur = questions[index]
    if (!cur) return
    const isCorrect = recordAnswer(cur, finalSel)
    if (!sessionAnswers[index]?.savedAttempt) {
      saveAttemptToTracking(cur, finalSel, isCorrect)
    }
    setSessionAnswers(prev => ({
      ...prev,
      [index]: { selected: finalSel, isCorrect, revealed: true, savedAttempt: true },
    }))
    setAnswers(prev => {
      const existing = prev.findIndex(a => a.question.id === cur.id)
      const entry = { question: cur, selected: finalSel, isCorrect }
      if (existing >= 0) { const u = [...prev]; u[existing] = entry; return u }
      return [...prev, entry]
    })
  }

  function showModelAnswer() { setRevealed(true) }

  function rateSubjective(rating) {
    const cur = questions[index]
    recordReview(cur, rating)
    if (userId && !sessionAnswers[index]?.savedAttempt) {
      const normalized = normalizeQuestion(cur)
      userTrackingService.saveQuestionAttempt({
        user_id: userId,
        question_id: cur.id,
        level: normalized.level || 1,
        topic: normalized.topic || 'Unknown',
        subtopic: normalized.subtopic || 'Unknown',
        selected_answer: null,
        correct_answer: null,
        is_correct: null,
        time_taken_seconds: Math.round((Date.now() - startTimeRef.current) / 1000),
        mistake_type: null,
      })
      startTimeRef.current = Date.now()
    }
    setSessionAnswers(prev => ({
      ...prev,
      [index]: { selected: null, isCorrect: null, revealed: true, savedAttempt: true, selfRating: rating },
    }))
    setAnswers(prev => {
      const existing = prev.findIndex(a => a.question.id === cur.id)
      const entry = { question: cur, selected: null, isCorrect: null, selfRating: rating }
      if (existing >= 0) { const u = [...prev]; u[existing] = entry; return u }
      return [...prev, entry]
    })
    advance()
  }

  function handleSkip() {
    const cur = questions[index]
    if (isObjective(cur)) {
      recordAnswer(cur, -1)
      saveAttemptToTracking(cur, -1, false)
      setSessionAnswers(prev => ({
        ...prev,
        [index]: { selected: -1, isCorrect: false, revealed: true, savedAttempt: true },
      }))
      setAnswers(prev => {
        if (prev.some(a => a.question.id === cur.id)) return prev
        return [...prev, { question: cur, selected: -1, isCorrect: false }]
      })
    } else {
      recordReview(cur, 'review')
      if (userId) {
        const normalized = normalizeQuestion(cur)
        userTrackingService.saveQuestionAttempt({
          user_id: userId,
          question_id: cur.id,
          level: normalized.level || 1,
          topic: normalized.topic || 'Unknown',
          subtopic: normalized.subtopic || 'Unknown',
          selected_answer: null,
          correct_answer: null,
          is_correct: null,
          time_taken_seconds: Math.round((Date.now() - startTimeRef.current) / 1000),
          mistake_type: null,
        })
        startTimeRef.current = Date.now()
      }
      setSessionAnswers(prev => ({
        ...prev,
        [index]: { selected: null, isCorrect: null, revealed: true, savedAttempt: true, selfRating: 'review' },
      }))
      setAnswers(prev => {
        if (prev.some(a => a.question.id === cur.id)) return prev
        return [...prev, { question: cur, selected: null, isCorrect: null, selfRating: 'review' }]
      })
    }
    advance()
  }

  // ── Selection mode — render picker before any drill state ─────────────────
  if (isSelectionMode) {
    return <PracticeSelector navigate={navigate} activeTab={activeTab} />
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (questions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <Icon name="search_off" size={40} className="text-on-dim mb-3" />
        <p className="font-display font-semibold text-base text-on mb-1">No questions found</p>
        <p className="text-sm text-on-variant text-center mb-5">
          {mode === 'revision' ? 'No wrong answers to revise. Keep practising!' : 'No questions match this selection.'}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-surface-low border border-outline-variant text-on text-sm font-medium px-4 py-2.5 rounded-lg"
        >
          Go Back
        </button>
      </div>
    )
  }

  // ── Results ────────────────────────────────────────────────────────────────
  if (done) {
    return (
      <ResultsScreen
        answers={answers}
        onRetry={loadQuestions}
        onDone={() => navigate('/')}
        onReviseWrong={() => navigate('/revision')}
      />
    )
  }

  // ── Active drill ───────────────────────────────────────────────────────────
  const progress   = ((index + (revealed ? 1 : 0)) / questions.length) * 100
  const bookmarked = isBookmarked(q.id)
  const lastAnswer = q ? answers.find(a => a.question.id === q.id) : null
  const instruction = TYPE_INSTRUCTION[q.type] || null
  const isLastQ    = index + 1 >= questions.length

  // Difficulty / source badges
  const sourceBadgeVariant = q.sourceStatus === 'real-pyq' ? 'success' : q.year ? 'default' : 'default'
  const sourceBadgeLabel   = q.sourceStatus === 'real-pyq'
    ? `Real PYQ ${q.year || ''}`.trim()
    : q.year ? `UPSC-style ${q.year}` : (q.source || 'Practice')

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* ── Persistent top bar — always visible, never scrolls ──────────── */}
      <div className="flex-shrink-0 bg-surface border-b border-outline-variant">

        {/* Progress row: close · mode/topic · count · progress bar · bookmark */}
        <div className="flex items-center gap-3 px-4 pt-3 pb-2 max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-on-variant hover:bg-surface-low flex-shrink-0 transition-colors"
          >
            <Icon name="close" size={18} />
          </button>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-on-dim">
                {MODE_LABEL[mode]} · {q.topic}
              </span>
              <span className="text-xs font-medium text-on tabular-nums">
                {index + 1} / {questions.length}
              </span>
            </div>
            <div className="h-1 bg-surface-low rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => toggleBookmark(q.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 transition-colors"
          >
            <Icon
              name="bookmark" size={18}
              fill={bookmarked}
              className={bookmarked ? 'text-accent' : 'text-on-dim'}
            />
          </button>
        </div>

        {/* Timer bar — timed mode only, always visible above content */}
        {isTimed && objective && !revealed && (
          <div className={`mx-4 mb-2 flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs max-w-4xl ${
            timeLeft <= 10
              ? 'bg-error-dim border-error/30 text-error'
              : 'bg-surface-low border-outline-variant text-on-variant'
          }`}>
            <Icon
              name="timer" size={14}
              fill={timeLeft <= 10}
              className={timeLeft <= 10 ? 'text-error' : 'text-on-dim'}
            />
            <span className="font-semibold tabular-nums w-6">{timeLeft}s</span>
            <div className="flex-1 h-1 bg-outline-variant rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${timeLeft <= 10 ? 'bg-error' : 'bg-accent'}`}
                style={{ width: `${(timeLeft / timePerQ) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Scrollable content ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 w-full pb-6">

          {/* Desktop split: lg:flex lg:gap-8 */}
          <div className="lg:flex lg:gap-8 lg:items-start">

            {/* ── Left / top: Question panel ────────────────────────────── */}
            <div className="lg:flex-1 lg:sticky lg:top-4">

              {/* Meta badges */}
              <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                <Badge variant={sourceBadgeVariant} size="xs">{sourceBadgeLabel}</Badge>
                {q.difficulty && (
                  <Badge
                    variant={q.difficulty === 'hard' ? 'error' : q.difficulty === 'medium' ? 'warn' : 'success'}
                    size="xs"
                  >
                    {q.difficulty}
                  </Badge>
                )}
                {!objective && <Badge variant="default" size="xs">Subjective</Badge>}
              </div>

              {/* Question card */}
              <div className="bg-surface-container border border-outline-variant rounded-xl px-4 py-3 mb-3">
                {instruction && (
                  <p className="text-xs text-on-dim mb-2 leading-relaxed italic">{instruction}</p>
                )}
                <p className="text-base text-on leading-relaxed whitespace-pre-line font-medium">
                  {q.question || q.questionText}
                </p>
              </div>

            </div>

            {/* ── Right / bottom: Options + explanation ─────────────────── */}
            <div className="lg:flex-1">
              {objective ? (
                <>
                  <div className="space-y-2 mb-3">
                    {q.options.map((opt, i) => (
                      <OptionItem
                        key={i}
                        label={OPTION_LABELS[i]}
                        text={opt}
                        selected={selected === i}
                        revealed={revealed}
                        isCorrect={i === q.correctAnswer}
                        onClick={() => {
                          if (!revealed) {
                            setSelected(i)
                            setSessionAnswers(prev => ({ ...prev, [index]: { ...(prev[index] || {}), selected: i } }))
                          }
                        }}
                      />
                    ))}
                  </div>

                  {revealed && (
                    <ExplanationBlock q={q} isCorrect={lastAnswer?.isCorrect ?? false} />
                  )}

                  {/* Inline actions for desktop (hidden on mobile — mobile uses sticky bar below) */}
                  <div className="hidden lg:flex gap-3 mt-3">
                    {!revealed ? (
                      <>
                        <button
                          onClick={goBack}
                          disabled={index === 0}
                          className="w-10 h-10 flex items-center justify-center rounded-xl border border-outline-variant bg-surface-low text-on-variant hover:bg-outline-variant active:scale-[0.98] disabled:opacity-30 transition-all flex-shrink-0"
                        >
                          <Icon name="arrow_back" size={18} />
                        </button>
                        <button
                          onClick={handleSkip}
                          className="bg-surface-low border border-outline-variant text-on-variant text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-outline-variant active:scale-[0.98] transition-all"
                        >
                          Skip
                        </button>
                        <button
                          onClick={() => doReveal(selected)}
                          disabled={selected === null}
                          className="flex-1 bg-accent text-white text-sm font-semibold py-2.5 rounded-xl hover:opacity-90 active:scale-[0.99] disabled:opacity-40 transition-all"
                        >
                          Check Answer
                        </button>
                      </>
                    ) : (
                      <div className="flex-1 flex gap-3">
                        <button
                          onClick={goBack}
                          disabled={index === 0}
                          className="flex items-center justify-center gap-1.5 bg-surface-low border border-outline-variant text-on text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-outline-variant active:scale-[0.98] disabled:opacity-30 transition-all"
                        >
                          <Icon name="arrow_back" size={16} />
                          Previous
                        </button>
                        <button
                          onClick={advance}
                          className="flex-1 flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-2.5 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all"
                        >
                          {isLastQ ? 'View Results' : 'Next Question'}
                          <Icon name={isLastQ ? 'flag' : 'arrow_forward'} size={16} fill className="text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <SubjectiveBlock
                  q={q}
                  revealed={revealed}
                  onShow={showModelAnswer}
                  onRate={rateSubjective}
                  onSkip={handleSkip}
                />
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── Sticky bottom bar — mobile only (objective questions) ────────── */}
      {objective && (
        <div className="lg:hidden flex-shrink-0 bg-surface-container border-t border-outline-variant px-4 py-3">
          <div className="max-w-lg mx-auto flex gap-2">
            {!revealed ? (
              <>
                <button
                  onClick={goBack}
                  disabled={index === 0}
                  className="w-11 h-11 flex items-center justify-center rounded-xl border border-outline-variant bg-surface-low text-on-variant hover:bg-outline-variant active:scale-[0.98] disabled:opacity-30 transition-all flex-shrink-0"
                >
                  <Icon name="arrow_back" size={18} />
                </button>
                <button
                  onClick={handleSkip}
                  className="bg-surface-low border border-outline-variant text-on-variant text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-outline-variant active:scale-[0.98] transition-all flex-shrink-0"
                >
                  Skip
                </button>
                <button
                  onClick={() => doReveal(selected)}
                  disabled={selected === null}
                  className="flex-1 bg-accent text-white text-sm font-semibold py-3 rounded-xl hover:opacity-90 active:scale-[0.99] disabled:opacity-40 transition-all"
                >
                  Check Answer
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={goBack}
                  disabled={index === 0}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-surface-low border border-outline-variant text-on text-sm font-medium py-3 rounded-xl hover:bg-outline-variant active:scale-[0.98] disabled:opacity-30 transition-all"
                >
                  <Icon name="arrow_back" size={16} />
                  Prev
                </button>
                <button
                  onClick={advance}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-3 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all"
                >
                  {isLastQ ? 'Finish' : 'Next'}
                  <Icon name={isLastQ ? 'flag' : 'arrow_forward'} size={16} fill className="text-white" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
