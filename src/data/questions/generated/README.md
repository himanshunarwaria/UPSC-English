# Generated Questions — Staging Area

This folder holds questions before they are approved for the main bank.

## Folders

```
generated/
├── pending_review/   — Draft questions waiting for human review
└── approved/         — Questions reviewed and cleared for batch assembly
```

## Workflow

```
[Generate questions]
        ↓
generated/pending_review/{topic}_draft_{date}.js
        ↓
[Review: validate, fix errors, remove duplicates]
        ↓
generated/approved/{topic}_approved_{date}.js
        ↓
[Assemble into batch of 50]
        ↓
batches/{code}_b{number}.js
        ↓
[Add import to index.js]
```

## Pending review checklist

Before moving from `pending_review/` to `approved/`, verify:

- [ ] Run `validateBatch(questions, filename)` — zero errors
- [ ] Run `findLikelyDuplicates(questions)` — no duplicates against existing batches
- [ ] Every `hard` question has a `trap` field
- [ ] No `conceptTag` is just a topic name ("Error Spotting", "Tenses" etc.)
- [ ] All sentences are in formal written English
- [ ] Question stems do not contain spelling or grammar errors themselves
- [ ] Options are all plausible — no obviously wrong distractors
- [ ] Correct answer has been double-verified against the rule
- [ ] Explanation names the rule clearly in ≤ 2 sentences
- [ ] No question is about trivial errors a school student would spot

## Generation guidelines

When generating questions for this bank, follow these prompts precisely:

1. Always specify the target CEFR level (B1/B2/C1/C2)
2. Always specify the exact sub-rule from categoryMeta.js
3. Always generate in batches of 10–20 per session
4. Always ask: "Would a well-read aspirant who has studied 6 months get this wrong?"
5. Prefer sentences from administrative, academic, and governance contexts
6. Never use sentences from school textbooks
7. Never use simple "correct/incorrect" patterns where the error is obvious

## Sample generation prompt (for AI-assisted generation)

```
Generate 20 UPSC-style error-spotting questions for the topic:
"Dangling participial phrases"

Rules:
- Each sentence must be in formal administrative/academic register
- Each sentence has 4 labelled parts (A)(B)(C)(D)
- Error appears in exactly one part (with 15% no-error sentences)
- Difficulty: C1 (aspirants should need to think carefully)
- Trap: name the specific mislead in a separate field
- ConceptTag: use a specific sub-rule name
- Format: follow the schema in ../schema.js exactly
- IDs: use placeholder format es_BATCH_SEQ (fill in batch number when assembling)
- Do NOT generate questions where the error is immediately obvious
- Do NOT reuse sentence structures from the existing grammarQuestions.js
```
