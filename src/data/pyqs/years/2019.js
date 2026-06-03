// ─────────────────────────────────────────────────────────────────────────────
// UPSC CSE Mains 2019 — General English
// ─────────────────────────────────────────────────────────────────────────────

/** @type {import('../schema.js').PYQQuestion[]} */
const questions2019 = [

  // ── GRAMMAR ──────────────────────────────────────────────────────────────

  {
    id: 'pyq-2019-g-001',
    year: 2019,
    exam: 'UPSC CSE',
    paper: 'Mains General English',
    section: 'grammar',
    questionType: 'fill-blank',
    questionText: "The politician's ___ behaviour during the session was widely condemned by the opposition.",
    passageText: null,
    options: ['decorous', 'recalcitrant', 'obsequious', 'exemplary'],
    correctAnswer: 1,
    modelAnswer: null,
    explanation: "'Recalcitrant' means stubbornly uncooperative or resistant to authority — behaviour that would be condemned.",
    trap: "'Decorous' and 'exemplary' mean well-behaved; 'obsequious' means excessively compliant.",
    topicTags: ['vocabulary-usage', 'word-in-context'],
    difficulty: 'hard',
    estimatedTime: 2,
    sourceStatus: 'sample-practice',
    sourceNote: 'UPSC-style practice question.',
    conceptTag: 'Vocabulary — recalcitrant, obsequious, decorous',
  },

  {
    id: 'pyq-2019-g-002',
    year: 2019,
    exam: 'UPSC CSE',
    paper: 'Mains General English',
    section: 'grammar',
    questionType: 'error-spotting',
    questionText: 'Find the error:\n\n"The government\'s new policy (A) / aims to provide (B) / affordable healthcare (C) / to each and every citizens. (D)"',
    passageText: null,
    options: ['A — The government\'s new policy', 'B — aims to provide', 'C — affordable healthcare', 'D — to each and every citizens'],
    correctAnswer: 3,
    modelAnswer: null,
    explanation: "'Each and every' is always followed by a singular noun. Correct: 'each and every citizen'.",
    trap: "'Each and every' takes a singular noun even though it refers to many.",
    topicTags: ['error-spotting', 'each-and-every', 'singular-noun'],
    difficulty: 'hard',
    estimatedTime: 2,
    sourceStatus: 'sample-practice',
    sourceNote: 'UPSC-style practice question.',
    conceptTag: 'Each and every — singular noun follows',
  },
]

export default questions2019
