// ─────────────────────────────────────────────────────────────────────────────
// Practice Catalog Service
//
// Organises the normalised question bank into student-friendly skill areas,
// subtopics, and difficulty groups for a skill-first practice selector.
//
// Key design decisions:
//   normalizedSubtopic — matches q.subtopic (inferred by metadataNormalizer)
//   rawKeywords        — matched against q.subTopic (original batch field,
//                        camelCase, preserved via spread in normalizeQuestion)
//   baseSubtopicFilter — on a skill, restricts totalCount to a specific
//                        normalizedSubtopic (separates Vocabulary vs
//                        Academic Vocabulary which share the same topic)
//
// Does NOT mutate question objects. All counts are computed over the cached
// normalised pool from questionFilterService.
// ─────────────────────────────────────────────────────────────────────────────

import { getAllNormalizedQuestions } from './questionFilterService'

// ─────────────────────────────────────────────────────────────────────────────
// 1. Static skill definitions
// ─────────────────────────────────────────────────────────────────────────────

export const SKILL_DEFINITIONS = [
  {
    skillId: 'grammar',
    title: 'Grammar',
    description: 'Articles, tenses, subject-verb agreement, prepositions, and core grammar rules.',
    icon: 'spellcheck',
    topicFilter: 'Grammar',
    baseSubtopicFilter: null, // all Grammar subtopics belong here
    subtopics: [
      { id: 'articles',      label: 'Articles',               normalizedSubtopic: 'Articles',               rawKeywords: null },
      { id: 'prepositions',  label: 'Prepositions',           normalizedSubtopic: 'Prepositions',           rawKeywords: null },
      { id: 'tenses',        label: 'Tenses',                 normalizedSubtopic: 'Tenses',                 rawKeywords: null },
      { id: 'sva',           label: 'Subject-Verb Agreement', normalizedSubtopic: 'Subject-Verb Agreement', rawKeywords: null },
      { id: 'modals',        label: 'Modals',                 normalizedSubtopic: 'Modals',                 rawKeywords: null },
      { id: 'pronouns',      label: 'Pronouns',               normalizedSubtopic: 'Pronouns',               rawKeywords: null },
      { id: 'conjunctions',  label: 'Conjunctions',           normalizedSubtopic: 'Conjunctions',           rawKeywords: null },
      { id: 'voice',         label: 'Active-Passive',         normalizedSubtopic: 'Active-Passive Voice',   rawKeywords: null },
      { id: 'speech',        label: 'Direct-Indirect',        normalizedSubtopic: 'Direct-Indirect Speech', rawKeywords: null },
      { id: 'error',         label: 'Error Spotting',         normalizedSubtopic: 'Error Spotting',         rawKeywords: null },
      { id: 'correction',    label: 'Sentence Correction',    normalizedSubtopic: 'Sentence Correction',    rawKeywords: null },
      { id: 'mixed-grammar', label: 'Mixed Grammar',          normalizedSubtopic: null,                     rawKeywords: null },
    ],
  },

  {
    skillId: 'vocabulary',
    title: 'Vocabulary',
    description: 'Replace informal words with formal, precise alternatives for UPSC writing.',
    icon: 'menu_book',
    topicFilter: 'Vocabulary',
    baseSubtopicFilter: 'Formal Vocabulary',
    subtopics: [
      { id: 'formal-vocab',  label: 'Formal Vocabulary',       normalizedSubtopic: 'Formal Vocabulary', rawKeywords: null },
      { id: 'word-upgrade',  label: 'Common to Advanced Words', normalizedSubtopic: 'Formal Vocabulary', rawKeywords: ['common', 'upgrade', 'better word', 'word replacement'] },
      { id: 'word-choice',   label: 'Word Choice',             normalizedSubtopic: 'Formal Vocabulary', rawKeywords: ['choice', 'select', 'appropriate'] },
      { id: 'vocab-usage',   label: 'Usage in Sentence',       normalizedSubtopic: 'Formal Vocabulary', rawKeywords: ['usage', 'use in', 'contextual'] },
    ],
  },

  {
    skillId: 'connectors',
    title: 'Sentence Connectors',
    description: 'Use however, moreover, therefore, and other connectors correctly in UPSC answers.',
    icon: 'link',
    topicFilter: 'Connectors',
    baseSubtopicFilter: null,
    subtopics: [
      { id: 'addition',         label: 'Addition',          normalizedSubtopic: null, rawKeywords: ['addition'] },
      { id: 'contrast',         label: 'Contrast',          normalizedSubtopic: null, rawKeywords: ['contrast'] },
      { id: 'cause-effect',     label: 'Cause-Effect',      normalizedSubtopic: null, rawKeywords: ['cause', 'effect', 'result', 'consequence'] },
      { id: 'examples',         label: 'Examples',          normalizedSubtopic: null, rawKeywords: ['example', 'instance', 'illustration'] },
      { id: 'conclusion',       label: 'Conclusion',        normalizedSubtopic: null, rawKeywords: ['conclusion', 'summary'] },
      { id: 'mixed-connectors', label: 'Mixed Connectors',  normalizedSubtopic: null, rawKeywords: null },
    ],
  },

  {
    skillId: 'phrasal-verbs',
    title: 'Phrasal Verbs',
    description: 'Replace informal phrasal verbs with formal single-word alternatives.',
    icon: 'swap_horiz',
    topicFilter: 'Phrasal Verbs',
    baseSubtopicFilter: null,
    subtopics: [
      { id: 'formal-replace',  label: 'Formal Replacements', normalizedSubtopic: 'Formal Replacement', rawKeywords: null },
      { id: 'meaning-context', label: 'Meaning in Context',  normalizedSubtopic: null,                 rawKeywords: ['meaning', 'context', 'understand'] },
      { id: 'governance-pv',   label: 'Governance Usage',    normalizedSubtopic: null,                 rawKeywords: ['governance', 'policy', 'administration'] },
      { id: 'economy-pv',      label: 'Economy / Society',   normalizedSubtopic: null,                 rawKeywords: ['economy', 'economic', 'society', 'social'] },
      { id: 'env-ethics-pv',   label: 'Environment / Ethics', normalizedSubtopic: null,                rawKeywords: ['environment', 'ecology', 'ethics', 'moral'] },
    ],
  },

  {
    skillId: 'sentence-structure',
    title: 'Sentence Structure',
    description: 'Improve clarity, parallelism, conciseness, and formal tone in sentences.',
    icon: 'format_indent_increase',
    topicFilter: 'Sentence Structure',
    baseSubtopicFilter: null,
    subtopics: [
      { id: 'improvement',    label: 'Sentence Improvement', normalizedSubtopic: 'Sentence Improvement', rawKeywords: null },
      { id: 'best-sentence',  label: 'Best Sentence',        normalizedSubtopic: null,                   rawKeywords: ['best sentence', 'best-sentence', 'best option'] },
      { id: 'para-clarity',   label: 'Paragraph Clarity',   normalizedSubtopic: null,                   rawKeywords: ['paragraph', 'clarity', 'paragraph improvement'] },
      { id: 'word-economy',   label: 'Word Economy',         normalizedSubtopic: null,                   rawKeywords: ['concise', 'economy', 'wordy', 'redundant'] },
      { id: 'formal-tone-ss', label: 'Formal Tone',          normalizedSubtopic: null,                   rawKeywords: ['formal tone', 'formality', 'register'] },
    ],
  },

  {
    skillId: 'academic-vocabulary',
    title: 'Academic Vocabulary',
    description: 'Domain-specific UPSC vocabulary: governance, economy, society, ethics, and more.',
    icon: 'school',
    topicFilter: 'Vocabulary',
    baseSubtopicFilter: 'Academic Vocabulary',
    subtopics: [
      { id: 'governance-av', label: 'Governance',             normalizedSubtopic: 'Academic Vocabulary', rawKeywords: ['governance'] },
      { id: 'economy-av',    label: 'Economy',                normalizedSubtopic: 'Academic Vocabulary', rawKeywords: ['economic', 'economy'] },
      { id: 'society-av',    label: 'Society',                normalizedSubtopic: 'Academic Vocabulary', rawKeywords: ['society', 'social'] },
      { id: 'env-av',        label: 'Environment',            normalizedSubtopic: 'Academic Vocabulary', rawKeywords: ['environment', 'ecology'] },
      { id: 'ethics-av',     label: 'Ethics',                 normalizedSubtopic: 'Academic Vocabulary', rawKeywords: ['ethics', 'moral', 'philosophy'] },
      { id: 'polity-av',     label: 'Polity',                 normalizedSubtopic: 'Academic Vocabulary', rawKeywords: ['polity', 'constitutional', 'constitution'] },
      { id: 'ir-av',         label: 'Intl Relations',         normalizedSubtopic: 'Academic Vocabulary', rawKeywords: ['international', 'relations', 'foreign'] },
      { id: 'science-av',    label: 'Science & Tech',         normalizedSubtopic: 'Academic Vocabulary', rawKeywords: ['science', 'technology', 'tech'] },
    ],
  },

  {
    skillId: 'answer-writing',
    title: 'Answer Writing',
    description: 'UPSC Mains answer writing: structure, tone, connectors, and formal expression.',
    icon: 'edit_note',
    topicFilter: 'Answer Writing',
    baseSubtopicFilter: null,
    subtopics: [
      { id: 'introduction',  label: 'Introduction',        normalizedSubtopic: 'UPSC Answer Writing', rawKeywords: ['introduction', 'intro'] },
      { id: 'body',          label: 'Body Paragraph',      normalizedSubtopic: 'UPSC Answer Writing', rawKeywords: ['body paragraph', 'paragraph formation', 'body'] },
      { id: 'aw-conclusion', label: 'Conclusion',          normalizedSubtopic: 'UPSC Answer Writing', rawKeywords: ['conclusion'] },
      { id: 'aw-tone',       label: 'Balanced Tone',       normalizedSubtopic: 'UPSC Answer Writing', rawKeywords: ['balanced', 'tone', 'neutral'] },
      { id: 'aw-connectors', label: 'Connector Usage',     normalizedSubtopic: 'UPSC Answer Writing', rawKeywords: ['connector', 'linking'] },
      { id: 'formal-expr',   label: 'Formal Expression',   normalizedSubtopic: 'UPSC Answer Writing', rawKeywords: ['formal expression', 'formal'] },
      { id: 'way-forward',   label: 'Way Forward',         normalizedSubtopic: 'UPSC Answer Writing', rawKeywords: ['way forward', 'suggestion', 'recommendation'] },
    ],
  },

  {
    skillId: 'full-test',
    title: 'Full Test',
    description: 'Comprehensive mixed practice and mock UPSC English tests.',
    icon: 'quiz',
    topicFilter: 'Full Test',
    baseSubtopicFilter: null,
    subtopics: [
      { id: 'mixed-advanced', label: 'Mixed Advanced Grammar',  normalizedSubtopic: 'Mixed Advanced Grammar',                rawKeywords: null },
      { id: 'para-improve',   label: 'Paragraph Improvement',  normalizedSubtopic: 'Comprehension & Paragraph Improvement', rawKeywords: null },
      { id: 'full-test-all',  label: 'Full UPSC English Test', normalizedSubtopic: null,                                    rawKeywords: null },
      { id: 'mock-practice',  label: 'Mock Practice',          normalizedSubtopic: null,                                    rawKeywords: ['mock', 'full test', 'comprehensive'] },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// 2. Difficulty groups
// ─────────────────────────────────────────────────────────────────────────────

export const DIFFICULTY_GROUPS = [
  { id: 'beginner',     label: 'Beginner',       description: 'Foundation — Level 1–2',         levels: [1, 2] },
  { id: 'intermediate', label: 'Intermediate',   description: 'Building up — Level 3–5',         levels: [3, 4, 5] },
  { id: 'advanced',     label: 'Advanced',       description: 'Upper intermediate — Level 6–8',  levels: [6, 7, 8] },
  { id: 'exam',         label: 'Exam Level',     description: 'UPSC Mains ready — Level 9–10',   levels: [9, 10] },
]

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

function getPool() {
  return getAllNormalizedQuestions()
}

// Filter a pool to questions that match a skill's base scope (topic + baseSubtopicFilter)
function poolForSkill(pool, skill) {
  let p = pool.filter(q => q.topic === skill.topicFilter)
  if (skill.baseSubtopicFilter) {
    p = p.filter(q => q.subtopic === skill.baseSubtopicFilter)
  }
  return p
}

// Apply a single subtopicDef filter against the skill's base pool
function applySubtopicFilter(skillPool, subtopicDef) {
  let filtered = skillPool

  // Narrow by normalized subtopic if specified
  if (subtopicDef.normalizedSubtopic !== null) {
    filtered = filtered.filter(q => q.subtopic === subtopicDef.normalizedSubtopic)
  }

  // Further narrow by raw keywords on the original subTopic field (camelCase,
  // preserved in the spread copy that normalizeQuestion returns)
  if (subtopicDef.rawKeywords && subtopicDef.rawKeywords.length > 0) {
    filtered = filtered.filter(q => {
      const raw = (q.subTopic || '').toLowerCase()
      return subtopicDef.rawKeywords.some(kw => raw.includes(kw))
    })
  }

  return filtered
}

// Apply difficulty group filter to a pool
function applyDifficultyGroup(pool, difficultyGroupId) {
  const group = DIFFICULTY_GROUPS.find(dg => dg.id === difficultyGroupId)
  if (!group) return pool
  return pool.filter(q => group.levels.includes(q.level))
}

// Fisher-Yates shuffle (non-mutating)
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Module-level cache: computed once after first call, stable for the app session
let _catalogCache = null

// ─────────────────────────────────────────────────────────────────────────────
// 3. Exported API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * getPracticeCatalog()
 * Returns all skill areas with totalQuestionCount, subtopics with counts,
 * and difficultyGroups with counts.
 * Result is cached after first computation.
 */
export function getPracticeCatalog() {
  if (_catalogCache) return _catalogCache

  const pool = getPool()

  _catalogCache = SKILL_DEFINITIONS.map(skill => {
    const skillPool = poolForSkill(pool, skill)

    const subtopics = skill.subtopics.map(st => ({
      id:    st.id,
      label: st.label,
      count: applySubtopicFilter(skillPool, st).length,
    }))

    const difficultyGroups = DIFFICULTY_GROUPS.map(dg => ({
      id:          dg.id,
      label:       dg.label,
      description: dg.description,
      levels:      dg.levels,
      count:       applyDifficultyGroup(skillPool, dg.id).length,
    }))

    return {
      skillId:             skill.skillId,
      title:               skill.title,
      description:         skill.description,
      icon:                skill.icon,
      totalQuestionCount:  skillPool.length,
      subtopics,
      difficultyGroups,
    }
  })

  return _catalogCache
}

/**
 * getSkillAreas()
 * Returns lightweight skill-area cards: skillId, title, description, icon,
 * totalQuestionCount, and up to 4 non-zero subtopics for preview chips.
 */
export function getSkillAreas() {
  return getPracticeCatalog().map(({ skillId, title, description, icon, totalQuestionCount, subtopics }) => ({
    skillId,
    title,
    description,
    icon,
    totalQuestionCount,
    previewSubtopics: subtopics.filter(st => st.count > 0).slice(0, 4),
  }))
}

/**
 * getSubtopicsForSkill(skillId)
 * Returns all subtopics for a skill with live question counts.
 * Subtopics with count === 0 are included so the UI can decide whether to hide them.
 */
export function getSubtopicsForSkill(skillId) {
  const entry = getPracticeCatalog().find(s => s.skillId === skillId)
  return entry ? entry.subtopics : []
}

/**
 * getDifficultyGroupsForSkillAndSubtopic(skillId, subtopicId?)
 * Returns difficulty groups with counts for a given skill (and optional subtopic).
 */
export function getDifficultyGroupsForSkillAndSubtopic(skillId, subtopicId = null) {
  const pool  = getPool()
  const skill = SKILL_DEFINITIONS.find(s => s.skillId === skillId)
  if (!skill) return []

  let base = poolForSkill(pool, skill)

  if (subtopicId) {
    const subtopicDef = skill.subtopics.find(st => st.id === subtopicId)
    if (subtopicDef) base = applySubtopicFilter(base, subtopicDef)
  }

  return DIFFICULTY_GROUPS.map(dg => ({
    id:          dg.id,
    label:       dg.label,
    description: dg.description,
    levels:      dg.levels,
    count:       applyDifficultyGroup(base, dg.id).length,
  }))
}

/**
 * filterPracticeQuestions({ skillId, subtopicId, difficultyGroup, level, limit })
 * Returns a shuffled, limited set of questions matching the given filters.
 *
 * skillId        — required
 * subtopicId     — optional catalog subtopic id (e.g. 'articles', 'sva')
 * difficultyGroup — optional ('beginner' | 'intermediate' | 'advanced' | 'exam')
 * level          — optional exact level number (overrides difficultyGroup)
 * limit          — max questions to return (default 20, pass 0 for all)
 */
export function filterPracticeQuestions({
  skillId,
  subtopicId   = null,
  difficultyGroup = null,
  level        = null,
  limit        = 20,
} = {}) {
  const pool  = getPool()
  const skill = SKILL_DEFINITIONS.find(s => s.skillId === skillId)
  if (!skill) return []

  let filtered = poolForSkill(pool, skill)

  // Subtopic
  if (subtopicId) {
    const subtopicDef = skill.subtopics.find(st => st.id === subtopicId)
    if (subtopicDef) filtered = applySubtopicFilter(filtered, subtopicDef)
  }

  // Difficulty group (ignored if exact level is given)
  if (level != null) {
    filtered = filtered.filter(q => q.level === Number(level))
  } else if (difficultyGroup) {
    filtered = applyDifficultyGroup(filtered, difficultyGroup)
  }

  const shuffled = shuffle(filtered)
  return limit > 0 ? shuffled.slice(0, limit) : shuffled
}

/**
 * searchPracticeCatalog(query)
 * Simple keyword search across skill titles, descriptions, and subtopic labels.
 * Returns an array of { type, skillId, subtopicId?, title, count } matches.
 */
export function searchPracticeCatalog(query) {
  const q = (query || '').toLowerCase().trim()
  if (!q) return []

  const pool    = getPool()
  const results = []

  for (const skill of SKILL_DEFINITIONS) {
    const skillPool = poolForSkill(pool, skill)

    const skillMatches =
      skill.title.toLowerCase().includes(q) ||
      skill.description.toLowerCase().includes(q)

    if (skillMatches) {
      results.push({
        type:    'skill',
        skillId: skill.skillId,
        title:   skill.title,
        count:   skillPool.length,
      })
    }

    for (const st of skill.subtopics) {
      const labelMatch   = st.label.toLowerCase().includes(q)
      const keywordMatch = st.rawKeywords && st.rawKeywords.some(kw => kw.includes(q))

      if (labelMatch || keywordMatch) {
        results.push({
          type:       'subtopic',
          skillId:    skill.skillId,
          skillTitle: skill.title,
          subtopicId: st.id,
          title:      `${skill.title} › ${st.label}`,
          count:      applySubtopicFilter(skillPool, st).length,
        })
      }
    }
  }

  return results
}

// ─────────────────────────────────────────────────────────────────────────────
// Default export for convenience import
// ─────────────────────────────────────────────────────────────────────────────

export default {
  getPracticeCatalog,
  getSkillAreas,
  getSubtopicsForSkill,
  getDifficultyGroupsForSkillAndSubtopic,
  filterPracticeQuestions,
  searchPracticeCatalog,
  SKILL_DEFINITIONS,
  DIFFICULTY_GROUPS,
}
