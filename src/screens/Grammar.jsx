import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { GRAMMAR_CATEGORIES } from '../data/categories'
import { useProgressContext } from '../hooks/useProgressContext'
import { getQuestionsByTopic, getAllQuestions } from '../data/questions/getQuestions'
import { grammarQuestions } from '../data/grammarQuestions'
import Icon from '../components/ui/Icon'

// Map question IDs to their topics for revision queue aggregation
const Q_TOPIC_MAP = Object.fromEntries(
  getAllQuestions().map(q => [q.id || q.topic, q.topic])
)

// Pre-computed at module level — stable across renders
const TOPIC_TOTALS = GRAMMAR_CATEGORIES.reduce((acc, cat) => {
  acc[cat.label] = getQuestionsByTopic(cat.label).length
  return acc
}, {})

const QUICK_DRILLS = [
  { mode: 'quick',    icon: 'bolt',        title: '10Q Quick Drill',  sublabel: '10 questions · no timer' },
  { mode: 'timed',    icon: 'timer',       title: '20Q Timed Drill',  sublabel: '20 questions · 60s each' },
  { mode: 'weakness', icon: 'trending_up', title: 'Weakness Drill',   sublabel: 'Auto-targets weak topics' },
  { mode: 'revision', icon: 'replay',      title: 'Revision Drill',   sublabel: 'Retry your wrong answers' },
]

const STATUS_CONFIG = {
  new:       { label: 'New',       cls: 'bg-surface-container-highest text-on-variant' },
  weak:      { label: 'Weak',      cls: 'bg-error-dim text-error' },
  improving: { label: 'Improving', cls: 'bg-warn-dim text-warn' },
  strong:    { label: 'Strong',    cls: 'bg-success-dim text-success' },
}

function getStatus(accuracy) {
  if (accuracy === null) return 'new'
  if (accuracy < 50)     return 'weak'
  if (accuracy < 70)     return 'improving'
  return 'strong'
}

function QuickDrillCard({ icon, title, sublabel, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col gap-2.5 p-3 bg-surface-container border border-outline-variant rounded-xl text-left hover:border-outline hover:bg-surface-low active:scale-[0.98] transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="w-7 h-7 rounded-lg bg-surface-low flex items-center justify-center flex-shrink-0">
          <Icon name={icon} size={16} className="text-on-variant" />
        </div>
        <Icon name="arrow_forward" size={14} className="text-on-dim" />
      </div>
      <div>
        <p className="text-sm font-semibold text-on leading-tight">{title}</p>
        <p className="text-2xs text-on-dim mt-0.5 leading-relaxed">{sublabel}</p>
      </div>
    </button>
  )
}

function TopicRow({ cat, stats, wrongCount, onStart }) {
  const attempted = stats?.total ?? 0
  const accuracy  = attempted > 0 ? Math.round((stats.correct / stats.total) * 100) : null
  const status    = getStatus(accuracy)
  const { label: statusLabel, cls: statusCls } = STATUS_CONFIG[status]

  const barColor = accuracy === null ? ''
    : accuracy >= 70 ? 'bg-success'
    : accuracy >= 50 ? 'bg-warn'
    : 'bg-error'

  const accColor = accuracy === null ? ''
    : accuracy >= 70 ? 'text-success'
    : accuracy >= 50 ? 'text-warn'
    : 'text-error'

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant last:border-0 hover:bg-surface-low transition-colors">

      {/* Topic icon */}
      <div className="w-7 h-7 rounded-md bg-accent-dim flex items-center justify-center flex-shrink-0">
        <Icon name={cat.icon} size={15} fill className="text-accent" />
      </div>

      {/* Name + stats */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
          <p className="text-sm font-medium text-on leading-tight truncate">{cat.label}</p>
          <span className={`text-2xs font-medium px-1.5 py-0.5 rounded-sm leading-none flex-shrink-0 ${statusCls}`}>
            {statusLabel}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-2xs text-on-dim">
          {attempted > 0 ? (
            <span>{attempted} done</span>
          ) : (
            <span>{TOPIC_TOTALS[cat.label]} questions</span>
          )}
          {accuracy !== null && (
            <>
              <span className="text-outline-variant">·</span>
              <span className={accColor}>{accuracy}%</span>
            </>
          )}
          {wrongCount > 0 && (
            <>
              <span className="text-outline-variant">·</span>
              <span className="text-error">{wrongCount} wrong</span>
            </>
          )}
        </div>

        {/* Progress bar — only when there's data */}
        {attempted > 0 && accuracy !== null && (
          <div className="h-0.5 bg-surface-low rounded-full overflow-hidden mt-1.5 w-20">
            <div className={`h-full rounded-full ${barColor}`} style={{ width: `${accuracy}%` }} />
          </div>
        )}
      </div>

      {/* One-tap Start */}
      <button
        onClick={onStart}
        className="flex-shrink-0 text-xs font-semibold text-accent bg-accent-dim rounded-lg px-3 py-1.5 hover:opacity-90 active:scale-[0.97] transition-all"
      >
        Start
      </button>
    </div>
  )
}

export default function Grammar() {
  const navigate = useNavigate()
  const { topicStats, revisionQueue } = useProgressContext()

  // Per-topic wrong count from the global revision queue
  const topicWrongCounts = useMemo(() => {
    const counts = {}
    revisionQueue.forEach(id => {
      const topic = Q_TOPIC_MAP[id]
      if (topic) counts[topic] = (counts[topic] || 0) + 1
    })
    return counts
  }, [revisionQueue])

  // Sort: weak → unattempted → improving → strong
  const sorted = [...GRAMMAR_CATEGORIES].sort((a, b) => {
    const sa = topicStats[a.label]
    const sb = topicStats[b.label]
    if (!sa && !sb) return 0
    if (sa && !sb)  return -1
    if (!sa && sb)  return 1
    const accA = sa.total > 0 ? sa.correct / sa.total : 1
    const accB = sb.total > 0 ? sb.correct / sb.total : 1
    return accA - accB
  })

  const startedCount = GRAMMAR_CATEGORIES.filter(c => topicStats[c.label]?.total > 0).length
  const weakCount = GRAMMAR_CATEGORIES.filter(c => {
    const s = topicStats[c.label]
    return s && s.total > 0 && s.correct / s.total < 0.7
  }).length

  function startDrill(mode, topic = 'all') {
    navigate(`/practice?mode=${mode}&topic=${encodeURIComponent(topic)}`)
  }

  return (
    <main className="flex-1 safe-pb overflow-y-auto">
      <div className="max-w-lg mx-auto px-4">

        {/* Screen header */}
        <div className="pt-5 pb-4">
          <p className="text-2xs font-medium text-on-dim uppercase tracking-widest mb-1">
            {grammarQuestions.length} questions · {startedCount}/{GRAMMAR_CATEGORIES.length} topics started
            {weakCount > 0 && <span className="text-error"> · {weakCount} weak</span>}
          </p>
          <h1 className="font-display font-bold text-2xl text-on">Grammar Library</h1>
        </div>

        {/* Quick Start — 2×2 mode cards */}
        <div className="mb-4">
          <p className="text-2xs font-medium text-on-dim uppercase tracking-widest mb-2">Quick Start</p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_DRILLS.map(d => (
              <QuickDrillCard
                key={d.mode}
                icon={d.icon}
                title={d.title}
                sublabel={d.sublabel}
                onClick={() => startDrill(d.mode, 'all')}
              />
            ))}
          </div>
        </div>

        {/* Topic Library */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-2xs font-medium text-on-dim uppercase tracking-widest">Topic Library</p>
            <p className="text-2xs text-on-dim">{GRAMMAR_CATEGORIES.length} topics</p>
          </div>
          <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
            {sorted.map(cat => (
              <TopicRow
                key={cat.id}
                cat={cat}
                stats={topicStats[cat.label]}
                wrongCount={topicWrongCounts[cat.label] || 0}
                onStart={() => startDrill('quick', cat.label)}
              />
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
