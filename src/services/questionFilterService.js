// ─────────────────────────────────────────────────────────────────────────────
// Question Filter Service
//
// Framework-agnostic service that provides normalized, filtered access to the
// full app-served question bank. All consumers get non-mutated question copies.
//
// Caches the normalized pool once per app session (module singleton).
// Safe to import from any screen, hook, or service — no React dependency.
// ─────────────────────────────────────────────────────────────────────────────

import { getAllQuestions } from '../data/questions/getQuestions'
import { normalizeQuestions } from '../data/questions/metadataNormalizer'
import { UPSC_LEVELS } from '../data/upscLevels'

// ── Module-level cache — normalized once, reused on every call ────────────────
let _normalizedCache = null

// ─────────────────────────────────────────────────────────────────────────────
// 1. getAllNormalizedQuestions
// Returns every app-served question after normalization.
// Fields guaranteed on every returned question:
//   level, topic, subtopic, question_type, mistake_type
// ─────────────────────────────────────────────────────────────────────────────

export function getAllNormalizedQuestions() {
  if (!_normalizedCache) {
    _normalizedCache = normalizeQuestions(getAllQuestions())
  }
  return _normalizedCache
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. getQuestionStats
// Returns aggregated counts across the full normalized bank.
// ─────────────────────────────────────────────────────────────────────────────

export function getQuestionStats() {
  const all = getAllNormalizedQuestions()

  const byLevel = {}
  const byTopic = {}
  const bySubtopic = {}
  const levelTopicSubtopic = {}

  for (const q of all) {
    const lv = q.level
    const tp = q.topic
    const st = q.subtopic

    byLevel[lv] = (byLevel[lv] || 0) + 1
    byTopic[tp] = (byTopic[tp] || 0) + 1
    bySubtopic[st] = (bySubtopic[st] || 0) + 1

    if (!levelTopicSubtopic[lv]) levelTopicSubtopic[lv] = {}
    if (!levelTopicSubtopic[lv][tp]) levelTopicSubtopic[lv][tp] = {}
    levelTopicSubtopic[lv][tp][st] = (levelTopicSubtopic[lv][tp][st] || 0) + 1
  }

  return {
    total: all.length,
    byLevel,
    byTopic,
    bySubtopic,
    levelTopicSubtopic,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. getAvailableLevels
// Returns levels 1–10 enriched with live question counts and available topics.
// ─────────────────────────────────────────────────────────────────────────────

export function getAvailableLevels() {
  const stats = getQuestionStats()
  return UPSC_LEVELS.map(level => ({
    level: level.levelNumber,
    title: level.title,
    shortDescription: level.shortDescription,
    difficulty: level.difficulty,
    questionCount: stats.byLevel[level.levelNumber] || 0,
    topics: Object.keys(stats.levelTopicSubtopic[level.levelNumber] || {}),
  }))
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. getTopicsForLevel
// Returns unique sorted topics available for the given level.
// ─────────────────────────────────────────────────────────────────────────────

export function getTopicsForLevel(level) {
  const all = getAllNormalizedQuestions()
  const topics = new Set(
    all.filter(q => q.level === Number(level)).map(q => q.topic)
  )
  return [...topics].filter(Boolean).sort()
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. getSubtopicsForLevelAndTopic
// Returns unique sorted subtopics for the given level (and optional topic).
// Pass topic = null to get all subtopics across all topics in that level.
// ─────────────────────────────────────────────────────────────────────────────

export function getSubtopicsForLevelAndTopic(level, topic = null) {
  const all = getAllNormalizedQuestions()
  const filtered = all.filter(q => {
    if (q.level !== Number(level)) return false
    if (topic != null && q.topic !== topic) return false
    return true
  })
  const subtopics = new Set(filtered.map(q => q.subtopic))
  return [...subtopics].filter(Boolean).sort()
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. filterQuestions
// Returns a filtered slice of the normalized bank. All args are optional.
// Omit a filter to leave that dimension unrestricted.
// Guarantees: no mutated objects, no broken questions (must have id + text).
// ─────────────────────────────────────────────────────────────────────────────

export function filterQuestions(filters = {}) {
  const { level, topic, subtopic, question_type, difficulty } = filters
  let pool = getAllNormalizedQuestions()

  if (level != null)         pool = pool.filter(q => q.level === Number(level))
  if (topic != null)         pool = pool.filter(q => q.topic === topic)
  if (subtopic != null)      pool = pool.filter(q => q.subtopic === subtopic)
  if (question_type != null) pool = pool.filter(q => (q.question_type || q.type) === question_type)
  if (difficulty != null)    pool = pool.filter(q => q.difficulty === difficulty)

  // Drop any question missing id or displayable text
  return pool.filter(q => q.id && (q.question || q.question_text || q.questionText))
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. getPracticeQuestions
// Returns a shuffled, limited set of filtered questions ready for a drill.
// Matches the ordering used by Practice.jsx: unattempted → wrong → correct,
// unless `attempted` is not passed (returns pure shuffle for UI-layer use).
// ─────────────────────────────────────────────────────────────────────────────

export function getPracticeQuestions(filters = {}, limit = 10, attempted = {}) {
  const pool = filterQuestions(filters)

  if (Object.keys(attempted).length > 0) {
    const unattempted = pool.filter(q => !attempted[q.id])
    const wrong  = pool.filter(q => attempted[q.id] && attempted[q.id].isCorrect === false)
    const correct = pool.filter(q => attempted[q.id] && attempted[q.id].isCorrect === true)
    return [
      ...shuffle(unattempted),
      ...shuffle(wrong),
      ...shuffle(correct),
    ].slice(0, limit)
  }

  return shuffle(pool).slice(0, Math.min(limit, pool.length))
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─────────────────────────────────────────────────────────────────────────────
// Default export — named exports preferred for tree-shaking
// ─────────────────────────────────────────────────────────────────────────────

export default {
  getAllNormalizedQuestions,
  getQuestionStats,
  getAvailableLevels,
  getTopicsForLevel,
  getSubtopicsForLevelAndTopic,
  filterQuestions,
  getPracticeQuestions,
}
