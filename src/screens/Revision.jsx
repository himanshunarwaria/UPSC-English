import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgressContext } from '../hooks/useProgressContext'
import { getAllQuestions } from '../data/questions/getQuestions'
import pyqQuestions from '../data/pyqQuestions'
import Icon from '../components/ui/Icon'

// ── Static question map ───────────────────────────────────────────────────────

const qMap = Object.fromEntries(
  [...getAllQuestions(), ...pyqQuestions].map(q => [q.id, q])
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

function sourceLabel(q) {
  if (q.year) return `PYQ · ${q.year}`
  const s = q.section || ''
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Grammar'
}

function mistakeDescription(q) {
  return q.trap || q.conceptTag || null
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'due',      label: 'Due Today' },
  { key: 'wrong',    label: 'Wrong Answers' },
  { key: 'bookmarks',label: 'Bookmarked' },
  { key: 'weak',     label: 'Weak Concepts' },
  { key: 'writing',  label: 'Writing Feedback' },
]

// ── EmptyState ────────────────────────────────────────────────────────────────

function EmptyState({ icon, title, subtitle, ctaLabel, ctaVariant = 'primary', onCta }) {
  return (
    <div className="text-center py-12">
      <Icon name={icon} size={36} className="text-on-dim mx-auto mb-3" />
      <p className="text-sm font-semibold text-on mb-1">{title}</p>
      {subtitle && (
        <p className="text-xs text-on-dim mb-4 leading-relaxed max-w-[200px] mx-auto">{subtitle}</p>
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

// ── RevisionCard ──────────────────────────────────────────────────────────────

function RevisionCard({ q, attemptData, onRevise, onRemove, onBookmarkToggle, bookmarked }) {
  const ago      = timeAgo(attemptData?.timestamp)
  const src      = sourceLabel(q)
  const mistake  = mistakeDescription(q)
  const preview  = (q.question || q.questionText || '').replace(/\n/g, ' ')

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-4 flex flex-col gap-3 hover:border-outline transition-colors">

      {/* Source + time + actions */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-2xs text-on-variant bg-surface-low border border-outline-variant rounded-sm px-1.5 py-0.5 flex-shrink-0 leading-relaxed">
          {src}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {ago && (
            <span className="text-2xs text-on-dim flex items-center gap-0.5">
              <Icon name="schedule" size={11} className="text-on-dim" />
              {ago}
            </span>
          )}
          <button
            onClick={() => onBookmarkToggle(q.id)}
            className="text-on-dim hover:text-accent transition-colors"
          >
            <Icon name="bookmark" size={14} fill={bookmarked} className={bookmarked ? 'text-accent' : ''} />
          </button>
          {onRemove && (
            <button
              onClick={() => onRemove(q.id)}
              className="text-on-dim hover:text-error transition-colors"
            >
              <Icon name="close" size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Topic */}
      <p className="text-sm font-semibold text-on leading-tight">{q.topic}</p>

      {/* Mistake chip — Stitch: red bg, error icon */}
      {mistake && (
        <div className="flex items-start gap-1.5 bg-error-dim border border-error/20 rounded-lg px-2.5 py-2">
          <Icon name="error" size={13} className="text-error flex-shrink-0 mt-0.5" />
          <p className="text-xs text-error leading-relaxed">{mistake}</p>
        </div>
      )}

      {/* Question preview — italic, 2-line clamp */}
      {preview && (
        <p className="text-xs text-on-variant leading-relaxed line-clamp-2 italic">
          "{preview}"
        </p>
      )}

      {/* Revise CTA */}
      <button
        onClick={onRevise}
        className="w-full py-2 text-sm font-semibold text-on bg-surface border border-outline-variant rounded-lg hover:bg-surface-low active:scale-[0.98] transition-all"
      >
        Revise
      </button>
    </div>
  )
}

// ── WeakConceptRow ────────────────────────────────────────────────────────────

function WeakConceptRow({ topic, stats, onDrill }) {
  const accuracy = Math.round((stats.correct / stats.total) * 100)
  const color    = accuracy < 40 ? 'text-error' : 'text-warn'
  const bar      = accuracy < 40 ? 'bg-error'   : 'bg-warn'

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-on">{topic}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="h-1 w-24 bg-surface-low rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${bar}`} style={{ width: `${accuracy}%` }} />
          </div>
          <span className={`text-xs font-semibold ${color}`}>{accuracy}%</span>
          <span className="text-xs text-on-dim">{stats.total} attempted</span>
        </div>
      </div>
      <button
        onClick={onDrill}
        className="flex-shrink-0 text-xs font-semibold text-warn bg-warn-dim px-3 py-1.5 rounded-lg hover:opacity-90 active:scale-[0.97] transition-all"
      >
        Drill
      </button>
    </div>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function Revision() {
  const navigate  = useNavigate()
  const { revisionQueue, bookmarks, topicStats, attempted, removeFromRevision, toggleBookmark, isBookmarked } = useProgressContext()
  const [activeTab, setActiveTab] = useState('due')

  // Wrong answers — full queue
  const wrongList = useMemo(
    () => revisionQueue.map(id => qMap[id]).filter(Boolean),
    [revisionQueue]
  )

  // Due Today — items not revisited in >= 3 days (or never stamped)
  const dueTodayList = useMemo(() => wrongList.filter(q => {
    const ts = attempted[q.id]?.timestamp
    if (!ts) return true
    return (Date.now() - new Date(ts).getTime()) / 86400000 >= 3
  }), [wrongList, attempted])

  // Bookmarks
  const bookmarkList = useMemo(
    () => bookmarks.map(id => qMap[id]).filter(Boolean),
    [bookmarks]
  )

  // Weak concepts — accuracy < 60% with at least 1 attempt
  const weakTopics = useMemo(
    () => Object.entries(topicStats)
      .filter(([, s]) => s.total > 0 && s.correct / s.total < 0.6)
      .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total)),
    [topicStats]
  )

  // Writing feedback — subjective questions self-rated as 'review'
  const writingFeedback = useMemo(
    () => Object.entries(attempted)
      .filter(([, a]) => a.selfRating === 'review')
      .map(([id]) => qMap[id])
      .filter(Boolean),
    [attempted]
  )

  // Tab badge counts
  const counts = {
    due:       dueTodayList.length,
    wrong:     wrongList.length,
    bookmarks: bookmarkList.length,
    weak:      weakTopics.length,
    writing:   writingFeedback.length,
  }

  // Routing
  function reviseQuestion(q) {
    if (q.year) navigate(`/practice?mode=pyq&id=${q.id}`)
    else         navigate(`/practice?mode=revision&topic=${encodeURIComponent(q.topic)}`)
  }

  function drillWeakTopic(topic) {
    navigate(`/practice?mode=weakness&topic=${encodeURIComponent(topic)}`)
  }

  return (
    <main className="flex-1 safe-pb overflow-y-auto">
      <div className="max-w-lg mx-auto px-4">

        {/* Header */}
        <div className="pt-5 pb-3">
          <p className="text-2xs font-medium text-on-dim uppercase tracking-widest mb-1">
            {wrongList.length} pending · {bookmarkList.length} bookmarked · {weakTopics.length} weak topics
          </p>
          <h1 className="font-display font-bold text-2xl text-on">Revision Queue</h1>
          <p className="text-sm text-on-variant mt-0.5">Mistakes you must not repeat in the exam.</p>
        </div>

        {/* 15-Minute Revision CTA — Stitch sticky pattern, shown at top */}
        {wrongList.length > 0 && (
          <button
            onClick={() => navigate('/practice?mode=revision&topic=all')}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-3 rounded-xl mb-3 hover:opacity-90 active:scale-[0.99] transition-all"
          >
            <Icon name="timer" size={18} fill className="text-white" />
            Start 15-Minute Revision ({wrongList.length})
          </button>
        )}

        {/* Tabs — horizontal scroll, Stitch pill style */}
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 -mx-4 px-4">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface-container text-on-variant border-outline-variant hover:border-outline'
              }`}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className={`ml-1.5 tabular-nums ${activeTab === tab.key ? 'text-white/70' : 'text-on-dim'}`}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Due Today ─────────────────────────────────────────────────────── */}
        {activeTab === 'due' && (
          <div className="space-y-3 pb-2">
            {dueTodayList.length === 0 ? (
              wrongList.length === 0 ? (
                <EmptyState
                  icon="check_circle"
                  title="No pending mistakes."
                  subtitle="Start a grammar drill."
                  ctaLabel="Start Grammar Drill"
                  onCta={() => navigate('/practice?mode=quick&topic=all')}
                />
              ) : (
                <EmptyState
                  icon="schedule"
                  title="No overdue items."
                  subtitle={`${wrongList.length} recent mistake${wrongList.length > 1 ? 's' : ''}. Revisit after 3 days.`}
                  ctaLabel="See All Wrong Answers"
                  ctaVariant="outline"
                  onCta={() => setActiveTab('wrong')}
                />
              )
            ) : (
              dueTodayList.map(q => (
                <RevisionCard
                  key={q.id} q={q}
                  attemptData={attempted[q.id]}
                  onRevise={() => reviseQuestion(q)}
                  onRemove={removeFromRevision}
                  onBookmarkToggle={toggleBookmark}
                  bookmarked={isBookmarked(q.id)}
                />
              ))
            )}
          </div>
        )}

        {/* ── Wrong Answers ─────────────────────────────────────────────────── */}
        {activeTab === 'wrong' && (
          <div className="space-y-3 pb-2">
            {wrongList.length === 0 ? (
              <EmptyState
                icon="check_circle"
                title="No wrong answers pending."
                subtitle="Start a grammar drill."
                ctaLabel="Start Grammar Drill"
                onCta={() => navigate('/practice?mode=quick&topic=all')}
              />
            ) : (
              wrongList.map(q => (
                <RevisionCard
                  key={q.id} q={q}
                  attemptData={attempted[q.id]}
                  onRevise={() => reviseQuestion(q)}
                  onRemove={removeFromRevision}
                  onBookmarkToggle={toggleBookmark}
                  bookmarked={isBookmarked(q.id)}
                />
              ))
            )}
          </div>
        )}

        {/* ── Bookmarked ────────────────────────────────────────────────────── */}
        {activeTab === 'bookmarks' && (
          <div className="pb-2">
            {bookmarkList.length === 0 ? (
              <EmptyState
                icon="bookmark"
                title="No bookmarks yet."
                subtitle="Tap the bookmark icon during practice to save questions."
              />
            ) : (
              <>
                <button
                  onClick={() => navigate('/practice?mode=revision&topic=bookmarks')}
                  className="w-full flex items-center justify-center gap-2 bg-accent-dim border border-accent/20 text-accent text-sm font-semibold py-2.5 rounded-xl mb-3 hover:opacity-90 transition-all"
                >
                  <Icon name="bookmark" size={16} fill className="text-accent" />
                  Drill All Bookmarked ({bookmarkList.length})
                </button>
                <div className="space-y-3">
                  {bookmarkList.map(q => (
                    <RevisionCard
                      key={q.id} q={q}
                      attemptData={attempted[q.id]}
                      onRevise={() => reviseQuestion(q)}
                      onRemove={null}
                      onBookmarkToggle={toggleBookmark}
                      bookmarked={true}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Weak Concepts ─────────────────────────────────────────────────── */}
        {activeTab === 'weak' && (
          <div className="pb-2">
            {weakTopics.length === 0 ? (
              <EmptyState
                icon="trending_up"
                title="No weak topics identified."
                subtitle="Attempt more questions to see weak areas."
              />
            ) : (
              <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
                {weakTopics.map(([topic, stats]) => (
                  <WeakConceptRow
                    key={topic}
                    topic={topic}
                    stats={stats}
                    onDrill={() => drillWeakTopic(topic)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Writing Feedback ──────────────────────────────────────────────── */}
        {activeTab === 'writing' && (
          <div className="pb-2">
            {writingFeedback.length === 0 ? (
              <EmptyState
                icon="edit_note"
                title="No writing tasks flagged."
                subtitle="Attempt subjective PYQ questions and tap 'Need to Review' to track them here."
                ctaLabel="Go to PYQ Bank"
                ctaVariant="outline"
                onCta={() => navigate('/pyqs')}
              />
            ) : (
              <div className="space-y-3">
                {writingFeedback.map(q => (
                  <RevisionCard
                    key={q.id} q={q}
                    attemptData={attempted[q.id]}
                    onRevise={() => reviseQuestion(q)}
                    onRemove={null}
                    onBookmarkToggle={toggleBookmark}
                    bookmarked={isBookmarked(q.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  )
}
