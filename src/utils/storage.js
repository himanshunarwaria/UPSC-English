const STORAGE_KEY = 'pep_v1'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage full or unavailable
  }
}

export function getInitialState() {
  return load() || {
    attempted: {},      // { [questionId]: { selectedAnswer, isCorrect, topic, timestamp } }
    bookmarks: [],      // [questionId, ...]
    revisionQueue: [],  // [questionId, ...]
    streak: { lastDate: null, count: 0 },
    sessions: [],       // [{ date, count, correct, topics }]
  }
}

export function saveState(state) {
  save(state)
}

export function getTopicStats(attempted) {
  const stats = {}
  Object.values(attempted).forEach(({ topic, isCorrect }) => {
    // Skip subjective/ungraded attempts (isCorrect === null) — accuracy is MCQ-only
    if (isCorrect === null || isCorrect === undefined) return
    if (!stats[topic]) stats[topic] = { correct: 0, total: 0 }
    stats[topic].total += 1
    if (isCorrect) stats[topic].correct += 1
  })
  return stats
}

export function computeReadiness(attempted, revisionQueue) {
  // Only graded (objective) attempts contribute to readiness accuracy
  const graded = Object.values(attempted).filter(v => v.isCorrect === true || v.isCorrect === false)
  if (graded.length === 0) return 0
  const accuracy = graded.filter(v => v.isCorrect).length / graded.length
  const revisionPenalty = Math.min(revisionQueue.length * 2, 20)
  return Math.round(accuracy * 100 - revisionPenalty)
}

export function updateStreak(streak) {
  const today = new Date().toISOString().split('T')[0]
  if (streak.lastDate === today) return streak
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  return {
    lastDate: today,
    count: streak.lastDate === yesterday ? streak.count + 1 : 1,
  }
}

export function getTodayAttempted(attempted) {
  const today = new Date().toISOString().split('T')[0]
  return Object.values(attempted).filter(a => a.timestamp?.startsWith(today)).length
}

export function getTodayCorrect(attempted) {
  const today = new Date().toISOString().split('T')[0]
  const todayAttempts = Object.values(attempted).filter(a => a.timestamp?.startsWith(today))
  return todayAttempts.filter(a => a.isCorrect).length
}
