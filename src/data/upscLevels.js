// ─────────────────────────────────────────────────────────────────────────────
// UPSC English Learning Levels (1-10)
//
// Progressive skill hierarchy for UPSC English Grammar & Vocabulary practice.
// Each level unlocks after completing the previous level's test requirement.
// ─────────────────────────────────────────────────────────────────────────────

export const UPSC_LEVELS = [
  {
    id: 'level_1',
    levelNumber: 1,
    title: 'Foundation',
    difficultyLabel: 'Easiest',
    shortDescription: 'Basic grammar and simple usage questions.',
    coreSkills: [
      'Identify subject-verb agreement errors',
      'Use articles correctly (a, an, the)',
      'Apply basic prepositions correctly',
      'Correct simple tense errors',
      'Fix singular/plural mistakes',
    ],
    subtopics: [
      'Subject-Verb Agreement',
      'Articles',
      'Basic Prepositions',
      'Simple Tense Correction',
      'Singular/Plural Errors',
      'Basic Sentence Correction',
    ],
    unlockRequirement: null, // Level 1 is always unlocked
    estimatedPracticeTime: 360, // minutes
    testRequired: true,
    difficulty: 'B1',
    questionBatchNumbers: [1, 5], // References to batch numbers from batchManifest
  },

  {
    id: 'level_2',
    levelNumber: 2,
    title: 'Common Errors',
    difficultyLabel: 'Very Easy',
    shortDescription: 'Common grammar mistakes and simple sentence correction.',
    coreSkills: [
      'Master all tense combinations',
      'Use modals correctly (can, should, must, etc.)',
      'Apply pronoun rules accurately',
      'Use conjunctions properly',
      'Convert active to passive voice basics',
      'Transform direct to indirect speech basics',
    ],
    subtopics: [
      'Tenses',
      'Modals',
      'Pronouns',
      'Conjunctions',
      'Active-Passive Basics',
      'Direct-Indirect Basics',
    ],
    unlockRequirement: 'level_1_test_passed_min_70',
    estimatedPracticeTime: 420,
    testRequired: true,
    difficulty: 'B2',
    questionBatchNumbers: [3, 4, 6],
  },

  {
    id: 'level_3',
    levelNumber: 3,
    title: 'Articles, Prepositions & Modals',
    difficultyLabel: 'Easy',
    shortDescription: 'Articles, prepositions, modals, and basic error spotting.',
    coreSkills: [
      'Master complex article usage (the, a, zero article)',
      'Apply advanced prepositions in formal contexts',
      'Use modals in complex sentences',
      'Understand nuanced meaning differences',
    ],
    subtopics: [
      'Advanced Articles',
      'Advanced Prepositions',
      'Advanced Modals',
    ],
    unlockRequirement: 'level_2_test_passed_min_70',
    estimatedPracticeTime: 300,
    testRequired: true,
    difficulty: 'C1',
    questionBatchNumbers: [7, 9],
  },

  {
    id: 'level_4',
    levelNumber: 4,
    title: 'Sentence Connectors',
    difficultyLabel: 'Lower Intermediate',
    shortDescription: 'Sentence connectors, grammar usage, and short sentence improvement.',
    coreSkills: [
      'Use addition connectors effectively (furthermore, moreover)',
      'Use contrast connectors clearly (however, nevertheless)',
      'Use cause-effect connectors logically (therefore, as a result)',
      'Use example connectors appropriately (for instance, such as)',
      'Use conclusion connectors effectively (in conclusion, ultimately)',
    ],
    subtopics: [
      'Addition Connectors',
      'Contrast Connectors',
      'Cause-Effect Connectors',
      'Example Connectors',
      'Conclusion Connectors',
    ],
    unlockRequirement: 'level_3_test_passed_min_70',
    estimatedPracticeTime: 240,
    testRequired: true,
    difficulty: 'C1',
    questionBatchNumbers: [8],
  },

  {
    id: 'level_5',
    levelNumber: 5,
    title: 'Vocabulary & Word Choice',
    difficultyLabel: 'Intermediate',
    shortDescription: 'Formal vocabulary and better word choice.',
    coreSkills: [
      'Replace informal words with formal equivalents',
      'Upgrade common words to academic vocabulary',
      'Choose contextually appropriate word alternatives',
      'Understand subtle meaning differences in synonyms',
    ],
    subtopics: [
      'Formal Replacements',
      'Common to Academic Words',
      'Better Word Choice',
    ],
    unlockRequirement: 'level_4_test_passed_min_70',
    estimatedPracticeTime: 280,
    testRequired: true,
    difficulty: 'C1',
    questionBatchNumbers: [9],
  },

  {
    id: 'level_6',
    levelNumber: 6,
    title: 'Phrasal Verbs & Formal Alternatives',
    difficultyLabel: 'Upper Intermediate',
    shortDescription: 'Phrasal verbs, formal alternatives, and usage accuracy.',
    coreSkills: [
      'Understand phrasal verb meanings in context',
      'Replace phrasal verbs with formal alternatives',
      'Use phrasal verbs appropriately in different contexts',
      'Maintain formality while preserving meaning',
    ],
    subtopics: [
      'Phrasal Verb Meaning',
      'Formal Alternatives',
      'Contextual Usage',
    ],
    unlockRequirement: 'level_5_test_passed_min_70',
    estimatedPracticeTime: 300,
    testRequired: true,
    difficulty: 'C1',
    questionBatchNumbers: [8, 10],
  },

  {
    id: 'level_7',
    levelNumber: 7,
    title: 'Advanced Sentence Structure',
    difficultyLabel: 'Advanced',
    shortDescription: 'Sentence structure and advanced correction.',
    coreSkills: [
      'Convert simple sentences to complex structures',
      'Correct sentence fragments',
      'Improve overly long sentences',
      'Fix Hindi-influenced English patterns',
      'Structure cause-effect sentences logically',
      'Create balanced, parallel sentence structures',
    ],
    subtopics: [
      'Simple to Complex Sentences',
      'Fragment Correction',
      'Long Sentence Improvement',
      'Hindi-style English Correction',
      'Cause-Effect Sentences',
      'Balanced Sentences',
    ],
    unlockRequirement: 'level_6_test_passed_min_70',
    estimatedPracticeTime: 360,
    testRequired: true,
    difficulty: 'C2',
    questionBatchNumbers: [2, 4, 10],
  },

  {
    id: 'level_8',
    levelNumber: 8,
    title: 'Academic Vocabulary',
    difficultyLabel: 'High Advanced',
    shortDescription: 'Academic vocabulary and domain-specific UPSC usage.',
    coreSkills: [
      'Use governance vocabulary precisely',
      'Apply economic terminology accurately',
      'Employ social science vocabulary',
      'Use environmental terminology correctly',
      'Apply ethical vocabulary appropriately',
      'Use international relations vocabulary',
      'Employ science and technology terms',
      'Use geography terminology',
      'Apply polity-related vocabulary',
    ],
    subtopics: [
      'Governance Vocabulary',
      'Economic Terminology',
      'Society & Social Vocabulary',
      'Environment & Ecology',
      'Ethics & Philosophy',
      'International Relations',
      'Science and Technology',
      'Geography & Geopolitics',
      'Polity & Constitutional Terms',
    ],
    unlockRequirement: 'level_7_test_passed_min_75',
    estimatedPracticeTime: 420,
    testRequired: true,
    difficulty: 'C2',
    questionBatchNumbers: [7, 9, 10],
  },

  {
    id: 'level_9',
    levelNumber: 9,
    title: 'UPSC Answer Writing',
    difficultyLabel: 'Mains Advanced',
    shortDescription: 'UPSC answer-writing language, tone, and clarity.',
    coreSkills: [
      'Write compelling introductions',
      'Structure effective body paragraphs',
      'Write conclusive, impactful conclusions',
      'Maintain balanced, neutral tone',
      'Use formal expressions appropriately',
      'Use connectors to link ideas seamlessly',
    ],
    subtopics: [
      'Introduction Writing',
      'Body Paragraph Formation',
      'Conclusion Writing',
      'Balanced Tone',
      'Formal Expression',
      'Connector Usage in Answers',
    ],
    unlockRequirement: 'level_8_test_passed_min_75',
    estimatedPracticeTime: 480,
    testRequired: true,
    difficulty: 'C2',
    questionBatchNumbers: [10],
  },

  {
    id: 'level_10',
    levelNumber: 10,
    title: 'Full UPSC Mastery',
    difficultyLabel: 'Exam Mastery',
    shortDescription: 'Toughest mixed questions for full UPSC English readiness.',
    coreSkills: [
      'Apply all grammar rules in mixed contexts',
      'Use vocabulary in varied academic contexts',
      'Master sentence correction under time pressure',
      'Use connectors naturally in flowing prose',
      'Improve passages for clarity and formality',
      'Write precise precis maintaining key ideas',
      'Understand complex written passages',
      'Perform excellently in full-length mock tests',
    ],
    subtopics: [
      'Grammar Mixed Test',
      'Vocabulary Mixed Test',
      'Sentence Correction',
      'Connector Test',
      'Paragraph Improvement',
      'Precis Writing',
      'Reading Comprehension',
      'Full Mock Test',
    ],
    unlockRequirement: 'level_9_test_passed_min_80',
    estimatedPracticeTime: 600, // Full mock test
    testRequired: true,
    difficulty: 'C2',
    questionBatchNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
]

/**
 * Get a single level by levelNumber
 * @param {number} levelNumber - Level number (1-10)
 * @returns {Object|null} - Level object or null if not found
 */
export function getLevelByNumber(levelNumber) {
  return UPSC_LEVELS.find(level => level.levelNumber === levelNumber) || null
}

/**
 * Get a single level by id
 * @param {string} id - Level id (e.g., 'level_1')
 * @returns {Object|null} - Level object or null if not found
 */
export function getLevelById(id) {
  return UPSC_LEVELS.find(level => level.id === id) || null
}

/**
 * Get all levels
 * @returns {Array} - Array of all level objects
 */
export function getAllLevels() {
  return UPSC_LEVELS
}

/**
 * Get next level from current level
 * @param {number} currentLevelNumber - Current level number
 * @returns {Object|null} - Next level object or null if at level 10
 */
export function getNextLevel(currentLevelNumber) {
  if (currentLevelNumber >= 10) return null
  return getLevelByNumber(currentLevelNumber + 1)
}

/**
 * Get previous level from current level
 * @param {number} currentLevelNumber - Current level number
 * @returns {Object|null} - Previous level object or null if at level 1
 */
export function getPreviousLevel(currentLevelNumber) {
  if (currentLevelNumber <= 1) return null
  return getLevelByNumber(currentLevelNumber - 1)
}

/**
 * Get levels by difficulty
 * @param {string} difficulty - Difficulty level (B1, B2, C1, C2)
 * @returns {Array} - Array of level objects matching the difficulty
 */
export function getLevelsByDifficulty(difficulty) {
  return UPSC_LEVELS.filter(level => level.difficulty === difficulty)
}
