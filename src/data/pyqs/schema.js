/**
 * UPSC PYQ Question Schema — v1
 *
 * All UPSC English PYQs and practice questions must conform to this schema.
 * Use validateQuestion() before adding questions to a year file.
 *
 * ─── SECTION VALUES ────────────────────────────────────────────────────────
 *   'grammar'        Objective grammar: error spotting, sentence correction,
 *                    fill-in-the-blank, voice/speech conversion, etc.
 *   'essay'          Essay writing (subjective, 600–700 words)
 *   'precis'         Précis writing: summarise a passage in 1/3 its length
 *   'comprehension'  Unseen passage with questions
 *   'translation'    Hindi → English or regional language → English
 *   'vocabulary'     Word meanings, synonyms, antonyms, usage in context
 *
 * ─── QUESTION TYPE VALUES ──────────────────────────────────────────────────
 *   OBJECTIVE (have options + correctAnswer):
 *     'mcq'                   Standard 4-option multiple choice
 *     'error-spotting'        Identify the error in underlined parts (A/B/C/D)
 *     'sentence-correction'   Choose grammatically correct sentence
 *     'fill-blank'            Choose correct word/phrase for the blank
 *     'voice-conversion'      Select the correct active/passive transformation
 *     'speech-conversion'     Select correct direct/indirect transformation
 *     'vocabulary-mcq'        Word meaning / synonym / antonym MCQ
 *     'comprehension-mcq'     MCQ based on a reading passage
 *
 *   SUBJECTIVE (no options; have passageText and/or modelAnswer):
 *     'essay-writing'         Write an essay on a given topic
 *     'precis-writing'        Summarise the given passage
 *     'comprehension-long'    Long-form answer questions on a passage
 *     'translation-passage'   Translate the given passage into English
 *     'vocabulary-usage'      Use given words in sentences
 *
 * ─── SOURCE STATUS ─────────────────────────────────────────────────────────
 *   'real-pyq'        Verified question from an official UPSC paper.
 *                     ONLY set this when you have confirmed the source.
 *   'sample-practice' Practice question modelled on UPSC style.
 *                     NOT from an actual UPSC paper.
 */

/** @enum {string} */
export const SECTIONS = /** @type {const} */ ({
  GRAMMAR: 'grammar',
  ESSAY: 'essay',
  PRECIS: 'precis',
  COMPREHENSION: 'comprehension',
  TRANSLATION: 'translation',
  VOCABULARY: 'vocabulary',
})

/** @enum {string} */
export const QUESTION_TYPES = /** @type {const} */ ({
  MCQ: 'mcq',
  ERROR_SPOTTING: 'error-spotting',
  SENTENCE_CORRECTION: 'sentence-correction',
  FILL_BLANK: 'fill-blank',
  VOICE_CONVERSION: 'voice-conversion',
  SPEECH_CONVERSION: 'speech-conversion',
  VOCABULARY_MCQ: 'vocabulary-mcq',
  COMPREHENSION_MCQ: 'comprehension-mcq',
  ESSAY_WRITING: 'essay-writing',
  PRECIS_WRITING: 'precis-writing',
  COMPREHENSION_LONG: 'comprehension-long',
  TRANSLATION_PASSAGE: 'translation-passage',
  VOCABULARY_USAGE: 'vocabulary-usage',
})

/** @enum {string} */
export const SOURCE_STATUS = /** @type {const} */ ({
  REAL_PYQ: 'real-pyq',
  SAMPLE: 'sample-practice',
})

/** @enum {string} */
export const DIFFICULTY = /** @type {const} */ ({
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
})

// Objective types have options + correctAnswer
export const OBJECTIVE_TYPES = new Set([
  'mcq', 'error-spotting', 'sentence-correction', 'fill-blank',
  'voice-conversion', 'speech-conversion', 'vocabulary-mcq', 'comprehension-mcq',
])

// Subjective types have passageText and/or modelAnswer, no correctAnswer
export const SUBJECTIVE_TYPES = new Set([
  'essay-writing', 'precis-writing', 'comprehension-long',
  'translation-passage', 'vocabulary-usage',
])

/**
 * @typedef {Object} PYQQuestion
 *
 * @property {string} id
 *   Unique question identifier.
 *   Format for new questions: "upsc-{year}-{section}-{3-digit-index}"
 *   Example: "upsc-2024-grammar-001"
 *
 * @property {number} year
 *   Calendar year the question appeared. Example: 2024
 *
 * @property {'UPSC CSE' | 'UPSC IFoS'} exam
 *   Examination name. Default is 'UPSC CSE'.
 *
 * @property {'Mains General English' | 'Mains English Essay'} paper
 *   Specific paper/subject.
 *
 * @property {'grammar'|'essay'|'precis'|'comprehension'|'translation'|'vocabulary'} section
 *   Broad section of the paper. See SECTIONS enum.
 *
 * @property {string} questionType
 *   Specific type of question. See QUESTION_TYPES enum.
 *
 * @property {string} questionText
 *   The full question text exactly as it appears (or would appear) in the paper.
 *   For error-spotting, include the sentence with (A)/(B)/(C)/(D) markers.
 *
 * @property {string | null} passageText
 *   Reading passage for comprehension, précis, translation questions.
 *   null for questions without a passage.
 *
 * @property {string[] | null} options
 *   Four answer choices for objective questions. null for subjective.
 *
 * @property {number | null} correctAnswer
 *   0-based index of the correct option. null for subjective questions.
 *
 * @property {string | null} modelAnswer
 *   Ideal/expected answer for subjective questions.
 *   For real PYQs, use the official/recommended answer if available.
 *   null if not yet available.
 *
 * @property {string} explanation
 *   Explanation of why the answer is correct (objective) or key content
 *   points (subjective). Keep concise — max 2–3 sentences.
 *
 * @property {string | null} trap
 *   Common mistake or trap to watch out for. null if not applicable.
 *
 * @property {string[]} topicTags
 *   Grammar/topic tags for filtering and analytics.
 *   Examples: ["subject-verb-agreement", "the-number-of"]
 *   Use kebab-case.
 *
 * @property {'easy' | 'medium' | 'hard'} difficulty
 *
 * @property {number} estimatedTime
 *   Estimated minutes to answer. Use 2 for MCQ, 5–10 for comprehension,
 *   20–30 for précis, 40–60 for essay, 20–30 for translation.
 *
 * @property {'real-pyq' | 'sample-practice'} sourceStatus
 *   ONLY use 'real-pyq' for verified official UPSC questions.
 *   See SOURCE_STATUS enum.
 *
 * @property {string | null} sourceNote
 *   Optional note about the source or context.
 *
 * @property {string | null} conceptTag
 *   Primary grammar concept tag (for UI display). First item of topicTags
 *   is used if this is null.
 */

const VALID_SECTIONS = new Set(Object.values(SECTIONS))
const VALID_TYPES = new Set([...Object.values(QUESTION_TYPES)])
const VALID_DIFFICULTIES = new Set(Object.values(DIFFICULTY))
const VALID_SOURCES = new Set(Object.values(SOURCE_STATUS))

/**
 * Validates a question object against the PYQQuestion schema.
 * Throws a descriptive error for any validation failure.
 * Returns true if valid.
 *
 * @param {Partial<PYQQuestion>} q
 * @param {Object} [opts]
 * @param {boolean} [opts.strict=false] — if true, also validates optional field completeness
 * @returns {true}
 * @throws {Error}
 */
export function validateQuestion(q, { strict = false } = {}) {
  const id = q.id || '(no id)'
  const errs = []

  // Required string fields
  if (!q.id || typeof q.id !== 'string') errs.push('id: required string')
  if (!q.exam) errs.push('exam: required')
  if (!q.paper) errs.push('paper: required')
  if (!q.questionText || typeof q.questionText !== 'string') errs.push('questionText: required string')
  if (!q.explanation || typeof q.explanation !== 'string') errs.push('explanation: required string')

  // Year
  if (!q.year || typeof q.year !== 'number' || q.year < 1950 || q.year > 2100) {
    errs.push(`year: must be a number (1950–2100), got: ${q.year}`)
  }

  // Section
  if (!VALID_SECTIONS.has(q.section)) {
    errs.push(`section: must be one of [${[...VALID_SECTIONS].join(', ')}], got: '${q.section}'`)
  }

  // Question type
  if (!VALID_TYPES.has(q.questionType)) {
    errs.push(`questionType: must be one of [${[...VALID_TYPES].join(', ')}], got: '${q.questionType}'`)
  }

  // Objective vs subjective consistency
  if (OBJECTIVE_TYPES.has(q.questionType)) {
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      errs.push(`options: objective question '${q.questionType}' requires exactly 4 options`)
    }
    if (q.correctAnswer === null || q.correctAnswer === undefined) {
      errs.push(`correctAnswer: required for objective questionType '${q.questionType}'`)
    } else if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
      errs.push(`correctAnswer: must be 0–3, got: ${q.correctAnswer}`)
    }
  }

  if (SUBJECTIVE_TYPES.has(q.questionType)) {
    if (q.options !== null && q.options !== undefined) {
      errs.push(`options: subjective question '${q.questionType}' should have options: null`)
    }
    if (q.correctAnswer !== null && q.correctAnswer !== undefined) {
      errs.push(`correctAnswer: subjective question '${q.questionType}' should have correctAnswer: null`)
    }
    if (strict && !q.modelAnswer) {
      errs.push(`modelAnswer: recommended for subjective question '${q.questionType}'`)
    }
  }

  // Difficulty
  if (!VALID_DIFFICULTIES.has(q.difficulty)) {
    errs.push(`difficulty: must be one of [${[...VALID_DIFFICULTIES].join(', ')}], got: '${q.difficulty}'`)
  }

  // Estimated time
  if (typeof q.estimatedTime !== 'number' || q.estimatedTime <= 0) {
    errs.push(`estimatedTime: must be a positive number (minutes), got: ${q.estimatedTime}`)
  }

  // Source status
  if (!VALID_SOURCES.has(q.sourceStatus)) {
    errs.push(`sourceStatus: must be 'real-pyq' or 'sample-practice', got: '${q.sourceStatus}'`)
  }

  // Topic tags
  if (!Array.isArray(q.topicTags) || q.topicTags.length === 0) {
    errs.push('topicTags: must be a non-empty array of strings')
  }

  if (errs.length > 0) {
    throw new Error(
      `Invalid question [${id}]:\n${errs.map(e => `  • ${e}`).join('\n')}`
    )
  }
  return true
}

/**
 * Validates an array of questions. Returns a report.
 * @param {PYQQuestion[]} questions
 * @returns {{ valid: number, invalid: number, errors: string[] }}
 */
export function validateAll(questions) {
  const errors = []
  let valid = 0

  for (const q of questions) {
    try {
      validateQuestion(q)
      valid++
    } catch (e) {
      errors.push(e.message)
    }
  }

  return { valid, invalid: errors.length, errors }
}

/**
 * Empty template for a new objective (MCQ) PYQ.
 * Copy this and fill in all fields.
 * @returns {PYQQuestion}
 */
export function newObjectiveTemplate(year, section = 'grammar') {
  return {
    id: `upsc-${year}-${section}-XXX`,     // replace XXX with 3-digit index
    year,
    exam: 'UPSC CSE',
    paper: 'Mains General English',
    section,
    questionType: 'mcq',                   // see QUESTION_TYPES
    questionText: '',
    passageText: null,
    options: ['', '', '', ''],
    correctAnswer: 0,                      // 0-based index of correct option
    modelAnswer: null,
    explanation: '',
    trap: null,
    topicTags: [],
    difficulty: 'medium',
    estimatedTime: 2,
    sourceStatus: 'sample-practice',       // change to 'real-pyq' only when verified
    sourceNote: null,
    conceptTag: null,
  }
}

/**
 * Empty template for a new subjective PYQ.
 * @returns {PYQQuestion}
 */
export function newSubjectiveTemplate(year, section = 'essay') {
  return {
    id: `upsc-${year}-${section}-XXX`,
    year,
    exam: 'UPSC CSE',
    paper: 'Mains General English',
    section,
    questionType: 'essay-writing',         // see QUESTION_TYPES
    questionText: '',
    passageText: null,
    options: null,
    correctAnswer: null,
    modelAnswer: null,
    explanation: 'Key points and approach to be added.',
    trap: null,
    topicTags: [section],
    difficulty: 'hard',
    estimatedTime: 40,
    sourceStatus: 'sample-practice',
    sourceNote: null,
    conceptTag: null,
  }
}
