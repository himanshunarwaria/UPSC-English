import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '../ui/Icon'
import {
  getAvailableLevels,
  getTopicsForLevel,
  getSubtopicsForLevelAndTopic,
  filterQuestions,
} from '../../services/questionFilterService'

export default function LevelSelector() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const levels = getAvailableLevels()

  const paramLevel    = params.get('level')    ? parseInt(params.get('level'), 10) : null
  const paramTopic    = params.get('topic')    || null
  const paramSubtopic = params.get('subtopic') || null
  const [selLevel,    setSelLevel]    = useState(paramLevel)
  const [selTopic,    setSelTopic]    = useState(paramTopic)
  const [selSubtopic, setSelSubtopic] = useState(paramSubtopic)

  const topics = selLevel != null ? getTopicsForLevel(selLevel) : []

  // Single-topic levels: auto-resolve without showing a selector
  const singleTopic    = topics.length === 1 ? topics[0] : null
  const effectiveTopic = singleTopic ?? selTopic

  const subtopics = selLevel != null && effectiveTopic != null
    ? getSubtopicsForLevelAndTopic(selLevel, effectiveTopic)
    : []

  const previewCount = filterQuestions({
    ...(selLevel != null       && { level: selLevel }),
    ...(effectiveTopic != null && { topic: effectiveTopic }),
    ...(selSubtopic != null    && { subtopic: selSubtopic }),
  }).length

  const needsTopic   = topics.length > 1 && effectiveTopic == null
  const canStart     = selLevel != null && !needsTopic && previewCount > 0

  const summaryLine = selLevel == null
    ? 'Select a level to continue.'
    : needsTopic
      ? 'Select a topic to continue.'
      : previewCount > 0
        ? `${previewCount} questions`
        : 'No questions for this selection.'

  const detailLine = selLevel != null && !needsTopic
    ? [
        `Level ${selLevel}`,
        effectiveTopic,
        selSubtopic ?? (subtopics.length > 1 ? 'All subtopics' : null),
      ].filter(Boolean).join(' · ')
    : null

  function handleLevelChange(e) {
    const val = e.target.value
    setSelTopic(null)
    setSelSubtopic(null)
    setSelLevel(val ? parseInt(val, 10) : null)
  }

  function handleTopicChange(e) {
    setSelSubtopic(null)
    setSelTopic(e.target.value || null)
  }

  function start() {
    if (!canStart) return
    const p = new URLSearchParams({ mode: 'focused', level: String(selLevel) })
    if (effectiveTopic) p.set('topic',    effectiveTopic)
    if (selSubtopic)    p.set('subtopic', selSubtopic)
    navigate(`/practice?${p.toString()}`)
  }

  return (
    <div className="space-y-3">

      {/* 1. Level dropdown */}
      <div>
        <p className="text-xs font-medium text-on-dim uppercase tracking-widest mb-2">Choose Level</p>
        <div className="relative">
          <select
            value={selLevel ?? ''}
            onChange={handleLevelChange}
            className="w-full appearance-none bg-surface-container border border-outline-variant rounded-xl px-4 py-3 pr-10 text-sm font-medium text-on focus:outline-none focus:border-primary transition-colors cursor-pointer"
          >
            <option value="">Select difficulty level</option>
            {levels.map(({ level: lv, difficultyLabel, questionCount }) => (
              <option key={lv} value={lv}>
                Level {lv} — {difficultyLabel} — {questionCount} Q
              </option>
            ))}
          </select>
          <Icon name="expand_more" size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-dim pointer-events-none" />
        </div>
        {selLevel === null && (
          <p className="text-xs text-on-dim mt-2 text-center">
            Not sure where to start?{' '}
            <button
              onClick={() => navigate('/level-test')}
              className="text-primary font-medium hover:underline underline-offset-2"
            >
              Take a short level test
            </button>
          </p>
        )}
      </div>

      {/* 2. Topic — auto-pill (single) or dropdown (multiple) */}
      {topics.length === 1 && (
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs font-medium text-on-dim uppercase tracking-widest">Topic:</span>
          <span className="text-xs font-semibold text-on bg-surface-container border border-outline-variant rounded-full px-3 py-1">
            {singleTopic}
          </span>
        </div>
      )}

      {topics.length > 1 && (
        <div>
          <p className="text-xs font-medium text-on-dim uppercase tracking-widest mb-2">Choose Topic</p>
          <div className="relative">
            <select
              value={selTopic ?? ''}
              onChange={handleTopicChange}
              className="w-full appearance-none bg-surface-container border border-outline-variant rounded-xl px-4 py-3 pr-10 text-sm font-medium text-on focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="">Select topic</option>
              {topics.map(tp => {
                const count = filterQuestions({ level: selLevel, topic: tp }).length
                return (
                  <option key={tp} value={tp} disabled={count === 0}>
                    {tp} — {count} Q
                  </option>
                )
              })}
            </select>
            <Icon name="expand_more" size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-dim pointer-events-none" />
          </div>
        </div>
      )}

      {/* 3. Subtopic dropdown — only when multiple subtopics exist */}
      {subtopics.length > 1 && (
        <div>
          <p className="text-xs font-medium text-on-dim uppercase tracking-widest mb-2">
            Subtopic <span className="normal-case font-normal">(optional)</span>
          </p>
          <div className="relative">
            <select
              value={selSubtopic ?? ''}
              onChange={e => setSelSubtopic(e.target.value || null)}
              className="w-full appearance-none bg-surface-container border border-outline-variant rounded-xl px-4 py-3 pr-10 text-sm font-medium text-on focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="">All subtopics — {previewCount} Q</option>
              {subtopics.map(st => {
                const count = filterQuestions({ level: selLevel, topic: effectiveTopic, subtopic: st }).length
                return (
                  <option key={st} value={st} disabled={count === 0}>
                    {st} — {count} Q
                  </option>
                )
              })}
            </select>
            <Icon name="expand_more" size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-dim pointer-events-none" />
          </div>
        </div>
      )}

      {/* 4. Summary card + Start — always visible */}
      <div className="bg-surface-container border border-outline-variant rounded-xl px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className={`text-sm font-semibold ${canStart ? 'text-on' : 'text-on-dim'}`}>
            {summaryLine}
          </p>
          {detailLine && (
            <p className="text-xs text-on-dim mt-0.5 truncate">{detailLine}</p>
          )}
        </div>
        <button
          onClick={start}
          disabled={!canStart}
          className="flex-shrink-0 flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-[0.99] disabled:opacity-40 transition-all min-h-[44px]"
        >
          Start
          <Icon name="arrow_forward" size={16} fill className="text-white" />
        </button>
      </div>

    </div>
  )
}
