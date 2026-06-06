/**
 * User Tracking Service
 * Manages user progress, question attempts, mistakes, and analytics
 * Uses localStorage for persistence (no backend)
 *
 * Storage structure:
 *   users_v1: { [userId]: { email, name, createdAt, lastActive } }
 *   user_${userId}_progress: { levels: {}, currentLevel, unlockedLevels }
 *   user_${userId}_attempts: [{ id, questionId, levelId, topicId, subtopicId, attempt_data }]
 *   user_${userId}_mistakes: [{ id, questionId, mistakeType, status, created_at, revised_at }]
 *   user_${userId}_tests: [{ id, levelId, startedAt, completedAt, score, accuracy }]
 */

const USERS_KEY = 'users_v1'

// ─────────────────────────────────────────────────────────────────────────────
// Storage Helpers
// ─────────────────────────────────────────────────────────────────────────────

function load(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    console.warn(`Failed to load ${key}:`, e)
    return null
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn(`Failed to save ${key}:`, e)
  }
}

function generateId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

// ─────────────────────────────────────────────────────────────────────────────
// User Management
// ─────────────────────────────────────────────────────────────────────────────

export function getLoggedInUserId() {
  try {
    const userId = localStorage.getItem('current_user_id')
    return userId || null
  } catch {
    return null
  }
}

export function setLoggedInUserId(userId) {
  try {
    if (userId) {
      localStorage.setItem('current_user_id', userId)
    } else {
      localStorage.removeItem('current_user_id')
    }
  } catch (e) {
    console.warn('Failed to set logged in user:', e)
  }
}

export function registerUser(userId, userData = {}) {
  const users = load(USERS_KEY) || {}
  if (!users[userId]) {
    users[userId] = {
      user_id: userId,
      email: userData.email || '',
      name: userData.name || 'User',
      created_at: new Date().toISOString(),
      last_active: new Date().toISOString(),
    }
    save(USERS_KEY, users)
  }
  return users[userId]
}

export function updateUserLastActive(userId) {
  const users = load(USERS_KEY) || {}
  if (users[userId]) {
    users[userId].last_active = new Date().toISOString()
    save(USERS_KEY, users)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// User Progress Initialization & Retrieval
// ─────────────────────────────────────────────────────────────────────────────

export function initializeUserProgress(userId) {
  const key = `user_${userId}_progress`
  let progress = load(key)

  if (!progress) {
    progress = {
      user_id: userId,
      currentLevel: 1,
      unlockedLevels: [1],
      levels: {
        1: { completed: false, accuracy: 0, questionsAttempted: 0, questionsCorrect: 0 },
        2: { completed: false, accuracy: 0, questionsAttempted: 0, questionsCorrect: 0 },
        3: { completed: false, accuracy: 0, questionsAttempted: 0, questionsCorrect: 0 },
        4: { completed: false, accuracy: 0, questionsAttempted: 0, questionsCorrect: 0 },
        5: { completed: false, accuracy: 0, questionsAttempted: 0, questionsCorrect: 0 },
        6: { completed: false, accuracy: 0, questionsAttempted: 0, questionsCorrect: 0 },
        7: { completed: false, accuracy: 0, questionsAttempted: 0, questionsCorrect: 0 },
        8: { completed: false, accuracy: 0, questionsAttempted: 0, questionsCorrect: 0 },
        9: { completed: false, accuracy: 0, questionsAttempted: 0, questionsCorrect: 0 },
        10: { completed: false, accuracy: 0, questionsAttempted: 0, questionsCorrect: 0 },
      },
      created_at: new Date().toISOString(),
    }
    save(key, progress)
  }

  return progress
}

export function getCurrentUserProgress(userId) {
  const key = `user_${userId}_progress`
  const progress = load(key)
  if (!progress) {
    return initializeUserProgress(userId)
  }
  return progress
}

// ─────────────────────────────────────────────────────────────────────────────
// Question Attempts
// ─────────────────────────────────────────────────────────────────────────────

export function saveQuestionAttempt(data) {
  const { user_id, question_id, level, topic, subtopic, selected_answer, correct_answer, is_correct, time_taken_seconds, mistake_type } = data

  if (!user_id || !question_id) {
    console.error('Missing required fields: user_id, question_id')
    return null
  }

  const key = `user_${user_id}_attempts`
  const attempts = load(key) || []

  const attempt = {
    id: generateId(),
    user_id,
    question_id,
    level: level || 1,
    topic: topic || 'Unknown',
    subtopic: subtopic || 'Unknown',
    selected_answer,
    correct_answer,
    is_correct: is_correct === true,
    time_taken_seconds: time_taken_seconds || 0,
    mistake_type: mistake_type || null,
    created_at: new Date().toISOString(),
  }

  attempts.push(attempt)
  save(key, attempts)

  // Update level progress
  updateLevelProgress(user_id, level, is_correct)

  // Track mistake if incorrect
  if (!is_correct && mistake_type) {
    saveMistake({
      user_id,
      question_id,
      topic,
      subtopic,
      level,
      mistake_type,
      explanation: `Answered ${selected_answer}, correct is ${correct_answer}`,
    })
  }

  return attempt
}

export function getAttempts(userId) {
  const key = `user_${userId}_attempts`
  return load(key) || []
}

export function getAttemptsByLevel(userId, level) {
  const attempts = getAttempts(userId)
  return attempts.filter(a => a.level === level)
}

// ─────────────────────────────────────────────────────────────────────────────
// Mistake Tracking
// ─────────────────────────────────────────────────────────────────────────────

export function saveMistake(data) {
  const { user_id, question_id, topic, subtopic, level, mistake_type, explanation } = data

  if (!user_id || !question_id || !mistake_type) {
    console.error('Missing required fields: user_id, question_id, mistake_type')
    return null
  }

  const key = `user_${user_id}_mistakes`
  const mistakes = load(key) || []

  // Check if mistake already exists
  const existing = mistakes.find(m => m.question_id === question_id && m.mistake_type === mistake_type)
  if (existing) {
    return existing
  }

  const mistake = {
    id: generateId(),
    user_id,
    question_id,
    topic: topic || 'Unknown',
    subtopic: subtopic || 'Unknown',
    level: level || 1,
    mistake_type,
    explanation: explanation || '',
    status: 'pending', // pending, revised, mastered
    created_at: new Date().toISOString(),
    revised_at: null,
  }

  mistakes.push(mistake)
  save(key, mistakes)

  return mistake
}

export function getMistakes(userId, status = null) {
  const key = `user_${userId}_mistakes`
  const mistakes = load(key) || []
  return status ? mistakes.filter(m => m.status === status) : mistakes
}

export function updateMistakeStatus(userId, mistakeId, newStatus) {
  if (!['pending', 'revised', 'mastered'].includes(newStatus)) {
    console.error('Invalid status:', newStatus)
    return null
  }

  const key = `user_${userId}_mistakes`
  const mistakes = load(key) || []
  const mistake = mistakes.find(m => m.id === mistakeId)

  if (mistake) {
    mistake.status = newStatus
    if (newStatus === 'revised' || newStatus === 'mastered') {
      mistake.revised_at = new Date().toISOString()
    }
    save(key, mistakes)
  }

  return mistake
}

// ─────────────────────────────────────────────────────────────────────────────
// Test/Level Attempts
// ─────────────────────────────────────────────────────────────────────────────

export function createTestAttempt(data) {
  const { user_id, level } = data

  if (!user_id || !level) {
    console.error('Missing required fields: user_id, level')
    return null
  }

  const key = `user_${user_id}_tests`
  const tests = load(key) || []

  const test = {
    id: generateId(),
    user_id,
    level,
    started_at: new Date().toISOString(),
    completed_at: null,
    questions_attempted: 0,
    questions_correct: 0,
    score: 0,
    accuracy: 0,
  }

  tests.push(test)
  save(key, tests)

  return test
}

export function completeTestAttempt(userId, testId, testData) {
  const { score, accuracy, questions_correct, questions_attempted } = testData

  const key = `user_${userId}_tests`
  const tests = load(key) || []
  const test = tests.find(t => t.id === testId)

  if (test) {
    test.completed_at = new Date().toISOString()
    test.score = score || 0
    test.accuracy = accuracy || 0
    test.questions_correct = questions_correct || 0
    test.questions_attempted = questions_attempted || 0
    save(key, tests)
  }

  return test
}

export function getTestAttempts(userId, level = null) {
  const key = `user_${userId}_tests`
  const tests = load(key) || []
  return level ? tests.filter(t => t.level === level) : tests
}

// ─────────────────────────────────────────────────────────────────────────────
// Analytics: Weak Topics, Accuracy, Level Progress
// ─────────────────────────────────────────────────────────────────────────────

export function getWeakTopics(userId, limit = 5) {
  const attempts = getAttempts(userId)

  // Group by topic and subtopic
  const topicStats = {}
  attempts.forEach(att => {
    const key = `${att.topic}:${att.subtopic}`
    if (!topicStats[key]) {
      topicStats[key] = { topic: att.topic, subtopic: att.subtopic, correct: 0, total: 0, accuracy: 0 }
    }
    topicStats[key].total += 1
    if (att.is_correct) topicStats[key].correct += 1
  })

  // Calculate accuracy and sort by weakness (lowest accuracy)
  const stats = Object.values(topicStats).map(s => ({
    ...s,
    accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
  }))

  return stats.sort((a, b) => a.accuracy - b.accuracy).slice(0, limit)
}

export function getUserAccuracy(userId, level = null) {
  const attempts = getAttempts(userId)
  const filtered = level ? attempts.filter(a => a.level === level) : attempts

  if (filtered.length === 0) return 0

  const correct = filtered.filter(a => a.is_correct).length
  return Math.round((correct / filtered.length) * 100)
}

export function getLevelProgress(userId, level) {
  const key = `user_${userId}_progress`
  const progress = load(key)

  if (!progress || !progress.levels[level]) {
    return null
  }

  return progress.levels[level]
}

// ─────────────────────────────────────────────────────────────────────────────
// Level Unlocking
// ─────────────────────────────────────────────────────────────────────────────

export function unlockNextLevel(userId, level) {
  const key = `user_${userId}_progress`
  const progress = load(key)

  if (!progress) return null

  const nextLevel = level + 1
  if (nextLevel <= 10 && !progress.unlockedLevels.includes(nextLevel)) {
    progress.unlockedLevels.push(nextLevel)
    save(key, progress)
  }

  return progress
}

// ─────────────────────────────────────────────────────────────────────────────
// Level Test Completion with Unlock Logic
// ─────────────────────────────────────────────────────────────────────────────

export function completeLevelTest(userId, level, testData) {
  const { accuracy, questions_correct, questions_attempted } = testData

  if (!userId || !level || typeof accuracy !== 'number') {
    console.error('Missing required fields for level test completion')
    return null
  }

  const key = `user_${userId}_progress`
  const progress = load(key)

  if (!progress || !progress.levels[level]) {
    return null
  }

  // Update level progress with test result
  const levelData = progress.levels[level]
  levelData.test_completed = true
  levelData.test_passed = accuracy >= 80
  levelData.is_strong = accuracy >= 90 // Mark as strong if 90%+
  levelData.last_test_score = accuracy
  levelData.last_test_timestamp = new Date().toISOString()

  // Unlock next level if accuracy >= 80%
  if (accuracy >= 80) {
    const nextLevel = level + 1
    if (nextLevel <= 10 && !progress.unlockedLevels.includes(nextLevel)) {
      progress.unlockedLevels.push(nextLevel)
    }
  }

  save(key, progress)

  return {
    levelData,
    unlockedLevels: progress.unlockedLevels,
    nextLevelUnlocked: accuracy >= 80,
    isStrong: accuracy >= 90,
    recommendation: getTestRecommendation(accuracy),
  }
}

function getTestRecommendation(accuracy) {
  if (accuracy >= 90) {
    return 'Excellent! You have mastered this level. Ready for the next challenge.'
  }
  if (accuracy >= 80) {
    return 'Great job! You have unlocked the next level. Keep building on your progress.'
  }
  if (accuracy >= 71) {
    return 'Good effort! Take the revision test after reviewing weak areas.'
  }
  if (accuracy > 50) {
    return 'You are progressing! Practice the weak areas before retrying.'
  }
  return 'Keep practicing! Focus on the weakest topics and try again.'
}

export function getUnlockedLevels(userId) {
  const progress = getCurrentUserProgress(userId)
  return progress.unlockedLevels || [1]
}

// ─────────────────────────────────────────────────────────────────────────────
// Vocabulary Tracking
// ─────────────────────────────────────────────────────────────────────────────

export function saveVocabularyProgress(userId, vocabularyId, isLearned = false) {
  if (!userId || !vocabularyId) {
    console.error('Missing required fields: userId, vocabularyId')
    return null
  }

  const key = `user_${userId}_vocabulary`
  const vocab = load(key) || {}

  vocab[vocabularyId] = {
    vocabulary_id: vocabularyId,
    learned: isLearned,
    saved_at: new Date().toISOString(),
  }

  save(key, vocab)
  return vocab[vocabularyId]
}

export function getVocabularyProgress(userId, vocabularyId) {
  if (!userId || !vocabularyId) return null

  const key = `user_${userId}_vocabulary`
  const vocab = load(key) || {}

  return vocab[vocabularyId] || null
}

export function toggleVocabularyLearned(userId, vocabularyId) {
  if (!userId || !vocabularyId) return null

  const key = `user_${userId}_vocabulary`
  const vocab = load(key) || {}

  const current = vocab[vocabularyId]
  const newLearned = current ? !current.learned : true

  vocab[vocabularyId] = {
    vocabulary_id: vocabularyId,
    learned: newLearned,
    saved_at: new Date().toISOString(),
  }

  save(key, vocab)
  return vocab[vocabularyId]
}

export function getUserLearnedVocabulary(userId) {
  if (!userId) return []

  const key = `user_${userId}_vocabulary`
  const vocab = load(key) || {}

  return Object.values(vocab).filter(v => v.learned)
}

export function getUserVocabularyStats(userId) {
  if (!userId) {
    return { total: 0, learned: 0, percentage: 0 }
  }

  const key = `user_${userId}_vocabulary`
  const vocab = load(key) || {}

  const learned = Object.values(vocab).filter(v => v.learned).length
  const total = Object.keys(vocab).length

  return {
    total,
    learned,
    percentage: total > 0 ? Math.round((learned / total) * 100) : 0,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Smart Recommendations
// ─────────────────────────────────────────────────────────────────────────────

export function getRecommendedTask(userId) {
  if (!userId) {
    // Fallback for new user
    return {
      title: 'Start Level 1 Grammar',
      description: 'Begin with basic grammar practice to build your UPSC English foundation.',
      taskType: 'practice',
      level: 1,
      topic: 'Grammar',
      subtopic: null,
      ctaLabel: 'Start Practice',
      ctaRoute: '/practice?mode=quick&level=1',
    }
  }

  // Get user data
  const mistakes = getMistakes(userId, 'pending') || []
  const weakTopics = getWeakTopics(userId, 3) || []
  const userAccuracy = getUserAccuracy(userId) || 0
  const progress = getCurrentUserProgress(userId)
  const currentLevel = progress?.currentLevel || 1
  const lastTestScore = progress?.levels[currentLevel]?.last_test_score || null

  // Rule 1: More than 5 pending mistakes
  if (mistakes.length > 5) {
    return {
      title: 'Review Mistakes',
      description: `You have ${mistakes.length} pending mistakes. Revise them to avoid repeating the same errors.`,
      taskType: 'mistakes',
      level: currentLevel,
      topic: 'Mistakes',
      subtopic: null,
      ctaLabel: 'Open Mistake Review',
      ctaRoute: '/mistakes',
    }
  }

  // Rule 2: Weak subtopic below 60% accuracy
  if (weakTopics.length > 0 && weakTopics[0].accuracy < 60) {
    const weakArea = weakTopics[0]
    return {
      title: `Practice ${weakArea.subtopic}`,
      description: `Your accuracy in ${weakArea.subtopic} is ${weakArea.accuracy}%. Practice 10 focused questions before taking the next test.`,
      taskType: 'practice',
      level: currentLevel,
      topic: weakArea.topic || 'Grammar',
      subtopic: weakArea.subtopic,
      ctaLabel: `Start ${weakArea.subtopic} Practice`,
      ctaRoute: `/practice?mode=quick&topic=${encodeURIComponent(weakArea.subtopic)}`,
    }
  }

  // Rule 3: Accuracy 60-79% — recommend revision test
  if (userAccuracy >= 60 && userAccuracy < 80) {
    const weakArea = weakTopics.length > 0 ? weakTopics[0].subtopic : 'Weak Areas'
    return {
      title: 'Take Revision Test',
      description: `Your overall accuracy is ${userAccuracy}%. Take a revision test on ${weakArea} to strengthen weak areas.`,
      taskType: 'revision',
      level: currentLevel,
      topic: 'Grammar',
      subtopic: weakArea,
      ctaLabel: 'Start Revision Test',
      ctaRoute: '/practice?mode=revision&topic=all',
    }
  }

  // Rule 4: Level test score 80%+ — recommend next level
  if (lastTestScore !== null && lastTestScore >= 80 && currentLevel < 10) {
    return {
      title: `Take Level ${currentLevel + 1} Test`,
      description: `Your Level ${currentLevel} test score is ${lastTestScore}%. You are ready for the next level.`,
      taskType: 'level-test',
      level: currentLevel + 1,
      topic: 'Grammar',
      subtopic: null,
      ctaLabel: 'Start Level Test',
      ctaRoute: '/level-test',
    }
  }

  // Rule 5: Accuracy 80%+ — recommend next level (if not just taken test)
  if (userAccuracy >= 80 && lastTestScore === null && currentLevel < 10) {
    return {
      title: `Ready for Level ${currentLevel + 1}`,
      description: `Your practice accuracy is above 80%. You are ready for the Level ${currentLevel + 1} test.`,
      taskType: 'level-test',
      level: currentLevel + 1,
      topic: 'Grammar',
      subtopic: null,
      ctaLabel: 'Start Level Test',
      ctaRoute: '/level-test',
    }
  }

  // Rule 6: Vocabulary progress check (simplified — check if learned < 5)
  const vocabStats = getUserVocabularyStats(userId)
  if (vocabStats.learned < 5) {
    return {
      title: 'Learn Vocabulary',
      description: 'Expand your vocabulary with 5 UPSC-level word replacements to improve your writing.',
      taskType: 'vocabulary',
      level: currentLevel,
      topic: 'Vocabulary',
      subtopic: null,
      ctaLabel: 'Open Vocabulary Bank',
      ctaRoute: '/vocabulary',
    }
  }

  // Default fallback: Continue with current level
  return {
    title: `Continue Level ${currentLevel}`,
    description: `Keep practicing Level ${currentLevel} to master all concepts and improve your accuracy.`,
    taskType: 'practice',
    level: currentLevel,
    topic: 'Grammar',
    subtopic: null,
    ctaLabel: 'Continue Practice',
    ctaRoute: `/practice?mode=quick&level=${currentLevel}`,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal Helpers
// ─────────────────────────────────────────────────────────────────────────────

function updateLevelProgress(userId, level, isCorrect) {
  const key = `user_${userId}_progress`
  const progress = load(key)

  if (!progress || !progress.levels[level]) {
    return
  }

  const levelData = progress.levels[level]
  levelData.questionsAttempted = (levelData.questionsAttempted || 0) + 1
  if (isCorrect) {
    levelData.questionsCorrect = (levelData.questionsCorrect || 0) + 1
  }
  levelData.accuracy = Math.round((levelData.questionsCorrect / levelData.questionsAttempted) * 100)

  save(key, progress)
}

export default {
  // User management
  getLoggedInUserId,
  setLoggedInUserId,
  registerUser,
  updateUserLastActive,

  // Progress
  initializeUserProgress,
  getCurrentUserProgress,

  // Attempts
  saveQuestionAttempt,
  getAttempts,
  getAttemptsByLevel,

  // Mistakes
  saveMistake,
  getMistakes,
  updateMistakeStatus,

  // Tests
  createTestAttempt,
  completeTestAttempt,
  getTestAttempts,

  // Analytics
  getWeakTopics,
  getUserAccuracy,
  getLevelProgress,

  // Levels
  unlockNextLevel,
  getUnlockedLevels,
  completeLevelTest,

  // Vocabulary
  saveVocabularyProgress,
  getVocabularyProgress,
  toggleVocabularyLearned,
  getUserLearnedVocabulary,
  getUserVocabularyStats,

  // Recommendations
  getRecommendedTask,
}
