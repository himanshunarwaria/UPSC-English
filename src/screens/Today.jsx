import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgressContext } from '../hooks/useProgressContext'
import Icon from '../components/ui/Icon'
import userTrackingService from '../services/userTrackingService'
import { UPSC_LEVELS } from '../data/upscLevels'

export default function Today() {
  const navigate = useNavigate()
  const [accessDeniedMessage, setAccessDeniedMessage] = useState(null)
  const { readiness, streak, revisionQueue, todayAttempted, todayCorrect, topicStats, attempted } = useProgressContext()

  // Check for level access denied message (from LevelAccessGuard)
  useEffect(() => {
    const message = sessionStorage.getItem('levelAccessDeniedMessage')
    if (message) {
      setAccessDeniedMessage(message)
      sessionStorage.removeItem('levelAccessDeniedMessage')
    }
  }, [])

  // Get UPSC progress data
  const userId = userTrackingService.getLoggedInUserId()
  const userProgress = userId ? userTrackingService.getCurrentUserProgress(userId) : null
  const currentLevel = userProgress?.currentLevel ?? 1
  const levelData = UPSC_LEVELS.find(l => l.levelNumber === currentLevel) || UPSC_LEVELS[0]
  const nextLevel = currentLevel < 10 ? UPSC_LEVELS[currentLevel] : null

  // User accuracy (fallback to 0%)
  const userAccuracy = userId ? userTrackingService.getUserAccuracy(userId) : 0
  const accuracyColorUpsc = userAccuracy >= 70 ? 'text-success' : userAccuracy >= 50 ? 'text-warn' : userAccuracy > 0 ? 'text-error' : 'text-on-dim'

  // Weak topics
  const weakTopics = userId ? userTrackingService.getWeakTopics(userId, 1) : []
  const weakArea = weakTopics.length > 0 ? weakTopics[0].subtopic : null

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

  // Get smart recommendation
  const recommendation = userId ? userTrackingService.getRecommendedTask(userId) : userTrackingService.getRecommendedTask(null)

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

        {/* Level Access Denied Message */}
        {accessDeniedMessage && (
          <button
            onClick={() => setAccessDeniedMessage(null)}
            className="w-full mb-4 flex items-start gap-3 bg-warn-dim border border-warn/20 rounded-xl px-4 py-3 text-left hover:opacity-90 transition-opacity active:scale-[0.99]"
          >
            <Icon name="lock" size={18} fill className="text-warn flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-warn">Level Locked</p>
              <p className="text-xs text-on-variant mt-0.5">{accessDeniedMessage}</p>
            </div>
            <Icon name="close" size={16} className="text-warn/60 flex-shrink-0 mt-0.5" />
          </button>
        )}

        {/* Primary CTA — most prominent, above fold */}
        <button
          onClick={() => navigate('/practice?mode=quick&topic=all')}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-4 rounded-xl mb-2 hover:opacity-90 active:scale-[0.99] transition-all"
        >
          <Icon name="bolt" size={20} fill className="text-white" />
          Start 15-Min Grammar Drill
        </button>

        {/* Secondary CTA — user-directed practice */}
        <button
          onClick={() => navigate('/practice?mode=select')}
          className="w-full flex items-center justify-center gap-2 bg-surface-container border border-outline-variant text-on text-sm font-medium py-3 rounded-xl mb-4 hover:opacity-90 active:scale-[0.99] transition-all"
        >
          <Icon name="tune" size={18} className="text-on-variant" />
          Choose Level / Topic
        </button>

        {/* Smart Recommendation Card — before stats for quick access */}
        {recommendation && (
          <button
            onClick={() => navigate(recommendation.ctaRoute)}
            className={`w-full mb-4 flex items-center gap-3 rounded-xl px-4 py-3 text-left hover:opacity-90 transition-opacity active:scale-[0.99] border ${
              recommendation.taskType === 'mistakes'
                ? 'bg-error-dim border-error/20'
                : recommendation.taskType === 'level-test'
                ? 'bg-primary/10 border-primary/30'
                : recommendation.taskType === 'vocabulary'
                ? 'bg-accent-dim border-accent/30'
                : 'bg-success-dim border-success/20'
            }`}
          >
            <Icon
              name={
                recommendation.taskType === 'mistakes' ? 'assignment_late'
                : recommendation.taskType === 'level-test' ? 'flag'
                : recommendation.taskType === 'vocabulary' ? 'school'
                : 'lightbulb'
              }
              size={18}
              fill
              className={`flex-shrink-0 ${
                recommendation.taskType === 'mistakes' ? 'text-error'
                : recommendation.taskType === 'level-test' ? 'text-primary'
                : recommendation.taskType === 'vocabulary' ? 'text-accent'
                : 'text-success'
              }`}
            />
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold mb-0.5 ${
                recommendation.taskType === 'mistakes' ? 'text-error'
                : recommendation.taskType === 'level-test' ? 'text-primary'
                : recommendation.taskType === 'vocabulary' ? 'text-accent'
                : 'text-success'
              }`}>
                {recommendation.title}
              </p>
              <p className="text-xs text-on-dim leading-snug">{recommendation.description}</p>
            </div>
            <Icon name="arrow_forward" size={16} className="flex-shrink-0 opacity-50" />
          </button>
        )}

        {/* Bento stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">

          {/* Current Level — UPSC Progress Card (full-width) */}
          <div className="col-span-2 bg-surface-container border border-outline-variant rounded-xl px-4 py-4">
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-2xs font-medium text-on-dim uppercase tracking-widest">Current Level</p>
              <p className="font-display font-bold text-2xl leading-none text-primary">
                Level {currentLevel}
              </p>
            </div>
            <p className="text-sm text-on font-semibold">{levelData.title}</p>
            <p className="text-xs text-on-variant mt-2 leading-snug">{levelData.shortDescription}</p>
          </div>

          {/* Readiness — full-width progress card */}
          <div className="col-span-2 bg-surface-container border border-outline-variant rounded-xl px-4 py-4">
            <div className="flex items-baseline justify-between mb-3">
              <p className="text-2xs font-medium text-on-dim uppercase tracking-widest">Readiness Score</p>
              <p className={`font-display font-bold text-2xl leading-none ${readinessColor}`}>
                {readiness}
                <span className="text-xs font-normal text-on-dim ml-0.5">/ 100</span>
              </p>
            </div>
            <div className="h-2 w-full bg-surface-low rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${readinessBar}`}
                style={{ width: `${readiness}%` }}
              />
            </div>
          </div>

          {/* UPSC Overall Accuracy */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-4 flex flex-col justify-between min-h-[105px]">
            <p className={`font-display font-bold text-3xl leading-tight mb-1 ${accuracyColorUpsc}`}>
              {userAccuracy > 0 ? `${userAccuracy}%` : '—'}
            </p>
            <div>
              <p className="text-xs font-semibold text-on-variant">Accuracy</p>
              <p className="text-2xs text-on-dim mt-0.5">overall</p>
            </div>
          </div>

          {/* Today's Accuracy */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-3">
            <p className={`font-display font-bold text-3xl leading-tight mb-1 ${accuracyColor}`}>
              {todayAccuracy !== null ? `${todayAccuracy}%` : '—'}
            </p>
            <div>
              <p className="text-xs font-semibold text-on-variant">Accuracy</p>
              <p className="text-2xs text-on-dim mt-0.5">today</p>
            </div>
          </div>

          {/* Day streak */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-3">
            <div className="flex items-baseline gap-1 mb-0.5">
              <p className={`font-display font-bold text-2xl leading-none ${streak.count > 0 ? 'text-warn' : 'text-on'}`}>
                {streak.count}
              </p>
              {streak.count > 0 && (
                <Icon name="local_fire_department" size={16} fill className="text-warn" />
              )}
            </div>
            <p className="text-xs text-on-variant">Streak</p>
            <p className="text-2xs text-on-dim mt-0.5">days</p>
          </div>

          {/* Questions attempted today */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-3">
            <p className="font-display font-bold text-3xl leading-tight mb-1 text-on">
              {todayAttempted}
            </p>
            <p className="text-xs text-on-variant">Attempted</p>
            <p className="text-2xs text-on-dim mt-0.5">today</p>
          </div>

          {/* Revision due */}
          <div className="bg-surface-container border border-outline-variant rounded-xl p-3">
            <p className={`font-display font-bold text-3xl leading-tight mb-1 ${revisionQueue.length > 0 ? 'text-error' : 'text-success'}`}>
              {revisionQueue.length}
            </p>
            <p className="text-xs text-on-variant">Revision Due</p>
            <p className="text-2xs text-on-dim mt-0.5">
              {revisionQueue.length === 0 ? 'all clear' : 'needs attention'}
            </p>
          </div>

          {/* Weak Area — UPSC Focused */}
          <div className="col-span-2 bg-surface-container border border-outline-variant rounded-xl p-3">
            <p className="text-2xs font-medium text-on-dim uppercase tracking-widest mb-1">Weak Area</p>
            <p className="text-sm text-on font-medium">
              {weakArea || 'Start practice to identify weak areas'}
            </p>
            {weakTopics.length > 0 && (
              <p className="text-2xs text-on-dim mt-1">
                {weakTopics[0].accuracy}% accuracy — focus here
              </p>
            )}
          </div>

          {/* Next Level Unlock Progress — if not at Level 10 */}
          {nextLevel && currentLevel < 10 && (
            <div className="col-span-2 bg-surface-container border border-outline-variant rounded-xl px-4 py-3">
              <div className="flex items-baseline justify-between mb-2">
                <p className="text-2xs font-medium text-on-dim uppercase tracking-widest">Unlock Level {currentLevel + 1}</p>
                <p className="text-2xs text-on-dim">Score 80% in Level {currentLevel} Test</p>
              </div>
              <p className="text-sm text-on font-medium">{nextLevel.title}</p>
              <div className="h-1.5 w-full bg-surface-low rounded-full overflow-hidden mt-2">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-primary"
                  style={{ width: `${Math.min(userAccuracy, 100)}%` }}
                />
              </div>
              <p className="text-2xs text-on-dim mt-1">{userAccuracy}% progress to unlock</p>
            </div>
          )}

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

        {/* UPSC Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => navigate(`/practice?level=${currentLevel}`)}
            className="flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-3 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all"
          >
            <Icon name="play_arrow" size={18} fill className="text-white" />
            Continue
          </button>
          <button
            onClick={() => navigate('/revision')}
            className="flex items-center justify-center gap-2 bg-warn text-white text-sm font-semibold py-3 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all"
          >
            <Icon name="assignment" size={18} fill className="text-white" />
            Review
          </button>
        </div>

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
