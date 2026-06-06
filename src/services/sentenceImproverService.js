// ─────────────────────────────────────────────────────────────────────────────
// Sentence Improver Service — Rule-based Mock Service
// Transforms simple sentences into UPSC-style formal language
// ─────────────────────────────────────────────────────────────────────────────

// Example database of improvements
const IMPROVEMENT_DATABASE = [
  {
    original: 'Government should help poor people.',
    improved: 'The government should implement targeted welfare measures to support economically vulnerable sections.',
    whatChanged: [
      '"help" replaced with "implement targeted welfare measures"',
      '"poor people" replaced with "economically vulnerable sections"',
      'Added definite article "The"',
    ],
    vocabularyUsed: ['implement', 'targeted', 'welfare', 'measures', 'economically vulnerable'],
    grammarCorrection: 'Added article "The" for formality',
    connectorUsed: null,
  },
  {
    original: 'Education helps people.',
    improved: 'Quality education serves as a catalyst for socio-economic development and empowerment of individuals.',
    whatChanged: [
      '"helps" expanded to "serves as a catalyst"',
      '"people" generalized to "individuals"',
      'Added context about socio-economic development',
    ],
    vocabularyUsed: ['catalyst', 'socio-economic', 'development', 'empowerment'],
    grammarCorrection: 'Changed verb structure for sophistication',
    connectorUsed: null,
  },
  {
    original: 'Pollution is bad.',
    improved: 'Uncontrolled pollution poses a severe threat to environmental sustainability and public health.',
    whatChanged: [
      '"is bad" replaced with "poses a severe threat"',
      'Added specific context: "environmental sustainability and public health"',
      'Added qualifier "Uncontrolled"',
    ],
    vocabularyUsed: ['uncontrolled', 'poses', 'severe', 'threat', 'sustainability'],
    grammarCorrection: 'Replaced vague predicate with specific noun phrase',
    connectorUsed: null,
  },
  {
    original: 'Women should get rights.',
    improved: 'Women must be guaranteed equal rights and opportunities in all spheres of society, as a fundamental prerequisite for inclusive development.',
    whatChanged: [
      '"get rights" replaced with "be guaranteed equal rights and opportunities"',
      'Added scope: "in all spheres of society"',
      'Added rationale with connector "as"',
    ],
    vocabularyUsed: ['guaranteed', 'equal', 'opportunities', 'spheres', 'inclusive', 'prerequisite'],
    grammarCorrection: 'Changed to passive voice for formality; added dependent clause',
    connectorUsed: 'as',
  },
  {
    original: 'Technology is useful.',
    improved: 'Strategic deployment of technology can significantly enhance productivity, facilitate innovation, and bridge socio-digital divides in developing economies.',
    whatChanged: [
      '"is useful" replaced with "can significantly enhance"',
      'Specified scope with "Strategic deployment"',
      'Added multiple outcomes with connector "and"',
    ],
    vocabularyUsed: ['strategic', 'deployment', 'significantly', 'enhance', 'facilitate', 'innovation', 'socio-digital'],
    grammarCorrection: 'Changed to modal verb structure; added compound predicate',
    connectorUsed: 'and',
  },
]

/**
 * Improve a simple sentence to UPSC-style formal language
 * @param {string} sentence - Input sentence to improve
 * @returns {Object} Improvement details
 */
export function improveSentence(sentence) {
  if (!sentence || sentence.trim().length === 0) {
    return null
  }

  const trimmed = sentence.trim()

  // Try to find exact or near match
  const match = IMPROVEMENT_DATABASE.find(
    item => item.original.toLowerCase() === trimmed.toLowerCase()
  )

  if (match) {
    return {
      original: match.original,
      improved: match.improved,
      whatChanged: match.whatChanged,
      vocabularyUsed: match.vocabularyUsed,
      grammarCorrection: match.grammarCorrection,
      connectorUsed: match.connectorUsed,
      isExact: true,
    }
  }

  // Fallback for unknown sentences
  return generateGenericImprovement(trimmed)
}

/**
 * Generate generic improvement for unknown sentences
 * Uses simple rule-based patterns
 * @param {string} sentence
 * @returns {Object}
 */
function generateGenericImprovement(sentence) {
  let improved = sentence
  const changes = []

  // Rule 1: Replace simple verbs with formal ones
  const simpleToFormal = {
    'help': 'facilitate',
    'make': 'establish',
    'get': 'acquire',
    'go': 'proceed',
    'use': 'utilise',
    'say': 'assert',
    'show': 'demonstrate',
    'think': 'contemplate',
    'try': 'endeavour',
    'want': 'seek',
  }

  Object.entries(simpleToFormal).forEach(([simple, formal]) => {
    const regex = new RegExp(`\\b${simple}\\b`, 'gi')
    if (regex.test(improved)) {
      improved = improved.replace(regex, formal)
      changes.push(`'${simple}' replaced with '${formal}'`)
    }
  })

  // Rule 2: Add article if missing at start
  if (!improved.match(/^(the|a|an)\s/i)) {
    improved = 'The ' + improved[0].toLowerCase() + improved.slice(1)
    changes.push('Added definite article "The"')
  }

  // Rule 3: Make passive if possible
  if (improved.includes(' is ')) {
    improved = improved.replace(/ is /, ' represents a critical aspect of ')
    changes.push('Enhanced predicate for formality')
  }

  if (changes.length === 0) {
    changes.push('Sentence is already formal')
  }

  return {
    original: sentence,
    improved,
    whatChanged: changes,
    vocabularyUsed: changes.filter(c => c.includes('replaced')).map(c =>
      c.match(/'([^']+)'/g)?.[1]?.replace(/'/g, '')
    ).filter(Boolean),
    grammarCorrection: changes[0] || null,
    connectorUsed: null,
    isExact: false,
  }
}

/**
 * Get all example sentences for learning
 * @returns {Array}
 */
export function getExamples() {
  return IMPROVEMENT_DATABASE.map(item => ({
    original: item.original,
    improved: item.improved,
  }))
}

/**
 * Track sentence improvement attempt
 * @param {string} userId
 * @param {Object} improvementData
 */
export function trackImprovement(userId, improvementData) {
  if (!userId) return

  const key = `user_${userId}_sentence_improvements`
  const improvements = JSON.parse(localStorage.getItem(key) || '[]')

  improvements.push({
    ...improvementData,
    created_at: new Date().toISOString(),
  })

  // Keep only last 50
  if (improvements.length > 50) {
    improvements.shift()
  }

  localStorage.setItem(key, JSON.stringify(improvements))
}

/**
 * Get user's improvement history
 * @param {string} userId
 * @returns {Array}
 */
export function getImprovementHistory(userId) {
  if (!userId) return []
  const key = `user_${userId}_sentence_improvements`
  return JSON.parse(localStorage.getItem(key) || '[]')
}

export default {
  improveSentence,
  getExamples,
  trackImprovement,
  getImprovementHistory,
}
