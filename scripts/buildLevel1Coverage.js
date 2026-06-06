#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Level 1 Coverage Builder
//
// Analyzes existing question batches to identify questions suitable for Level 1.
// Maps B1-difficulty questions and filters by subtopic.
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { normalizeQuestions } from '../src/data/questions/metadataNormalizer.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Level 1 subtopics and their minimum coverage requirement
const LEVEL_1_SUBTOPICS = {
  'subject-verb-agreement': { target: 20, sources: [5], keywords: ['subject-verb', 'agreement'] },
  'articles': { target: 20, sources: [9], keywords: ['article', 'definite', 'indefinite', 'a ', 'an ', 'the '] },
  'basic-prepositions': { target: 20, sources: [7], keywords: ['preposition', 'from', 'in', 'on', 'at', 'to', 'by'] },
  'simple-tense-correction': { target: 20, sources: [6], keywords: ['tense', 'simple past', 'present', 'perfect'] },
  'singular-plural-errors': { target: 20, sources: [1, 2, 3, 4, 5], keywords: ['singular', 'plural', 'error', 'subject-verb'] },
  'basic-sentence-correction': { target: 20, sources: [3, 4], keywords: ['sentence correction', 'correction', 'subject-verb'] },
}

// ── Load batch questions ──────────────────────────────────────────────────────

async function loadBatchQuestions(batchNum) {
  const batchesDir = path.join(__dirname, '../src/data/questions/batches')
  const batchNumStr = String(batchNum).padStart(3, '0')
  const questions = []

  const files = fs.readdirSync(batchesDir)
  // Find files that match batch_XXX_*_part_YY.js pattern (handles category names in filename)
  const partFiles = files
    .filter(f => {
      // Match: batch_NNN_...any_words..._part_NN.js
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

// ── Match question to Level 1 subtopic ────────────────────────────────────────

function matchSubtopic(question, subtopicConfig) {
  const questionText = ((question.question || question.question_text || '') + (question.subTopic || '')).toLowerCase()
  return subtopicConfig.keywords.some(keyword => questionText.includes(keyword.toLowerCase()))
}

// ── Main analysis ─────────────────────────────────────────────────────────────

async function buildLevel1Coverage() {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`LEVEL 1 COVERAGE ANALYSIS`)
  console.log(`${'='.repeat(80)}\n`)

  // Collect all B1 questions from relevant batches
  const level1Questions = {}
  const allBatches = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  console.log(`📚 Loading existing questions...\n`)

  const batchQuestions = {}
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

  console.log(`\n🔍 Normalizing and filtering B1 questions...\n`)

  // Initialize subtopic tracking
  for (const subtopic of Object.keys(LEVEL_1_SUBTOPICS)) {
    level1Questions[subtopic] = []
  }

  // Find B1 questions
  let totalB1Found = 0
  for (const batchNum of allBatches) {
    const qs = batchQuestions[batchNum]
    const normalized = normalizeQuestions(qs)

    for (const q of normalized) {
      if (q.difficulty === 'B1') {
        totalB1Found++

        // Try to match to a Level 1 subtopic
        for (const [subtopic, config] of Object.entries(LEVEL_1_SUBTOPICS)) {
          if (config.sources.includes(batchNum) && matchSubtopic(q, config)) {
            level1Questions[subtopic].push({
              id: q.id,
              batch: batchNum,
              subtopic: q.subtopic || 'Unknown',
              type: q.question_type || q.type,
            })
            break // Assign to first matching subtopic only
          }
        }
      }
    }
  }

  console.log(`   Total B1 questions found: ${totalB1Found}`)

  // Report coverage
  console.log(`\n📊 LEVEL 1 SUBTOPIC COVERAGE:\n`)

  const gaps = []
  let totalLevel1 = 0

  for (const [subtopic, config] of Object.entries(LEVEL_1_SUBTOPICS)) {
    const questions = level1Questions[subtopic]
    const count = questions.length
    const percentage = ((count / config.target) * 100).toFixed(1)
    const status = count >= config.target ? '✅' : '❌'
    const bar = '█'.repeat(Math.ceil(count / 2))

    totalLevel1 += count

    console.log(`${status} ${subtopic.padEnd(30)} ${count.toString().padStart(2)}/${config.target} (${percentage}%) ${bar}`)

    if (count < config.target) {
      gaps.push({
        subtopic,
        needed: config.target - count,
        current: count,
        target: config.target,
      })
    }

    // Show sample questions
    if (count > 0) {
      console.log(`     Sample IDs: ${questions.slice(0, 3).map(q => q.id).join(', ')}${count > 3 ? ', ...' : ''}`)
    }
  }

  console.log(`\n${'='.repeat(80)}`)
  console.log(`SUMMARY:`)
  console.log(`${'='.repeat(80)}`)
  console.log(`Total Level 1 Questions Available: ${totalLevel1}`)
  console.log(`Target Level 1 Questions: 120 (20 × 6 subtopics)`)
  console.log(`Coverage: ${((totalLevel1 / 120) * 100).toFixed(1)}%`)

  if (gaps.length > 0) {
    console.log(`\n⚠️ GAPS REQUIRING NEW QUESTIONS:\n`)
    gaps.forEach(gap => {
      console.log(`   ${gap.subtopic}: need ${gap.needed} questions (${gap.current}/${gap.target})`)
    })
    console.log(`\n   Total new questions to create: ${gaps.reduce((sum, g) => sum + g.needed, 0)}`)
  } else {
    console.log(`\n✅ All Level 1 subtopics have sufficient coverage!`)
  }

  console.log(`${'='.repeat(80)}\n`)

  return {
    level1Questions,
    totalLevel1,
    gaps,
    hasGaps: gaps.length > 0,
  }
}

// Run analysis
const result = await buildLevel1Coverage()
process.exit(result.hasGaps ? 1 : 0)
