import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import userTrackingService from '../services/userTrackingService'
import { UPSC_LEVELS } from '../data/upscLevels'
import Icon from '../components/ui/Icon'

// ── Stat Cell ──────────────────────────────────────────────────────────────

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

// ── Level Progress Row ─────────────────────────────────────────────────────

function LevelProgressRow({ level, accuracy, questionsAttempted }) {
  const levelData = UPSC_LEVELS.find(l => l.levelNumber === level)
  const barColor = accuracy < 50 ? 'bg-error' : accuracy < 70 ? 'bg-warn' : 'bg-success'
  const accColor = accuracy < 50 ? 'text-error' : accuracy < 70 ? 'text-warn' : 'text-success'

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-3 mb-2">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-on">Level {level}</p>
          <p className="text-2xs text-on-dim">{levelData?.title}</p>
        </div>
        <div className="text-right">
          <p className={`text-xs font-bold ${accColor}`}>{accuracy}%</p>
          <p className="text-2xs text-on-dim">{questionsAttempted} Q</p>
        </div>
      </div>
      <div className="h-1.5 bg-surface-low rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(accuracy, 100)}%` }} />
      </div>
    </div>
  )
}

// ── Main Progress Screen ───────────────────────────────────────────────────

export default function ProgressReport() {
  const navigate = useNavigate()
  const userId = userTrackingService.getLoggedInUserId()

  const attempts  = useMemo(() => userId ? userTrackingService.getAttempts(userId)             : [], [userId])
  const progress  = useMemo(() => userId ? userTrackingService.getCurrentUserProgress(userId)  : null, [userId])
  const weakTopics = useMemo(() => userId ? userTrackingService.getWeakTopics(userId, 5)       : [], [userId])
  const mistakes  = useMemo(() => userId ? userTrackingService.getMistakes(userId)             : [], [userId])

  const overallAccuracy = useMemo(() => {
    if (attempts.length === 0) return 0
    return Math.round((attempts.filter(a => a.is_correct).length / attempts.length) * 100)
  }, [attempts])

  const pendingMistakesCount = mistakes.filter(m => m.status === 'pending').length
  const currentLevel = progress?.currentLevel || 1

  const levelStats = useMemo(() => {
    const stats = {}
    attempts.forEach(a => {
      const lv = a.level || 1
      if (!stats[lv]) stats[lv] = { correct: 0, total: 0 }
      stats[lv].total += 1
      if (a.is_correct) stats[lv].correct += 1
    })
    return stats
  }, [attempts])

  // ── Empty / logged-out state ──────────────────────────────────────────────
  if (!userId || attempts.length === 0) {
    return (
      <main className="flex-1 safe-pb overflow-y-auto">
        <div className="max-w-lg mx-auto px-4">
          <div className="pt-5 pb-4">
            <h1 className="font-display font-bold text-2xl text-on">Progress</h1>
            <p className="text-sm text-on-variant mt-0.5">How am I improving?</p>
          </div>
          <div className="text-center py-12">
            <Icon name="trending_up" size={40} className="text-on-dim mx-auto mb-3" />
            <p className="text-sm font-semibold text-on mb-1">No practice yet</p>
            <p className="text-xs text-on-dim mb-4 leading-relaxed max-w-[240px] mx-auto">
              Complete your first session to see your progress here.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-accent text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Start Practice
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
          <h1 className="font-display font-bold text-2xl text-on">Progress</h1>
          <p className="text-sm text-on-variant mt-0.5">How am I improving?</p>
        </div>

        {/* 4 stat cells — the only ones that answer student questions */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <StatCell
            icon="trending_up"
            label="Accuracy"
            value={`${overallAccuracy}%`}
            sub={`${attempts.filter(a => a.is_correct).length} of ${attempts.length} correct`}
            valueColor={overallAccuracy >= 70 ? 'text-success' : overallAccuracy >= 50 ? 'text-warn' : 'text-error'}
          />
          <StatCell
            icon="flag"
            label="Current Level"
            value={`Level ${currentLevel}`}
            sub={UPSC_LEVELS.find(l => l.levelNumber === currentLevel)?.difficultyLabel}
          />
          <StatCell
            icon="menu_book"
            label="Questions Done"
            value={attempts.length}
            sub={`${attempts.filter(a => a.is_correct).length} correct`}
            valueColor="text-primary"
          />
          <StatCell
            icon="error"
            label="Pending Fixes"
            value={pendingMistakesCount}
            sub={pendingMistakesCount > 0 ? 'Tap Mistakes to review' : 'All clear!'}
            valueColor={pendingMistakesCount > 0 ? 'text-error' : 'text-success'}
          />
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-3 rounded-xl hover:opacity-90 active:scale-[0.99] mb-6 transition-all"
        >
          <Icon name="play_arrow" size={18} fill className="text-white" />
          Continue Practice
        </button>

        {/* Level Progress — answers "where am I?" */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-on mb-3">Level Progress</h2>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => {
            const stats = levelStats[level]
            if (!stats) return null
            const accuracy = Math.round((stats.correct / stats.total) * 100)
            return (
              <LevelProgressRow
                key={level}
                level={level}
                accuracy={accuracy}
                questionsAttempted={stats.total}
              />
            )
          })}
        </div>

        {/* Practice These Next — answers "what should I do?" */}
        {weakTopics.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold text-on mb-3">Practice These Next</h2>
            <div className="space-y-2">
              {weakTopics.slice(0, 3).map((topic, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/?level=${topic.level || currentLevel}`)}
                  className="w-full text-left bg-warn-dim border border-warn/20 rounded-xl px-4 py-3 hover:opacity-90 transition-opacity active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-warn">{topic.subtopic || topic.topic}</p>
                      <p className="text-2xs text-on-dim mt-0.5">{topic.accuracy}% accuracy · {topic.total} attempted</p>
                    </div>
                    <Icon name="arrow_forward" size={16} className="text-warn/60" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
