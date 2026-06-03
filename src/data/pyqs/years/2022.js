// ─────────────────────────────────────────────────────────────────────────────
// UPSC CSE Mains 2022 — General English
// ─────────────────────────────────────────────────────────────────────────────

/** @type {import('../schema.js').PYQQuestion[]} */
const questions2022 = [

  // ── GRAMMAR ──────────────────────────────────────────────────────────────

  {
    id: 'pyq-2022-g-001',
    year: 2022,
    exam: 'UPSC CSE',
    paper: 'Mains General English',
    section: 'grammar',
    questionType: 'sentence-correction',
    questionText: 'Convert to passive: "The government has implemented several new schemes."',
    passageText: null,
    options: [
      'Several new schemes have been implemented by the government.',
      'Several new schemes were implemented by the government.',
      'Several new schemes are implemented by the government.',
      'Several new schemes had been implemented by the government.',
    ],
    correctAnswer: 0,
    modelAnswer: null,
    explanation: "Present Perfect Active → Present Perfect Passive: 'has implemented' → 'have been implemented'.",
    trap: "The verb number shifts: singular 'has' (with 'government') → plural 'have' (with 'schemes') in passive.",
    topicTags: ['active-passive-voice', 'present-perfect-passive'],
    difficulty: 'medium',
    estimatedTime: 2,
    sourceStatus: 'sample-practice',
    sourceNote: 'UPSC-style practice question.',
    conceptTag: 'Present Perfect Passive',
  },

  {
    id: 'pyq-2022-g-002',
    year: 2022,
    exam: 'UPSC CSE',
    paper: 'Mains General English',
    section: 'grammar',
    questionType: 'sentence-correction',
    questionText: 'Correct the sentence: "Had the government intervened earlier, the crisis would not escalate."',
    passageText: null,
    options: [
      'Had the government intervened earlier, the crisis would not have escalated.',
      'If the government had intervened earlier, the crisis would not escalate.',
      'Had the government intervened earlier, the crisis will not have escalated.',
      'No correction required.',
    ],
    correctAnswer: 0,
    modelAnswer: null,
    explanation: "Type 3 Conditional: inverted 'Had + subject + past participle' → main clause must use 'would/could have + past participle'.",
    trap: "'Would not escalate' is a Type 2 result — it cannot pair with a Type 3 condition.",
    topicTags: ['conditionals', 'third-conditional', 'inverted-conditional'],
    difficulty: 'hard',
    estimatedTime: 2,
    sourceStatus: 'sample-practice',
    sourceNote: 'UPSC-style practice question.',
    conceptTag: 'Third conditional — inverted had',
  },

  // ── COMPREHENSION (sample placeholder) ───────────────────────────────────

  {
    id: 'upsc-2022-comprehension-001',
    year: 2022,
    exam: 'UPSC CSE',
    paper: 'Mains General English',
    section: 'comprehension',
    questionType: 'comprehension-long',
    questionText: 'Read the following passage carefully and answer the questions given below it in your own words.',
    passageText: 'India\'s federal structure faces a persistent tension between the need for national unity and the demand for local autonomy. The Constitution distributes powers between the Union and the States through three lists: the Union List, the State List, and the Concurrent List. However, in practice, the balance has often tilted towards centralisation. Financial dependency of states on the Centre, the use of Article 356, and the proliferation of Centrally Sponsored Schemes have all been cited as factors that erode state autonomy. At the same time, proponents of a strong centre argue that national challenges — from internal security to pandemic response — require coordinated action that only the Union government can ensure. The challenge for Indian federalism lies in finding institutional arrangements that accommodate both unity and diversity without sacrificing either.',
    options: null,
    correctAnswer: null,
    modelAnswer: '(a) India\'s federal structure balances national unity with state autonomy, but the Centre often holds greater power due to financial control, Article 356, and centralised schemes.\n\n(b) Financial dependency, use of Article 356, and Centrally Sponsored Schemes erode state autonomy (any two).\n\n(c) Proponents argue national challenges like security and pandemic response require coordinated central action.\n\n(d) The passage suggests India needs institutional reforms that balance unity with diversity.\n\n(e) Suitable title: "The Challenge of Indian Federalism" or "Unity vs. Autonomy in India\'s Federal Design".',
    explanation: 'Read carefully and identify: (a) the main theme, (b) specific examples of centralisation, (c) counterarguments, (d) the author\'s conclusion. Answer in concise, clear English — 2–3 sentences per question.',
    trap: 'Do not quote the passage verbatim. Use your own words. Answer exactly what is asked.',
    topicTags: ['comprehension', 'polity', 'federalism'],
    difficulty: 'medium',
    estimatedTime: 15,
    sourceStatus: 'sample-practice',
    sourceNote: 'Representative UPSC Mains comprehension passage. Not a verified PYQ.',
    conceptTag: null,
  },
]

export default questions2022
