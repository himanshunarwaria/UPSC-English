// ─────────────────────────────────────────────────────────────────────────────
// COMPATIBILITY ADAPTER
//
// The PYQ data now lives in the scalable system under src/data/pyqs/.
// This file adapts the new schema to the legacy shape used by older screens
// (Practice, Revision) so nothing breaks. New code should import from
// '@/data/pyqs' directly and use the query API.
//
// Legacy fields added per question: topic, type, question, source, sourceLabel.
// All new-schema fields (questionText, topicTags, sourceStatus, passageText,
// modelAnswer, etc.) are preserved on the same object.
// ─────────────────────────────────────────────────────────────────────────────

import { allPYQs } from './pyqs/index.js'

// Map a topic tag to a display category that matches GRAMMAR_CATEGORIES labels,
// so PYQ attempts feed correctly into topic accuracy + weakness drills.
const TAG_TO_CATEGORY = {
  'error-spotting': 'Error Spotting',
  'each-and-every': 'Error Spotting',
  'sentence-correction': 'Sentence Correction',
  'subject-verb-agreement': 'Subject-Verb Agreement',
  'the-number-of': 'Subject-Verb Agreement',
  'data-plural': 'Subject-Verb Agreement',
  'along-with': 'Subject-Verb Agreement',
  'tenses': 'Tenses',
  'articles': 'Articles',
  'definite-article': 'Articles',
  'proper-names': 'Articles',
  'prepositions': 'Prepositions',
  'active-passive-voice': 'Active & Passive Voice',
  'present-perfect-passive': 'Active & Passive Voice',
  'direct-indirect-speech': 'Direct & Indirect Speech',
  'reported-speech': 'Direct & Indirect Speech',
  'modifiers': 'Modifiers',
  'dangling-modifier': 'Modifiers',
  'parallelism': 'Parallelism',
  'conditionals': 'Conditionals',
  'third-conditional': 'Conditionals',
  'vocabulary-usage': 'Vocabulary Usage',
  'vocabulary': 'Vocabulary Usage',
  'word-in-context': 'Vocabulary Usage',
  'idioms': 'Idioms & Phrases',
}

const SECTION_DISPLAY = {
  grammar: 'Grammar',
  essay: 'Essay',
  precis: 'Précis',
  comprehension: 'Comprehension',
  translation: 'Translation',
  vocabulary: 'Vocabulary',
}

function deriveTopic(q) {
  if (q.section === 'grammar') {
    for (const tag of q.topicTags) {
      if (TAG_TO_CATEGORY[tag]) return TAG_TO_CATEGORY[tag]
    }
  }
  return SECTION_DISPLAY[q.section] || 'General'
}

function toLegacy(q) {
  const isReal = q.sourceStatus === 'real-pyq'
  return {
    ...q,
    // Legacy aliases
    topic: deriveTopic(q),
    type: q.questionType,
    question: q.questionText,
    source: isReal ? 'UPSC PYQ' : 'Sample UPSC-style Practice',
    sourceLabel: isReal
      ? `${q.exam} ${q.year} — ${q.paper}`
      : `${q.exam} ${q.year} — ${q.paper} (Sample)`,
  }
}

export const pyqQuestions = allPYQs.map(toLegacy)

export default pyqQuestions
