// ─────────────────────────────────────────────────────────────────────────────
// Batch Index — Master Loader for All Approved Question Batches
//
// As each batch is approved, import it here.
// The combined array is exported for use by getQuestions.js.
// ─────────────────────────────────────────────────────────────────────────────

// Approved batches — add imports as they become available
// Format: import batch_{N} from './{filename}'

// Approved batches — batch_001 (all 5 parts, 100Q total, audited ✓)
import batch_001_p1 from './batch_001_part_01_error_spotting.js'
import batch_001_p2 from './batch_001_part_02_error_spotting.js'
import batch_001_p3 from './batch_001_part_03_error_spotting.js'
import batch_001_p4 from './batch_001_part_04_error_spotting.js'
import batch_001_p5 from './batch_001_part_05_error_spotting.js'

// Approved batches — batch_002 (all 5 parts, 100Q total, validated ✓)
import batch_002_p1 from './batch_002_part_01_error_spotting.js'
import batch_002_p2 from './batch_002_part_02_error_spotting.js'
import batch_002_p3 from './batch_002_part_03_error_spotting.js'
import batch_002_p4 from './batch_002_part_04_error_spotting.js'
import batch_002_p5 from './batch_002_part_05_error_spotting.js'

// Approved batches — batch_003 parts 1–5 (100Q total, audited ✓)
import batch_003_p1 from './batch_003_sentence_correction_part_01.js'
import batch_003_p2 from './batch_003_sentence_correction_part_02.js'
import batch_003_p3 from './batch_003_sentence_correction_part_03.js'
import batch_003_p4 from './batch_003_sentence_correction_part_04.js'
import batch_003_p5 from './batch_003_sentence_correction_part_05.js'

// Approved batches — batch_004 parts 1–5 (100Q complete, audited ✓)
import batch_004_p1 from './batch_004_sentence_correction_part_01.js'
import batch_004_p2 from './batch_004_sentence_correction_part_02.js'
import batch_004_p3 from './batch_004_sentence_correction_part_03.js'
import batch_004_p4 from './batch_004_sentence_correction_part_04.js'
import batch_004_p5 from './batch_004_sentence_correction_part_05.js'

// Approved batches — batch_005 parts 1–5 (100Q complete, audited ✓)
import batch_005_p1 from './batch_005_subject_verb_agreement_part_01.js'
import batch_005_p2 from './batch_005_subject_verb_agreement_part_02.js'
import batch_005_p3 from './batch_005_subject_verb_agreement_part_03.js'
import batch_005_p4 from './batch_005_subject_verb_agreement_part_04.js'
import batch_005_p5 from './batch_005_subject_verb_agreement_part_05.js'

// Draft batches — batch_006 parts 1–5 (100Q complete)
import batch_006_p1 from './batch_006_tenses_part_01.js'
import batch_006_p2 from './batch_006_tenses_part_02.js'
import batch_006_p3 from './batch_006_tenses_part_03.js'
import batch_006_p4 from './batch_006_tenses_part_04.js'
import batch_006_p5 from './batch_006_tenses_part_05.js'

// Approved batches — batch_007 parts 1–5 (100Q complete)
import batch_007_p1 from './batch_007_prepositions_part_01.js'
import batch_007_p2 from './batch_007_prepositions_part_02.js'
import batch_007_p3 from './batch_007_prepositions_part_03.js'
import batch_007_p4 from './batch_007_prepositions_part_04.js'
import batch_007_p5 from './batch_007_prepositions_part_05.js'

// Approved batches — batch_008 parts 1–5 (100Q complete)
import batch_008_p1 from './batch_008_voice_narration_part_01.js'
import batch_008_p2 from './batch_008_voice_narration_part_02.js'
import batch_008_p3 from './batch_008_voice_narration_part_03.js'
import batch_008_p4 from './batch_008_voice_narration_part_04.js'
import batch_008_p5 from './batch_008_voice_narration_part_05.js'

// Draft batches — batch_009 parts 1–5 (100Q complete)
import batch_009_p1 from './batch_009_articles_determiners_part_01.js'
import batch_009_p2 from './batch_009_articles_determiners_part_02.js'
import batch_009_p3 from './batch_009_articles_determiners_part_03.js'
import batch_009_p4 from './batch_009_articles_determiners_part_04.js'
import batch_009_p5 from './batch_009_articles_determiners_part_05.js'

// Draft batches — batch_010 parts 1–5 (100Q complete)
import batch_010_p1 from './batch_010_mixed_advanced_grammar_part_01.js'
import batch_010_p2 from './batch_010_mixed_advanced_grammar_part_02.js'
import batch_010_p3 from './batch_010_mixed_advanced_grammar_part_03.js'
import batch_010_p4 from './batch_010_mixed_advanced_grammar_part_04.js'
import batch_010_p5 from './batch_010_mixed_advanced_grammar_part_05.js'

// Gap-filling batches — previously orphaned, now activated
import batch_gap_l1_foundational from './batch_level1_foundational_part_01.js'
import batch_gap_l1_foundational_p2 from './batch_level1_foundational_part_02.js'
import batch_gap_l1_foundational_p3 from './batch_level1_foundational_part_03.js'
import batch_gap_l1_foundational_p4 from './batch_level1_foundational_part_04.js'
import batch_gap_l1_foundational_p5 from './batch_level1_foundational_part_05.js'
import batch_gap_l1_foundational_p6 from './batch_level1_foundational_part_06.js'
import batch_gap_l1_foundational_p7 from './batch_level1_foundational_part_07.js'
import batch_gap_l1_foundational_p8 from './batch_level1_foundational_part_08.js'
import batch_gap_l1_foundational_p9 from './batch_level1_foundational_part_09.js'
import batch_gap_l2_intermediate from './batch_level2_intermediate_part_01.js'
import batch_gap_l5_vocabulary from './batch_level5_vocabulary_advancement.js'
import batch_gap_l9_answerwriting from './batch_level9_answerwriting.js'
import batch_gap_pronouns from './batch_pronouns_advanced.js'
import batch_gap_sentenceimprovement from './batch_sentenceimprovement_advanced.js'
import batch_gap_diindirect from './batch_diindirect_advanced.js'

// Level 4 — Sentence Connectors (batch 011 parts 1–5, 100Q total)
import batch_011_sentence_connectors from './batch_011_sentence_connectors_part_01.js'
import batch_011_sentence_connectors_p2 from './batch_011_sentence_connectors_part_02.js'
import batch_011_sentence_connectors_p3 from './batch_011_sentence_connectors_part_03.js'
import batch_011_sentence_connectors_p4 from './batch_011_sentence_connectors_part_04.js'
import batch_011_sentence_connectors_p5 from './batch_011_sentence_connectors_part_05.js'

// Level 6 — Phrasal Verbs: Formal Replacements (batch 012 parts 1–6, 110Q total)
import batch_012_phrasal_verbs from './batch_012_phrasal_verbs_part_01.js'
import batch_012_phrasal_verbs_p2 from './batch_012_phrasal_verbs_part_02.js'
import batch_012_phrasal_verbs_p3 from './batch_012_phrasal_verbs_part_03.js'
import batch_012_phrasal_verbs_p4 from './batch_012_phrasal_verbs_part_04.js'
import batch_012_phrasal_verbs_p5 from './batch_012_phrasal_verbs_part_05.js'
import batch_012_phrasal_verbs_p6 from './batch_012_phrasal_verbs_part_06.js'

// Level 8 — Academic Vocabulary (batch 013 parts 1–5, 100Q total — COMPLETE)
import batch_013_academic_vocab from './batch_013_academic_vocabulary_part_01.js'
import batch_013_academic_vocab_p2 from './batch_013_academic_vocabulary_part_02.js'
import batch_013_academic_vocab_p3 from './batch_013_academic_vocabulary_part_03.js'
import batch_013_academic_vocab_p4 from './batch_013_academic_vocabulary_part_04.js'
import batch_013_academic_vocab_p5 from './batch_013_academic_vocabulary_part_05.js'

// Level 5 — Vocabulary Expansion: Formal Word Replacement (batch 015 parts 1–5, 100Q total — COMPLETE)
import batch_015_vocab_expansion from './batch_015_vocabulary_expansion_part_01.js'
import batch_015_vocab_expansion_p2 from './batch_015_vocabulary_expansion_part_02.js'
import batch_015_vocab_expansion_p3 from './batch_015_vocabulary_expansion_part_03.js'
import batch_015_vocab_expansion_p4 from './batch_015_vocabulary_expansion_part_04.js'
import batch_015_vocab_expansion_p5 from './batch_015_vocabulary_expansion_part_05.js'

// Level 9 — UPSC Answer Writing (batch 014 parts 1–5, 100Q total)
import batch_014_answer_writing from './batch_014_answer_writing_part_01.js'
import batch_015_answer_writing from './batch_014_answer_writing_part_02.js'
import batch_016_answer_writing from './batch_014_answer_writing_part_03.js'
import batch_017_answer_writing from './batch_014_answer_writing_part_04.js'
import batch_018_answer_writing from './batch_014_answer_writing_part_05.js'

// Level 10 — Full UPSC English Test (batch 016 parts 1–2, 40Q total)
import batch_016_full_mock from './batch_016_full_mock_part_01.js'
import batch_016_full_mock_p2 from './batch_016_full_mock_part_02.js'

// Level 4 — General Grammar (batch 017 part 1, 30Q)
import batch_017_grammar_l4_p1 from './batch_017_grammar_level4_part_01.js'

// Level 4 — General Grammar (batch 018 part 2, 20Q)
import batch_018_grammar_l4_p2 from './batch_018_grammar_level4_part_02.js'

// Level 4 — General Grammar (batch 019 part 3, 30Q)
import batch_019_grammar_l4_p3 from './batch_019_grammar_level4_part_03.js'

// ── Combine all approved batches ──────────────────────────────────────────────

const allBatches = [
  ...batch_001_p1,
  ...batch_001_p2,
  ...batch_001_p3,
  ...batch_001_p4,
  ...batch_001_p5,
  ...batch_002_p1,
  ...batch_002_p2,
  ...batch_002_p3,
  ...batch_002_p4,
  ...batch_002_p5,
  ...batch_003_p1,
  ...batch_003_p2,
  ...batch_003_p3,
  ...batch_003_p4,
  ...batch_003_p5,
  ...batch_004_p1,
  ...batch_004_p2,
  ...batch_004_p3,
  ...batch_004_p4,
  ...batch_004_p5,
  ...batch_005_p1,
  ...batch_005_p2,
  ...batch_005_p3,
  ...batch_005_p4,
  ...batch_005_p5,
  ...batch_006_p1,
  ...batch_006_p2,
  ...batch_006_p3,
  ...batch_006_p4,
  ...batch_006_p5,
  ...batch_007_p1,
  ...batch_007_p2,
  ...batch_007_p3,
  ...batch_007_p4,
  ...batch_007_p5,
  ...batch_008_p1,
  ...batch_008_p2,
  ...batch_008_p3,
  ...batch_008_p4,
  ...batch_008_p5,
  ...batch_009_p1,
  ...batch_009_p2,
  ...batch_009_p3,
  ...batch_009_p4,
  ...batch_009_p5,
  ...batch_010_p1,
  ...batch_010_p2,
  ...batch_010_p3,
  ...batch_010_p4,
  ...batch_010_p5,
  ...batch_gap_l1_foundational,
  ...batch_gap_l1_foundational_p2,
  ...batch_gap_l1_foundational_p3,
  ...batch_gap_l1_foundational_p4,
  ...batch_gap_l1_foundational_p5,
  ...batch_gap_l1_foundational_p6,
  ...batch_gap_l1_foundational_p7,
  ...batch_gap_l1_foundational_p8,
  ...batch_gap_l1_foundational_p9,
  ...batch_gap_l2_intermediate,
  ...batch_gap_l5_vocabulary,
  ...batch_gap_l9_answerwriting,
  ...batch_gap_pronouns,
  ...batch_gap_sentenceimprovement,
  ...batch_gap_diindirect,
  ...batch_011_sentence_connectors,
  ...batch_011_sentence_connectors_p2,
  ...batch_011_sentence_connectors_p3,
  ...batch_011_sentence_connectors_p4,
  ...batch_011_sentence_connectors_p5,
  ...batch_012_phrasal_verbs,
  ...batch_012_phrasal_verbs_p2,
  ...batch_012_phrasal_verbs_p3,
  ...batch_012_phrasal_verbs_p4,
  ...batch_012_phrasal_verbs_p5,
  ...batch_012_phrasal_verbs_p6,
  ...batch_013_academic_vocab,
  ...batch_013_academic_vocab_p2,
  ...batch_013_academic_vocab_p3,
  ...batch_013_academic_vocab_p4,
  ...batch_013_academic_vocab_p5,
  ...batch_015_vocab_expansion,
  ...batch_015_vocab_expansion_p2,
  ...batch_015_vocab_expansion_p3,
  ...batch_015_vocab_expansion_p4,
  ...batch_015_vocab_expansion_p5,
  ...batch_014_answer_writing,
  ...batch_015_answer_writing,
  ...batch_016_answer_writing,
  ...batch_017_answer_writing,
  ...batch_018_answer_writing,
  ...batch_016_full_mock,
  ...batch_016_full_mock_p2,
  ...batch_017_grammar_l4_p1,
  ...batch_018_grammar_l4_p2,
  ...batch_019_grammar_l4_p3,
]

export const questionsFromBatches = allBatches

export default questionsFromBatches
