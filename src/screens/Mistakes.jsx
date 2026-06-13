import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import userTrackingService from '../services/userTrackingService'
import { getAllQuestions } from '../data/questions/getQuestions'
import Badge from '../components/ui/Badge'
import Icon from '../components/ui/Icon'

// ── Static question map ───────────────────────────────────────────────────────

const qMap = Object.fromEntries(
  getAllQuestions().map(q => [q.id, q])
)

// ── Utilities ─────────────────────────────────────────────────────────────────

function formatMistakeDate(timestamp) {
  if (!timestamp) return null
  const date = new Date(timestamp)
  const now = new Date()
  const days = Math.floor((now - date) / 86400000)
  if (days === 0) {
    const time = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    return `Today, ${time}`
  }
  if (days === 1) return 'Yesterday'
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function bucketByDate(mistakes) {
  const now = Date.now()
  const buckets = { today: [], yesterday: [], earlier: [] }
  for (const m of mistakes) {
    const days = m.created_at ? Math.floor((now - new Date(m.created_at).getTime()) / 86400000) : 999
    if (days === 0)      buckets.today.push(m)
    else if (days === 1) buckets.yesterday.push(m)
    else                 buckets.earlier.push(m)
  }
  return buckets
}

function statusColor(status) {
  if (status === 'pending')  return 'text-error'
  if (status === 'revised')  return 'text-warn'
  if (status === 'mastered') return 'text-success'
  return 'text-on-dim'
}

function statusLabel(status) {
  return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'
}

// ── Constants ─────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'pending',  label: 'Pending',  icon: 'clock' },
  { key: 'revised',  label: 'Revised',  icon: 'done' },
  { key: 'mastered', label: 'Mastered', icon: 'check_circle' },
]

const EMPTY_STATES = {
  pending: {
    icon: 'check_circle',
    title: 'No pending mistakes',
    subtitle: 'No pending mistakes. Great work — review mastered mistakes or continue practice.',
  },
  revised: {
    icon: 'auto_stories',
    title: 'No revised mistakes yet',
    subtitle: 'No revised mistakes yet. Mark a mistake as revised after reviewing it.',
  },
  mastered: {
    icon: 'celebration',
    title: 'No mastered mistakes yet',
    subtitle: 'No mastered mistakes yet. Master mistakes after repeated correct practice.',
  },
}

// ── EmptyState ────────────────────────────────────────────────────────────────

function EmptyState({ icon, title, subtitle, ctaLabel, ctaVariant = 'primary', onCta }) {
  return (
    <div className="text-center py-12">
      <Icon name={icon} size={36} className="text-on-dim mx-auto mb-3" />
      <p className="text-sm font-semibold text-on mb-1">{title}</p>
      {subtitle && (
        <p className="text-xs text-on-dim mb-4 leading-relaxed max-w-[250px] mx-auto">{subtitle}</p>
      )}
      {ctaLabel && onCta && (
        <button
          onClick={onCta}
          className={`text-sm font-medium px-4 py-2 rounded-lg transition-all active:scale-[0.98] ${
            ctaVariant === 'primary'
              ? 'bg-accent text-white hover:opacity-90'
              : 'border border-outline-variant text-on hover:bg-surface-low'
          }`}
        >
          {ctaLabel}
        </button>
      )}
    </div>
  )
}

// ── MistakeCard ───────────────────────────────────────────────────────────────

function MistakeCard({ mistake, onStatusChange, navigate }) {
  const [expanded, setExpanded] = useState(false)
  const q = qMap[mistake.question_id]
  if (!q) return null

  const preview = (q.question || q.questionText || '').split('\n')[0].substring(0, 120)
  const hasDetail = !!(q.explanation || q.trap || mistake.mistake_type)

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden mb-3">
      {/* Always-visible card body — tappable to expand */}
      <button
        onClick={() => hasDetail && setExpanded(e => !e)}
        className={`w-full text-left p-4 ${hasDetail ? 'active:bg-surface-low/50 transition-colors' : ''}`}
      >
        {/* Badges + status chip */}
        <div className="flex items-start gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
            {mistake.topic && (
              <Badge variant="default" size="xs">{mistake.topic}</Badge>
            )}
            {mistake.subtopic && mistake.subtopic !== mistake.topic && (
              <Badge variant="default" size="xs">{mistake.subtopic}</Badge>
            )}
            {mistake.level && (
              <Badge variant="default" size="xs">L{mistake.level}</Badge>
            )}
            {mistake.mistake_type && (
              <Badge variant="warn" size="xs">{mistake.mistake_type}</Badge>
            )}
          </div>
          <span className={`text-xs font-semibold flex-shrink-0 ${statusColor(mistake.status)}`}>
            {statusLabel(mistake.status)}
          </span>
        </div>

        {/* Date */}
        <p className="text-2xs text-on-dim mb-2.5">{formatMistakeDate(mistake.created_at)}</p>

        {/* Question preview */}
        <p className="text-sm text-on leading-relaxed line-clamp-3 mb-3">{preview}</p>

        {/* Your answer / Correct answer */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-error-dim border border-error/20 rounded-lg min-w-0">
            <p className="text-2xs text-on-dim font-medium mb-0.5">Your Answer</p>
            <p className="text-xs text-error font-semibold leading-snug break-words">
              {q.options && Array.isArray(q.options)
                ? q.options[mistake.selected_answer] || 'Skipped'
                : 'Not available'}
            </p>
          </div>
          <div className="p-2 bg-success-dim border border-success/20 rounded-lg min-w-0">
            <p className="text-2xs text-on-dim font-medium mb-0.5">Correct Answer</p>
            <p className="text-xs text-success font-semibold leading-snug break-words">
              {q.options && Array.isArray(q.options)
                ? q.options[q.correctAnswer] || 'Not available'
                : 'Not available'}
            </p>
          </div>
        </div>
      </button>

      {/* Expand toggle — only when there is detail to show */}
      {hasDetail && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="w-full flex items-center justify-between px-4 py-2 text-xs text-on-variant hover:text-on border-t border-outline-variant/40 transition-colors min-h-[36px]"
        >
          <span className="font-medium">{expanded ? 'Hide explanation' : 'Show explanation'}</span>
          <Icon name={expanded ? 'expand_less' : 'expand_more'} size={15} className="text-on-dim" />
        </button>
      )}

      {/* Expanded area — explanation, trap, mistake type */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-outline-variant/40 bg-surface-low/50">
          {q.explanation && (
            <div className="pt-3">
              <p className="text-2xs text-on-dim font-medium mb-1">Explanation</p>
              <p className="text-sm text-on-variant leading-relaxed">{q.explanation}</p>
            </div>
          )}
          {q.trap && (
            <div className="mt-3 p-3 bg-warn-dim border border-warn/20 rounded-lg">
              <p className="text-2xs text-on-dim font-medium mb-1">Trap / Common confusion</p>
              <p className="text-sm text-on-variant leading-relaxed">{q.trap}</p>
            </div>
          )}
          {mistake.mistake_type && (
            <p className="text-2xs text-on-dim mt-3">
              Mistake type: <span className="text-warn font-medium">{mistake.mistake_type}</span>
            </p>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="px-4 pb-4">
        {/* Practice Similar */}
        {mistake.subtopic && (
          <button
            onClick={() => navigate(`/practice?mode=focused&subtopic=${encodeURIComponent(mistake.subtopic)}`)}
            className="w-full flex items-center justify-center gap-1.5 bg-primary/10 border border-primary/30 text-primary text-xs font-semibold py-2.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all mb-2"
          >
            <Icon name="play_arrow" size={14} fill className="text-primary" />
            Practice more on {mistake.subtopic}
          </button>
        )}

        {/* Status transition buttons */}
        <div className="flex gap-2">
          {mistake.status === 'pending' && (
            <>
              <button
                onClick={() => onStatusChange(mistake.id, 'revised')}
                className="flex-1 bg-warn-dim border border-warn/20 text-warn text-xs font-semibold py-2 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Mark Revised
              </button>
              <button
                onClick={() => onStatusChange(mistake.id, 'mastered')}
                className="flex-1 bg-success-dim border border-success/20 text-success text-xs font-semibold py-2 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Got It
              </button>
            </>
          )}
          {mistake.status === 'revised' && (
            <button
              onClick={() => onStatusChange(mistake.id, 'mastered')}
              className="flex-1 bg-success-dim border border-success/20 text-success text-xs font-semibold py-2 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Mark Mastered
            </button>
          )}
          {mistake.status === 'mastered' && (
            <button
              onClick={() => onStatusChange(mistake.id, 'pending')}
              className="flex-1 bg-surface-low border border-outline-variant text-on-variant text-xs font-medium py-2 rounded-lg hover:bg-outline-variant active:scale-[0.98] transition-all"
            >
              Back to Review
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── DateGroup ─────────────────────────────────────────────────────────────────

function DateGroup({ label, mistakes, onStatusChange, navigate }) {
  if (mistakes.length === 0) return null
  return (
    <div className="mb-1">
      <p className="text-xs font-medium text-on-dim uppercase tracking-widest mb-2">{label}</p>
      {mistakes.map(m => (
        <MistakeCard key={m.id} mistake={m} onStatusChange={onStatusChange} navigate={navigate} />
      ))}
    </div>
  )
}

// ── Main Mistakes screen ──────────────────────────────────────────────────────

export default function Mistakes() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pending')
  // refreshKey forces useMemo to re-compute after status changes
  const [refreshKey, setRefreshKey] = useState(0)

  const userId = userTrackingService.getLoggedInUserId()

  // Mistakes for active tab — sorted most-recent-first
  const allMistakes = useMemo(() => {
    if (!userId) return []
    const raw = userTrackingService.getMistakes(userId, activeTab) || []
    return [...raw].sort((a, b) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0
      return tb - ta
    })
  }, [userId, activeTab, refreshKey])

  // Counts across all 3 statuses (for summary strip + tab badges)
  const counts = useMemo(() => {
    if (!userId) return { pending: 0, revised: 0, mastered: 0 }
    return {
      pending:  (userTrackingService.getMistakes(userId, 'pending')  || []).length,
      revised:  (userTrackingService.getMistakes(userId, 'revised')  || []).length,
      mastered: (userTrackingService.getMistakes(userId, 'mastered') || []).length,
    }
  }, [userId, refreshKey])

  // Weakest topic/subtopic from attempt analytics
  const weakestTopic = useMemo(() => {
    if (!userId) return null
    const weak = userTrackingService.getWeakTopics(userId, 1)
    return weak.length > 0 ? weak[0] : null
  }, [userId, refreshKey])

  // Group active tab mistakes by date bucket
  const grouped = useMemo(() => bucketByDate(allMistakes), [allMistakes])

  function handleStatusChange(mistakeId, newStatus) {
    if (!userId) return
    userTrackingService.updateMistakeStatus(userId, mistakeId, newStatus)
    setRefreshKey(k => k + 1)
  }

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!userId) {
    return (
      <main className="flex-1 safe-pb overflow-y-auto">
        <div className="max-w-lg mx-auto px-4">
          <div className="pt-5 pb-4">
            <h1 className="font-display font-bold text-2xl text-on">Your Mistakes</h1>
            <p className="text-sm text-on-variant mt-0.5">Revise wrong answers and fix weak areas.</p>
          </div>
          <EmptyState
            icon="login"
            title="Sign in to view mistakes"
            subtitle="Login to start tracking your mistakes and improve faster."
            ctaLabel="Go to Home"
            onCta={() => navigate('/')}
          />
        </div>
      </main>
    )
  }

  const emptyState = EMPTY_STATES[activeTab] || EMPTY_STATES.pending

  return (
    <main className="flex-1 safe-pb overflow-y-auto">
      <div className="max-w-lg mx-auto px-4">

        {/* Header */}
        <div className="pt-5 pb-3">
          <h1 className="font-display font-bold text-2xl text-on">Your Mistakes</h1>
          <p className="text-sm text-on-variant mt-0.5">Revise wrong answers and fix weak areas.</p>
        </div>

        {/* Summary strip */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-3 mb-4">
          <div className="flex items-center gap-3 flex-wrap mb-1.5">
            <span className="text-xs text-on-dim">
              Pending: <span className="font-semibold text-error">{counts.pending}</span>
            </span>
            <span className="text-outline-variant text-xs">·</span>
            <span className="text-xs text-on-dim">
              Revised: <span className="font-semibold text-warn">{counts.revised}</span>
            </span>
            <span className="text-outline-variant text-xs">·</span>
            <span className="text-xs text-on-dim">
              Mastered: <span className="font-semibold text-success">{counts.mastered}</span>
            </span>
          </div>
          {weakestTopic && weakestTopic.subtopic && weakestTopic.subtopic !== 'Unknown' && (
            <p className="text-xs text-on-dim">
              Weakest: <span className="text-warn font-medium">{weakestTopic.subtopic}</span>
              <span className="text-on-dim"> ({weakestTopic.accuracy}% accuracy)</span>
            </p>
          )}
        </div>

        {/* Retry All — only on Pending when mistakes exist */}
        {activeTab === 'pending' && allMistakes.length > 0 && (
          <button
            onClick={() => navigate('/practice?mode=revision')}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-3 rounded-xl hover:opacity-90 active:scale-[0.99] mb-4 transition-all"
          >
            <Icon name="replay" size={18} fill className="text-white" />
            Retry All {allMistakes.length} Pending Mistake{allMistakes.length !== 1 ? 's' : ''}
          </button>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeTab === tab.key
                  ? 'bg-accent text-white'
                  : 'bg-surface-container border border-outline-variant text-on-variant hover:border-accent/30'
              }`}
            >
              <Icon name={tab.icon} size={14} />
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className={`text-2xs font-bold tabular-nums ${activeTab === tab.key ? 'text-white/80' : 'text-on-dim'}`}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Cards — grouped by date, or empty state */}
        {allMistakes.length === 0 ? (
          <EmptyState
            icon={emptyState.icon}
            title={emptyState.title}
            subtitle={emptyState.subtitle}
            ctaLabel="Start Practice"
            onCta={() => navigate('/')}
          />
        ) : (
          <div className="mb-6">
            <DateGroup label="Today"     mistakes={grouped.today}     onStatusChange={handleStatusChange} navigate={navigate} />
            <DateGroup label="Yesterday" mistakes={grouped.yesterday} onStatusChange={handleStatusChange} navigate={navigate} />
            <DateGroup label="Earlier"   mistakes={grouped.earlier}   onStatusChange={handleStatusChange} navigate={navigate} />
          </div>
        )}

      </div>
    </main>
  )
}
