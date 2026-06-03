import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgressContext } from '../hooks/useProgressContext'
import { GRAMMAR_CATEGORIES } from '../data/categories'
import grammarQuestions from '../data/grammarQuestions'
import pyqQuestions from '../data/pyqQuestions'
import Icon from '../components/ui/Icon'

// ── Static lookup ─────────────────────────────────────────────────────────────

const qMap = Object.fromEntries(
  [...grammarQuestions, ...pyqQuestions].map(q => [q.id, q])
)

const TOPIC_TOTALS = GRAMMAR_CATEGORIES.reduce((acc, cat) => {
  acc[cat.label] = grammarQuestions.filter(q => q.topic === cat.label).length
  return acc
}, {})

// ── Skill row (Stitch Heatmap pattern) ───────────────────────────────────────

function SkillRow({ topic, stats, wrongCount, onDrill }) {
  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
  const pct       = Math.min(accuracy, 100)

  const barColor  = accuracy < 50 ? 'bg-error'   : accuracy < 70 ? 'bg-warn' : 'bg-on'
  const accColor  = accuracy < 50 ? 'text-error'  : accuracy < 70 ? 'text-warn' : 'text-on'
  const action    = accuracy < 50 ? 'Drill'        : accuracy < 70 ? 'Practice' : 'Review'
  const actionCls = accuracy < 50
    ? 'text-error bg-error-dim border-error/20'
    : accuracy < 70
    ? 'text-warn bg-warn-dim border-warn/20'
    : 'text-on-variant bg-surface-low border-outline-variant'

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-on truncate pr-2">{topic}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {wrongCount > 0 && (
            <span className="text-2xs text-error tabular-nums">{wrongCount} wrong</span>
          )}
          <span className={`text-xs font-semibold tabular-nums w-8 text-right ${accColor}`}>
            {accuracy}%
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-surface-low rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
        </div>
        <button
          onClick={onDrill}
          className={`text-2xs font-semibold px-2 py-0.5 rounded-sm border flex-shrink-0 hover:opacity-80 active:scale-[0.97] transition-all ${actionCls}`}
        >
          {action}
        </button>
      </div>
      <p className="text-2xs text-on-dim mt-0.5">{stats.total} attempted · {stats.correct} correct</p>
    </div>
  )
}

// ── Stat cell (Stitch 2×2 pattern) ───────────────────────────────────────────

function StatCell({ icon, label, value, sub, subColor = 'text-on-dim', valueColor = 'text-on' }) {
  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-3 flex flex-col justify-between">
      <div className="flex items-center gap-1.5 mb-2">
        <Icon name={icon} size={14} className="text-on-dim" />
        <p className="text-2xs font-medium text-on-dim uppercase tracking-wider">{label}</p>
      </div>
      <div>
        <p className={`font-display font-bold text-xl leading-tight truncate ${valueColor}`}>{value}</p>
        {sub && <p className={`text-2xs mt-0.5 leading-relaxed ${subColor}`}>{sub}</p>}
      </div>
    </div>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function Analytics() {
  const navigate = useNavigate()
  const { topicStats, attempted, revisionQueue, readiness } = useProgressContext()

  // ── Core calculations ──────────────────────────────────────────────────────

  const allAttempted    = Object.values(attempted)
  const totalAttempted  = allAttempted.length
  const totalCorrect    = allAttempted.filter(a => a.isCorrect === true).length
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : null

  // Per-topic wrong counts from revision queue
  const topicWrongCounts = useMemo(() => {
    const counts = {}
    revisionQueue.forEach(id => {
      const q = qMap[id]
      if (q?.topic) counts[q.topic] = (counts[q.topic] || 0) + 1
    })
    return counts
  }, [revisionQueue])

  // Topics sorted best → worst accuracy
  const sortedTopics = Object.entries(topicStats)
    .filter(([, s]) => s.total > 0)
    .sort((a, b) => (b[1].correct / b[1].total) - (a[1].correct / a[1].total))

  const strongest = sortedTopics[0]
  const weakest   = sortedTopics[sortedTopics.length - 1]

  // Suggested topic: weakest not yet mastered, or first unattempted
  const suggestedTopic = weakest?.[0]
    ?? GRAMMAR_CATEGORIES.find(c => !topicStats[c.label] || topicStats[c.label].total === 0)?.label

  // Top 3 weak topics for regimen
  const weakTopicsForRegimen = sortedTopics
    .filter(([, s]) => s.correct / s.total < 0.7)
    .slice(0, 3)

  const regimenCounts  = [20, 10, 5]
  const regimenRegimen = weakTopicsForRegimen.map(([topic], i) => ({
    topic,
    count: regimenCounts[i],
  }))

  // Unattempted topics
  const unattempted = GRAMMAR_CATEGORIES.filter(
    c => !topicStats[c.label] || topicStats[c.label].total === 0
  )

  // Accuracy colors
  const accColor = overallAccuracy === null ? 'text-on-dim'
    : overallAccuracy >= 70 ? 'text-success' : overallAccuracy >= 50 ? 'text-warn' : 'text-error'

  const readinessColor = readiness >= 70 ? 'text-success' : readiness >= 40 ? 'text-warn' : 'text-error'

  // Dynamic observation text
  const observation = overallAccuracy === null
    ? null
    : overallAccuracy < 40
    ? `Critical gaps across multiple topics. Prioritise ${suggestedTopic ?? 'all topics'} before attempting timed drills.`
    : overallAccuracy < 60
    ? `Most frequent errors in ${weakest?.[0] ?? 'grammar'}. Drilling weak topics systematically will improve accuracy faster than random practice.`
    : overallAccuracy < 75
    ? `Solid base, but ${weakest?.[0] ?? 'some topics'} needs targeted work. Focused weakness drills are more effective than broad revision.`
    : `Strong accuracy. Maintain consistency by revisiting ${weakest?.[0] ?? 'edge topics'} and clearing your revision queue.`

  function startWeaknessDrill() {
    const topic = suggestedTopic ?? 'all'
    navigate(`/practice?mode=weakness&topic=${encodeURIComponent(topic)}`)
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (totalAttempted === 0) {
    return (
      <main className="flex-1 safe-pb overflow-y-auto">
        <div className="max-w-lg mx-auto px-4">
          <div className="pt-5 pb-3">
            <h1 className="font-display font-bold text-2xl text-on">Weakness Analytics</h1>
          </div>
          <div className="bg-surface-container border border-outline-variant rounded-xl p-6 text-center mt-4">
            <Icon name="analytics" size={36} className="text-on-dim mx-auto mb-3" />
            <p className="text-sm font-semibold text-on mb-1">No data yet.</p>
            <p className="text-xs text-on-dim mb-4">Start a grammar drill to see your analytics.</p>
            <button
              onClick={() => navigate('/practice?mode=quick&topic=all')}
              className="bg-accent text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90"
            >
              Start Grammar Drill
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 safe-pb overflow-y-auto">
      <div className="max-w-lg mx-auto px-4">

        {/* Header */}
        <div className="pt-5 pb-4">
          <p className="text-2xs font-medium text-on-dim uppercase tracking-widest mb-1">
            {totalAttempted} attempted · {sortedTopics.length}/{GRAMMAR_CATEGORIES.length} topics
          </p>
          <h1 className="font-display font-bold text-2xl text-on">Weakness Analytics</h1>
          <p className="text-sm text-on-variant mt-0.5">Your practice data converted into a recovery plan.</p>
        </div>

        {/* ── 2×2 Stat grid (Stitch) ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Overall Accuracy */}
          <StatCell
            icon="analytics"
            label="Overall Accuracy"
            value={overallAccuracy !== null ? `${overallAccuracy}%` : '—'}
            sub={`${totalCorrect} / ${totalAttempted} correct`}
            valueColor={accColor}
          />
          {/* Readiness */}
          <StatCell
            icon="trending_up"
            label="Readiness"
            value={readiness}
            sub="/ 100"
            valueColor={readinessColor}
          />
          {/* Weakest Area */}
          <StatCell
            icon="arrow_downward"
            label="Weakest Area"
            value={weakest ? weakest[0].split(' ')[0] : '—'}
            sub={weakest ? 'Requires immediate focus' : 'Not enough data'}
            subColor={weakest ? 'text-error' : 'text-on-dim'}
            valueColor="text-on"
          />
          {/* Wrong Answers Pending */}
          <StatCell
            icon="replay"
            label="Wrong Pending"
            value={revisionQueue.length}
            sub={revisionQueue.length === 0 ? 'All clear' : 'Marked for revision'}
            subColor={revisionQueue.length > 0 ? 'text-error' : 'text-success'}
            valueColor={revisionQueue.length > 0 ? 'text-error' : 'text-success'}
          />
        </div>

        {/* ── Strongest / Weakest side by side ───────────────────────────── */}
        {sortedTopics.length > 1 && (
          <div className="flex gap-2 mb-3">
            <div className="flex-1 bg-success-dim border border-success/20 rounded-xl p-3">
              <p className="text-2xs font-medium text-success uppercase tracking-wider mb-1">Strongest</p>
              <p className="text-sm font-semibold text-on leading-snug">{strongest[0]}</p>
              <p className="text-xs text-success">
                {Math.round((strongest[1].correct / strongest[1].total) * 100)}% accuracy
              </p>
            </div>
            {weakest && weakest[0] !== strongest[0] && (
              <div className="flex-1 bg-error-dim border border-error/20 rounded-xl p-3">
                <p className="text-2xs font-medium text-error uppercase tracking-wider mb-1">Weakest</p>
                <p className="text-sm font-semibold text-on leading-snug">{weakest[0]}</p>
                <p className="text-xs text-error">
                  {Math.round((weakest[1].correct / weakest[1].total) * 100)}% accuracy
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Suggested Next Drill ────────────────────────────────────────── */}
        {suggestedTopic && (
          <button
            onClick={startWeaknessDrill}
            className="w-full flex items-center gap-3 bg-accent-dim border border-accent/20 rounded-xl px-4 py-3 mb-4 text-left hover:opacity-90 active:scale-[0.99] transition-all"
          >
            <Icon name="lightbulb" size={18} fill className="text-accent flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-2xs text-accent font-medium uppercase tracking-wider mb-0.5">Start Here</p>
              <p className="text-sm font-semibold text-on">20Q {suggestedTopic} Drill</p>
              <p className="text-xs text-on-variant">
                {weakest ? `${Math.round((weakest[1].correct / weakest[1].total) * 100)}% accuracy — targeted weakness drill` : 'Not yet started'}
              </p>
            </div>
            <Icon name="arrow_forward" size={16} className="text-accent/60 flex-shrink-0" />
          </button>
        )}

        {/* ── Skill Heatmap (Stitch) ──────────────────────────────────────── */}
        {sortedTopics.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-on-dim uppercase tracking-widest">Skill Heatmap</p>
              <p className="text-2xs text-on-dim">{sortedTopics.length} / {GRAMMAR_CATEGORIES.length} topics</p>
            </div>
            <div className="bg-surface-container border border-outline-variant rounded-xl p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
                {sortedTopics.map(([topic, stats]) => (
                  <SkillRow
                    key={topic}
                    topic={topic}
                    stats={stats}
                    wrongCount={topicWrongCounts[topic] || 0}
                    onDrill={() => navigate(`/practice?mode=weakness&topic=${encodeURIComponent(topic)}`)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Mistake Pattern Analysis (Stitch) ──────────────────────────── */}
        {observation && (
          <div className="bg-surface-container border border-outline-variant rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-surface-low flex items-center justify-center flex-shrink-0">
                <Icon name="psychology" size={16} className="text-on-variant" />
              </div>
              <p className="text-sm font-semibold text-on">Mistake Pattern Analysis</p>
            </div>

            {/* Key observation */}
            <div className="bg-surface-low border border-outline-variant rounded-lg px-3 py-2.5 mb-3">
              <p className="text-2xs font-medium text-on-dim uppercase tracking-wider mb-1">Key Observation</p>
              <p className="text-xs text-on leading-relaxed">{observation}</p>
            </div>

            {/* Suggested regimen */}
            {regimenRegimen.length > 0 && (
              <div>
                <p className="text-xs font-medium text-on mb-2">Suggested Regimen</p>
                <ul className="space-y-1.5">
                  {regimenRegimen.map(({ topic, count }) => (
                    <li key={topic} className="flex items-center gap-2">
                      <Icon name="check_circle" size={14} fill className="text-accent flex-shrink-0" />
                      <button
                        onClick={() => navigate(`/practice?mode=weakness&topic=${encodeURIComponent(topic)}`)}
                        className="text-xs text-on-variant hover:text-accent transition-colors text-left"
                      >
                        {count} {topic} questions
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ── Start Weakness Drill CTA (Stitch dark card) ────────────────── */}
        <div className="bg-primary text-white rounded-xl px-4 py-5 mb-4 text-center">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
            <Icon name="build" size={20} className="text-white" />
          </div>
          <p className="text-sm font-bold text-white mb-1">Ready to repair?</p>
          <p className="text-xs text-white/60 mb-4 leading-relaxed">
            Begin a targeted drill based on the above analysis.
          </p>
          <button
            onClick={startWeaknessDrill}
            className="w-full flex items-center justify-center gap-2 bg-white text-on text-sm font-semibold py-2.5 rounded-lg hover:bg-surface-low active:scale-[0.99] transition-all"
          >
            Start Weakness Repair Drill
            <Icon name="arrow_forward" size={16} className="text-on" />
          </button>
        </div>

        {/* ── Unattempted topics ──────────────────────────────────────────── */}
        {unattempted.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-medium text-on-dim uppercase tracking-widest mb-2">
              Not Started ({unattempted.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {unattempted.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/practice?mode=quick&topic=${encodeURIComponent(cat.label)}`)}
                  className="text-xs text-on-variant bg-surface-container border border-outline-variant rounded-full px-2.5 py-1 hover:border-accent/30 hover:text-accent transition-all"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
