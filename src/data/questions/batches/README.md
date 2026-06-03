# Batch Files

Each file in this folder is an approved batch of 50 grammar questions.

## Naming convention

```
{category_code}_b{batch_number:03d}.js
```

Examples:
```
es_b001.js   — Error Spotting, Batch 1 (questions es_001_0001 – es_001_0050)
es_b002.js   — Error Spotting, Batch 2 (questions es_002_0051 – es_002_0100)
sva_b001.js  — Subject-Verb Agreement, Batch 1
mix_b001.js  — Mixed UPSC-style, Batch 1
```

## File template

```js
// Error Spotting — Batch 001
// Questions: es_001_0001 to es_001_0050
// Difficulty mix: ~7 easy, ~18 medium, ~22 hard, ~3 C2
// Reviewed by: [name or AI session date]
// Status: approved

/** @type {import('../schema.js').GrammarQuestion[]} */
const batch = [
  {
    id: 'es_001_0001',
    source: 'UPSC-style Practice',
    section: 'Grammar',
    topic: 'Error Spotting',
    type: 'error-spotting',
    difficulty: 'medium',
    question: 'The number of road accidents (A) / on national highways (B) / have been increasing (C) / steadily. (D)',
    options: [
      'The number of road accidents',
      'on national highways',
      'have been increasing',
      'No error',
    ],
    correctAnswer: 2,
    explanation: "'The number of' is a fixed singular expression. The verb must be 'has been increasing', not 'have been increasing'.",
    trap: "The plural phrase 'road accidents' creates a false agreement signal for 'have'.",
    conceptTag: 'The number of — singular verb',
  },
  // ... 49 more questions
]

export default batch
```

## Status lifecycle

1. `generated/pending_review/` — raw AI or manual draft
2. `generated/approved/` — reviewed, errors fixed
3. `batches/` — final approved batch, imported in `index.js`

## Quality gate before moving to batches/

- [ ] All 50 questions pass `validateBatch()` with zero errors
- [ ] No duplicate question stems (run `findLikelyDuplicates()`)
- [ ] Difficulty distribution matches plan: ~15% easy, ~35% medium, ~40% hard, ~10% C2
- [ ] All hard questions have a `trap` field
- [ ] All conceptTags are specific (not just the topic name)
- [ ] Sentences are in formal/academic register
- [ ] No school-level or trivially obvious questions
- [ ] Question is added to `index.js`
