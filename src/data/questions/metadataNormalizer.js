// ─────────────────────────────────────────────────────────────────────────────
// Question Metadata Normalizer
//
// Non-destructive normalizer that enriches existing questions with inferred
// metadata fields (level, topic, subtopic, question_type, mistake_type).
// Does NOT mutate original question files.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalize a single question by inferring missing metadata
 * @param {Object} question - Original question object
 * @returns {Object} - Normalized question with inferred fields
 */
export function normalizeQuestion(question) {
  // Create a copy to avoid mutating the original
  const normalized = { ...question }

  // Map type field to question_type if not already present
  if (!normalized.question_type && normalized.type) {
    normalized.question_type = normalized.type
  }

  // Infer topic, subtopic, level, and mistake_type based on content
  const inference = inferMetadata(question)

  // Fill in missing fields from inference
  if (!normalized.level) {
    normalized.level = inference.level
  }
  if (!normalized.topic) {
    normalized.topic = inference.topic
  }
  if (!normalized.subtopic) {
    normalized.subtopic = inference.subtopic
  }
  if (!normalized.mistake_type) {
    normalized.mistake_type = inference.mistake_type
  }

  return normalized
}

/**
 * Infer metadata from existing question fields
 * Uses question content, category, subTopic, and difficulty to map to new schema
 * @param {Object} question - Original question object
 * @returns {Object} - { level, topic, subtopic, mistake_type }
 */
function inferMetadata(question) {
  const questionText = (question.question || question.question_text || '').toLowerCase()
  const subTopic = (question.subTopic || '').toLowerCase()
  const category = (question.category || '').toLowerCase()
  const difficulty = question.difficulty || 'B2'

  // Difficulty to base level mapping
  const difficultyToLevel = {
    'B1': 1,
    'B2': 2,
    'C1': 3,
    'C2': 4,
  }
  const baseLevel = difficultyToLevel[difficulty] || 2

  // ── Subject-Verb Agreement ────────────────────────────────────────────────
  if (
    category.includes('subject-verb') ||
    subTopic.includes('subject-verb') ||
    subTopic.includes('agreement') ||
    questionText.includes('subject-verb') ||
    questionText.includes('agrees with')
  ) {
    return {
      level: difficulty === 'B1' ? 1 : difficulty === 'B2' ? 2 : 3,
      topic: 'Grammar',
      subtopic: 'Subject-Verb Agreement',
      mistake_type: 'subject-verb-agreement',
    }
  }

  // ── Articles (a, an, the) ────────────────────────────────────────────────
  if (
    category.includes('articles') ||
    subTopic.includes('articles') ||
    subTopic.includes('definite') ||
    subTopic.includes('indefinite') ||
    questionText.includes('article') ||
    questionText.includes(' a ') ||
    questionText.includes(' the ')
  ) {
    return {
      level: difficulty === 'B1' ? 1 : 3,
      topic: 'Grammar',
      subtopic: 'Articles',
      mistake_type: 'article-usage',
    }
  }

  // ── Prepositions ──────────────────────────────────────────────────────
  if (
    category.includes('preposition') ||
    subTopic.includes('preposition') ||
    questionText.includes('preposition')
  ) {
    return {
      level: difficulty === 'B1' ? 1 : 3,
      topic: 'Grammar',
      subtopic: 'Prepositions',
      mistake_type: 'preposition-usage',
    }
  }

  // ── Tenses ───────────────────────────────────────────────────────────
  if (
    category.includes('tense') ||
    subTopic.includes('tense') ||
    subTopic.includes('present perfect') ||
    subTopic.includes('simple past') ||
    subTopic.includes('progressive') ||
    questionText.includes('tense')
  ) {
    return {
      level: difficulty === 'B1' ? 1 : 2,
      topic: 'Grammar',
      subtopic: 'Tenses',
      mistake_type: 'tense-consistency',
    }
  }

  // ── Modals (can, should, must, may, might, could, would) ──────────────────
  if (
    subTopic.includes('modal') ||
    questionText.includes('modal') ||
    questionText.match(/\b(can|should|must|may|might|could|would)\b/)
  ) {
    return {
      level: difficulty === 'B1' ? 2 : 3,
      topic: 'Grammar',
      subtopic: 'Modals',
      mistake_type: 'modal-usage',
    }
  }

  // ── Pronouns ───────────────────────────────────────────────────────────
  if (
    subTopic.includes('pronoun') ||
    questionText.includes('pronoun') ||
    questionText.includes('their') ||
    questionText.includes('its')
  ) {
    return {
      level: 2,
      topic: 'Grammar',
      subtopic: 'Pronouns',
      mistake_type: 'pronoun-reference',
    }
  }

  // ── Conjunctions ───────────────────────────────────────────────────────
  if (
    subTopic.includes('conjunction') ||
    questionText.includes('conjunction') ||
    questionText.match(/\b(and|but|or|nor|yet|so|because|although)\b/)
  ) {
    return {
      level: 2,
      topic: 'Grammar',
      subtopic: 'Conjunctions',
      mistake_type: 'conjunction-usage',
    }
  }

  // ── Active-Passive Voice ───────────────────────────────────────────────
  if (
    category.includes('voice') ||
    subTopic.includes('passive') ||
    subTopic.includes('active') ||
    questionText.includes('passive') ||
    questionText.includes('active voice')
  ) {
    return {
      level: 2,
      topic: 'Grammar',
      subtopic: 'Active-Passive Voice',
      mistake_type: 'active-passive-voice',
    }
  }

  // ── Direct-Indirect Speech ──────────────────────────────────────────
  if (
    category.includes('indirect') ||
    category.includes('speech') ||
    subTopic.includes('indirect') ||
    subTopic.includes('reported') ||
    questionText.includes('said') ||
    questionText.includes('reported')
  ) {
    return {
      level: 2,
      topic: 'Grammar',
      subtopic: 'Direct-Indirect Speech',
      mistake_type: 'speech-conversion',
    }
  }

  // ── Connectors ──────────────────────────────────────────────────────────
  if (
    subTopic.includes('connector') ||
    questionText.includes('connector') ||
    questionText.match(/\b(therefore|moreover|however|furthermore|thus|hence)\b/)
  ) {
    return {
      level: 4,
      topic: 'Connectors',
      subtopic: 'Sentence Connectors',
      mistake_type: 'connector-misuse',
    }
  }

  // ── Formal Vocabulary ─────────────────────────────────────────────────
  if (
    category.includes('vocabulary') ||
    subTopic.includes('vocabulary') ||
    subTopic.includes('formal') ||
    questionText.includes('replace') ||
    questionText.includes('formal')
  ) {
    return {
      level: difficulty === 'C1' ? 5 : 8,
      topic: 'Vocabulary',
      subtopic: difficulty === 'C1' ? 'Formal Vocabulary' : 'Academic Vocabulary',
      mistake_type: 'vocabulary-usage',
    }
  }

  // ── Phrasal Verbs ──────────────────────────────────────────────────────
  if (
    subTopic.includes('phrasal') ||
    questionText.includes('phrasal verb')
  ) {
    return {
      level: 6,
      topic: 'Phrasal Verbs',
      subtopic: 'Formal Replacement',
      mistake_type: 'phrasal-verb-usage',
    }
  }

  // ── Sentence Improvement / Structure ────────────────────────────────────
  if (
    category.includes('sentence correction') ||
    subTopic.includes('sentence improvement') ||
    subTopic.includes('fragment') ||
    subTopic.includes('modifier') ||
    subTopic.includes('parallelism')
  ) {
    return {
      level: difficulty === 'C1' ? 7 : 9,
      topic: 'Sentence Structure',
      subtopic: 'Sentence Improvement',
      mistake_type: 'sentence-structure',
    }
  }

  // ── Paragraph / Comprehension / Advanced Writing ───────────────────────
  if (
    category.includes('paragraph') ||
    subTopic.includes('paragraph') ||
    subTopic.includes('comprehension')
  ) {
    return {
      level: 10,
      topic: 'Full Test',
      subtopic: 'Comprehension & Paragraph Improvement',
      mistake_type: 'advanced-writing',
    }
  }

  // ── Default inference based on category ────────────────────────────────────
  const categoryDefaults = {
    'error spotting': { topic: 'Grammar', subtopic: 'Error Spotting', mistake_type: 'grammar-error' },
    'sentence correction': { topic: 'Grammar', subtopic: 'Sentence Correction', mistake_type: 'sentence-structure' },
    'tenses': { topic: 'Grammar', subtopic: 'Tenses', mistake_type: 'tense-consistency' },
    'prepositions': { topic: 'Grammar', subtopic: 'Prepositions', mistake_type: 'preposition-usage' },
    'modifiers': { topic: 'Grammar', subtopic: 'Modifiers', mistake_type: 'modifier-error' },
    'parallelism': { topic: 'Grammar', subtopic: 'Parallelism', mistake_type: 'parallelism-error' },
    'conditionals': { topic: 'Grammar', subtopic: 'Conditionals', mistake_type: 'conditional-error' },
    'non-finite verbs': { topic: 'Grammar', subtopic: 'Non-finite Verbs', mistake_type: 'non-finite-error' },
    'clauses & connectors': { topic: 'Connectors', subtopic: 'Clause & Connector Usage', mistake_type: 'connector-misuse' },
    'formal vocabulary usage': { topic: 'Vocabulary', subtopic: 'Formal Vocabulary', mistake_type: 'vocabulary-usage' },
    'idioms & collocations': { topic: 'Vocabulary', subtopic: 'Idioms & Collocations', mistake_type: 'idiom-error' },
    'mixed grammar': { topic: 'Grammar', subtopic: 'Mixed Grammar Rules', mistake_type: 'multiple-errors' },
  }

  const defaults = categoryDefaults[category] || {
    topic: 'Grammar',
    subtopic: 'Mixed Grammar Rules',
    mistake_type: 'grammar-error',
  }

  return {
    level: baseLevel,
    ...defaults,
  }
}

/**
 * Normalize an array of questions
 * @param {Array} questions - Original questions array
 * @returns {Array} - Normalized questions with inferred metadata
 */
export function normalizeQuestions(questions) {
  if (!Array.isArray(questions)) {
    console.warn('Input is not an array')
    return []
  }
  return questions.map(q => normalizeQuestion(q))
}

/**
 * Get normalization statistics for a batch
 * Shows which fields were inferred and coverage
 * @param {Array} originalQuestions - Original questions
 * @param {Array} normalizedQuestions - Normalized questions
 * @returns {Object} - Statistics on inferred fields
 */
export function getNormalizationStats(originalQuestions, normalizedQuestions) {
  if (!Array.isArray(originalQuestions) || !Array.isArray(normalizedQuestions)) {
    return { error: 'Both inputs must be arrays' }
  }

  const stats = {
    totalQuestions: originalQuestions.length,
    fieldsInferred: {
      level: 0,
      topic: 0,
      subtopic: 0,
      question_type: 0,
      mistake_type: 0,
    },
  }

  originalQuestions.forEach((orig, idx) => {
    const norm = normalizedQuestions[idx]

    if (!orig.level && norm.level) stats.fieldsInferred.level++
    if (!orig.topic && norm.topic) stats.fieldsInferred.topic++
    if (!orig.subtopic && norm.subtopic) stats.fieldsInferred.subtopic++
    if (!orig.question_type && orig.type && norm.question_type) stats.fieldsInferred.question_type++
    if (!orig.mistake_type && norm.mistake_type) stats.fieldsInferred.mistake_type++
  })

  return stats
}

export default {
  normalizeQuestion,
  normalizeQuestions,
  getNormalizationStats,
}
