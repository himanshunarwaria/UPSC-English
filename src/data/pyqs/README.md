# UPSC English PYQ Data System

A scalable, year-wise, section-wise data structure for UPSC CSE English questions.

## Folder structure

```
src/data/pyqs/
├── schema.js          # Schema, enums, validation, and templates (the contract)
├── index.js           # Aggregator + query API (queryPYQs, getPYQStats, …)
├── validate.js        # Runnable validation script
├── README.md          # This file
└── years/
    ├── 2024.js        # All 2024 questions (any section)
    ├── 2023.js
    ├── 2022.js
    ├── 2021.js
    ├── 2020.js
    └── 2019.js
```

Questions are organised **by year** (one file per year). Within a file they are
grouped **by section** with comment headers. The app slices the data
**by section, topic, type, difficulty, and source** at query time — so you only
ever maintain the year files.

## The six sections

| Section         | `section` value   | Typical question types                          |
|-----------------|-------------------|-------------------------------------------------|
| Grammar         | `grammar`         | error-spotting, sentence-correction, fill-blank, voice/speech-conversion |
| Comprehension   | `comprehension`   | comprehension-mcq, comprehension-long           |
| Précis          | `precis`          | precis-writing                                  |
| Essay           | `essay`           | essay-writing                                   |
| Translation     | `translation`     | translation-passage                             |
| Vocabulary      | `vocabulary`      | vocabulary-mcq, vocabulary-usage                |

See `schema.js` for the full list of `questionType` values and which are
objective (auto-graded) vs subjective (model-answer based).

## Adding REAL previous-year questions

> ⚠️ **Never label a question `real-pyq` unless you have verified it against an
> official UPSC paper.** When in doubt, use `sample-practice`.

1. Open the relevant year file in `years/` (create it if the year is missing).
2. Copy a template — in code you can use the helpers:
   ```js
   import { newObjectiveTemplate, newSubjectiveTemplate } from '../schema.js'
   ```
   …or just copy an existing question object and edit it.
3. Fill in every field. ID format: `upsc-{year}-{section}-{NNN}` (3-digit index).
4. Set `sourceStatus: 'real-pyq'` and add a `sourceNote` citing the paper.
5. Validate:
   ```bash
   node src/data/pyqs/validate.js
   ```

### Adding a new year

1. Create `years/<year>.js` (copy an existing file as a starting point).
2. Register it in `index.js`:
   ```js
   import questions2025 from './years/2025.js'
   const YEAR_MODULES = [ questions2025, questions2024, /* … */ ]
   ```
   The year then appears automatically in every filter and screen.

## Question schema (summary)

Every question MUST have these fields (see `schema.js` for full JSDoc):

| Field           | Type                          | Notes                                  |
|-----------------|-------------------------------|----------------------------------------|
| `id`            | string                        | Unique. `upsc-{year}-{section}-{NNN}`  |
| `year`          | number                        | e.g. 2024                              |
| `exam`          | string                        | `'UPSC CSE'`                           |
| `paper`         | string                        | `'Mains General English'`              |
| `section`       | enum                          | one of the six sections                |
| `questionType`  | enum                          | see QUESTION_TYPES                      |
| `questionText`  | string                        | the question itself                    |
| `passageText`   | string \| null                | for comprehension/précis/translation   |
| `options`       | string[4] \| null             | objective only                         |
| `correctAnswer` | number(0–3) \| null           | objective only                         |
| `modelAnswer`   | string \| null                | subjective only                        |
| `explanation`   | string                        | concise; required                      |
| `trap`          | string \| null                | common mistake                         |
| `topicTags`     | string[]                      | kebab-case, non-empty                  |
| `difficulty`    | `easy`\|`medium`\|`hard`      |                                        |
| `estimatedTime` | number                        | minutes                                |
| `sourceStatus`  | `real-pyq`\|`sample-practice` | **be honest**                          |
| `sourceNote`    | string \| null                | citation/context                       |
| `conceptTag`    | string \| null                | short label for UI                     |

## Querying from the app

```js
import { queryPYQs, getPYQStats } from '@/data/pyqs'

// Real PYQs only, 2023, grammar, hard:
const qs = queryPYQs(
  { sourceStatus: 'real-pyq', year: 2023, section: 'grammar', difficulty: 'hard' },
  { attempted, bookmarks }   // pass progress data for attempted/wrong/bookmarked filters
)

const stats = getPYQStats(qs, { attempted })
```

Supported filters: `sourceStatus`, `year`, `section`, `topic`, `difficulty`,
`format` (objective/subjective), and `progress`
(attempted/unattempted/wrong/bookmarked).
