import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import userTrackingService from '../services/userTrackingService'
import { normalizeQuestion } from '../data/questions/metadataNormalizer'
import { getConnectorPracticeQuestions } from '../data/connectorPractice'
import { getConnectorBank } from '../data/connectorBank'
import Badge from '../components/ui/Badge'
import Icon from '../components/ui/Icon'

// ── Option Item ────────────────────────────────────────────────────────

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

// ── Results Screen ────────────────────────────────────────────────────

function ResultsScreen({ answers, onDone }) {
  const graded = answers.filter(a => typeof a.isCorrect === 'boolean')
  const correct = graded.filter(a => a.isCorrect).length
  const wrong = graded.length - correct
  const accuracy = graded.length > 0 ? Math.round((correct / graded.length) * 100) : 0

  const color = accuracy >= 80 ? 'text-success' : accuracy >= 60 ? 'text-warn' : 'text-error'
  const msg = accuracy >= 80 ? 'Excellent! Great work with connectors.' : accuracy >= 60 ? 'Good progress! Review the ones you missed.' : 'Keep practicing — connectors take repetition.'

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="max-w-lg mx-auto px-4 w-full safe-pb">

        <div className="pt-8 pb-4 text-center">
          <p className={`font-display font-bold text-5xl mb-1 ${color}`}>{accuracy}%</p>
          <p className="text-sm text-on-variant">{msg}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
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

        <div className="flex flex-col gap-2">
          <button
            onClick={() => onDone('again')}
            className="w-full flex items-center justify-center gap-2 bg-accent text-white text-sm font-semibold py-3 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all"
          >
            <Icon name="replay" size={18} fill />
            Practice Again
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

// ── Main Connector Practice Screen ──────────────────────────────────────

const OPTION_LABELS = ['A', 'B', 'C', 'D']

export default function ConnectorPractice() {
  const navigate = useNavigate()
  const userId = userTrackingService.getLoggedInUserId()

  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState([])
  const [done, setDone] = useState(false)

  // Load connector practice questions on mount
  useEffect(() => {
    const qs = getConnectorPracticeQuestions()
    setQuestions(qs.slice(0, 10)) // Load first 10 for now
  }, [])

  const q = questions[index]
  const progress_pct = questions.length > 0 ? ((index + (revealed ? 1 : 0)) / questions.length) * 100 : 0

  const doReveal = () => {
    if (!q) return
    setRevealed(true)
    const isCorrect = selected === q.correctAnswer

    // Track in userTrackingService if logged in
    if (userId) {
      const normalized = normalizeQuestion(q)
      userTrackingService.saveQuestionAttempt({
        user_id: userId,
        question_id: q.id,
        level: normalized.level || 4,
        topic: 'Connectors',
        subtopic: q.subTopic,
        selected_answer: selected,
        correct_answer: q.correctAnswer,
        is_correct: isCorrect,
        time_taken_seconds: Math.round(Math.random() * 60), // Simplified for now
        mistake_type: isCorrect ? null : 'connector-usage',
      })
    }

    setAnswers(prev => [...prev, { question: q, selected, isCorrect }])
  }

  const advance = () => {
    if (index + 1 >= questions.length) {
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
        <p className="text-sm font-semibold text-on mb-1">Loading Connector Practice</p>
        <p className="text-xs text-on-variant text-center">Preparing questions...</p>
      </div>
    )
  }

  // Results screen
  if (done) {
    return (
      <ResultsScreen
        answers={answers}
        onDone={(action) => {
          if (action === 'again') window.location.reload()
          else navigate('/')
        }}
      />
    )
  }

  // Active practice
  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* Top bar */}
      <div className="flex-shrink-0 bg-surface border-b border-outline-variant px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-on-dim">Connector Practice</span>
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

          {/* Connector category badge */}
          <div className="mt-4 mb-3 flex items-center gap-1.5">
            {q.subTopic.includes('Addition') && <Badge variant="success" size="xs">✓ Addition</Badge>}
            {q.subTopic.includes('Contrast') && <Badge variant="error" size="xs">↔ Contrast</Badge>}
            {q.subTopic.includes('Cause-effect') && <Badge variant="warn" size="xs">→ Cause-Effect</Badge>}
            {q.subTopic.includes('Example') && <Badge variant="accent" size="xs">○ Example</Badge>}
            {q.subTopic.includes('Conclusion') && <Badge variant="default" size="xs">✓ Conclusion</Badge>}
          </div>

          {/* Question */}
          <div className="bg-surface-container border border-outline-variant rounded-xl px-4 py-3 mb-4">
            <p className="text-base text-on leading-relaxed whitespace-pre-line font-medium">
              {q.question}
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
              <p className="text-sm text-on leading-relaxed font-semibold mb-1">
                {selected === q.correctAnswer ? 'Correct!' : 'Incorrect'}
              </p>
              <p className="text-sm text-on-variant leading-relaxed">{q.explanation}</p>
              {q.trap && (
                <p className="text-xs text-warn mt-2 leading-relaxed">
                  <span className="font-semibold">Trap:</span> {q.trap}
                </p>
              )}
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
