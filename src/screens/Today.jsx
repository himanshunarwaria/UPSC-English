import { useNavigate } from 'react-router-dom'
import { useProgressContext } from '../hooks/useProgressContext'
import Icon from '../components/ui/Icon'

export default function Today() {
  const navigate = useNavigate()
  const { readiness, streak, revisionQueue, todayAttempted, todayCorrect, topicStats, attempted } = useProgressContext()

  const today = new Date().toISOString().split('T')[0]
  const todayAttempts = Object.values(attempted).filter(a => a.timestamp?.startsWith(today))
  const todayByTopic = todayAttempts.reduce((acc, a) => {
    acc[a.topic] = (acc[a.topic] || 0) + 1
    return acc
  }, {})

  const todayAccuracy = todayAttempted > 0 ? Math.round((todayCorrect / todayAttempted) * 100) : null
  const accuracyColor = todayAccuracy === null
    ? 'text-on-dim'
    : todayAccuracy >= 70 ? 'text-success' : todayAccuracy >= 50 ? 'text-warn' : 'text-error'

  const readinessColor = readiness >= 70 ? 'text-success' : readiness >= 40 ? 'text-warn' : 'text-error'
  const readinessBar   = readiness >= 70 ? 'bg-success'   : readiness >= 40 ? 'bg-warn'   : 'bg-error'

  const weakestEntry = Object.entries(topicStats)
    .filter(([, s]) => s.total >= 3 && s.correct / s.total < 0.65)
    .sort((a, b) => (a[1].correct / a[1].total) - (b[1].correct / b[1].total))[0]

  const CHECKLIST = [
    {
      label: '20 Grammar Questions',
      sublabel: `${Math.min(todayAttempted, 20)} / 20 done today`,
      done: todayAttempted >= 20,
      route: '/practice?mode=quick&topic=all',
    },
    {
      label: '10 Error Spotting',
      sublabel: `${Math.min(todayByTopic['Error Spotting'] || 0, 10)} / 10 done`,
      done: (todayByTopic['Error Spotting'] || 0) >= 10,
      route: '/practice?mode=quick&topic=Error%20Spotting',
    },
    {
      label: '5 Voice & Speech',
      sublabel: `${Math.min((todayByTopic['Active & Passive Voice'] || 0) + (todayByTopic['Direct & Indirect Speech'] || 0), 5)} / 5 done`,
      done: ((todayByTopic['Active & Passive Voice'] || 0) + (todayByTopic['Direct & Indirect Speech'] || 0)) >= 5,
      route: '/practice?mode=quick&topic=Active%20%26%20Passive%20Voice',
    },
    {
      label: 'Review Wrong Answers',
      sublabel: revisionQueue.length === 0 ? 'All clear' : `${revisionQueue.length} pending`,
      done: revisionQueue.length === 0,
      route: '/revision',
    },
  ]

  const doneCount = CHECKLIST.filter(c => c.done).length
  const dateLabel = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <main className="flex-1 safe-pb overflow-y-auto">
      <div className="max-w-lg mx-auto px-4">

        {/* Date + greeting */}
        <div className="pt-5 pb-4">
          <p className="text-2xs font-medium text-on-dim uppercase tracking-widest mb-1">{dateLabel}</p>
          <h1 className="font-display font-bold text-2xl text-on leading-tight">
            {todayAttempted === 0 ? 'Ready to focus?' : `${todayAttempted} done so far.`}
          </h1>
          <p className="text-sm text-on-variant mt-0.5">
            {doneCount === CHECKLIST.length
              ? "Today's plan complete — great work."
              : `${doneCount} of ${CHECKLIST.length} tasks done today`}
          </p>
        </div>

        {/* Primary CTA — most prominent, above fold */}
        <button
          onClick={() => navigate('/practice?mode=quick&topic=all')}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-4 rounded-xl mb-4 hover:opacity-90 active:scale-[0.99] transition-all"
        >
          <Icon name="bolt" size={20} fill className="text-white" />
          Start 15-Min Grammar Drill
        </button>

        {/* Bento stats grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">

          {/* Readiness — full-width progress card */}
          <div className="col-span-2 bg-surface-container border border-outline-variant rounded-xl px-4 py-3">
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-2xs font-medium text-on-dim uppercase tracking-widest">Readiness Score</p>
              <p className={`font-display font-bold text-xl leading-none ${readinessColor}`}>
                {readiness}
                <span className="text-xs font-normal text-on-dim ml-0.5">/ 100</span>
              </p>
            </div>
            <div className="h-1.5 w-full bg-surface-low rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${readinessBar}`}
                style={{ width: `${readiness}%` }}
              />
            </div>
          </div>

          {/* Grammar accuracy */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-3">
            <p className={`font-display font-bold text-2xl leading-none mb-0.5 ${accuracyColor}`}>
              {todayAccuracy !== null ? `${todayAccuracy}%` : '—'}
            </p>
            <p className="text-xs text-on-variant">Accuracy</p>
            <p className="text-2xs text-on-dim mt-0.5">today</p>
          </div>

          {/* Day streak */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-3">
            <div className="flex items-baseline gap-1 mb-0.5">
              <p className={`font-display font-bold text-2xl leading-none ${streak.count > 0 ? 'text-warn' : 'text-on'}`}>
                {streak.count}
              </p>
              {streak.count > 0 && (
                <Icon name="local_fire_department" size={14} fill className="text-warn" />
              )}
            </div>
            <p className="text-xs text-on-variant">Streak</p>
            <p className="text-2xs text-on-dim mt-0.5">days</p>
          </div>

          {/* Questions attempted today */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-3">
            <p className="font-display font-bold text-2xl leading-none mb-0.5 text-on">
              {todayAttempted}
            </p>
            <p className="text-xs text-on-variant">Attempted</p>
            <p className="text-2xs text-on-dim mt-0.5">today</p>
          </div>

          {/* Revision due */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-3">
            <p className={`font-display font-bold text-2xl leading-none mb-0.5 ${revisionQueue.length > 0 ? 'text-error' : 'text-success'}`}>
              {revisionQueue.length}
            </p>
            <p className="text-xs text-on-variant">Revision Due</p>
            <p className="text-2xs text-on-dim mt-0.5">
              {revisionQueue.length === 0 ? 'all clear' : 'needs attention'}
            </p>
          </div>

        </div>

        {/* Weakest topic alert — only when there is meaningful data */}
        {weakestEntry && (
          <button
            onClick={() => navigate(`/practice?mode=weakness&topic=${encodeURIComponent(weakestEntry[0])}`)}
            className="w-full mb-3 flex items-center gap-3 bg-warn-dim border border-warn/20 rounded-xl px-4 py-3 text-left hover:opacity-90 transition-opacity active:scale-[0.99]"
          >
            <Icon name="trending_up" size={18} fill className="text-warn flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-2xs font-medium text-on-dim uppercase tracking-wider mb-0.5">Weakest Topic</p>
              <p className="text-sm font-semibold text-on truncate">{weakestEntry[0]}</p>
              <p className="text-xs text-on-dim">
                {Math.round((weakestEntry[1].correct / weakestEntry[1].total) * 100)}% accuracy — drill to improve
              </p>
            </div>
            <Icon name="arrow_forward" size={16} className="text-warn/60 flex-shrink-0" />
          </button>
        )}

        {/* Revision queue alert — only when there are pending items */}
        {revisionQueue.length > 0 && (
          <button
            onClick={() => navigate('/revision')}
            className="w-full mb-3 flex items-center gap-3 bg-error-dim border border-error/20 rounded-xl px-4 py-3 text-left hover:opacity-90 transition-opacity active:scale-[0.99]"
          >
            <Icon name="assignment_late" size={18} fill className="text-error flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-error">
                {revisionQueue.length} wrong answer{revisionQueue.length > 1 ? 's' : ''} pending
              </p>
              <p className="text-xs text-error/70">Revise before they accumulate</p>
            </div>
            <Icon name="arrow_forward" size={16} className="text-error/60 flex-shrink-0" />
          </button>
        )}

        {/* Today's Tasks — Stitch Apple Reminders style */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-on-dim uppercase tracking-widest">Today's Tasks</p>
            <p className="text-xs text-on-dim">{doneCount} / {CHECKLIST.length}</p>
          </div>
          <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
            {CHECKLIST.map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.route)}
                className="w-full flex items-start gap-3 px-4 py-3 border-b border-outline-variant last:border-0 text-left hover:bg-surface-low transition-colors"
              >
                {item.done
                  ? <Icon name="task_alt" size={20} fill className="text-success flex-shrink-0 mt-0.5" />
                  : <Icon name="radio_button_unchecked" size={20} className="text-outline flex-shrink-0 mt-0.5" />
                }
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${item.done ? 'line-through text-on-dim' : 'font-medium text-on'}`}>
                    {item.label}
                  </p>
                  <p className={`text-xs mt-0.5 ${item.done ? 'text-on-dim' : 'text-on-variant'}`}>
                    {item.sublabel}
                  </p>
                </div>
                {!item.done && (
                  <Icon name="chevron_right" size={14} className="text-on-dim flex-shrink-0 mt-1" />
                )}
              </button>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
