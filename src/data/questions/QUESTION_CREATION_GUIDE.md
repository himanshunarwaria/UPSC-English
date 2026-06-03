# UPSC Grammar Practice Bank — Question Creation Guide

**Version**: 1.0  
**Philosophy**: Do not waste even one second of a UPSC aspirant.  
Every question must test a real exam-pattern weakness.

---

## 1. What Makes a Question UPSC-Level

UPSC grammar questions are not tests of knowledge. They are tests of **precision under trap conditions**.

A UPSC-level question has three properties:

### 1.1 The sentence looks correct to a careless reader
The error must be invisible on a casual first read. If an aspirant can spot the mistake in 5 seconds, the question belongs in a school workbook, not this bank.

> ❌ BAD: "He don't know the answer." — Too obvious.  
> ✅ GOOD: "The committee, along with its subcommittees, have submitted their report." — Error invisible until you know the "along with" rule.

### 1.2 The wrong option is specifically designed to trap
Every distractor must represent a real, documented error that aspirants make in practice. Distractors are not random wrong answers — they are **predictable failure modes**.

> ❌ BAD: Options A/B/C are nonsensical — obviously wrong.  
> ✅ GOOD: The wrong option is grammatically plausible and triggers a known misconception.

### 1.3 The explanation teaches — not just confirms
The explanation must state the **rule name**, then show why this sentence applies it. Merely confirming the correct answer ("Option B is right") is not an explanation.

> ❌ BAD: "Option C is correct because 'has been' is the right form."  
> ✅ GOOD: "'The number of' is a fixed singular noun phrase. It always takes a singular verb regardless of the plural noun that follows."

---

## 2. What to Avoid (Zero-Tolerance Rules)

### 2.1 School-level errors
Do not test errors that a Class 8 student would catch. These waste aspirant time and destroy the bank's reputation.

❌ Never write:
- "He go to school" type errors
- Missing basic articles: "He is doctor"
- Wrong tense in simple sentences: "Yesterday I am going"
- Missing capital letters, punctuation errors

### 2.2 Artificial sentences
Sentences must sound like they come from a government circular, academic paper, policy report, or news article. They must never sound like they were composed only to contain a grammar error.

❌ Artificial:  "The water is wet and the sky have fallen."  
✅ Natural:     "The committee's recommendations, submitted along with the annexures, have been placed before the Board for consideration."

### 2.3 Ambiguous questions
Every question must have exactly ONE correct answer. If two options are grammatically acceptable in different registers or dialects, rewrite the question.

### 2.4 Duplicate patterns
Do not create questions that test the exact same rule in the exact same format. The bank has 1,000 questions — multiple questions all testing "The number of / A number of" with identical sentence structures is padding, not practice.

**Allowed:** Multiple questions on the same rule IF the context, trap, or structural complexity is meaningfully different.

### 2.5 Culture-specific traps
Do not use names, places, or events that are meaningless outside India. Use names like "the minister", "the authority", "the district collector" — not specific real names.

### 2.6 Ambiguous "No error" usage
"No error" is valid in approximately 15–20% of error-spotting questions. But the "No error" sentence must be genuinely error-free in formal written English — not just free from the ONE common error you were thinking of.

---

## 3. How to Write Concise Explanations

**Rule:** Maximum 2–3 sentences. State the rule, then apply it.

### Format:
```
[Rule name]. [Why this sentence triggers it]. [Optional: contrast with the wrong pattern.]
```

### Examples:

❌ Too long:
"The sentence 'The committee have submitted their report' is incorrect because in English grammar, the subject 'committee' is a collective noun. Collective nouns in formal British and American English can take either singular or plural verbs depending on whether the noun is thought of as a single unit or as a collection of individuals. In this sentence, since the committee is acting as a unified entity, the singular verb 'has' is preferred in formal written English. Therefore option B, 'have submitted', is the error."

✅ Correct:
"Collective nouns acting as a unified entity take singular verbs in formal writing. 'Has submitted' is correct since the committee acts as one body."

### One more:

❌ Repetitive:
"'Stop doing' means to cease an activity that is in progress. 'Stop to do' means to pause one action in order to begin another. Therefore, 'He stopped smoking' means he gave up smoking, while 'He stopped to smoke' means he stopped (some other activity) so that he could smoke. Since the question asks for the meaning of 'ceasing an activity', the correct answer is 'stop doing'."

✅ Correct:
"'Stop + gerund' means cease an activity ('stopped smoking' = quit). 'Stop + infinitive' means pause to do something else ('stopped to smoke' = paused to light a cigarette). The required meaning is cessation, so 'smoking' is correct."

---

## 4. How to Write Trap Notes

The `trap` field is the most important field for C1/C2 questions. It must identify the **specific cognitive shortcut** that leads to the wrong answer.

### Formula:
```
[What the wrong-answer-chooser believes] → [Why that belief leads to wrong answer]
```

### Examples:

❌ Vague:
"Aspirants may confuse the two options."

✅ Specific:
"'Along with its subcommittees' creates a visually plural subject, misleading aspirants into choosing the plural verb 'have'."

❌ Circular:
"The trap is that people don't know this rule."

✅ Specific:
"Most aspirants apply the spoken-English intuition 'If I was...' (natural in informal speech) without switching to the formal subjunctive 'If I were...' required in written UPSC-level English."

---

## 5. How to Classify Difficulty

### Quick test for each level:

| Level | Question to ask yourself |
|-------|--------------------------|
| **B1 / easy** | Would a student who has read one grammar book for 2 weeks get this right? Yes → B1 |
| **B2 / medium** | Would a careful aspirant get this wrong once, then understand after seeing the explanation? Yes → B2 |
| **C1 / hard** | Would a well-prepared aspirant who has drilled 300 questions still debate this? Yes → C1 |
| **C2** | Would even an English teacher hesitate? Yes → C2. Add `cefr: 'C2'` to the question. |

### Never artificially inflate difficulty
A question is not C1 just because the sentence is long. Length ≠ difficulty.  
A question is C1 because the error is non-obvious AND the wrong option is genuinely tempting.

---

## 6. How to Tag Topics

The `topic` field must match one of the 16 valid topic values exactly (see `schema.js`).

The `conceptTag` field must be:
- **Specific**: names the exact rule being tested
- **Not a topic name**: "Subject-Verb Agreement" as a conceptTag is too broad
- **Useful for study**: a student should be able to look up this rule by name

### Examples:

| topic | ❌ Too broad | ✅ Specific conceptTag |
|-------|-------------|----------------------|
| Subject-Verb Agreement | "SVA rule" | "Neither...nor proximity rule" |
| Subject-Verb Agreement | "Subject agreement" | "Along with — does not change subject number" |
| Tenses | "Past tense" | "Present perfect vs simple past with 'ago'" |
| Articles | "Article usage" | "An before spoken vowel sounds in acronyms" |
| Conditionals | "If clause" | "Subjunctive mood — If I were (Type 2)" |
| Non-finite Verbs | "Verb forms" | "Stop + gerund (cessation) vs stop + infinitive (pause)" |

---

## 7. How to Prevent Duplicates

### Rule 1: Same rule, different sentence
You MAY test the same conceptTag multiple times, but:
- The sentence structure must be different
- The trap must be slightly different
- The formal context must be different

### Rule 2: Same sentence type, different difficulty
You MAY test "Neither...nor" at B2 (basic form) AND at C1 (with interrupting clause). These are not duplicates.

### Rule 3: Stem check
Before adding a question, run `findLikelyDuplicates()` from `schema.js`. Any match of the first 60 normalised characters is flagged for manual review.

### Rule 4: Batch-level uniqueness
Within a single batch of 50 questions, no two questions should test the exact same conceptTag. Spread the sub-rules.

---

## 8. How to Ensure Exam Value

Every question must pass this checklist before being added to the bank:

| Check | Standard |
|-------|----------|
| **Exam context** | Sentence belongs in a government circular, academic report, or formal editorial |
| **Rule precision** | Tests a named, documented grammar rule — not a stylistic preference |
| **Trap quality** | Wrong option represents a real, predictable error — not a random wrong answer |
| **Explanation quality** | States the rule in ≤ 2 sentences — not a paraphrase of "option B is correct" |
| **Uniqueness** | Does not duplicate a question already in any approved batch |
| **Register** | Sentence sounds natural in formal written Indian/British English |
| **Difficulty honesty** | The assigned difficulty level is genuinely accurate |
| **Aspirant time ROI** | If a student gets this right 3 times in a row, have they truly mastered something useful for UPSC? If no → replace it |

---

## 9. UPSC-Specific Patterns to Prioritise

These patterns appear repeatedly in UPSC CSE Mains, IFoS, and SSC CGL papers.  
Questions testing these patterns have the highest exam-return value.

### Tier 1 — Appears in almost every UPSC paper
1. Dangling participial phrases
2. "Neither...nor / Either...or" with unequal-number subjects
3. "The number of" vs "a number of"
4. Tense in conditional clauses (subjunctive "were")
5. "Along with / together with / as well as" do not change verb number
6. Stative verbs in progressive form ("is knowing", "was belonging")
7. "Said to" vs "told" in reported speech
8. Gerund vs infinitive after: stop, remember, forget, try, mean, regret

### Tier 2 — Appears regularly
9. Articles with acronyms (an IAS, a UPSC, an MP, a BJP spokesperson)
10. "Due to" (attributive) vs "owing to" (adverbial)
11. "Affect" vs "effect" in formal writing contexts
12. Collective nouns with unified vs divided meaning
13. "Who" vs "whom" in formal subordinate clauses
14. Pronoun reference in long sentences
15. "Each / Every / None / Everyone" — always singular

### Tier 3 — High-value precision
16. Inverted conditionals: "Had she known... / Were I to..."
17. "It is I / It is he" in formal constructions
18. "Data" as plural in academic/formal contexts
19. Redundant expressions: "return back", "advance warning", "future plans"
20. Formal reporting verbs: stated, asserted, alleged, claimed — connotation differences

---

## 10. Sample Question — Full Example at Each Level

### B1 (easy)
```js
{
  id: 'sva_001_0001',
  source: 'UPSC-style Practice',
  section: 'Grammar',
  topic: 'Subject-Verb Agreement',
  type: 'fill-blank',
  difficulty: 'easy',
  question: 'Each of the employees ___ required to submit a declaration form.',
  options: ['are', 'is', 'were', 'have been'],
  correctAnswer: 1,
  explanation: "'Each' is always singular and takes a singular verb. 'Is required' is correct.",
  trap: null,
  conceptTag: 'Each — always singular',
}
```

### B2 (medium)
```js
{
  id: 'sva_001_0005',
  source: 'UPSC-style Practice',
  section: 'Grammar',
  topic: 'Subject-Verb Agreement',
  type: 'fill-blank',
  difficulty: 'medium',
  question: 'The minister, along with his senior advisers, ___ expected to address the press briefing.',
  options: ['are', 'is', 'were', 'have been'],
  correctAnswer: 1,
  explanation: "'Along with' introduces a parenthetical phrase that does not change the subject. 'The minister' is singular, so 'is' is correct.",
  trap: "'Along with his senior advisers' creates a visually plural construction, leading aspirants to choose 'are'.",
  conceptTag: 'Along with — parenthetical, does not change verb number',
}
```

### C1 (hard)
```js
{
  id: 'es_001_0031',
  source: 'UPSC-style Practice',
  section: 'Grammar',
  topic: 'Error Spotting',
  type: 'error-spotting',
  difficulty: 'hard',
  question: 'The data submitted (A) / by the research division (B) / clearly shows (C) / a declining trend. (D)',
  options: [
    'The data submitted',
    'by the research division',
    'clearly shows',
    'No error',
  ],
  correctAnswer: 2,
  explanation: "In formal and academic writing, 'data' is the plural of 'datum' and takes a plural verb. 'Clearly show' is correct.",
  trap: "In everyday speech, 'data' is treated as singular ('the data shows'). UPSC follows the formal convention where 'data' is plural.",
  conceptTag: 'Data — plural noun in formal/academic register',
}
```

### C2 (elite)
```js
{
  id: 'sc_001_0048',
  source: 'UPSC-style Practice',
  section: 'Grammar',
  topic: 'Sentence Correction',
  type: 'sentence-correction',
  difficulty: 'hard',
  cefr: 'C2',
  question: 'Choose the grammatically correct formal sentence:',
  options: [
    'It is me who is responsible for the oversight.',
    'It is I who am responsible for the oversight.',
    'It is I who is responsible for the oversight.',
    'It is me who am responsible for the oversight.',
  ],
  correctAnswer: 1,
  explanation: "After 'It is', formal grammar requires the nominative 'I' (not 'me'). The relative clause verb agrees with its antecedent 'I' — hence 'who am', not 'who is'.",
  trap: "'It is me' is universally accepted in speech and is even defended by prescriptivists. However, 'It is I who am' is the standard for formal written English in Indian government examinations. Option C ('It is I who is') uses the correct nominative but wrong verb agreement in the clause.",
  conceptTag: 'Nominative pronoun after "It is" — formal construction',
}
```

---

## 11. Quick Reference — Common Traps by Category

| Category | Classic UPSC Trap |
|----------|------------------|
| Error Spotting | "No error" when sentence is actually correct — tests aspirant confidence |
| SVA | "Along with / as well as / together with" do not make subject plural |
| Tenses | Stative verbs (know, believe, own, consist) in progressive form |
| Articles | "An" before SPOKEN vowel sounds: an MLA, an NGO, an IPS officer |
| Prepositions | "Married to" (not "married with"); "die of" (not "die from") |
| Voice | Modal perfect passive: "should have been done" (not "should be done") |
| Speech | Universal truths don't backshift: "She said the sun rises in the east." |
| Modifiers | Dangling participle with passive main clause |
| Conditionals | If I were (not "was") in hypothetical Type 2 |
| Non-finite | "Stop smoking" (quit) ≠ "stop to smoke" (pause to smoke) |

---

*This guide is a living document. Update it with new trap patterns as they emerge from practice sessions.*
