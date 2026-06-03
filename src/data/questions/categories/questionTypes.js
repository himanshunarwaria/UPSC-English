// ─────────────────────────────────────────────────────────────────────────────
// Question Type Definitions — UPSC Grammar Practice Bank
//
// Each type defines: format, instructions, writing rules, and an example.
// All questions must use one of these exactly.
// ─────────────────────────────────────────────────────────────────────────────

export const QUESTION_TYPES = {

  'error-spotting': {
    label: 'Error Spotting',
    instruction: 'Each sentence has four underlined parts marked (A), (B), (C), (D). Identify the part that contains a grammatical error. If there is no error, choose (D) No error.',
    format: `
      The sentence is divided into exactly 4 labelled parts.
      Format:   "The committee (A) / has submitted (B) / their report (C) / on time. (D)"
      Option A: Part (A) — exact words of part A (with correction if A is wrong)
      Option B: Part (B) — ...
      Option C: Part (C) — ...
      Option D: No error
    `,
    writingRules: [
      'The sentence must be complete and formally written',
      'Exactly one part should contain the error (except "No error" questions)',
      'The error must be grammatical — not stylistic or a matter of opinion',
      'All four parts must be approximately equal in length',
      'Part labels (A)/(B)/(C)/(D) must be placed at natural phrase boundaries',
      'The "No error" option (D) should be included in 15–20% of questions',
      'Wrong options should be the PART LABEL, not a rewrite of the correct form',
    ],
    example: {
      question: 'The number of students (A) / who fail the examination (B) / are increasing (C) / every year. (D)',
      options: ['The number of students', 'who fail the examination', 'are increasing', 'No error'],
      correctAnswer: 2,
      explanation: '"The number of" takes a singular verb. "is increasing" is correct.',
      trap: 'The plural intervening clause "who fail the examination" misleads into choosing a plural verb.',
      conceptTag: 'The number of — singular verb',
    },
  },

  'sentence-correction': {
    label: 'Sentence Correction',
    instruction: 'Choose the sentence that is grammatically correct and idiomatically appropriate for formal writing.',
    format: `
      Four complete sentences that differ only in grammatical structure.
      Same vocabulary, different grammar.
    `,
    writingRules: [
      'All four options must use identical or near-identical vocabulary',
      'Only ONE sentence should be grammatically correct',
      'The other three must have real, distinct grammatical errors — not made-up ones',
      'Wrong options must represent errors that real aspirants actually make',
      'The correct sentence must be in formal register appropriate for government writing',
      'Avoid sentences where two options are "both acceptable" in different contexts',
    ],
    example: {
      question: 'Choose the grammatically correct sentence:',
      options: [
        'Neither the officer nor his subordinates was present at the meeting.',
        'Neither the officer nor his subordinates were present at the meeting.',
        'Neither the officer nor his subordinates are present at the meeting.',
        'Neither the officer nor his subordinates have been present at the meeting.',
      ],
      correctAnswer: 1,
      explanation: "With 'neither...nor', the verb agrees with the nearer subject. 'Subordinates' is plural, so 'were' is correct.",
      trap: "The presence of 'officer' (singular) as the first subject misleads aspirants into choosing 'was'.",
      conceptTag: 'Neither...nor proximity agreement',
    },
  },

  'fill-blank': {
    label: 'Fill in the Blank',
    instruction: 'Choose the word or phrase that best completes the sentence.',
    format: `
      Sentence with one blank marked as ___ or [blank].
      Four options to fill the blank.
    `,
    writingRules: [
      'The blank must have exactly ONE best answer — not "both A and C work"',
      'The sentence must be in formal/administrative register',
      'Wrong options must all be grammatically possible-looking — not obviously wrong',
      'Each wrong option must test a distinct, named grammar rule',
      'The blank should be at a point of genuine grammatical decision',
      'Avoid trivially easy blanks: "He ___ to school." (went/go/going/goes) — too obvious',
    ],
    example: {
      question: 'The minister, along with his secretaries, ___ arrived at the venue.',
      options: ['have', 'has', 'had have', 'were'],
      correctAnswer: 1,
      explanation: "'Along with' is a parenthetical phrase and does not change the number of the main subject 'minister'. Singular 'has' is correct.",
      trap: "'Along with his secretaries' makes the subject appear plural.",
      conceptTag: 'Along with — does not change subject number',
    },
  },

  'mcq': {
    label: 'MCQ (Context-based)',
    instruction: 'Choose the most appropriate option.',
    format: `
      A question stem followed by four options.
      Used for vocabulary, idiom selection, formal usage, and rule identification.
    `,
    writingRules: [
      'Options must all be plausible in isolation',
      'Correct option is definitively best in the given formal context',
      'For vocabulary questions: stem sentence must make the correct word clearly the best fit',
      'For rule identification: options must all represent real rules',
      'Avoid "none of the above" or "all of the above" options',
    ],
    example: {
      question: 'Which of the following sentences uses the subjunctive mood correctly?',
      options: [
        'If I was the Prime Minister, I would reform the tax system.',
        'If I were the Prime Minister, I would reform the tax system.',
        'If I am the Prime Minister, I will reform the tax system.',
        'If I had been the Prime Minister, I would reform the tax system.',
      ],
      correctAnswer: 1,
      explanation: "The subjunctive 'were' is required in hypothetical Type 2 conditionals. 'Was' is incorrect in formal written English.",
      trap: '"Was" sounds natural in speech and informal writing, making it the most common wrong choice.',
      conceptTag: 'Subjunctive mood — If I were',
    },
  },

  'voice-conversion': {
    label: 'Voice Conversion',
    instruction: 'Choose the correct transformation of the given sentence into the indicated voice.',
    format: `
      Active sentence given → choose correct passive transformation
      OR
      Passive sentence given → choose correct active transformation.
    `,
    writingRules: [
      'The original sentence must be clearly stated before the options',
      'All four options must be complete grammatical sentences',
      'Wrong options must have specific, nameable voice errors (wrong tense, wrong auxiliary, wrong agent placement)',
      'Include "by" phrase only when the agent is meaningful — omit when obvious or irrelevant',
      'Test tenses beyond simple present/past: perfect, continuous, modal',
    ],
    example: {
      question: 'Transform to passive: "The committee should have reviewed the proposal."',
      options: [
        'The proposal should be reviewed by the committee.',
        'The proposal should have been reviewed by the committee.',
        'The proposal should have reviewed by the committee.',
        'The proposal should had been reviewed by the committee.',
      ],
      correctAnswer: 1,
      explanation: "Modal perfect passive: should + have + been + past participle. The structure is 'should have been reviewed'.",
      trap: '"Should be reviewed" (A) loses the perfect aspect — it drops the past reference.',
      conceptTag: 'Modal perfect passive — should have been + p.p.',
    },
  },

  'speech-conversion': {
    label: 'Direct / Indirect Speech',
    instruction: 'Choose the correct indirect speech form of the given direct speech sentence.',
    format: `
      Direct speech sentence given → choose correct reported speech form.
      OR
      Reported speech → choose original direct speech (in reversal questions).
    `,
    writingRules: [
      'The direct speech sentence must be clearly quoted',
      'Wrong options must test specific, distinct reported speech rules',
      'Include pronoun change, tense backshift, and time/place adverb change as separate traps',
      'Use a variety of reporting verbs: said, told, stated, claimed, admitted, denied',
      'Test universal truths that do NOT undergo tense backshift',
    ],
    example: {
      question: 'Report the following statement: The minister said, "I will address the press tomorrow."',
      options: [
        'The minister said that he will address the press tomorrow.',
        'The minister said that he would address the press the next day.',
        'The minister told that he would address the press the next day.',
        'The minister said that he would address the press tomorrow.',
      ],
      correctAnswer: 1,
      explanation: "Future 'will' shifts to 'would' in reported speech. 'Tomorrow' shifts to 'the next day'. 'Said' does not require an indirect object.",
      trap: "Option D keeps 'tomorrow' unchanged. Option C wrongly uses 'told' without an indirect object.",
      conceptTag: 'Indirect speech — will → would, tomorrow → the next day',
    },
  },
}

export default QUESTION_TYPES
