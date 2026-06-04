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

// Approved batches — batch_005 parts 1–5 (100Q complete, awaiting audit)
import batch_005_p1 from './batch_005_subject_verb_agreement_part_01.js'
import batch_005_p2 from './batch_005_subject_verb_agreement_part_02.js'
import batch_005_p3 from './batch_005_subject_verb_agreement_part_03.js'
import batch_005_p4 from './batch_005_subject_verb_agreement_part_04.js'
import batch_005_p5 from './batch_005_subject_verb_agreement_part_05.js'

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
]

export const questionsFromBatches = allBatches

export default questionsFromBatches
