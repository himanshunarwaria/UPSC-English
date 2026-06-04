// ─────────────────────────────────────────────────────────────────────────────
// Batch Manifest — Progress Tracker for 1,000-Question Bank
//
// Each batch: 100 questions.
// Total batches: 10.
// Update status as batches are generated and approved.
// ─────────────────────────────────────────────────────────────────────────────

export const BATCH_MANIFEST = [

  // Error Spotting — 2 batches (200 questions)
  { batchNo: 1,  file: 'batch_001_error_spotting.js',         category: 'Error Spotting',           targetCount: 100, difficultyMix: 'B1:10 B2:35 C1:45 C2:10', status: 'approved', generatedCount: 100, validated: true,  notes: 'ALL 5 PARTS AUDITED ✓ (100Q total). Answer balance 5:5:5:5 each part. All 100 rules distinct. Ready for production.' },
  { batchNo: 2,  file: 'batch_002_error_spotting.js',         category: 'Error Spotting',           targetCount: 100, difficultyMix: 'B1:10 B2:35 C1:45 C2:10', status: 'draft',   generatedCount: 100, validated: false, notes: 'Split into 5 parts (20Q each): batch_002_part_01 through batch_002_part_05. Awaiting validation.' },

  // Sentence Correction — 2 batches (200 questions)
  { batchNo: 3,  file: 'batch_003_sentence_correction.js',    category: 'Sentence Correction',      targetCount: 100, difficultyMix: 'B1:15 B2:35 C1:40 C2:10', status: 'approved', generatedCount: 100, validated: true, notes: 'ALL PARTS AUDITED ✓ (100Q total). Part1 Q12 replaced (stylistic pref→who/whom objective case). Part2 Q28 replaced (dup)→what-clause SVA, Q37 tags fixed (B2→C1). Part3 Q49 replaced (dup of new Q28)→either/or-singular. Parts 4–5 all 40Q pass (no replacements). All 100Q pass validation. Production-ready.' },
  { batchNo: 4,  file: 'batch_004_sentence_correction.js',    category: 'Sentence Correction',      targetCount: 100, difficultyMix: 'B1:15 B2:35 C1:40 C2:10', status: 'approved', generatedCount: 100, validated: true, notes: 'ALL 5 PARTS AUDITED ✓ (100Q: Q0101–Q0200). Part1 replaced Q0103 (stylistic preference). Part4 replaced Q0163, Q0165, Q0169, Q0170, Q0177 (debatable/style-based). Part5 replaced Q0187, Q0192, Q0200 (style/preference, not grammar). All replacements test clear, unambiguous UPSC grammar rules. Final audit: 100/100 pass (100%). All sentences formal, all rules serious and UPSC-relevant, all explanations complete. Production-ready.' },

  // Subject-Verb Agreement — 1 batch (100 questions)
  { batchNo: 5,  file: 'batch_005_subject_verb_agreement.js', category: 'Subject-Verb Agreement',   targetCount: 100, difficultyMix: 'B1:15 B2:35 C1:40 C2:10', status: 'approved', generatedCount: 100, validated: true, notes: 'ALL 5 PARTS AUDITED ✓ (100Q: Q0501–Q0600). Part 1 replaced Q0507 (confusing explanation). Part 2 replaced Q0526 (subTopic mismatch). Part 3 replaced Q0543 (contradictory), Q0545 (grammar error), Q0546 (debatable). Part 4 replaced Q0562 (broken logic), Q0569 (wrong tag). Part 5 replaced Q0597 (contradictory proximity rule). All 100Q pass 15 audit criteria: serious rules, UPSC-relevant governance/policy contexts, clear unambiguous answers, quality 8.0/10 avg. Production-ready.' },

  // Tenses & Sequence of Tenses — 1 batch (100 questions)
  { batchNo: 6,  file: 'batch_006_tenses.js',                 category: 'Tenses & Sequence',        targetCount: 100, difficultyMix: 'B1:15 B2:35 C1:40 C2:10', status: 'pending', generatedCount: 0, validated: false, notes: '' },

  // Prepositions — 1 batch (100 questions)
  { batchNo: 7,  file: 'batch_007_prepositions.js',           category: 'Prepositions',             targetCount: 100, difficultyMix: 'B1:15 B2:35 C1:40 C2:10', status: 'pending', generatedCount: 0, validated: false, notes: '' },

  // Voice & Narration — 1 batch (100 questions)
  { batchNo: 8,  file: 'batch_008_voice_narration.js',        category: 'Voice & Narration',        targetCount: 100, difficultyMix: 'B1:15 B2:35 C1:40 C2:10', status: 'pending', generatedCount: 0, validated: false, notes: 'Covers Active/Passive Voice + Direct/Indirect Speech' },

  // Articles & Determiners — 1 batch (100 questions)
  { batchNo: 9,  file: 'batch_009_articles_determiners.js',   category: 'Articles & Determiners',   targetCount: 100, difficultyMix: 'B1:15 B2:35 C1:40 C2:10', status: 'pending', generatedCount: 0, validated: false, notes: '' },

  // Mixed Advanced Grammar — 1 batch (100 questions)
  { batchNo: 10, file: 'batch_010_mixed_advanced_grammar.js', category: 'Mixed Advanced Grammar',   targetCount: 100, difficultyMix: 'B1:15 B2:35 C1:40 C2:10', status: 'pending', generatedCount: 0, validated: false, notes: 'Modifiers, Parallelism, Conditionals, Non-finite Verbs, Clauses' },

]

export function getBatchProgress() {
  const pending  = BATCH_MANIFEST.filter(b => b.status === 'pending').length
  const draft    = BATCH_MANIFEST.filter(b => b.status === 'draft').length
  const approved = BATCH_MANIFEST.filter(b => b.status === 'approved').length

  return {
    totalBatches:            BATCH_MANIFEST.length,
    pendingBatches:          pending,
    draftBatches:            draft,
    approvedBatches:         approved,
    totalQuestionsGenerated: BATCH_MANIFEST.reduce((sum, b) => sum + b.generatedCount, 0),
    totalQuestionsPlanned:   BATCH_MANIFEST.reduce((sum, b) => sum + b.targetCount, 0),
  }
}

export function updateBatchStatus(batchNo, status, generatedCount, notes = '') {
  const batch = BATCH_MANIFEST.find(b => b.batchNo === batchNo)
  if (batch) {
    batch.status = status
    batch.generatedCount = generatedCount
    batch.notes = notes
  }
}

export default BATCH_MANIFEST
