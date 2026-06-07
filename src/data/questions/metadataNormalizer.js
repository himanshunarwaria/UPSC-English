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
  const subTopic = (question.subTopic || question.subtopic || '').toLowerCase()
  const category = (question.category || '').toLowerCase()
  const difficulty = question.difficulty || 'B2'
  const questionType = (question.type || question.question_type || '').toLowerCase()

  // Difficulty to base level mapping (fallback only — explicit rules take priority)
  const difficultyToLevel = { 'B1': 1, 'B2': 2, 'C1': 3, 'C2': 4 }
  const baseLevel = difficultyToLevel[difficulty] || 2

  // ── Level 9: UPSC Answer-Writing ────────────────────────────────────────────
  // Checked first — most specific tag set, must not be overridden by generic rules
  if (
    subTopic.includes('answer writing') ||
    subTopic.includes('answer-writing') ||
    subTopic.includes('introduction writing') ||
    subTopic.includes('body paragraph') ||
    subTopic.includes('paragraph formation') ||
    subTopic.includes('conclusion writing') ||
    subTopic.includes('formal expression') ||
    subTopic.includes('balanced tone') ||
    subTopic.includes('upsc mains') ||
    subTopic.includes('connector usage in answer')
  ) {
    return {
      level: 9,
      topic: 'Answer Writing',
      subtopic: 'UPSC Answer Writing',
      mistake_type: 'answer-writing',
    }
  }

  // ── Level 5: Formal Word Replacement ────────────────────────────────────────
  // Explicit category match for gap-filling vocabulary batch
  if (
    category.includes('formal vocabulary') ||
    subTopic.includes('formal word replacement') ||
    subTopic.includes('common to formal') ||
    subTopic.includes('word replacement') ||
    subTopic.includes('academic word alternative') ||
    subTopic.includes('better word choice') ||
    subTopic.includes('vocabulary replacement')
  ) {
    return {
      level: 5,
      topic: 'Vocabulary',
      subtopic: 'Formal Vocabulary',
      mistake_type: 'vocabulary-usage',
    }
  }

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
  // NOTE: Removed `questionText.includes(' a ')` and `questionText.includes(' the ')` —
  // those matched virtually every English sentence and falsely mapped ~700 questions here.
  if (
    category.includes('articles') ||
    subTopic.includes('articles') ||
    subTopic.includes('determiner') ||
    subTopic.includes('definite') ||
    subTopic.includes('indefinite') ||
    questionText.includes('article')
  ) {
    return {
      level: difficulty === 'B1' ? 1 : 3,
      topic: 'Grammar',
      subtopic: 'Articles',
      mistake_type: 'article-usage',
    }
  }

  // ── Prepositions ──────────────────────────────────────────────────────────
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

  // ── Tenses ────────────────────────────────────────────────────────────────
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

  // ── Modals ────────────────────────────────────────────────────────────────
  // NOTE: Removed broad regex match for modal verbs — those words appear in nearly
  // every governance sentence and caused false positives across all batches.
  if (
    subTopic.includes('modal') ||
    questionText.includes('modal')
  ) {
    return {
      level: difficulty === 'B1' ? 2 : 3,
      topic: 'Grammar',
      subtopic: 'Modals',
      mistake_type: 'modal-usage',
    }
  }

  // ── Pronouns ──────────────────────────────────────────────────────────────
  // NOTE: Removed `questionText.includes('their')` and `questionText.includes('its')` —
  // possessives appear in virtually all formal prose.
  if (
    subTopic.includes('pronoun') ||
    questionText.includes('pronoun')
  ) {
    return {
      level: 2,
      topic: 'Grammar',
      subtopic: 'Pronouns',
      mistake_type: 'pronoun-reference',
    }
  }

  // ── Conjunctions ──────────────────────────────────────────────────────────
  // NOTE: Removed broad regex for common conjunctions — matched almost every sentence.
  if (
    subTopic.includes('conjunction') ||
    questionText.includes('conjunction')
  ) {
    return {
      level: 2,
      topic: 'Grammar',
      subtopic: 'Conjunctions',
      mistake_type: 'conjunction-usage',
    }
  }

  // ── Active-Passive Voice ──────────────────────────────────────────────────
  // NOTE: Removed `questionText.includes('passive')` — too many governance sentences
  // use the word "passive" in non-grammar contexts.
  if (
    category.includes('voice') ||
    subTopic.includes('passive') ||
    subTopic.includes('active-passive') ||
    subTopic.includes('voice conversion') ||
    questionType === 'voice-conversion'
  ) {
    return {
      level: 2,
      topic: 'Grammar',
      subtopic: 'Active-Passive Voice',
      mistake_type: 'active-passive-voice',
    }
  }

  // ── Direct-Indirect Speech ────────────────────────────────────────────────
  // NOTE: Removed `questionText.includes('said')` and `questionText.includes('reported')` —
  // both appear widely in policy/news-style question stems without indicating this topic.
  if (
    category.includes('indirect') ||
    category.includes('speech') ||
    subTopic.includes('indirect') ||
    subTopic.includes('reported speech') ||
    subTopic.includes('narration') ||
    questionType === 'speech-conversion'
  ) {
    return {
      level: 2,
      topic: 'Grammar',
      subtopic: 'Direct-Indirect Speech',
      mistake_type: 'speech-conversion',
    }
  }

  // ── Level 10: Full UPSC Test Mode ─────────────────────────────────────────
  // C2 Mixed Grammar = comprehensive mastery questions — check before Level 7
  if (
    (category.includes('mixed grammar') && difficulty === 'C2') ||
    subTopic.includes('comprehensive mastery') ||
    subTopic.includes('mock test') ||
    subTopic.includes('full test') ||
    subTopic.includes('precis') ||
    subTopic.includes('reading comprehension')
  ) {
    return {
      level: 10,
      topic: 'Full Test',
      subtopic: 'Mixed Advanced Grammar',
      mistake_type: 'multiple-errors',
    }
  }

  // ── Level 7: Sentence Structure Improvement ───────────────────────────────
  // Mixed Grammar C1 + best-sentence C1/C2 + explicit structure subTopics
  if (
    (category.includes('mixed grammar') && difficulty === 'C1') ||
    (questionType === 'best-sentence' && (difficulty === 'C1' || difficulty === 'C2')) ||
    (category.includes('sentence correction') && (difficulty === 'C1' || difficulty === 'C2')) ||
    subTopic.includes('dangling modifier') ||
    subTopic.includes('squinting modifier') ||
    subTopic.includes('parallel structure') ||
    subTopic.includes('parallelism') ||
    subTopic.includes('fragment correction') ||
    subTopic.includes('sentence improvement') ||
    subTopic.includes('sentence variety') ||
    subTopic.includes('hindi-style') ||
    subTopic.includes('long sentence improvement') ||
    subTopic.includes('subject-predicate alignment') ||
    subTopic.includes('clause relationship')
  ) {
    return {
      level: 7,
      topic: 'Sentence Structure',
      subtopic: 'Sentence Improvement',
      mistake_type: 'sentence-structure',
    }
  }

  // ── Connectors (Level 4) ──────────────────────────────────────────────────
  if (
    subTopic.includes('connector') ||
    questionText.includes('connector') ||
    questionText.match(/\b(therefore|moreover|however|furthermore|thus|hence|consequently|nevertheless|notwithstanding)\b/)
  ) {
    return {
      level: 4,
      topic: 'Connectors',
      subtopic: 'Sentence Connectors',
      mistake_type: 'connector-misuse',
    }
  }

  // ── Level 8: Academic / Domain Vocabulary ─────────────────────────────────
  if (
    subTopic.includes('governance vocabulary') ||
    subTopic.includes('economic terminology') ||
    subTopic.includes('society vocabulary') ||
    subTopic.includes('environment vocabulary') ||
    subTopic.includes('ethics vocabulary') ||
    subTopic.includes('academic vocabulary') ||
    subTopic.includes('polity vocabulary') ||
    subTopic.includes('international relations vocabulary') ||
    subTopic.includes('science and technology vocabulary') ||
    subTopic.includes('geography vocabulary')
  ) {
    return {
      level: 8,
      topic: 'Vocabulary',
      subtopic: 'Academic Vocabulary',
      mistake_type: 'vocabulary-usage',
    }
  }

  // ── Formal Vocabulary (Level 5 / 8 fallback) ─────────────────────────────
  // NOTE: Removed broad `questionText.includes('replace')` and `questionText.includes('formal')` —
  // those matched sentence correction and error-spotting questions that aren't vocabulary tasks.
  if (
    category.includes('vocabulary') ||
    subTopic.includes('vocabulary')
  ) {
    return {
      level: difficulty === 'C1' ? 5 : 8,
      topic: 'Vocabulary',
      subtopic: difficulty === 'C1' ? 'Formal Vocabulary' : 'Academic Vocabulary',
      mistake_type: 'vocabulary-usage',
    }
  }

  // ── Phrasal Verbs (Level 6) ───────────────────────────────────────────────
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

  // ── Sentence Improvement fallback (remaining modifier/structure subTopics) ─
  if (
    subTopic.includes('modifier') ||
    subTopic.includes('sentence structure')
  ) {
    return {
      level: 7,
      topic: 'Sentence Structure',
      subtopic: 'Sentence Improvement',
      mistake_type: 'sentence-structure',
    }
  }

  // ── Paragraph / Comprehension ─────────────────────────────────────────────
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

  // ── Error Spotting: hard cap at Level 3 ──────────────────────────────────
  // C2 error-spotting questions must not reach Level 4 via difficultyToLevel.
  // Level 4 is Sentence Connectors only. Error spotting at any difficulty is
  // grammar practice: B1→L1, B2→L2, C1/C2→L3 (Advanced Grammar).
  // This rule fires only after all topic-specific rules (SVA, Articles, etc.)
  // and the Connector rule — so connector-subTopic error-spotting still reaches L4.
  if (category === 'error spotting') {
    return {
      level: difficulty === 'B1' ? 1 : difficulty === 'B2' ? 2 : 3,
      topic: 'Grammar',
      subtopic: 'Error Spotting',
      mistake_type: 'grammar-error',
    }
  }

  // ── Default: category-based with difficulty level ─────────────────────────
  const categoryDefaults = {
    'error spotting':         { topic: 'Grammar',     subtopic: 'Error Spotting',        mistake_type: 'grammar-error' },
    'sentence correction':    { topic: 'Grammar',     subtopic: 'Sentence Correction',   mistake_type: 'sentence-structure' },
    'tenses':                 { topic: 'Grammar',     subtopic: 'Tenses',                mistake_type: 'tense-consistency' },
    'prepositions':           { topic: 'Grammar',     subtopic: 'Prepositions',          mistake_type: 'preposition-usage' },
    'modifiers':              { topic: 'Grammar',     subtopic: 'Modifiers',             mistake_type: 'modifier-error' },
    'parallelism':            { topic: 'Grammar',     subtopic: 'Parallelism',           mistake_type: 'parallelism-error' },
    'conditionals':           { topic: 'Grammar',     subtopic: 'Conditionals',          mistake_type: 'conditional-error' },
    'non-finite verbs':       { topic: 'Grammar',     subtopic: 'Non-finite Verbs',      mistake_type: 'non-finite-error' },
    'clauses & connectors':   { topic: 'Connectors',  subtopic: 'Clause & Connector Usage', mistake_type: 'connector-misuse' },
    'formal vocabulary usage':{ topic: 'Vocabulary',  subtopic: 'Formal Vocabulary',     mistake_type: 'vocabulary-usage' },
    'idioms & collocations':  { topic: 'Vocabulary',  subtopic: 'Idioms & Collocations', mistake_type: 'idiom-error' },
    'mixed grammar':          { topic: 'Grammar',     subtopic: 'Mixed Grammar Rules',   mistake_type: 'multiple-errors' },
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
