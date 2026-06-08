import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import userTrackingService from '../services/userTrackingService'
import { getAllQuestions } from '../data/questions/getQuestions'
import { normalizeQuestion } from '../data/questions/metadataNormalizer'
import { UPSC_LEVELS } from '../data/upscLevels'
import Icon from '../components/ui/Icon'

// ── Question selection for level ────────────────────────────────────────────

function selectLevelQuestions(level, allQuestions, count = 20) {
  const normalized = allQuestions.map(q => normalizeQuestion(q))
  const levelQuestions = normalized.filter(q => q.level === level)

  // Shuffle and limit to count
  const shuffled = [...levelQuestions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// ── Option Item ────────────────────────────────────────────────────────────

function OptionItem({ label, text, selected, revealed, isCorrect, onClick }) {
  let rowCls
  if (revealed) {
    if (isCorrect)     rowCls = 'bg-success-dim border-success/40'
    else if (selected) rowCls = 'bg-error-dim border-error/40'
    else               rowCls = 'bg-surface-container border-outline-variant opacity-50'
  } else if (selected) {
    rowCls = 'bg-accent-dim border-accent/40'
  } else {
    rowCls = 'bg-surface-container border-outline-variant hover:border-accent/30'
  }

  let badgeCls
  if (revealed) {
    if (isCorrect)     badgeCls = 'bg-success text-white'
    else if (selected) badgeCls = 'bg-error text-white'
    else               badgeCls = 'border border-outline text-on-dim'
  } else if (selected) {
    badgeCls = 'bg-accent text-white'
  } else {
    badgeCls = 'border border-outline text-on-variant'
  }

  return (
    <button
      onClick={!revealed ? onClick : undefined}
      disabled={revealed}
      className={`w-full flex items-center gap-3 px-4 py-3 border rounded-xl text-left transition-all ${rowCls}`}
    >
      <span className={`w-6 h-6 text-xs font-bold flex items-center justify-center flex-shrink-0 border rounded-full ${badgeCls}`}>
        {label}
      </span>
      <span className="text-sm flex-1 text-on">{text}</span>
      {revealed && isCorrect  && <Icon name="check_circle" size={16} fill className="text-success" />}
      {revealed && selected && !isCorrect && <Icon name="cancel" size={16} fill className="text-error" />}
    </button>
  )
}

// ── Test Results Screen ────────────────────────────────────────────────────

function TestResultsScreen({ level, answers, onDone }) {
  const graded = answers.filter(a => typeof a.isCorrect === 'boolean')
  const correct = graded.filter(a => a.isCorrect).length
  const wrong = graded.length - correct
  const accuracy = graded.length > 0 ? Math.round((correct / graded.length) * 100) : 0

  const recommendedLevel = accuracy >= 80
    ? Math.min(Math.floor(level) + 1, 10)
    : Math.floor(level)

  const accColor = accuracy >= 80 ? 'text-success' : accuracy >= 60 ? 'text-warn' : 'text-error'

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="max-w-lg mx-auto px-4 w-full safe-pb">

        {/* Score */}
        <div className="pt-8 pb-6 text-center">
          <p className="text-2xs text-on-dim font-medium uppercase tracking-widest mb-3">Level Test Complete</p>
          <p className={`font-display font-bold text-5xl mb-1 ${accColor}`}>{accuracy}%</p>
          <p className="text-xs text-on-dim">{correct} of {graded.length} correct</p>
        </div>

        {/* Score breakdown */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-surface-container border border-outline-variant rounded-xl p-3 text-center">
            <p className="font-display font-bold text-xl text-success">{correct}</p>
            <p className="text-2xs text-on-dim">Correct</p>
          </div>
          <div className="bg-surface-container border border-outline-variant rounded-xl p-3 text-center">
            <p className="font-display font-bold text-xl text-error">{wrong}</p>
            <p className="text-2xs text-on-dim">Wrong</p>
          </div>
          <div className="bg-surface-container border border-outline-variant rounded-xl p-3 text-center">
            <p className="font-display font-bold text-xl text-on">{graded.length}</p>
            <p className="text-2xs text-on-dim">Total</p>
          </div>
        </div>

        {/* Recommendation */}
        <div className="mb-6 bg-surface-container border border-outline-variant rounded-xl px-4 py-4 text-center">
          <p className="text-xs text-on-dim mb-1">Recommended starting level</p>
          <p className="font-display font-bold text-2xl text-primary">Level {recommendedLevel}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onDone('start', recommendedLevel)}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-3 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all"
          >
            <Icon name="play_arrow" size={18} fill />
            Start Level {recommendedLevel} Practice
          </button>
          <button
            onClick={() => onDone('home')}
            className="w-full flex items-center justify-center gap-2 bg-surface-low border border-outline-variant text-on text-sm font-medium py-3 rounded-xl hover:bg-outline-variant active:scale-[0.99] transition-all"
          >
            <Icon name="home" size={18} fill />
            Back to Home
          </button>
        </div>

      </div>
    </div>
  )
}

// ── Main Level Test Screen ──────────────────────────────────────────────────

const OPTION_LABELS = ['A', 'B', 'C', 'D']

export default function LevelTest() {
  const navigate = useNavigate()
  const userId = userTrackingService.getLoggedInUserId()

  // Get current level
  const progress = userId ? userTrackingService.getCurrentUserProgress(userId) : null
  const currentLevel = progress?.currentLevel || 1
  const levelData = UPSC_LEVELS.find(l => l.levelNumber === currentLevel)

  // Test state
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState([])
  const [done, setDone] = useState(false)
  const [testId, setTestId] = useState(null)
  const [testResult, setTestResult] = useState(null)

  // Load questions on mount
  useEffect(() => {
    const qs = selectLevelQuestions(currentLevel, getAllQuestions(), 20)
    setQuestions(qs)

    if (userId && currentLevel) {
      const test = userTrackingService.createTestAttempt({
        user_id: userId,
        level: currentLevel,
      })
      setTestId(test?.id)
    }
  }, [userId, currentLevel])

  const q = questions[index]
  const progress_pct = questions.length > 0 ? ((index + (revealed ? 1 : 0)) / questions.length) * 100 : 0

  const doReveal = () => {
    if (!q) return
    setRevealed(true)
    const isCorrect = selected === q.correctAnswer
    setAnswers(prev => [...prev, { question: q, selected, isCorrect }])
  }

  const advance = () => {
    if (index + 1 >= questions.length) {
      // Test complete
      const graded = [...answers, { question: q, selected, isCorrect: selected === q.correctAnswer }]
        .filter(a => typeof a.isCorrect === 'boolean')
      const correct = graded.filter(a => a.isCorrect).length
      const accuracy = Math.round((correct / graded.length) * 100)

      // Save test result
      if (userId && testId) {
        userTrackingService.completeTestAttempt(userId, testId, {
          score: accuracy,
          accuracy,
          questions_correct: correct,
          questions_attempted: graded.length,
        })

        // Complete level test and unlock next level
        const result = userTrackingService.completeLevelTest(userId, currentLevel, {
          accuracy,
          questions_correct: correct,
          questions_attempted: graded.length,
        })

        // Get weak topics
        const weakTopics = userTrackingService.getWeakTopics(userId, 3)

        setTestResult({
          accuracy,
          correct,
          total: graded.length,
          unlockedNextLevel: result?.nextLevelUnlocked,
          isStrong: result?.isStrong,
          recommendation: result?.recommendation,
          weakTopics,
        })
      }

      setDone(true)
    } else {
      setIndex(i => i + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  // Empty state
  if (questions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <Icon name="hourglass_empty" size={40} className="text-on-dim mb-3" />
        <p className="text-sm font-semibold text-on mb-1">Loading Level Test</p>
        <p className="text-xs text-on-variant text-center">Preparing your Level {currentLevel} test...</p>
      </div>
    )
  }

  // Results screen
  if (done) {
    return (
      <TestResultsScreen
        level={currentLevel}
        answers={answers}
        onDone={(action, level) => {
          if (action === 'start') navigate(`/?level=${level}`)
          else navigate('/')
        }}
      />
    )
  }

  // Active test
  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* Top bar */}
      <div className="flex-shrink-0 bg-surface border-b border-outline-variant px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-on-dim">Level {currentLevel} Test</span>
            <span className="text-xs font-medium text-on tabular-nums">
              {index + 1} / {questions.length}
            </span>
          </div>
          <div className="h-1 bg-surface-low rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${progress_pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 w-full pb-6">

          {/* Question */}
          <div className="bg-surface-container border border-outline-variant rounded-xl px-4 py-3 my-4">
            <p className="text-base text-on leading-relaxed font-medium whitespace-pre-line">
              {q.question || q.questionText}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2 mb-4">
            {q.options.map((opt, i) => (
              <OptionItem
                key={i}
                label={OPTION_LABELS[i]}
                text={opt}
                selected={selected === i}
                revealed={revealed}
                isCorrect={i === q.correctAnswer}
                onClick={() => !revealed && setSelected(i)}
              />
            ))}
          </div>

          {/* Explanation after reveal */}
          {revealed && (
            <div className={`rounded-xl p-3 border mb-4 ${
              (selected === q.correctAnswer)
                ? 'bg-success-dim border-success/30'
                : 'bg-error-dim border-error/30'
            }`}>
              <p className="text-sm text-on leading-relaxed">{q.explanation}</p>
            </div>
          )}

        </div>
      </div>

      {/* Bottom action */}
      <div className="flex-shrink-0 bg-surface-container border-t border-outline-variant px-4 pt-3 pb-[56px]">
        <div className="max-w-lg mx-auto">
          {!revealed ? (
            <button
              onClick={doReveal}
              disabled={selected === null}
              className="w-full bg-accent text-white text-sm font-semibold py-3 rounded-xl hover:opacity-90 active:scale-[0.99] disabled:opacity-40 transition-all"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={advance}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-3 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all"
            >
              {index + 1 >= questions.length ? 'View Results' : 'Next Question'}
              <Icon name={index + 1 >= questions.length ? 'flag' : 'arrow_forward'} size={16} fill />
            </button>
          )}
        </div>
      </div>

    </div>
  )
}
