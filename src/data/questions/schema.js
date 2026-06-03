// ─────────────────────────────────────────────────────────────────────────────
// Grammar Question Bank — Schema & Validators
//
// All questions in src/data/questions/batches/ must conform to this schema.
// Compatible with the existing grammarQuestions.js format used by Practice.jsx.
// ─────────────────────────────────────────────────────────────────────────────

// ── Valid field values ────────────────────────────────────────────────────────

export const VALID_TOPICS = new Set([
  'Error Spotting',
  'Sentence Correction',
  'Subject-Verb Agreement',
  'Tenses',
  'Articles',
  'Prepositions',
  'Active & Passive Voice',
  'Direct & Indirect Speech',
  'Modifiers',
  'Parallelism',
  'Conditionals',
  'Non-finite Verbs',
  'Clauses & Connectors',
  'Vocabulary Usage',
  'Idioms & Phrases',
])

export const VALID_TYPES = new Set([
  'error-spotting',       // Identify the error part (A/B/C/D format)
  'sentence-correction',  // Choose the correctly written sentence
  'fill-blank',           // Fill in the blank — choose the best word/phrase
  'mcq',                  // Standard 4-option MCQ
  'voice-conversion',     // Choose correct active/passive transformation
  'speech-conversion',    // Choose correct reported speech form
])

export const VALID_DIFFICULTIES = new Set(['easy', 'medium', 'hard'])

export const VALID_CEFR = new Set(['B1', 'B2', 'C1', 'C2'])

// ── Difficulty → CEFR mapping ─────────────────────────────────────────────────
// The app uses 'easy/medium/hard'. CEFR is stored separately for analytics.
export const DIFFICULTY_TO_CEFR = {
  easy:   'B1',
  medium: 'B2',    // some medium = B2, some = C1 depending on conceptTag
  hard:   'C1',    // most hard = C1; C2 requires cefr field override
}

// ── Schema typedef ────────────────────────────────────────────────────────────

/**
 * @typedef {Object} GrammarQuestion
 *
 * @property {string} id
 *   Format: {code}_{batch:03d}_{seq:04d}  e.g. "es_001_0001"
 *   Must be globally unique across ALL question files.
 *
 * @property {string} source
 *   Always: "UPSC-style Practice"
 *   Never write "Real PYQ" or "From UPSC 20XX" unless officially verified.
 *
 * @property {string} section
 *   Always: "Grammar"
 *
 * @property {string} topic
 *   Must be a value from VALID_TOPICS.
 *
 * @property {string} type
 *   Must be a value from VALID_TYPES.
 *
 * @property {'easy'|'medium'|'hard'} difficulty
 *   easy = B1 foundation  medium = B2/C1 real exam  hard = C1/C2 UPSC trap
 *
 * @property {string} [cefr]
 *   Optional override for precise CEFR level: 'B1'|'B2'|'C1'|'C2'
 *   Required only for C2 questions (difficulty='hard' with cefr='C2').
 *
 * @property {string} question
 *   The question stem. For error-spotting: include (A)/(B)/(C)/(D) part labels.
 *   For fill-blank: use ___ or [blank] marker.
 *   Max 200 characters for MCQ stems. Sentences must sound formal and natural.
 *
 * @property {string[]} options
 *   Exactly 4 options. Must be plausible — all 4 should look correct at a glance.
 *   For error-spotting: options are the underlined part labels or corrections.
 *   Wrong options must represent real, common errors — not obvious wrong answers.
 *
 * @property {number} correctAnswer
 *   0-based index (0–3) of the correct option.
 *
 * @property {string} explanation
 *   The rule behind the correct answer. Max 2 sentences.
 *   State the rule first, then why this instance applies it.
 *   Never just say "option B is correct" — explain WHY.
 *
 * @property {string|null} trap
 *   The specific mislead in this question. What makes aspirants choose the wrong answer?
 *   Max 1 sentence. Required for difficulty='hard'.
 *   null only for difficulty='easy' questions where no meaningful trap exists.
 *
 * @property {string} conceptTag
 *   The single grammar rule being tested. Specific > broad.
 *   Examples: "Neither...nor proximity rule" NOT "Subject-Verb Agreement"
 *             "Gerund as subject — singular verb" NOT "Tenses"
 *             "Dangling participial phrase" NOT "Modifiers"
 *
 * @property {string[]} [upscRelevance]
 *   Optional: specific UPSC paper patterns this question mirrors.
 *   Example: ["UPSC 2019 Error Spotting pattern", "IFoS 2021 fill-blank"]
 */

// ── Validator ─────────────────────────────────────────────────────────────────

/**
 * Validate a single grammar question.
 * Returns { valid: boolean, errors: string[] }
 */
export function validateGrammarQuestion(q) {
  const errors = []
  const id = q.id || '(no id)'

  // Required string fields
  if (!q.id || typeof q.id !== 'string') errors.push('id: required string')
  if (!q.source || typeof q.source !== 'string') errors.push('source: required string')
  if (q.section !== 'Grammar') errors.push("section: must be 'Grammar'")
  if (!VALID_TOPICS.has(q.topic)) errors.push(`topic: must be one of [${[...VALID_TOPICS].join(', ')}]`)
  if (!VALID_TYPES.has(q.type)) errors.push(`type: must be one of [${[...VALID_TYPES].join(', ')}]`)
  if (!VALID_DIFFICULTIES.has(q.difficulty)) errors.push(`difficulty: must be easy|medium|hard`)

  // Question stem
  if (!q.question || typeof q.question !== 'string') {
    errors.push('question: required string')
  } else if (q.question.length > 300) {
    errors.push(`question: too long (${q.question.length} chars; max 300)`)
  }

  // Options
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    errors.push('options: must be an array of exactly 4 strings')
  } else {
    q.options.forEach((opt, i) => {
      if (typeof opt !== 'string' || opt.trim() === '') {
        errors.push(`options[${i}]: must be a non-empty string`)
      }
    })
    const unique = new Set(q.options.map(o => o.trim().toLowerCase()))
    if (unique.size < 4) errors.push('options: all 4 options must be distinct')
  }

  // Correct answer
  if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
    errors.push('correctAnswer: must be integer 0–3')
  }

  // Explanation
  if (!q.explanation || typeof q.explanation !== 'string') {
    errors.push('explanation: required')
  } else if (q.explanation.split('.').filter(s => s.trim()).length > 3) {
    errors.push('explanation: too long — max 2–3 sentences')
  }

  // Trap — required for hard questions
  if (q.difficulty === 'hard' && !q.trap) {
    errors.push('trap: required for difficulty=hard questions')
  }

  // Concept tag
  if (!q.conceptTag || typeof q.conceptTag !== 'string') {
    errors.push('conceptTag: required — be specific, e.g. "Neither...nor proximity rule"')
  } else if (VALID_TOPICS.has(q.conceptTag)) {
    errors.push('conceptTag: too broad — use a specific rule name, not a topic name')
  }

  // ID format check
  if (q.id && !/^[a-z]+_\d{3}_\d{4}$/.test(q.id)) {
    errors.push(`id: format must be {code}_{batch:3d}_{seq:4d}, got '${q.id}'`)
  }

  // Source honesty
  if (q.source && (q.source.toLowerCase().includes('real pyq') || q.source.toLowerCase().includes('from upsc'))) {
    errors.push('source: do not claim real PYQ status unless officially verified')
  }

  return { valid: errors.length === 0, errors, id }
}

/**
 * Validate a batch array of questions. Returns a report.
 */
export function validateBatch(questions, batchFilename = '(unknown)') {
  const results = questions.map(validateGrammarQuestion)
  const valid   = results.filter(r => r.valid).length
  const invalid = results.filter(r => !r.valid)

  // Duplicate ID check within batch
  const ids = questions.map(q => q.id)
  const seen = new Set()
  const duplicates = []
  ids.forEach(id => {
    if (seen.has(id)) duplicates.push(id)
    else seen.add(id)
  })
  if (duplicates.length) {
    invalid.push({ id: 'DUPLICATE', valid: false, errors: [`Duplicate IDs: ${duplicates.join(', ')}`] })
  }

  return {
    batch:    batchFilename,
    total:    questions.length,
    valid,
    invalid:  invalid.length,
    errors:   invalid.flatMap(r => r.errors.map(e => `[${r.id}] ${e}`)),
  }
}

// ── Duplicate detection across batches ───────────────────────────────────────

/**
 * Simple stem-level duplicate check.
 * Normalise question text and compare first 60 characters.
 * Returns pairs of likely duplicates for human review.
 */
export function findLikelyDuplicates(questions) {
  const stems = {}
  const duplicates = []

  for (const q of questions) {
    const key = (q.question || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').slice(0, 60).trim()
    if (stems[key]) {
      duplicates.push({ a: stems[key], b: q.id, stem: key })
    } else {
      stems[key] = q.id
    }
  }
  return duplicates
}

export default { validateGrammarQuestion, validateBatch, findLikelyDuplicates }
