import { useNavigate } from 'react-router-dom'
import { useProgressContext } from '../hooks/useProgressContext'
import Icon from '../components/ui/Icon'
import LevelSelector from '../components/practice/LevelSelector'
import userTrackingService from '../services/userTrackingService'

export default function Today() {
  const navigate = useNavigate()
  const { streak, revisionQueue, todayAttempted, todayCorrect } = useProgressContext()

  const userId      = userTrackingService.getLoggedInUserId()
  const userProgress = userId ? userTrackingService.getCurrentUserProgress(userId) : null
  const currentLevel = userProgress?.currentLevel ?? 1
  const userAccuracy = userId ? userTrackingService.getUserAccuracy(userId) : 0

  const todayAccuracy = todayAttempted > 0
    ? Math.round((todayCorrect / todayAttempted) * 100)
    : null

  const accuracyColor = todayAccuracy === null
    ? 'text-on-dim'
    : todayAccuracy >= 70 ? 'text-success' : todayAccuracy >= 50 ? 'text-warn' : 'text-error'

  const dateLabel = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <main className="flex-1 safe-pb overflow-y-auto">
      <div className="max-w-lg mx-auto px-4">

        {/* Header */}
        <div className="pt-5 pb-4">
          <p className="text-2xs font-medium text-on-dim uppercase tracking-widest mb-1">{dateLabel}</p>
          <h1 className="font-display font-bold text-2xl text-on leading-tight">
            {todayAttempted === 0 ? 'Ready to practise?' : `${todayAttempted} done today.`}
          </h1>
        </div>

        {/* Compact stats strip */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="bg-surface-container border border-outline-variant rounded-xl px-2 py-3 text-center">
            <p className="font-display font-bold text-xl text-primary leading-none">{currentLevel}</p>
            <p className="text-2xs text-on-dim mt-1">Level</p>
          </div>
          <div className="bg-surface-container border border-outline-variant rounded-xl px-2 py-3 text-center">
            <p className={`font-display font-bold text-xl leading-none ${accuracyColor}`}>
              {todayAccuracy !== null ? `${todayAccuracy}%` : '—'}
            </p>
            <p className="text-2xs text-on-dim mt-1">Today</p>
          </div>
          <div className="bg-surface-container border border-outline-variant rounded-xl px-2 py-3 text-center">
            <p className={`font-display font-bold text-xl leading-none ${streak.count > 0 ? 'text-warn' : 'text-on'}`}>
              {streak.count}
            </p>
            <p className="text-2xs text-on-dim mt-1">Streak</p>
          </div>
          <div className={`bg-surface-container border rounded-xl px-2 py-3 text-center ${
            revisionQueue.length > 0 ? 'border-error/30' : 'border-outline-variant'
          }`}>
            <p className={`font-display font-bold text-xl leading-none ${
              revisionQueue.length > 0 ? 'text-error' : 'text-success'
            }`}>
              {revisionQueue.length}
            </p>
            <p className="text-2xs text-on-dim mt-1">Due</p>
          </div>
        </div>

        {/* Level selector — main practice entry */}
        <div className="mb-6">
          <LevelSelector />
        </div>

        {/* Shortcuts */}
        <div className="space-y-2 mb-8">
          {revisionQueue.length > 0 && (
            <button
              onClick={() => navigate('/revision')}
              className="w-full flex items-center gap-3 bg-error-dim border border-error/20 rounded-xl px-4 py-3 text-left hover:opacity-90 active:scale-[0.99] transition-all"
            >
              <Icon name="replay" size={18} fill className="text-error flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-error">
                  {revisionQueue.length} wrong answer{revisionQueue.length > 1 ? 's' : ''} to revise
                </p>
                <p className="text-xs text-on-dim">Revise before they accumulate</p>
              </div>
              <Icon name="arrow_forward" size={16} className="text-error/60 flex-shrink-0" />
            </button>
          )}

          <button
            onClick={() => navigate('/mistakes')}
            className="w-full flex items-center gap-3 bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-left hover:opacity-90 active:scale-[0.99] transition-all"
          >
            <Icon name="error" size={18} fill className="text-on-variant flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-on">Mistake Review</p>
              <p className="text-xs text-on-dim">Review what you got wrong</p>
            </div>
            <Icon name="arrow_forward" size={16} className="text-on-dim flex-shrink-0" />
          </button>

          <button
            onClick={() => navigate('/progress')}
            className="w-full flex items-center gap-3 bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-left hover:opacity-90 active:scale-[0.99] transition-all"
          >
            <Icon name="bar_chart" size={18} fill className="text-on-variant flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-on">Progress Report</p>
              <p className="text-xs text-on-dim">
                {userAccuracy > 0 ? `${userAccuracy}% overall accuracy` : 'Track your progress'}
              </p>
            </div>
            <Icon name="arrow_forward" size={16} className="text-on-dim flex-shrink-0" />
          </button>
        </div>

      </div>
    </main>
  )
}
