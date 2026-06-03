// ─────────────────────────────────────────────────────────────────────────────
// Canonical Question Schema — UPSC Grammar Practice Bank (1,000 Questions)
//
// All questions in src/data/questions/batches/ MUST conform to this schema.
// Questions failing validation will be rejected from the bank.
//
// CEFR Difficulty:  B1 = foundation  B2 = serious exam  C1 = UPSC trap  C2 = elite
// ─────────────────────────────────────────────────────────────────────────────

// ── Allowed field values ──────────────────────────────────────────────────────

export const ALLOWED_CATEGORIES = new Set([
  'Error Spotting',
  'Sentence Correction',
  'Subject-Verb Agreement',
  'Tenses',
  'Articles & Determiners',
  'Prepositions',
  'Active/Passive Voice',
  'Direct/Indirect Speech',
  'Modifiers',
  'Parallelism',
  'Conditionals',
  'Non-finite Verbs',
  'Clauses & Connectors',
  'Formal Vocabulary Usage',
  'Idioms & Collocations',
  'Mixed Grammar',
])

export const ALLOWED_TYPES = new Set([
  'mcq-correction',     // 4-option MCQ where one option is the correction
  'error-spotting',     // A/B/C/D underlined parts — find the error
  'fill-blank',         // Choose the best word/phrase for the blank
  'best-sentence',      // Choose the grammatically best sentence from 4
  'voice-conversion',   // Active ↔ Passive transformation
  'speech-conversion',  // Direct ↔ Indirect speech transformation
  'formal-usage',       // Choose the most formal/appropriate option
  'mixed-rule',         // Tests interaction of 2+ grammar rules
])

export const ALLOWED_DIFFICULTIES = new Set(['B1', 'B2', 'C1', 'C2'])

export const ALLOWED_SOURCE_STATUSES = new Set(['sample-practice', 'real-pyq'])

// ── Category → Code map (for ID generation) ──────────────────────────────────

export const CATEGORY_TO_CODE = {
  'Error Spotting':         'es',
  'Sentence Correction':    'sc',
  'Subject-Verb Agreement': 'sva',
  'Tenses':                 'ten',
  'Articles & Determiners': 'art',
  'Prepositions':           'pre',
  'Active/Passive Voice':   'vce',
  'Direct/Indirect Speech': 'spe',
  'Modifiers':              'mod',
  'Parallelism':            'par',
  'Conditionals':           'cnd',
  'Non-finite Verbs':       'nfv',
  'Clauses & Connectors':   'cla',
  'Formal Vocabulary Usage':'voc',
  'Idioms & Collocations':  'idm',
  'Mixed Grammar':          'mix',
}

// ── Realistic time estimates (minutes) per type/difficulty ────────────────────

export const TIME_BOUNDS = {
  'error-spotting':   { min: 1, max: 3 },
  'fill-blank':       { min: 1, max: 3 },
  'best-sentence':    { min: 1, max: 3 },
  'mcq-correction':   { min: 1, max: 4 },
  'voice-conversion': { min: 1, max: 4 },
  'speech-conversion':{ min: 1, max: 4 },
  'formal-usage':     { min: 1, max: 3 },
  'mixed-rule':       { min: 2, max: 5 },
}

// ── Rules that are too broad to be valid ruleTested values ────────────────────
// If ruleTested matches one of these, it is flagged as too generic.

export const BROAD_RULE_NAMES = new Set([
  'Error Spotting',
  'Sentence Correction',
  'Subject-Verb Agreement',
  'Tenses',
  'Articles & Determiners',
  'Articles',
  'Prepositions',
  'Active/Passive Voice',
  'Passive Voice',
  'Active Voice',
  'Direct/Indirect Speech',
  'Reported Speech',
  'Modifiers',
  'Parallelism',
  'Conditionals',
  'Non-finite Verbs',
  'Clauses & Connectors',
  'Formal Vocabulary Usage',
  'Idioms & Collocations',
  'Mixed Grammar',
  'Grammar',
  'Verb form',
  'Verb forms',
  'Tense',
  'Tenses',
  'Article usage',
  'Subject verb agreement',
])

// ── School-level detection patterns ──────────────────────────────────────────
// Questions matching these patterns are flagged as below UPSC standard.

export const SCHOOL_LEVEL_PATTERNS = [
  { pattern: /\b(cat|dog|cow|monkey|banana|mango|apple)\b/i, reason: 'Childish vocabulary' },
  { pattern: /\bhe don['']?t\b/i,                             reason: 'Trivial error — school level' },
  { pattern: /\bshe don['']?t\b/i,                            reason: 'Trivial error — school level' },
  { pattern: /\bi is\b/i,                                     reason: 'Trivial error — school level' },
  { pattern: /\bthey is\b/i,                                  reason: 'Trivial error — school level' },
  { pattern: /\bwe is\b/i,                                    reason: 'Trivial error — school level' },
  { pattern: /\bhe have\b/i,                                   reason: 'Trivial error — school level' },
  { pattern: /\bshe have\b/i,                                  reason: 'Trivial error — school level' },
  { pattern: /^(he|she|they|we|it)\s+(go|eat|play|run|walk)\b/i, reason: 'Elementary sentence structure' },
  { pattern: /\b(ram|sita|mohan|raju)\b/i,                    reason: 'School textbook names — use formal titles' },
]

// ── Fake PYQ claim detection ──────────────────────────────────────────────────

export const FAKE_PYQ_PATTERNS = [
  /\breal\s+pyq\b/i,
  /\bofficial\s+upsc\b/i,
  /\bactual\s+upsc\b/i,
  /\bverified\s+pyq\b/i,
  /\bfrom\s+upsc\s+\d{4}\b/i,
  /\bupsc\s+\d{4}\s+paper\b/i,
  /\bprevious\s+year\s+question\b/i,
]

// ── Quality scoring rubric ────────────────────────────────────────────────────
//
// Total: 10 points. Questions scoring < 7 are flagged. Below 4 → auto-reject.
//
// Points:
//   trap       — 0-3 pts: specificity and length of trap note
//   explanation — 0-3 pts: clarity, rule naming, length
//   ruleSpec   — 0-2 pts: specificity of ruleTested field
//   nonObvious — 0-2 pts: question length, formal register indicators

export const QUALITY_WEIGHTS = {
  trap:        3,
  explanation: 3,
  ruleSpec:    2,
  nonObvious:  2,
}

export const QUALITY_THRESHOLD_WARN = 7
export const QUALITY_THRESHOLD_REJECT = 4

// ── Schema typedef ────────────────────────────────────────────────────────────

/**
 * @typedef {Object} UPSCGrammarQuestion
 *
 * @property {string} id
 *   Format: {category_code}_{batch:03d}_{sequence:04d}
 *   Example: "es_001_0001" — Error Spotting, Batch 1, Question 1
 *   Must be globally unique across the entire 1,000-question bank.
 *
 * @property {'sample-practice'|'real-pyq'} sourceStatus
 *   ALWAYS 'sample-practice' until actual UPSC question text is officially verified.
 *   NEVER write 'real-pyq' unless you have the original question in front of you.
 *
 * @property {string} sourceLabel
 *   Human-readable source label displayed in the app.
 *   Always: "UPSC-style Practice"
 *
 * @property {string} examFocus
 *   Always: "UPSC CSE Compulsory English"
 *
 * @property {'Grammar'} section
 *   Always: "Grammar"
 *
 * @property {string} category
 *   Must be a value from ALLOWED_CATEGORIES.
 *
 * @property {string} subTopic
 *   The specific sub-rule within the category. More detailed than ruleTested.
 *   Example: "Proximity rule with neither...nor"
 *
 * @property {string} type
 *   Must be a value from ALLOWED_TYPES.
 *
 * @property {'B1'|'B2'|'C1'|'C2'} difficulty
 *   CEFR level. B1=foundation B2=exam-ready C1=UPSC-trap C2=elite precision.
 *   Do NOT map to easy/medium/hard — use CEFR directly.
 *
 * @property {string} question
 *   Full question text. For error-spotting: include (A)/(B)/(C)/(D) part labels.
 *   For fill-blank: use ___ marker. Minimum 40 characters. Max 400 characters.
 *   Must read like formal administrative/academic English.
 *
 * @property {string[]} options
 *   Exactly 4 distinct options. All must be plausible at first glance.
 *   Wrong options must each represent a real, nameable grammatical error.
 *
 * @property {number} correctAnswer
 *   0-based index (0–3) of the correct option.
 *
 * @property {string} explanation
 *   The grammar rule applied. Min 50 characters, max 250 characters.
 *   Format: [Rule name]. [Why this instance applies it.] [Optional: contrast with wrong form.]
 *   NEVER write just "Option B is correct." — state the rule.
 *
 * @property {string} trap
 *   Required for ALL questions (not just C1/C2).
 *   The specific cognitive shortcut that leads to the wrong answer.
 *   Min 30 characters. Must be question-specific, not generic.
 *
 * @property {string} ruleTested
 *   The exact grammar rule being tested. Must be specific — not just the category name.
 *   Example: "Neither...nor proximity agreement" not "Subject-Verb Agreement"
 *
 * @property {string} skillTested
 *   The exam skill this question develops. Choose from:
 *   "Identifying grammatical errors in formal text"
 *   "Applying subject-verb agreement in complex sentences"
 *   "Selecting the correct non-finite verb form"
 *   "Transforming voice in complex sentences"
 *   "Converting speech with correct tense backshift"
 *   "Recognising and correcting dangling modifiers"
 *   "Maintaining parallel structure in formal writing"
 *   "Selecting correct conditional verb forms"
 *   "Choosing precise formal vocabulary"
 *   "Identifying appropriate idiomatic usage"
 *   OR write a specific custom description.
 *
 * @property {number} estimatedTime
 *   Realistic time in minutes to answer this question.
 *   error-spotting/fill-blank: 1–3 min
 *   voice/speech conversion: 1–4 min
 *   mixed-rule: 2–5 min
 *
 * @property {string[]} tags
 *   Array of searchable tags for filtering and analytics.
 *   Always include the category code + key rule words.
 *   Example: ['es', 'sva', 'along-with', 'C1', 'intervening-phrase']
 *
 * @property {number} batchNo
 *   The batch number this question belongs to (1-indexed).
 *   Match the batch number in the filename: es_b003.js → batchNo: 3
 *
 * @property {number} qualityScore
 *   Auto-computed by validator (1-10). Do not set manually.
 *   If setting manually for override, add a comment explaining why.
 *   Minimum passing score: 7. Below 4: auto-rejected.
 */

// ── Factory function ──────────────────────────────────────────────────────────
//
// Use this to create a new question object with defaults pre-filled.
// Fill in all placeholder values before submitting.

/**
 * @param {string} category
 * @param {string} type
 * @param {'B1'|'B2'|'C1'|'C2'} difficulty
 * @param {number} batchNo
 * @param {number} sequenceNo  — sequential number within the category (e.g. 42 for the 42nd Error Spotting question)
 * @returns {UPSCGrammarQuestion}
 */
export function createQuestionTemplate(category, type, difficulty, batchNo, sequenceNo) {
  const code    = CATEGORY_TO_CODE[category] || 'unk'
  const id      = `${code}_${String(batchNo).padStart(3, '0')}_${String(sequenceNo).padStart(4, '0')}`
  const timeBounds = TIME_BOUNDS[type] || { min: 1, max: 3 }

  return {
    id,
    sourceStatus:  'sample-practice',
    sourceLabel:   'UPSC-style Practice',
    examFocus:     'UPSC CSE Compulsory English',
    section:       'Grammar',
    category,
    subTopic:      '',           // REQUIRED — fill in specific sub-rule
    type,
    difficulty,
    question:      '',           // REQUIRED — formal sentence, min 40 chars
    options:       ['', '', '', ''],  // REQUIRED — all 4 plausible options
    correctAnswer: 0,            // REQUIRED — verify carefully
    explanation:   '',           // REQUIRED — state the rule, min 50 chars
    trap:          '',           // REQUIRED — min 30 chars, be specific
    ruleTested:    '',           // REQUIRED — specific sub-rule name
    skillTested:   '',           // REQUIRED — exam skill developed
    estimatedTime: timeBounds.min + 1,
    tags:          [code, difficulty.toLowerCase()],
    batchNo,
    qualityScore:  0,            // Auto-computed by validator
  }
}

// ── Canonical field list for completeness checks ──────────────────────────────

export const REQUIRED_FIELDS = [
  'id',
  'sourceStatus',
  'sourceLabel',
  'examFocus',
  'section',
  'category',
  'subTopic',
  'type',
  'difficulty',
  'question',
  'options',
  'correctAnswer',
  'explanation',
  'trap',
  'ruleTested',
  'skillTested',
  'estimatedTime',
  'tags',
  'batchNo',
]

export default {
  ALLOWED_CATEGORIES,
  ALLOWED_TYPES,
  ALLOWED_DIFFICULTIES,
  ALLOWED_SOURCE_STATUSES,
  CATEGORY_TO_CODE,
  TIME_BOUNDS,
  BROAD_RULE_NAMES,
  SCHOOL_LEVEL_PATTERNS,
  FAKE_PYQ_PATTERNS,
  QUALITY_WEIGHTS,
  QUALITY_THRESHOLD_WARN,
  QUALITY_THRESHOLD_REJECT,
  REQUIRED_FIELDS,
  createQuestionTemplate,
}
