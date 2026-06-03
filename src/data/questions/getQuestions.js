// ─────────────────────────────────────────────────────────────────────────────
// Master Question Loader — getQuestions API
//
// Unified interface for all screens to access grammar questions.
// Combines:
//   - Legacy grammarQuestions.js (78 existing questions)
//   - New batches from src/data/questions/batches/ (up to 1000 questions)
//
// Usage:
//   import { getAllQuestions, getQuestionsByCategory, getRandomDrill } from './questions/getQuestions.js'
//   const questions = getAllQuestions()
//   const errors = getQuestionsByCategory('Error Spotting')
//   const drill = getRandomDrill({ category: 'Tenses', count: 20, difficulty: 'C1' })
// ─────────────────────────────────────────────────────────────────────────────

import { grammarQuestions } from '../grammarQuestions.js'
import { questionsFromBatches } from './batches/index.js'

// ── Master combined question store ─────────────────────────────────────────────

const MASTER_QUESTIONS = [
  ...grammarQuestions,
  ...questionsFromBatches,
]

// Map questions by ID for fast lookups
const QUESTION_MAP = Object.fromEntries(
  MASTER_QUESTIONS.map(q => [q.id || q.topic, q])
)

// ─────────────────────────────────────────────────────────────────────────────
// 1. getAllQuestions — Get all questions in the bank
// ─────────────────────────────────────────────────────────────────────────────

export function getAllQuestions() {
  return MASTER_QUESTIONS
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. getQuestionsByCategory — Filter by category
// ─────────────────────────────────────────────────────────────────────────────

export function getQuestionsByCategory(category) {
  return MASTER_QUESTIONS.filter(q => q.category === category)
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. getQuestionsByDifficulty — Filter by CEFR difficulty (B1/B2/C1/C2)
// ─────────────────────────────────────────────────────────────────────────────

export function getQuestionsByDifficulty(difficulty) {
  return MASTER_QUESTIONS.filter(q => q.difficulty === difficulty)
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. getQuestionsByTopic — Filter by topic (legacy field for backward compat)
// ─────────────────────────────────────────────────────────────────────────────

export function getQuestionsByTopic(topic) {
  return MASTER_QUESTIONS.filter(q => q.topic === topic)
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. getRandomDrill — Get random questions matching filters
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @param {Object} options
 * @param {string} [options.category] — filter by category
 * @param {string} [options.difficulty] — filter by CEFR (B1/B2/C1/C2)
 * @param {string} [options.topic] — filter by topic (legacy)
 * @param {number} options.count — how many questions to return
 * @returns {Array} shuffled questions matching filters
 */
export function getRandomDrill(options = {}) {
  const { category, difficulty, topic, count = 10 } = options

  let pool = MASTER_QUESTIONS

  if (category) pool = pool.filter(q => q.category === category)
  if (difficulty) pool = pool.filter(q => q.difficulty === difficulty)
  if (topic) pool = pool.filter(q => q.topic === topic)

  // Shuffle using Fisher-Yates
  const shuffled = [...pool]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, Math.min(count, shuffled.length))
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. getWeaknessDrill — Auto-generate drill from weak topics
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @param {Object} options
 * @param {string[]} options.weakTopics — topics to prioritise (e.g. ['Tenses', 'Modifiers'])
 * @param {number} options.count — questions to return
 * @returns {Array} questions biased toward weak topics
 */
export function getWeaknessDrill(options = {}) {
  const { weakTopics = [], count = 20 } = options

  if (weakTopics.length === 0) {
    return getRandomDrill({ count })
  }

  // Bias: 60% from weak topics, 40% from others
  const weakQCount = Math.ceil(count * 0.6)
  const otherQCount = count - weakQCount

  const weakPool = MASTER_QUESTIONS.filter(q => weakTopics.includes(q.topic))
  const otherPool = MASTER_QUESTIONS.filter(q => !weakTopics.includes(q.topic))

  const weakDrill = getRandomDrill({ count: weakQCount })
  const otherDrill = otherPool.length > 0
    ? getRandomDrill({ count: otherQCount })
    : []

  return [...weakDrill, ...otherDrill].slice(0, count)
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. getRevisionDrill — Get specific questions for revision
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @param {Object} options
 * @param {string[]} options.questionIds — specific IDs to retrieve
 * @param {number} [options.count] — limit result count
 * @returns {Array} requested questions (or subset if count < IDs)
 */
export function getRevisionDrill(options = {}) {
  const { questionIds = [], count } = options

  const questions = questionIds
    .map(id => QUESTION_MAP[id])
    .filter(q => q !== undefined)

  if (count && count > 0) {
    return questions.slice(0, count)
  }

  return questions
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. Stats — Bank overview
// ─────────────────────────────────────────────────────────────────────────────

export function getBankStats() {
  const stats = {
    totalQuestions: MASTER_QUESTIONS.length,
    byCategory: {},
    byDifficulty: { B1: 0, B2: 0, C1: 0, C2: 0 },
    byType: {},
  }

  for (const q of MASTER_QUESTIONS) {
    // Category counts
    stats.byCategory[q.category] = (stats.byCategory[q.category] || 0) + 1

    // Difficulty counts
    const diff = q.difficulty || 'unknown'
    if (stats.byDifficulty[diff] !== undefined) {
      stats.byDifficulty[diff]++
    }

    // Type counts
    stats.byType[q.type] = (stats.byType[q.type] || 0) + 1
  }

  return stats
}

// ─────────────────────────────────────────────────────────────────────────────
// Default exports for common imports
// ─────────────────────────────────────────────────────────────────────────────

export default {
  getAllQuestions,
  getQuestionsByCategory,
  getQuestionsByDifficulty,
  getQuestionsByTopic,
  getRandomDrill,
  getWeaknessDrill,
  getRevisionDrill,
  getBankStats,
}
