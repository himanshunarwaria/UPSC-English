// ─────────────────────────────────────────────────────────────────────────────
// PYQ Validation Script
//
// Run from the project root:
//   node src/data/pyqs/validate.js
//
// Validates every question in the bank against the schema and prints a report.
// Exit code 1 if any question is invalid (useful in CI / pre-commit hooks).
// ─────────────────────────────────────────────────────────────────────────────

import { allPYQs, availableYears, getPYQStats } from './index.js'
import { validateAll } from './schema.js'

const { valid, invalid, errors } = validateAll(allPYQs)
const stats = getPYQStats()

console.log('\n─── UPSC PYQ Bank Validation ───────────────────────────────\n')
console.log(`  Years:        ${availableYears.join(', ')}`)
console.log(`  Total:        ${stats.total} questions`)
console.log(`  Real PYQs:    ${stats.realCount}`)
console.log(`  Sample:       ${stats.sampleCount}`)
console.log(`  Objective:    ${stats.objectiveCount}`)
console.log(`  Subjective:   ${stats.subjectiveCount}`)
console.log('')
console.log(`  ✓ Valid:      ${valid}`)
console.log(`  ✗ Invalid:    ${invalid}`)

// Check for duplicate IDs
const ids = allPYQs.map(q => q.id)
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i)
if (dupes.length > 0) {
  console.log(`\n  ⚠ Duplicate IDs: ${[...new Set(dupes)].join(', ')}`)
}

if (errors.length > 0) {
  console.log('\n─── Errors ─────────────────────────────────────────────────\n')
  errors.forEach(e => console.log(e + '\n'))
}

console.log('────────────────────────────────────────────────────────────\n')

if (invalid > 0 || dupes.length > 0) {
  process.exit(1)
}
