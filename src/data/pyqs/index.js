// ─────────────────────────────────────────────────────────────────────────────
// PYQ Data — Central Aggregator & Query API
//
// This module collects all year files into a single queryable bank and exposes
// helpers for filtering by year, section, topic, difficulty, source status, etc.
//
// TO ADD A NEW YEAR:
//   1. Create src/data/pyqs/years/<year>.js (copy an existing one as a template)
//   2. Import it below and add it to YEAR_MODULES
//   That's it — it will automatically appear everywhere in the app.
// ─────────────────────────────────────────────────────────────────────────────

import { OBJECTIVE_TYPES, SUBJECTIVE_TYPES, SECTIONS, SOURCE_STATUS } from './schema.js'

import questions2024 from './years/2024.js'
import questions2023 from './years/2023.js'
import questions2022 from './years/2022.js'
import questions2021 from './years/2021.js'
import questions2020 from './years/2020.js'
import questions2019 from './years/2019.js'

// Register every year module here. Order does not matter (sorted on read).
const YEAR_MODULES = [
  questions2024,
  questions2023,
  questions2022,
  questions2021,
  questions2020,
  questions2019,
]

/** Flat array of all PYQ questions across every year. */
export const allPYQs = YEAR_MODULES.flat()

/** Sorted list of years that actually have questions. */
export const availableYears = [...new Set(allPYQs.map(q => q.year))].sort((a, b) => b - a)

/** Sorted list of sections that actually have questions. */
export const availableSections = [...new Set(allPYQs.map(q => q.section))]

/** Sorted unique topic tags across the whole bank. */
export const availableTopicTags = [...new Set(allPYQs.flatMap(q => q.topicTags))].sort()

// ── Section metadata (labels, icons, order) ─────────────────────────────────

export const SECTION_META = {
  [SECTIONS.GRAMMAR]: { label: 'Grammar', icon: 'rule', order: 1 },
  [SECTIONS.COMPREHENSION]: { label: 'Comprehension', icon: 'menu_book', order: 2 },
  [SECTIONS.PRECIS]: { label: 'Précis', icon: 'compress', order: 3 },
  [SECTIONS.ESSAY]: { label: 'Essay', icon: 'edit_note', order: 4 },
  [SECTIONS.TRANSLATION]: { label: 'Translation', icon: 'translate', order: 5 },
  [SECTIONS.VOCABULARY]: { label: 'Vocabulary', icon: 'spellcheck', order: 6 },
}

/** Ordered section list for filter UIs (only sections that have questions). */
export const sectionFilters = Object.entries(SECTION_META)
  .filter(([id]) => availableSections.includes(id))
  .sort((a, b) => a[1].order - b[1].order)
  .map(([id, meta]) => ({ id, ...meta }))

// ── Type helpers ────────────────────────────────────────────────────────────

export function isObjective(q) {
  return OBJECTIVE_TYPES.has(q.questionType)
}

export function isSubjective(q) {
  return SUBJECTIVE_TYPES.has(q.questionType)
}

export function isRealPYQ(q) {
  return q.sourceStatus === SOURCE_STATUS.REAL_PYQ
}

// ── Query API ───────────────────────────────────────────────────────────────

/**
 * Filter the PYQ bank by any combination of criteria.
 *
 * @param {Object} filters
 * @param {'all'|'real-pyq'|'sample-practice'} [filters.sourceStatus]
 * @param {number|'all'} [filters.year]
 * @param {string|'all'} [filters.section]
 * @param {string|'all'} [filters.topic]            — matches against topicTags
 * @param {'all'|'easy'|'medium'|'hard'} [filters.difficulty]
 * @param {'all'|'objective'|'subjective'} [filters.format]
 * @param {'all'|'attempted'|'unattempted'|'wrong'|'bookmarked'} [filters.progress]
 * @param {Object} [progressData]                   — { attempted, bookmarks } from useProgress
 * @returns {import('./schema.js').PYQQuestion[]}
 */
export function queryPYQs(filters = {}, progressData = {}) {
  const {
    sourceStatus = 'all',
    year = 'all',
    section = 'all',
    topic = 'all',
    difficulty = 'all',
    format = 'all',
    progress = 'all',
  } = filters

  const { attempted = {}, bookmarks = [] } = progressData

  return allPYQs.filter(q => {
    if (sourceStatus !== 'all' && q.sourceStatus !== sourceStatus) return false
    if (year !== 'all' && q.year !== Number(year)) return false
    if (section !== 'all' && q.section !== section) return false
    if (topic !== 'all' && !q.topicTags.includes(topic)) return false
    if (difficulty !== 'all' && q.difficulty !== difficulty) return false

    if (format === 'objective' && !isObjective(q)) return false
    if (format === 'subjective' && !isSubjective(q)) return false

    if (progress !== 'all') {
      const a = attempted[q.id]
      if (progress === 'attempted' && !a) return false
      if (progress === 'unattempted' && a) return false
      if (progress === 'wrong' && (!a || a.isCorrect !== false)) return false
      if (progress === 'bookmarked' && !bookmarks.includes(q.id)) return false
    }

    return true
  })
}

/**
 * Aggregate counts for the bank (optionally filtered set).
 * @param {import('./schema.js').PYQQuestion[]} [questions=allPYQs]
 * @param {Object} [progressData]
 */
export function getPYQStats(questions = allPYQs, progressData = {}) {
  const { attempted = {} } = progressData
  const objective = questions.filter(isObjective)
  const attemptedObjective = objective.filter(q => attempted[q.id])
  const correct = attemptedObjective.filter(q => attempted[q.id]?.isCorrect).length

  return {
    total: questions.length,
    realCount: questions.filter(isRealPYQ).length,
    sampleCount: questions.filter(q => !isRealPYQ(q)).length,
    objectiveCount: objective.length,
    subjectiveCount: questions.filter(isSubjective).length,
    attempted: questions.filter(q => attempted[q.id]).length,
    correct,
    accuracy: attemptedObjective.length > 0
      ? Math.round((correct / attemptedObjective.length) * 100)
      : null,
  }
}

/** Look up a single question by id. */
const byId = Object.fromEntries(allPYQs.map(q => [q.id, q]))
export function getPYQById(id) {
  return byId[id] ?? null
}

export default allPYQs
