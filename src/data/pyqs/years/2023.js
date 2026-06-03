// ─────────────────────────────────────────────────────────────────────────────
// UPSC CSE Mains 2023 — General English
// ─────────────────────────────────────────────────────────────────────────────

/** @type {import('../schema.js').PYQQuestion[]} */
const questions2023 = [

  // ── GRAMMAR ──────────────────────────────────────────────────────────────

  {
    id: 'pyq-2023-g-001',
    year: 2023,
    exam: 'UPSC CSE',
    paper: 'Mains General English',
    section: 'grammar',
    questionType: 'fill-blank',
    questionText: 'The minister announced that the government ___ the policy the following week.',
    passageText: null,
    options: ['will revise', 'would revise', 'revised', 'has revised'],
    correctAnswer: 1,
    modelAnswer: null,
    explanation: "In reported speech, 'will' changes to 'would' when the reporting verb is past ('announced').",
    trap: "'Will revise' is direct speech tense — after a past reporting verb, use 'would'.",
    topicTags: ['reported-speech', 'tenses', 'will-to-would'],
    difficulty: 'hard',
    estimatedTime: 2,
    sourceStatus: 'sample-practice',
    sourceNote: 'UPSC-style practice question.',
    conceptTag: 'Reported speech — will → would',
  },

  {
    id: 'pyq-2023-g-002',
    year: 2023,
    exam: 'UPSC CSE',
    paper: 'Mains General English',
    section: 'grammar',
    questionType: 'error-spotting',
    questionText: 'Find the error:\n\n"The number of candidates (A) / appearing for the examination (B) / have increased (C) / significantly this year. (D)"',
    passageText: null,
    options: ['A — The number of candidates', 'B — appearing for the examination', 'C — have increased', 'D — No error'],
    correctAnswer: 2,
    modelAnswer: null,
    explanation: "'The number of' always takes a singular verb. Correct: 'has increased'.",
    trap: "'The number of' = singular; 'A number of' = plural. A frequently tested UPSC pattern.",
    topicTags: ['subject-verb-agreement', 'the-number-of'],
    difficulty: 'hard',
    estimatedTime: 2,
    sourceStatus: 'sample-practice',
    sourceNote: 'UPSC-style practice question.',
    conceptTag: 'The number of — singular verb',
  },

  // ── PRÉCIS (sample placeholder) ──────────────────────────────────────────

  {
    id: 'upsc-2023-precis-001',
    year: 2023,
    exam: 'UPSC CSE',
    paper: 'Mains General English',
    section: 'precis',
    questionType: 'precis-writing',
    questionText: 'Make a précis of the following passage in about one-third its length. Supply a suitable title.',
    passageText: 'The idea that democracy is about voting is so deeply ingrained that it is often difficult to imagine what else democracy might be about. Yet democracy is really about decisions, not merely about elections. A vote is a decision — but a decision about who should make decisions, not a decision about the substance of any issue. If voting is our only democratic practice, then we are not really democrats at all; we are simply choosing our rulers. A genuine democracy would give citizens a more direct say over the decisions that affect their lives — through participatory budgeting, citizens\' assemblies, public consultations on major policy choices, and the free flow of information to enable informed judgement. The ballot box is not the ceiling of democratic aspiration; it is only the floor.',
    options: null,
    correctAnswer: null,
    modelAnswer: 'Democracy is fundamentally about decision-making, not merely elections. While voting selects decision-makers, genuine democracy requires citizens to participate directly in shaping policies. Mechanisms such as participatory budgeting, citizens\' assemblies, and public consultations give citizens real agency. Voting should be seen as the foundation, not the limit, of democratic participation.\n\n[Title: "Democracy Beyond the Ballot Box" — approx. 70 words]',
    explanation: 'The précis should capture the central argument (voting is insufficient for democracy), the supporting evidence (participatory mechanisms), and the conclusion (voting is a floor, not ceiling). Use your own words. Aim for ~90 words.',
    trap: 'Do not copy phrases directly from the passage. Condense without losing key ideas.',
    topicTags: ['precis-writing', 'governance', 'democracy'],
    difficulty: 'hard',
    estimatedTime: 25,
    sourceStatus: 'sample-practice',
    sourceNote: 'Representative UPSC Mains précis passage. Not a verified PYQ.',
    conceptTag: null,
  },
]

export default questions2023
