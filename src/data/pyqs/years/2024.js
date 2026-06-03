// ─────────────────────────────────────────────────────────────────────────────
// UPSC CSE Mains 2024 — General English
//
// TO ADD REAL PYQs:
//   1. Copy a question object below
//   2. Replace all fields with real question data
//   3. Set sourceStatus: 'real-pyq'
//   4. Run: node src/data/pyqs/validate.js  to check for errors
// ─────────────────────────────────────────────────────────────────────────────

/** @type {import('../schema.js').PYQQuestion[]} */
const questions2024 = [

  // ── GRAMMAR ──────────────────────────────────────────────────────────────

  {
    id: 'pyq-2024-g-001',              // old ID preserved for localStorage compat
    year: 2024,
    exam: 'UPSC CSE',
    paper: 'Mains General English',
    section: 'grammar',
    questionType: 'error-spotting',
    questionText: 'Find the error:\n\n"The data collected (A) / by the research team (B) / clearly shows (C) / the declining trend. (D)"',
    passageText: null,
    options: ['A — The data collected', 'B — by the research team', 'C — clearly shows', 'D — No error'],
    correctAnswer: 2,
    modelAnswer: null,
    explanation: "'Data' is the plural of 'datum'. In formal/academic English, 'data' takes a plural verb: 'clearly show'.",
    trap: "In informal usage 'data' can be singular, but UPSC follows formal grammar.",
    topicTags: ['data-plural', 'subject-verb-agreement'],
    difficulty: 'hard',
    estimatedTime: 2,
    sourceStatus: 'sample-practice',
    sourceNote: 'UPSC-style practice question. Not a verified PYQ.',
    conceptTag: 'data — plural noun',
  },

  {
    id: 'pyq-2024-g-002',
    year: 2024,
    exam: 'UPSC CSE',
    paper: 'Mains General English',
    section: 'grammar',
    questionType: 'sentence-correction',
    questionText: 'Choose the grammatically correct sentence.',
    passageText: null,
    options: [
      'The report, along with its annexures, were submitted to the committee.',
      'The report, along with its annexures, was submitted to the committee.',
      'The report along with its annexures have been submitted to the committee.',
      'The report and its annexures was submitted to the committee.',
    ],
    correctAnswer: 1,
    modelAnswer: null,
    explanation: "'Along with' does not compound the subject. 'The report' is singular → 'was submitted'.",
    trap: "Only 'and' creates a compound subject. 'Along with', 'together with', 'as well as' do not.",
    topicTags: ['subject-verb-agreement', 'along-with'],
    difficulty: 'hard',
    estimatedTime: 2,
    sourceStatus: 'sample-practice',
    sourceNote: 'UPSC-style practice question. Not a verified PYQ.',
    conceptTag: 'Along with — does not compound subject',
  },

  // ── ESSAY (sample placeholder — replace with real PYQ when available) ─────

  {
    id: 'upsc-2024-essay-001',
    year: 2024,
    exam: 'UPSC CSE',
    paper: 'Mains General English',
    section: 'essay',
    questionType: 'essay-writing',
    questionText: 'Write an essay on any ONE of the following topics in approximately 600 words:\n\n(a) The role of civil services in building a New India\n(b) Technology as a tool for inclusive development\n(c) Urbanisation and its impact on Indian culture',
    passageText: null,
    options: null,
    correctAnswer: null,
    modelAnswer: null,
    explanation: 'A strong essay should have a clear thesis, logical structure, relevant examples from Indian governance and current affairs, and a conclusive paragraph. Aim for ~600 words.',
    trap: null,
    topicTags: ['essay', 'governance', 'current-affairs'],
    difficulty: 'hard',
    estimatedTime: 40,
    sourceStatus: 'sample-practice',
    sourceNote: 'Representative UPSC Mains essay topic. Not a verified PYQ.',
    conceptTag: null,
  },

  // ── PLACEHOLDERS (uncomment and fill when real PYQs are available) ────────

  // {
  //   id: 'upsc-2024-comprehension-001',
  //   year: 2024,
  //   exam: 'UPSC CSE',
  //   paper: 'Mains General English',
  //   section: 'comprehension',
  //   questionType: 'comprehension-long',
  //   questionText: 'Read the passage below and answer the questions that follow.',
  //   passageText: '[Paste the full passage text here]',
  //   options: null,
  //   correctAnswer: null,
  //   modelAnswer: null,
  //   explanation: '[Add key points / expected answers]',
  //   trap: null,
  //   topicTags: ['comprehension', 'reading'],
  //   difficulty: 'medium',
  //   estimatedTime: 15,
  //   sourceStatus: 'real-pyq',
  //   sourceNote: 'UPSC CSE Mains 2024, Paper — General English',
  //   conceptTag: null,
  // },
]

export default questions2024
