import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import userTrackingService from '../services/userTrackingService'
import { UPSC_LEVELS } from '../data/upscLevels'
import Badge from '../components/ui/Badge'
import Icon from '../components/ui/Icon'

// ── Empty State ────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="text-center py-12">
      <Icon name="trending_up" size={40} className="text-on-dim mx-auto mb-3" />
      <p className="text-sm font-semibold text-on mb-1">No Progress Yet</p>
      <p className="text-xs text-on-dim mb-4 leading-relaxed max-w-[250px] mx-auto">
        Start your first practice session to generate your progress report.
      </p>
    </div>
  )
}

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

function LevelProgressRow({ level, completed, accuracy, questionsAttempted }) {
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
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${Math.min(accuracy, 100)}%` }}
        />
      </div>
      {completed && (
        <p className="text-2xs text-success font-semibold mt-1 flex items-center gap-1">
          <Icon name="check_circle" size={12} fill className="text-success" />
          Completed
        </p>
      )}
    </div>
  )
}

// ── Topic Accuracy Row ─────────────────────────────────────────────────────

function TopicRow({ topic, stats, onPractice }) {
  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
  const barColor = accuracy < 50 ? 'bg-error' : accuracy < 70 ? 'bg-warn' : 'bg-success'
  const accColor = accuracy < 50 ? 'text-error' : accuracy < 70 ? 'text-warn' : 'text-success'

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-on truncate pr-2">{topic}</span>
        <span className={`text-xs font-bold ${accColor}`}>{accuracy}%</span>
      </div>
      <div className="h-1.5 bg-surface-low rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(accuracy, 100)}%` }} />
      </div>
      <div className="flex justify-between items-center mt-0.5">
        <p className="text-2xs text-on-dim">{stats.total} attempted · {stats.correct} correct</p>
        {accuracy < 70 && (
          <button
            onClick={onPractice}
            className="text-2xs font-semibold px-2 py-0.5 rounded-sm border border-outline-variant bg-surface-low text-on-variant hover:opacity-80 active:scale-[0.97] transition-all"
          >
            Practice
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main Progress Report Screen ────────────────────────────────────────────

export default function ProgressReport() {
  const navigate = useNavigate()
  const userId = userTrackingService.getLoggedInUserId()

  // Get all user data
  const attempts = useMemo(() => userId ? userTrackingService.getAttempts(userId) : [], [userId])
  const progress = useMemo(() => userId ? userTrackingService.getCurrentUserProgress(userId) : null, [userId])
  const weakTopics = useMemo(() => userId ? userTrackingService.getWeakTopics(userId, 5) : [], [userId])
  const mistakes = useMemo(() => userId ? userTrackingService.getMistakes(userId) : [], [userId])
  const learnedVocab = useMemo(() => userId ? userTrackingService.getUserLearnedVocabulary(userId).length : 0, [userId])
  const testAttempts = useMemo(() => userId ? userTrackingService.getTestAttempts(userId) : [], [userId])

  // Calculate stats
  const overallAccuracy = useMemo(() => {
    if (attempts.length === 0) return 0
    const correct = attempts.filter(a => a.is_correct).length
    return Math.round((correct / attempts.length) * 100)
  }, [attempts])

  const totalTime = useMemo(() => {
    return attempts.reduce((sum, a) => sum + (a.time_taken_seconds || 0), 0)
  }, [attempts])

  const avgTimePerQuestion = useMemo(() => {
    if (attempts.length === 0) return 0
    return Math.round(totalTime / attempts.length)
  }, [attempts])

  const pendingMistakesCount = mistakes.filter(m => m.status === 'pending').length
  const masteredMistakesCount = mistakes.filter(m => m.status === 'mastered').length

  const currentLevel = progress?.currentLevel || 1
  const unlockedLevels = progress?.unlockedLevels || [1]

  // Calculate topic-wise accuracy
  const topicStats = useMemo(() => {
    const stats = {}
    attempts.forEach(a => {
      if (!stats[a.topic]) {
        stats[a.topic] = { correct: 0, total: 0 }
      }
      stats[a.topic].total += 1
      if (a.is_correct) stats[a.topic].correct += 1
    })
    return stats
  }, [attempts])

  // Calculate level-wise stats
  const levelStats = useMemo(() => {
    const stats = {}
    attempts.forEach(a => {
      const level = a.level || 1
      if (!stats[level]) {
        stats[level] = { correct: 0, total: 0 }
      }
      stats[level].total += 1
      if (a.is_correct) stats[level].correct += 1
    })
    return stats
  }, [attempts])

  // Empty state
  if (attempts.length === 0 && !userId) {
    return (
      <main className="flex-1 safe-pb overflow-y-auto">
        <div className="max-w-lg mx-auto px-4">
          <div className="pt-5 pb-4">
            <h1 className="font-display font-bold text-2xl text-on">Progress Report</h1>
            <p className="text-sm text-on-variant mt-0.5">Your learning journey</p>
          </div>
          <EmptyState />
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 safe-pb overflow-y-auto">
      <div className="max-w-lg mx-auto px-4">

        {/* Header */}
        <div className="pt-5 pb-4">
          <h1 className="font-display font-bold text-2xl text-on">Progress Report</h1>
          <p className="text-sm text-on-variant mt-0.5">Your learning journey</p>
        </div>

        {/* Empty state if no data */}
        {attempts.length === 0 ? (
          <EmptyState />
        ) : (
          <>

            {/* Overall Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <StatCell
                icon="trending_up"
                label="Overall Accuracy"
                value={`${overallAccuracy}%`}
                sub={`${attempts.filter(a => a.is_correct).length}/${attempts.length} correct`}
                valueColor={overallAccuracy >= 70 ? 'text-success' : overallAccuracy >= 50 ? 'text-warn' : 'text-error'}
              />
              <StatCell
                icon="flag"
                label="Current Level"
                value={`Level ${currentLevel}`}
                sub={UPSC_LEVELS.find(l => l.levelNumber === currentLevel)?.title.substring(0, 20)}
              />
              <StatCell
                icon="check_circle"
                label="Completed Levels"
                value={unlockedLevels.length - 1}
                sub={unlockedLevels.length === 1 ? 'In progress' : 'Keep going!'}
                valueColor="text-success"
              />
              <StatCell
                icon="schedule"
                label="Avg Time Per Q"
                value={`${avgTimePerQuestion}s`}
                sub={`${Math.round(totalTime / 60)}m total`}
              />
              <StatCell
                icon="menu_book"
                label="Total Questions"
                value={attempts.length}
                sub={`${attempts.filter(a => a.is_correct).length} correct`}
                valueColor="text-primary"
              />
              <StatCell
                icon="assignment"
                label="Tests Taken"
                value={testAttempts.length}
                sub={testAttempts.length > 0 ? `Avg: ${Math.round(testAttempts.reduce((s, t) => s + t.accuracy, 0) / testAttempts.length)}%` : 'Start a test'}
              />
              <StatCell
                icon="error"
                label="Pending Mistakes"
                value={pendingMistakesCount}
                sub="Review to improve"
                valueColor={pendingMistakesCount > 0 ? 'text-error' : 'text-success'}
              />
              <StatCell
                icon="star"
                label="Mastered Skills"
                value={masteredMistakesCount}
                sub="Well done!"
                valueColor="text-success"
              />
              <StatCell
                icon="vocabulary"
                label="Vocabulary Learned"
                value={learnedVocab}
                sub="Keep expanding"
                valueColor="text-accent"
              />
            </div>

            {/* Level-Wise Progress */}
            <div className="mb-6">
              <h2 className="text-sm font-bold text-on mb-3">Level-Wise Progress</h2>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => {
                const stats = levelStats[level]
                if (!stats) return null
                const accuracy = Math.round((stats.correct / stats.total) * 100)
                const isCompleted = unlockedLevels.includes(level + 1)
                return (
                  <LevelProgressRow
                    key={level}
                    level={level}
                    completed={isCompleted}
                    accuracy={accuracy}
                    questionsAttempted={stats.total}
                  />
                )
              })}
            </div>

            {/* Topic-Wise Accuracy */}
            <div className="mb-6">
              <h2 className="text-sm font-bold text-on mb-3">Topic-Wise Accuracy</h2>
              {Object.entries(topicStats).length === 0 ? (
                <p className="text-sm text-on-variant">No topic data yet</p>
              ) : (
                Object.entries(topicStats)
                  .sort((a, b) => {
                    const accA = (a[1].correct / a[1].total) * 100
                    const accB = (b[1].correct / b[1].total) * 100
                    return accB - accA
                  })
                  .map(([topic, stats]) => (
                    <TopicRow
                      key={topic}
                      topic={topic}
                      stats={stats}
                      onPractice={() => navigate(`/practice?mode=quick&topic=${encodeURIComponent(topic)}`)}
                    />
                  ))
              )}
            </div>

            {/* Weak Topics Alert */}
            {weakTopics.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-bold text-on mb-3">Areas to Improve</h2>
                <div className="space-y-2">
                  {weakTopics.slice(0, 3).map((topic, i) => (
                    <button
                      key={i}
                      onClick={() => navigate(`/practice?mode=quick&topic=${encodeURIComponent(topic.subtopic)}`)}
                      className="w-full text-left bg-warn-dim border border-warn/20 rounded-xl px-4 py-3 hover:opacity-90 transition-opacity active:scale-[0.99]"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-warn">{topic.subtopic}</p>
                          <p className="text-2xs text-on-dim mt-0.5">{topic.accuracy}% accuracy · {topic.total} attempted</p>
                        </div>
                        <Icon name="arrow_forward" size={16} className="text-warn/60" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Strong Topics */}
            {Object.entries(topicStats).length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-bold text-on mb-3">Strong Areas</h2>
                <div className="space-y-2">
                  {Object.entries(topicStats)
                    .map(([topic, stats]) => ({
                      topic,
                      accuracy: Math.round((stats.correct / stats.total) * 100)
                    }))
                    .filter(t => t.accuracy >= 75)
                    .sort((a, b) => b.accuracy - a.accuracy)
                    .slice(0, 3)
                    .map((topic, i) => (
                      <div key={i} className="bg-success-dim border border-success/20 rounded-xl px-4 py-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-success flex items-center gap-2">
                              <Icon name="check_circle" size={14} fill className="text-success" />
                              {topic.topic}
                            </p>
                            <p className="text-2xs text-on-dim mt-0.5">{topic.accuracy}% accuracy</p>
                          </div>
                          <Icon name="star" size={18} fill className="text-success/40" />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

          </>
        )}

      </div>
    </main>
  )
}
