// ─────────────────────────────────────────────────────────────────────────────
// Difficulty Criteria — UPSC Grammar Practice Bank
//
// Use these criteria to classify every question before adding it to a batch.
// When in doubt between two levels, always go harder.
// UPSC rewards correct answers, not safe ones.
// ─────────────────────────────────────────────────────────────────────────────

export const DIFFICULTY_CRITERIA = {

  // ── B1 (easy) — Foundation cleanup ─────────────────────────────────────────
  //
  // Target: 15% of bank (750 questions)
  // Audience: Aspirants who have clear gaps in basic grammar
  // Question type: Single-rule application, obvious error
  //
  easy: {
    cefr: 'B1',
    description: 'Foundation — tests ONE rule with a clear, single error',
    characteristics: [
      'One rule is tested; all other parts of the sentence are correct',
      'Error is not buried under multiple clauses',
      'Wrong options are clearly wrong once you know the rule',
      'Rule is fundamental: basic SVA, clear tense shift, obvious article error',
    ],
    goodExamples: [
      'Neither of the students have submitted their assignment. (each/every → singular)',
      'The team were playing well yesterday. (collective noun → context is unified)',
    ],
    badExamples: [
      '"A cat sat on a mat." — trivially simple, zero exam value',
      '"He go to school." — below B1 level, irrelevant to UPSC',
    ],
    trapNote: 'Trap is optional for B1. If included, it must be a genuine misconception, not a fabricated distraction.',
    typicalTopics: ['Subject-Verb Agreement (basic rules)', 'Simple tense errors', 'Obvious article omission'],
  },

  // ── B2 (medium) — Real exam level ──────────────────────────────────────────
  //
  // Target: 35% of bank (1750 questions)
  // Audience: Well-prepared aspirants — 80% should get this right after drilling
  //
  medium: {
    cefr: 'B2',
    description: 'Serious exam level — 2–3 rules interact; one trap present',
    characteristics: [
      'Error requires identifying the rule AND ruling out a plausible wrong option',
      'Intervening phrases, clause structure, or formal register adds complexity',
      'Sentence resembles actual government/academic writing style',
      'At least one distractor option should fool 30–40% of test-takers',
    ],
    goodExamples: [
      'The committee, along with its subcommittees, have submitted their report. (along with = singular)',
      'She denied to have known about the irregularities. (deny + gerund, not infinitive)',
    ],
    badExamples: [
      'Anything that a careful reader would get right on first pass without drilling',
    ],
    trapNote: 'Required. The trap is what makes this B2 rather than B1. Name the exact misconception.',
    typicalTopics: [
      'Correlative conjunctions with complex nouns',
      'Gerund/infinitive choice with tricky verbs',
      'Preposition collocations in formal sentences',
      'Sequence of tenses in subordinate clauses',
    ],
  },

  // ── C1 (hard) — UPSC trap level ────────────────────────────────────────────
  //
  // Target: 40% of bank (2000 questions)
  // Audience: Advanced aspirants — only 30–40% should get this right first try
  //
  hard: {
    cefr: 'C1',
    description: 'UPSC trap level — error is non-obvious; rule interaction is complex',
    characteristics: [
      'The sentence LOOKS correct. The error is subtle and easy to miss.',
      'Error requires knowing both the primary rule AND at least one exception',
      'Formal/administrative language context — aspirants must handle this register',
      'At least one distractor looks almost identical to the correct answer',
      'The "No error" option should be plausible (appears in error-spotting sets)',
    ],
    goodExamples: [
      '"The data clearly shows a declining trend." (data = plural in formal/academic)',
      '"Having submitted the report, the file was closed." (dangling participle)',
      '"If I was the minister, I would have acted differently." (subjunctive: "were")',
      '"The government have decided to implement..." vs "...has decided..." (BrE vs formal)',
    ],
    badExamples: [
      'Questions where you need specialist vocabulary to know the answer',
      'Cultural or regional content that has nothing to do with grammar',
    ],
    trapNote: 'Mandatory. Must state EXACTLY what makes the wrong option tempting. Be specific.',
    typicalTopics: [
      'Dangling modifiers in formal passages',
      'Subjunctive mood (were) in unreal conditionals',
      'Non-finite verb patterns with meaning shifts',
      'Formal pronoun usage (who/whom in subordinate clauses)',
      'Stative verbs in progressive form',
      'Articles with abstract nouns in formal writing',
      'The number of / A number of trap',
    ],
  },

  // ── C2 — Elite precision ────────────────────────────────────────────────────
  //
  // Target: 10% of bank (500 questions)
  // Audience: Top 1% aspirants / aspirants aiming for IAS rank 1–100
  //
  'C2-elite': {
    cefr: 'C2',
    difficulty: 'hard',
    description: 'C2 elite — error is invisible without expert-level grammar knowledge',
    characteristics: [
      'Even well-read aspirants debate whether the sentence has an error',
      'Tests edge-case interactions between 3+ grammar rules simultaneously',
      'Often involves formal Latin phrases, bureaucratic idioms, or archaic formal constructions',
      'Correct answer may go against a common "rule" that is actually a simplified school-level guideline',
      'The question is designed for aspirants who have ALREADY mastered C1 topics',
    ],
    goodExamples: [
      '"The police is on its way." vs "The police are on their way." — register and context dependency',
      '"It is I who is/am responsible." — formal pronoun after "It is" construction',
      '"The accused was acquitted of the charges." vs "...acquitted from..." — legal collocations',
    ],
    identificationNote: `
      To classify a question as C2: ask yourself, "Would a careful B2-level aspirant
      reasonably get this wrong even after studying for 6 months?" If yes, it's C2.
      Use the cefr: 'C2' field override in the question object alongside difficulty: 'hard'.
    `,
    trapNote: 'Mandatory. Must explain the rule AND the meta-reasoning behind it.',
  },
}

// ── Validation helper ─────────────────────────────────────────────────────────

/**
 * Check if a question's difficulty assignment is justified by the criteria.
 * Returns warnings (not errors) for human review.
 */
export function checkDifficultyJustification(q) {
  const warnings = []

  if (q.difficulty === 'hard' && !q.trap) {
    warnings.push('Hard question missing trap — C1/C2 questions must name the specific mislead')
  }

  if (q.difficulty === 'easy' && q.question.length > 150) {
    warnings.push('Long question at easy difficulty — verify this is genuinely B1 level')
  }

  if (q.difficulty === 'hard' && q.options) {
    const optionLengths = q.options.map(o => o.length)
    const maxLen = Math.max(...optionLengths)
    const minLen = Math.min(...optionLengths)
    if (maxLen - minLen > 30) {
      warnings.push('Hard question has very unequal option lengths — one option may be obviously wrong')
    }
  }

  return warnings
}

export default DIFFICULTY_CRITERIA
