import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgressContext } from '../hooks/useProgressContext'
import Icon from '../components/ui/Icon'
import LevelSelector from '../components/practice/LevelSelector'
import userTrackingService from '../services/userTrackingService'

export default function Today() {
  const navigate = useNavigate()

  const [lastSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pure_english_last_session') || 'null') } catch { return null }
  })
  const { streak, revisionQueue, todayAttempted, todayCorrect } = useProgressContext()

  const userId       = userTrackingService.getLoggedInUserId()
  const userProgress = userId ? userTrackingService.getCurrentUserProgress(userId) : null
  const currentLevel = userProgress?.currentLevel ?? 1

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
          <h1 className="font-display font-bold text-2xl text-on leading-tight">Practice</h1>
          <p className="text-sm text-on-variant mt-1">Choose your level, then select what you want to practise.</p>
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

        {/* Continue last session */}
        {lastSession && (
          <div className="mb-4 bg-surface-container border border-outline-variant rounded-xl px-4 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-2xs font-medium text-on-dim uppercase tracking-widest mb-0.5">Continue</p>
              <p className="text-sm font-semibold text-on truncate">
                Level {lastSession.level}
                {lastSession.topic ? ` · ${lastSession.topic}` : ''}
                {lastSession.subtopic ? ` · ${lastSession.subtopic}` : ''}
              </p>
            </div>
            <button
              onClick={() => {
                const p = new URLSearchParams({ mode: 'focused', level: String(lastSession.level) })
                if (lastSession.topic)    p.set('topic',    lastSession.topic)
                if (lastSession.subtopic) p.set('subtopic', lastSession.subtopic)
                navigate(`/practice?${p.toString()}`)
              }}
              className="flex-shrink-0 flex items-center gap-1.5 bg-surface-low border border-outline-variant text-on text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-outline-variant active:scale-[0.99] transition-all min-h-[44px]"
            >
              Resume
              <Icon name="arrow_forward" size={16} fill className="text-white" />
            </button>
          </div>
        )}

        {/* Level selector — main practice entry */}
        <div className="mb-6">
          <LevelSelector />
        </div>

        {/* Secondary links */}
        <div className="space-y-1 mb-8">
          <button
            onClick={() => navigate('/mistakes')}
            className="w-full flex items-center justify-between px-1 py-2.5 text-sm text-on-variant hover:text-on active:opacity-70 transition-colors"
          >
            <span>Revise Mistakes</span>
            <Icon name="arrow_forward" size={14} className="text-on-dim" />
          </button>
          <button
            onClick={() => navigate('/progress')}
            className="w-full flex items-center justify-between px-1 py-2.5 text-sm text-on-variant hover:text-on active:opacity-70 transition-colors"
          >
            <span>View Progress</span>
            <Icon name="arrow_forward" size={14} className="text-on-dim" />
          </button>
        </div>

      </div>
    </main>
  )
}
