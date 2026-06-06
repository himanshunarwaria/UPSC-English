#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Level 2 & Level 3 Coverage Builder
//
// Analyzes existing B2/C1 difficulty questions for Level 2 & 3 mapping.
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { normalizeQuestions } from '../src/data/questions/metadataNormalizer.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Level 2 subtopics (B2 difficulty)
const LEVEL_2_SUBTOPICS = {
  'tenses': { target: 20, difficulty: 'B2', sources: [6], keywords: ['tense', 'present', 'past', 'perfect', 'continuous'] },
  'modals': { target: 20, difficulty: 'B2', sources: [6, 8], keywords: ['modal', 'can', 'should', 'must', 'may', 'might', 'could', 'would'] },
  'pronouns': { target: 20, difficulty: 'B2', sources: [2, 3, 4, 5], keywords: ['pronoun', 'their', 'its', 'who', 'whom', 'that'] },
  'conjunctions': { target: 20, difficulty: 'B2', sources: [3, 4], keywords: ['conjunction', 'and', 'but', 'or', 'because', 'although'] },
  'active-passive-basics': { target: 20, difficulty: 'B2', sources: [8], keywords: ['passive', 'active', 'voice', 'conversion'] },
  'direct-indirect-basics': { target: 20, difficulty: 'B2', sources: [8], keywords: ['indirect', 'reported', 'direct', 'speech', 'said'] },
}

// Level 3 subtopics (C1 difficulty)
const LEVEL_3_SUBTOPICS = {
  'advanced-articles': { target: 20, difficulty: 'C1', sources: [9], keywords: ['article', 'determiner', 'definite', 'indefinite'] },
  'advanced-prepositions': { target: 20, difficulty: 'C1', sources: [7], keywords: ['preposition', 'formal', 'semantic'] },
  'advanced-modals': { target: 20, difficulty: 'C1', sources: [6, 8, 10], keywords: ['modal', 'perfect', 'subjunctive', 'conditional'] },
}

async function loadBatchQuestions(batchNum) {
  const batchesDir = path.join(__dirname, '../src/data/questions/batches')
  const batchNumStr = String(batchNum).padStart(3, '0')
  const questions = []

  const files = fs.readdirSync(batchesDir)
  const partFiles = files
    .filter(f => {
      const pattern = new RegExp(`^batch_${batchNumStr}_.*_part_\\d+.*\\.js$`)
      return pattern.test(f)
    })
    .sort()

  for (const partFile of partFiles) {
    try {
      const filePath = path.join(batchesDir, partFile)
      const module = await import(`file://${filePath}`)
      const qs = module.default || module[Object.keys(module)[0]]

      if (Array.isArray(qs)) {
        questions.push(...qs)
      }
    } catch (err) {
      console.error(`Error loading ${partFile}:`, err.message)
    }
  }

  return questions
}

function matchSubtopic(question, subtopicConfig) {
  const questionText = ((question.question || question.question_text || '') + (question.subTopic || '') + (question.category || '')).toLowerCase()
  return subtopicConfig.keywords.some(keyword => questionText.includes(keyword.toLowerCase()))
}

async function buildLevel23Coverage() {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`LEVEL 2 & LEVEL 3 COVERAGE ANALYSIS`)
  console.log(`${'='.repeat(80)}\n`)

  // Load all batches
  const allBatches = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const batchQuestions = {}

  console.log(`📚 Loading existing questions...\n`)

  for (const batchNum of allBatches) {
    try {
      const qs = await loadBatchQuestions(batchNum)
      batchQuestions[batchNum] = qs
      console.log(`   Batch ${batchNum}: ${qs.length} questions`)
    } catch (err) {
      console.error(`   Error loading batch ${batchNum}:`, err.message)
      batchQuestions[batchNum] = []
    }
  }

  // Initialize tracking
  const level2Questions = {}
  const level3Questions = {}

  for (const subtopic of Object.keys(LEVEL_2_SUBTOPICS)) {
    level2Questions[subtopic] = []
  }
  for (const subtopic of Object.keys(LEVEL_3_SUBTOPICS)) {
    level3Questions[subtopic] = []
  }

  console.log(`\n🔍 Analyzing Level 2 (B2) and Level 3 (C1) questions...\n`)

  let totalB2 = 0, totalC1 = 0

  for (const batchNum of allBatches) {
    const qs = batchQuestions[batchNum]
    const normalized = normalizeQuestions(qs)

    for (const q of normalized) {
      // Level 2: B2 difficulty
      if (q.difficulty === 'B2') {
        totalB2++
        for (const [subtopic, config] of Object.entries(LEVEL_2_SUBTOPICS)) {
          if (config.sources.includes(batchNum) && matchSubtopic(q, config)) {
            level2Questions[subtopic].push({
              id: q.id,
              batch: batchNum,
              subtopic: q.subtopic || 'Unknown',
              type: q.question_type || q.type,
            })
            break
          }
        }
      }

      // Level 3: C1 difficulty
      if (q.difficulty === 'C1') {
        totalC1++
        for (const [subtopic, config] of Object.entries(LEVEL_3_SUBTOPICS)) {
          if (config.sources.includes(batchNum) && matchSubtopic(q, config)) {
            level3Questions[subtopic].push({
              id: q.id,
              batch: batchNum,
              subtopic: q.subtopic || 'Unknown',
              type: q.question_type || q.type,
            })
            break
          }
        }
      }
    }
  }

  console.log(`   Total B2 questions found: ${totalB2}`)
  console.log(`   Total C1 questions found: ${totalC1}`)

  // Report Level 2
  console.log(`\n${'='.repeat(80)}`)
  console.log(`LEVEL 2 (B2) SUBTOPIC COVERAGE:`)
  console.log(`${'='.repeat(80)}\n`)

  const level2Gaps = []
  let totalLevel2 = 0

  for (const [subtopic, config] of Object.entries(LEVEL_2_SUBTOPICS)) {
    const questions = level2Questions[subtopic]
    const count = questions.length
    const percentage = ((count / config.target) * 100).toFixed(1)
    const status = count >= config.target ? '✅' : count >= config.target * 0.7 ? '⚠️' : '❌'
    const bar = '█'.repeat(Math.ceil(count / 2))

    totalLevel2 += count

    console.log(`${status} ${subtopic.padEnd(30)} ${count.toString().padStart(2)}/${config.target} (${percentage}%) ${bar}`)

    if (count > 0) {
      console.log(`     Sample IDs: ${questions.slice(0, 3).map(q => q.id).join(', ')}${count > 3 ? ', ...' : ''}`)
    }

    if (count < config.target) {
      level2Gaps.push({
        subtopic,
        needed: config.target - count,
        current: count,
        target: config.target,
      })
    }
  }

  // Report Level 3
  console.log(`\n${'='.repeat(80)}`)
  console.log(`LEVEL 3 (C1) SUBTOPIC COVERAGE:`)
  console.log(`${'='.repeat(80)}\n`)

  const level3Gaps = []
  let totalLevel3 = 0

  for (const [subtopic, config] of Object.entries(LEVEL_3_SUBTOPICS)) {
    const questions = level3Questions[subtopic]
    const count = questions.length
    const percentage = ((count / config.target) * 100).toFixed(1)
    const status = count >= config.target ? '✅' : count >= config.target * 0.7 ? '⚠️' : '❌'
    const bar = '█'.repeat(Math.ceil(count / 2))

    totalLevel3 += count

    console.log(`${status} ${subtopic.padEnd(30)} ${count.toString().padStart(2)}/${config.target} (${percentage}%) ${bar}`)

    if (count > 0) {
      console.log(`     Sample IDs: ${questions.slice(0, 3).map(q => q.id).join(', ')}${count > 3 ? ', ...' : ''}`)
    }

    if (count < config.target) {
      level3Gaps.push({
        subtopic,
        needed: config.target - count,
        current: count,
        target: config.target,
      })
    }
  }

  // Summary
  console.log(`\n${'='.repeat(80)}`)
  console.log(`SUMMARY:`)
  console.log(`${'='.repeat(80)}`)
  console.log(`\nLevel 2 (B2):`)
  console.log(`  Total Questions Available: ${totalLevel2}`)
  console.log(`  Target: 120 (20 × 6 subtopics)`)
  console.log(`  Coverage: ${((totalLevel2 / 120) * 100).toFixed(1)}%`)

  console.log(`\nLevel 3 (C1):`)
  console.log(`  Total Questions Available: ${totalLevel3}`)
  console.log(`  Target: 60 (20 × 3 subtopics)`)
  console.log(`  Coverage: ${((totalLevel3 / 60) * 100).toFixed(1)}%`)

  if (level2Gaps.length > 0) {
    console.log(`\n⚠️ LEVEL 2 GAPS:\n`)
    level2Gaps.forEach(gap => {
      console.log(`   ${gap.subtopic}: need ${gap.needed} (${gap.current}/${gap.target})`)
    })
    console.log(`   Total: ${level2Gaps.reduce((sum, g) => sum + g.needed, 0)} new questions`)
  }

  if (level3Gaps.length > 0) {
    console.log(`\n⚠️ LEVEL 3 GAPS:\n`)
    level3Gaps.forEach(gap => {
      console.log(`   ${gap.subtopic}: need ${gap.needed} (${gap.current}/${gap.target})`)
    })
    console.log(`   Total: ${level3Gaps.reduce((sum, g) => sum + g.needed, 0)} new questions`)
  }

  console.log(`${'='.repeat(80)}\n`)

  return {
    level2Questions,
    level3Questions,
    totalLevel2,
    totalLevel3,
    level2Gaps,
    level3Gaps,
    hasGaps: level2Gaps.length > 0 || level3Gaps.length > 0,
  }
}

const result = await buildLevel23Coverage()
process.exit(result.hasGaps ? 1 : 0)
