// ─────────────────────────────────────────────────────────────────────────────
// UPSC CSE Mains 2020 — General English
// ─────────────────────────────────────────────────────────────────────────────

/** @type {import('../schema.js').PYQQuestion[]} */
const questions2020 = [

  // ── GRAMMAR ──────────────────────────────────────────────────────────────

  {
    id: 'pyq-2020-g-001',
    year: 2020,
    exam: 'UPSC CSE',
    paper: 'Mains General English',
    section: 'grammar',
    questionType: 'speech-conversion',
    questionText: 'Convert: The officer said, "I will submit the report by Friday."',
    passageText: null,
    options: [
      'The officer said that he would submit the report by Friday.',
      'The officer said that he will submit the report by Friday.',
      'The officer told that he would submit the report by Friday.',
      'The officer said that he would submit the report by the following Friday.',
    ],
    correctAnswer: 3,
    modelAnswer: null,
    explanation: "In indirect speech: 'will' → 'would', and 'by Friday' becomes 'by the following Friday' for temporal precision.",
    trap: "'By Friday' is relative to the time of speaking; reported speech needs 'the following' to preserve meaning.",
    topicTags: ['direct-indirect-speech', 'reported-speech', 'time-expressions'],
    difficulty: 'hard',
    estimatedTime: 2,
    sourceStatus: 'sample-practice',
    sourceNote: 'UPSC-style practice question.',
    conceptTag: 'Reported speech — time expression conversion',
  },

  {
    id: 'pyq-2020-g-002',
    year: 2020,
    exam: 'UPSC CSE',
    paper: 'Mains General English',
    section: 'grammar',
    questionType: 'sentence-correction',
    questionText: 'Correct: "The examination tests a student\'s ability to read critically, to write coherently, and expressing ideas logically."',
    passageText: null,
    options: [
      'The examination tests a student\'s ability to read critically, to write coherently, and to express ideas logically.',
      'The examination tests a student\'s ability to read critically, write coherently, and expressing ideas logically.',
      'The examination tests a student\'s ability to read critically, write coherently, and logical expression of ideas.',
      'No correction required.',
    ],
    correctAnswer: 0,
    modelAnswer: null,
    explanation: "After 'ability to', the series must use parallel infinitives: 'to read, to write, and to express'. Mixing '-ing' breaks parallelism.",
    trap: "When a series follows 'ability to', every item must use the infinitive form.",
    topicTags: ['parallelism', 'infinitive-series'],
    difficulty: 'hard',
    estimatedTime: 2,
    sourceStatus: 'sample-practice',
    sourceNote: 'UPSC-style practice question.',
    conceptTag: 'Parallelism — infinitive series after ability to',
  },

  // ── VOCABULARY (sample placeholder) ──────────────────────────────────────

  {
    id: 'upsc-2020-vocabulary-001',
    year: 2020,
    exam: 'UPSC CSE',
    paper: 'Mains General English',
    section: 'vocabulary',
    questionType: 'vocabulary-mcq',
    questionText: 'Choose the word most nearly OPPOSITE in meaning to the word in capitals:\n\nMITIGATE',
    passageText: null,
    options: ['Alleviate', 'Aggravate', 'Moderate', 'Diminish'],
    correctAnswer: 1,
    modelAnswer: null,
    explanation: "'Mitigate' means to make less severe. Its antonym is 'aggravate' (to make worse). 'Alleviate' and 'diminish' are synonyms.",
    trap: "'Alleviate', 'moderate', and 'diminish' are all synonyms of mitigate — only 'aggravate' is opposite.",
    topicTags: ['vocabulary', 'antonyms', 'word-meaning'],
    difficulty: 'medium',
    estimatedTime: 2,
    sourceStatus: 'sample-practice',
    sourceNote: 'UPSC-style vocabulary practice question.',
    conceptTag: 'Antonyms — mitigate / aggravate',
  },
]

export default questions2020
