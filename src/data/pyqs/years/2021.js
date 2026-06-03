// ─────────────────────────────────────────────────────────────────────────────
// UPSC CSE Mains 2021 — General English
// ─────────────────────────────────────────────────────────────────────────────

/** @type {import('../schema.js').PYQQuestion[]} */
const questions2021 = [

  // ── GRAMMAR ──────────────────────────────────────────────────────────────

  {
    id: 'pyq-2021-g-001',
    year: 2021,
    exam: 'UPSC CSE',
    paper: 'Mains General English',
    section: 'grammar',
    questionType: 'sentence-correction',
    questionText: 'Correct: "Having read the report carefully, the committee\'s decision was surprising."',
    passageText: null,
    options: [
      'Having read the report carefully, the committee made a surprising decision.',
      'After reading the report carefully, the committee\'s decision was surprising.',
      'The committee having read the report carefully, the decision was surprising.',
      'No correction required.',
    ],
    correctAnswer: 0,
    modelAnswer: null,
    explanation: "The participial phrase 'Having read the report' must modify a noun that can read — the committee. A 'decision' cannot read.",
    trap: "Ensure the subject of the main clause matches what the participle describes.",
    topicTags: ['modifiers', 'dangling-modifier', 'perfect-participle'],
    difficulty: 'hard',
    estimatedTime: 2,
    sourceStatus: 'sample-practice',
    sourceNote: 'UPSC-style practice question.',
    conceptTag: 'Dangling modifier — perfect participle',
  },

  {
    id: 'pyq-2021-g-002',
    year: 2021,
    exam: 'UPSC CSE',
    paper: 'Mains General English',
    section: 'grammar',
    questionType: 'fill-blank',
    questionText: 'Fill in the blank: "___ Indian Civil Service was established under the British administration."',
    passageText: null,
    options: ['A', 'An', 'The', 'No article'],
    correctAnswer: 2,
    modelAnswer: null,
    explanation: "'The' is used before unique institutions and proper names referring to a specific, identifiable entity.",
    trap: "'An' is wrong — 'Indian Civil Service' is a proper name requiring 'the', regardless of vowel sound.",
    topicTags: ['articles', 'definite-article', 'proper-names'],
    difficulty: 'medium',
    estimatedTime: 2,
    sourceStatus: 'sample-practice',
    sourceNote: 'UPSC-style practice question.',
    conceptTag: 'The — unique institutions and proper names',
  },

  // ── TRANSLATION (sample placeholder) ─────────────────────────────────────

  {
    id: 'upsc-2021-translation-001',
    year: 2021,
    exam: 'UPSC CSE',
    paper: 'Mains General English',
    section: 'translation',
    questionType: 'translation-passage',
    questionText: 'Translate the following passage into English.',
    passageText: 'शिक्षा किसी भी राष्ट्र की प्रगति की आधारशिला है। यह न केवल व्यक्ति को ज्ञान प्रदान करती है, बल्कि उसे एक उत्तरदायी नागरिक भी बनाती है। एक शिक्षित समाज ही लोकतंत्र की सच्ची नींव है, क्योंकि शिक्षित नागरिक अपने अधिकारों और कर्तव्यों दोनों को समझते हैं।',
    options: null,
    correctAnswer: null,
    modelAnswer: 'Education is the cornerstone of any nation\'s progress. It not only imparts knowledge to an individual but also makes them a responsible citizen. An educated society is the true foundation of democracy, because educated citizens understand both their rights and their duties.',
    explanation: 'A good translation preserves meaning and tone while reading naturally in English. Avoid word-for-word literal translation; convey the sense idiomatically.',
    trap: 'Do not translate literally word-by-word. Maintain natural English sentence structure.',
    topicTags: ['translation', 'hindi-to-english'],
    difficulty: 'hard',
    estimatedTime: 20,
    sourceStatus: 'sample-practice',
    sourceNote: 'Representative UPSC Mains translation passage. Not a verified PYQ.',
    conceptTag: null,
  },
]

export default questions2021
