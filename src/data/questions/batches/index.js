// ─────────────────────────────────────────────────────────────────────────────
// Batch Index — Master Loader for All Approved Question Batches
//
// As each batch is approved, import it here.
// The combined array is exported for use by getQuestions.js.
// ─────────────────────────────────────────────────────────────────────────────

// Approved batches — add imports as they become available
// Format: import batch_{N} from './{filename}'

// Validation imports — batch_002 parts (pending approval)
import batch_002_p1 from './batch_002_part_01_error_spotting.js'

// ── Combine all approved batches ──────────────────────────────────────────────

const allBatches = [
  ...batch_002_p1,
]

export const questionsFromBatches = allBatches

export default questionsFromBatches
