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
]

export const questionsFromBatches = allBatches

export default questionsFromBatches
