# UPSC Grammar Question Bank — 1,000 Questions

## Overview

This system manages the complete UPSC English grammar practice bank:
- **78 legacy questions** — original seed bank
- **1,000 new questions** — organized in 10 batches of 100 questions each
- **Total capacity**: ~1,100 questions

The system is designed for scalability without sacrificing code clarity.

## Folder structure

```
src/data/questions/
├── README.md                          ← You are here
├── questionSchema.js                  ← Canonical schema + validation rules
├── batchManifest.js                   ← Progress tracker (10 batches)
├── getQuestions.js                    ← Master API for screens
├── QUESTION_CREATION_GUIDE.md         ← Editorial guidelines
├── questionBankPlan.js                ← Original architecture plan
│
├── batches/                           ← Approved batches (100 Q each)
│   ├── index.js                       ← Master batch loader
│   ├── README.md
│   ├── batch_001_error_spotting.js    ← 100 questions
│   ├── batch_002_error_spotting.js
│   └── ... (up to batch_010)
│
├── categories/
│   ├── categoryMeta.js                ← Category metadata + UPSC relevance
│   ├── difficultyCriteria.js          ← B1/B2/C1/C2 definitions
│   └── questionTypes.js               ← Question type definitions (6 types)
│
└── generated/                         ← Staging area for new questions
    ├── pending_review/                ← Raw AI/manual drafts
    └── approved/                      ← Reviewed, ready to batch
```

## Data flow

```
AI/Manual generation
        ↓
generated/pending_review/{topic}_draft.js
        ↓
Review: validate + remove duplicates
        ↓
generated/approved/{topic}_approved.js
        ↓
Assemble 100 questions per batch
        ↓
batches/batch_{N}_{category}.js
        ↓
Import in batches/index.js
        ↓
Consumed by screens via getQuestions API
```

## 10 Batches @ 100 Questions Each = 1,000 Total

| Batch # | Category | File | Status |
|---------|----------|------|--------|
| 1–2 | Error Spotting | `batch_001_error_spotting.js`, `batch_002_error_spotting.js` | pending |
| 3–4 | Sentence Correction | `batch_003_sentence_correction.js`, `batch_004_sentence_correction.js` | pending |
| 5 | Subject-Verb Agreement | `batch_005_subject_verb_agreement.js` | pending |
| 6 | Tenses & Sequence | `batch_006_tenses.js` | pending |
| 7 | Prepositions | `batch_007_prepositions.js` | pending |
| 8 | Voice & Narration | `batch_008_voice_narration.js` | pending |
| 9 | Articles & Determiners | `batch_009_articles_determiners.js` | pending |
| 10 | Mixed Advanced Grammar | `batch_010_mixed_advanced_grammar.js` | pending |

Each batch follows the canonical schema (see `questionSchema.js`).

## How to use: getQuestions API

Instead of importing scattered question sources, all screens now use one unified API.

### Before (old way)
```js
import grammarQuestions from '../grammarQuestions.js'

const errorSpottings = grammarQuestions.filter(q => q.topic === 'Error Spotting')
```

### After (new way)
```js
import { getQuestionsByCategory, getRandomDrill } from '../questions/getQuestions.js'

const errorSpottings = getQuestionsByCategory('Error Spotting')
const drill = getRandomDrill({ category: 'Tenses', count: 20, difficulty: 'C1' })
```

## API Reference

### `getAllQuestions()`
Returns all questions (legacy + batches combined).

```js
const allQ = getAllQuestions()  // ~5,100 questions
```

### `getQuestionsByCategory(category)`
Filter by category (16 allowed values).

```js
const qs = getQuestionsByCategory('Tenses')
```

### `getQuestionsByDifficulty(difficulty)`
Filter by CEFR level: B1 | B2 | C1 | C2.

```js
const advanced = getQuestionsByDifficulty('C1')
```

### `getQuestionsByTopic(topic)` *(legacy)*
Filter by old `topic` field (backward compat with grammarQuestions.js).

```js
const svAs = getQuestionsByTopic('Subject-Verb Agreement')
```

### `getRandomDrill(options)`
Shuffled subset with optional filters.

```js
// 20 random Error Spotting questions
const drill = getRandomDrill({ category: 'Error Spotting', count: 20 })

// 15 C2-level questions from any category
const elite = getRandomDrill({ difficulty: 'C2', count: 15 })

// Random mix (no filters)
const mix = getRandomDrill({ count: 10 })
```

### `getWeaknessDrill(options)`
Bias toward weak topics (60% weak, 40% other).

```js
const topicsToFix = ['Modifiers', 'Dangling Participles']
const drill = getWeaknessDrill({ weakTopics: topicsToFix, count: 30 })
```

### `getRevisionDrill(options)`
Retrieve specific questions by ID for revision.

```js
const wrongIds = ['es_001_0015', 'sva_002_0044', 'ten_001_0088']
const revise = getRevisionDrill({ questionIds: wrongIds })

// Limit to first 5
const limited = getRevisionDrill({ questionIds: wrongIds, count: 5 })
```

### `getBankStats()`
Overview of entire question bank.

```js
const stats = getBankStats()
// {
//   totalQuestions: 5100,
//   byCategory: { 'Error Spotting': 900, 'Tenses': 500, ... },
//   byDifficulty: { B1: 765, B2: 1785, C1: 2100, C2: 450 },
//   byType: { 'error-spotting': 900, 'fill-blank': 1200, ... }
// }
```

## How to add a batch

1. **Generate 100 questions** following QUESTION_CREATION_GUIDE.md
2. **Save to** `generated/pending_review/` with meaningful name
3. **Validate** using npm script:
   ```
   npm run validate:questions
   ```
4. **Fix errors** (if any) — goal is zero ERRORs, aim for quality score ≥ 7
5. **Move approved** to `generated/approved/`
6. **Assemble into batch** of 100 questions
7. **Create file**: `batches/batch_{N}_{category}.js`
8. **Add import** to `batches/index.js`:
   ```js
   import batch_001 from './batch_001_error_spotting.js'
   // ... then spread into allBatches array
   ```
9. **Update manifest**: `batchManifest.js` mark batch status as 'approved'
10. **Validate** final bank:
    ```
    npm run validate:questions
    ```
    Should see count increase and no new errors.

## How screens consume questions

**Example: Update Grammar.jsx**

**Old:**
```js
import grammarQuestions from '../data/grammarQuestions.js'

export default function Grammar() {
  const topicStats = ...
  const topics = GRAMMAR_CATEGORIES.map(cat => ({
    label: cat.label,
    attempted: grammarQuestions.filter(q => q.topic === cat.label).length,
  }))
}
```

**New:**
```js
import { getQuestionsByTopic } from '../data/questions/getQuestions.js'

export default function Grammar() {
  const topicStats = ...
  const topics = GRAMMAR_CATEGORIES.map(cat => ({
    label: cat.label,
    attempted: getQuestionsByTopic(cat.label).length,
  }))
}
```

All screens should update similarly.

## Quality control

Every question must pass:

```
npm run validate:questions
```

Validation checks:
- ✓ Unique IDs (no duplicates across 1,000 questions)
- ✓ All required fields present
- ✓ No fake PYQ claims
- ✓ No school-level content
- ✓ No "Option X is correct" explanations (must state the rule)
- ✓ Quality score ≥ 7 (trap, explanation, rule specificity, non-obviousness)
- ✓ Difficulty distribution: B1 15%, B2 35%, C1 40%, C2 10%

Exit code 0 = safe to publish. Exit code 1 = fix errors before merging.

## Current progress

Track progress in `batchManifest.js`:

```js
const progress = getBatchProgress()
// {
//   totalBatches: 10,
//   pendingBatches: 10,
//   draftBatches: 0,
//   approvedBatches: 0,
//   totalQuestionsGenerated: 0,
//   totalQuestionsPlanned: 1000
// }
```

## Next steps

1. ✅ Architecture created
2. ✅ Validator implemented
3. ✅ getQuestions API ready
4. 🔲 Generate batch_001_error_spotting.js (100 questions)
5. 🔲 Validate + approve batch 1
6. 🔲 Update all 7 screens to use getQuestions API
7. 🔲 Continue remaining 9 batches

## Notes

- **Batch size**: 100 per file
- **Total batches**: 10 (controlled, production-ready scope)
- **Legacy compat**: grammarQuestions.js stays untouched; getQuestions auto-merges
- **Performance**: All in-memory (no lazy loading needed at 1000Q)
- **Build time**: Fast — questions are data, not code
