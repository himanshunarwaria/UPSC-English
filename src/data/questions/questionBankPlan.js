// ─────────────────────────────────────────────────────────────────────────────
// UPSC English Grammar Practice Bank — Master Architecture Plan
//
// 1,000-question controlled practice bank.
// Philosophy: Every question must test a real UPSC-pattern weakness.
//             Zero filler. Zero school-level content.
// ─────────────────────────────────────────────────────────────────────────────

// ── Category codes (used in IDs and filenames) ──────────────────────────────

export const CATEGORY_CODES = {
  ERROR_SPOTTING:       'es',
  SENTENCE_CORRECTION:  'sc',
  SUBJECT_VERB:         'sva',
  TENSES:               'ten',
  PREPOSITIONS:         'pre',
  VOICE_NARRATION:      'vn',
  ARTICLES:             'art',
  MIXED:                'mix',
}

// ── Distribution plan ────────────────────────────────────────────────────────
//
// Each entry: [category, code, total, batches]
// 100 questions per batch.
// Difficulty mix per batch: B1:15 B2:35 C1:40 C2:10

export const DISTRIBUTION = [
  //  Category                          Code    Total  Batches
  { category: 'Error Spotting',         code: 'es',  total: 200, batches: 2 },
  { category: 'Sentence Correction',    code: 'sc',  total: 200, batches: 2 },
  { category: 'Subject-Verb Agreement', code: 'sva', total: 100, batches: 1 },
  { category: 'Tenses & Sequence',      code: 'ten', total: 100, batches: 1 },
  { category: 'Prepositions',           code: 'pre', total: 100, batches: 1 },
  { category: 'Voice & Narration',      code: 'vn',  total: 100, batches: 1 },
  { category: 'Articles & Determiners', code: 'art', total: 100, batches: 1 },
  { category: 'Mixed Advanced Grammar', code: 'mix', total: 100, batches: 1 },
]

// ── Bank totals ───────────────────────────────────────────────────────────────

export const BANK_TOTALS = {
  total:               1000,
  b1_foundation:        150,  // 15% — fix basic knowledge gaps
  b2_serious:           350,  // 35% — real exam-level challenge
  c1_upsc_traps:        400,  // 40% — the core of UPSC paper pattern
  c2_elite:             100,  // 10% — precision-level edge cases
  total_batches:         10,
  questions_per_batch:  100,
}

// ── Question type distribution per category ──────────────────────────────────

export const CATEGORY_QUESTION_TYPES = {
  es:  ['error-spotting'],
  sc:  ['sentence-correction', 'mcq'],
  sva: ['fill-blank', 'error-spotting', 'sentence-correction'],
  ten: ['fill-blank', 'error-spotting', 'sentence-correction'],
  pre: ['fill-blank', 'error-spotting', 'sentence-correction'],
  vn:  ['voice-conversion', 'speech-conversion', 'mcq', 'error-spotting'],
  art: ['fill-blank', 'error-spotting'],
  mix: ['error-spotting', 'sentence-correction', 'fill-blank', 'mcq'],
}

// ── Batch file naming convention ──────────────────────────────────────────────
//
// Filename:  batches/batch_{NNN}_{category_slug}.js
// Examples:  batches/batch_001_error_spotting.js   (Q 1–100)
//            batches/batch_002_error_spotting.js   (Q 101–200)
//
// Question ID: {code}_{batch_number:03d}_{sequence_in_bank:04d}
// Examples:  es_001_0001  (Error Spotting #1)
//            es_001_0100  (Error Spotting #100)
//            es_002_0101  (Error Spotting #101)

export function makeQuestionId(code, batchNumber, sequenceInBank) {
  return `${code}_${String(batchNumber).padStart(3, '0')}_${String(sequenceInBank).padStart(4, '0')}`
}

export function makeBatchFilename(code, batchNumber) {
  return `${code}_b${String(batchNumber).padStart(3, '0')}`
}

// ── Batch map — exactly which file owns which ID range ────────────────────────

export const BATCH_MAP = DISTRIBUTION.flatMap(cat => {
  const batches = []
  for (let b = 1; b <= cat.batches; b++) {
    const startSeq = (b - 1) * BANK_TOTALS.questions_per_batch + 1
    const endSeq   = Math.min(b * BANK_TOTALS.questions_per_batch, cat.total)
    batches.push({
      category: cat.category,
      code:     cat.code,
      batch:    b,
      filename: makeBatchFilename(cat.code, b),
      idRange:  [
        makeQuestionId(cat.code, b, startSeq),
        makeQuestionId(cat.code, b, endSeq),
      ],
      count: endSeq - startSeq + 1,
    })
  }
  return batches
})

// ── Source labels ─────────────────────────────────────────────────────────────

export const SOURCE = {
  status: 'sample-practice',
  label:  'UPSC-style Practice',
  note:   'Original question modelled on UPSC Compulsory English paper patterns. Not a verified PYQ.',
}

// ── Generation status tracker ─────────────────────────────────────────────────
//
// Update this as batches are created.
// Format: 'batch_filename': 'pending' | 'draft' | 'reviewed' | 'approved'

export const GENERATION_STATUS = {
  'batch_001_error_spotting':       'pending',
  'batch_002_error_spotting':       'pending',
  'batch_003_sentence_correction':  'pending',
  'batch_004_sentence_correction':  'pending',
  'batch_005_subject_verb_agreement': 'pending',
  'batch_006_tenses':               'pending',
  'batch_007_prepositions':         'pending',
  'batch_008_voice_narration':      'pending',
  'batch_009_articles_determiners': 'pending',
  'batch_010_mixed_advanced_grammar': 'pending',
}

// ── Progress summary ──────────────────────────────────────────────────────────

export function getBankProgress() {
  const approved = Object.values(GENERATION_STATUS).filter(s => s === 'approved').length
  const reviewed = Object.values(GENERATION_STATUS).filter(s => s === 'reviewed').length
  const draft    = Object.values(GENERATION_STATUS).filter(s => s === 'draft').length
  const pending  = BANK_TOTALS.total_batches - approved - reviewed - draft

  return {
    total_batches:               BANK_TOTALS.total_batches,
    approved_batches:            approved,
    reviewed_batches:            reviewed,
    draft_batches:               draft,
    pending_batches:             pending,
    approx_questions_done:       approved * BANK_TOTALS.questions_per_batch,
    approx_questions_remaining:  pending  * BANK_TOTALS.questions_per_batch,
    percent_complete:            Math.round((approved / BANK_TOTALS.total_batches) * 100),
  }
}

export default DISTRIBUTION
