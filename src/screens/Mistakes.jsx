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

function timeAgo(timestamp) {
  if (!timestamp) return null
  const days = Math.floor((Date.now() - new Date(timestamp).getTime()) / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7)  return `${days}d ago`
  const wk = Math.floor(days / 7)
  if (wk < 5)    return `${wk}w ago`
  return `${Math.floor(days / 30)}mo ago`
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

// ── Tabs ──────────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'pending',  label: 'Pending',  icon: 'clock' },
  { key: 'revised',  label: 'Revised',  icon: 'done' },
  { key: 'mastered', label: 'Mastered', icon: 'check_circle' },
]

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

function MistakeCard({ mistake, onStatusChange }) {
  const q = qMap[mistake.question_id]
  if (!q) return null

  const preview = (q.question || q.questionText || '').split('\n')[0].substring(0, 100)

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-4 mb-3">
      {/* Header with status and meta */}
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {mistake.topic && (
              <Badge variant="default" size="xs">{mistake.topic}</Badge>
            )}
            {mistake.subtopic && (
              <Badge variant="default" size="xs">{mistake.subtopic}</Badge>
            )}
            {mistake.level && (
              <Badge variant="default" size="xs">L{mistake.level}</Badge>
            )}
            {mistake.mistake_type && (
              <Badge variant="warn" size="xs">{mistake.mistake_type}</Badge>
            )}
          </div>
          <p className="text-2xs text-on-dim">{timeAgo(mistake.created_at)}</p>
        </div>
        <span className={`text-xs font-semibold flex-shrink-0 ${statusColor(mistake.status)}`}>
          {statusLabel(mistake.status)}
        </span>
      </div>

      {/* Question preview */}
      <div className="mb-3 p-3 bg-surface-low border border-outline-variant rounded-lg">
        <p className="text-sm text-on leading-relaxed line-clamp-2">{preview}</p>
        {preview.length === 100 && (
          <p className="text-2xs text-on-dim mt-1">…</p>
        )}
      </div>

      {/* User answer vs correct answer */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 bg-error-dim border border-error/20 rounded-lg">
          <p className="text-2xs text-on-dim font-medium mb-0.5">Your Answer</p>
          <p className="text-sm text-error font-semibold">
            {q.options && Array.isArray(q.options)
              ? q.options[mistake.selected_answer] || 'Skipped'
              : 'Not available'}
          </p>
        </div>
        <div className="p-2 bg-success-dim border border-success/20 rounded-lg">
          <p className="text-2xs text-on-dim font-medium mb-0.5">Correct Answer</p>
          <p className="text-sm text-success font-semibold">
            {q.options && Array.isArray(q.options)
              ? q.options[q.correctAnswer] || 'Not available'
              : 'Not available'}
          </p>
        </div>
      </div>

      {/* Explanation */}
      {q.explanation && (
        <div className="mb-3 p-3 bg-surface-low border border-outline-variant rounded-lg">
          <p className="text-2xs text-on-dim font-medium mb-1">Explanation</p>
          <p className="text-sm text-on-variant leading-relaxed">{q.explanation}</p>
        </div>
      )}

      {/* Trap/Note */}
      {q.trap && (
        <div className="mb-3 p-3 bg-warn-dim border border-warn/20 rounded-lg">
          <p className="text-2xs text-on-dim font-medium mb-1">Note</p>
          <p className="text-sm text-on-variant leading-relaxed">{q.trap}</p>
        </div>
      )}

      {/* Quick practice button */}
      {mistake.subtopic && (
        <button
          onClick={() => window.location.href = `/practice?mode=focused&subtopic=${encodeURIComponent(mistake.subtopic)}`}
          className="w-full mb-3 flex items-center justify-center gap-1.5 bg-primary/10 border border-primary/30 text-primary text-xs font-semibold py-2.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
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
  )
}

// ── Main Mistakes screen ────────────────────────────────────────────────────────

export default function Mistakes() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('pending')

  // Get current user
  const userId = userTrackingService.getLoggedInUserId()

  // Get mistakes for current tab
  const allMistakes = useMemo(() => {
    if (!userId) return []
    return userTrackingService.getMistakes(userId, activeTab) || []
  }, [userId, activeTab])

  const handleStatusChange = (mistakeId, newStatus) => {
    if (!userId) return
    userTrackingService.updateMistakeStatus(userId, mistakeId, newStatus)
    // Re-fetch will happen on next render due to dependency
    setActiveTab(activeTab) // Trigger re-render
  }

  // Empty state
  if (!userId) {
    return (
      <main className="flex-1 safe-pb overflow-y-auto">
        <div className="max-w-lg mx-auto px-4">
          <div className="pt-5 pb-4">
            <h1 className="font-display font-bold text-2xl text-on">Mistakes</h1>
            <p className="text-sm text-on-variant mt-0.5">Your improvement map</p>
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

  return (
    <main className="flex-1 safe-pb overflow-y-auto">
      <div className="max-w-lg mx-auto px-4">

        {/* Header */}
        <div className="pt-5 pb-4">
          <h1 className="font-display font-bold text-2xl text-on">Mistakes</h1>
          <p className="text-sm text-on-variant mt-0.5">Your improvement map</p>
        </div>

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
            </button>
          ))}
        </div>

        {/* Mistake cards or empty state */}
        {allMistakes.length === 0 ? (
          <EmptyState
            icon={activeTab === 'pending' ? 'check_circle' : 'celebration'}
            title={
              activeTab === 'pending'
                ? 'No pending mistakes'
                : activeTab === 'revised'
                ? 'No revised mistakes'
                : 'No mastered mistakes yet'
            }
            subtitle="No mistakes yet. Start practice to build your improvement map."
            ctaLabel="Start Practice"
            onCta={() => navigate('/practice?mode=quick&topic=all')}
          />
        ) : (
          <div className="mb-6">
            <p className="text-xs text-on-dim mb-3">{allMistakes.length} item{allMistakes.length !== 1 ? 's' : ''}</p>
            {allMistakes.map(mistake => (
              <MistakeCard
                key={mistake.id}
                mistake={mistake}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

      </div>
    </main>
  )
}
