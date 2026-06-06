#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Level 4–10 Advanced Questions Mapping
//
// Maps existing C1/C2 questions to Levels 4–10.
// Uses question content analysis to assign levels.
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { normalizeQuestions } from '../src/data/questions/metadataNormalizer.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Level 4–10 mappings (C1/C2 questions)
const LEVEL_MAPPINGS = {
  4: {
    name: 'Sentence Connectors & Coherence',
    targetCount: 20,
    keywords: ['connector', 'therefore', 'however', 'moreover', 'furthermore', 'nevertheless', 'thus', 'hence'],
    sources: [8, 10],
  },
  5: {
    name: 'Common to Advanced Word',
    targetCount: 20,
    keywords: ['vocabulary', 'formal', 'replacement', 'alternative', 'synonym'],
    sources: [9],
  },
  6: {
    name: 'Phrasal Verbs & Formal Alternatives',
    targetCount: 20,
    keywords: ['phrasal', 'verb', 'formal', 'alternative', 'replacement'],
    sources: [8, 10],
  },
  7: {
    name: 'Sentence Structure Improvement',
    targetCount: 20,
    keywords: ['sentence', 'structure', 'modifier', 'parallelism', 'clause', 'improvement'],
    sources: [2, 4, 10],
  },
  8: {
    name: 'Academic Vocabulary for UPSC',
    targetCount: 20,
    keywords: ['governance', 'economy', 'vocabulary', 'academic', 'formal', 'institutional'],
    sources: [7, 9, 10],
  },
  9: {
    name: 'UPSC Answer-Writing English',
    targetCount: 20,
    keywords: ['answer', 'writing', 'introduction', 'paragraph', 'conclusion', 'formal'],
    sources: [10],
  },
  10: {
    name: 'Full UPSC English Test Mode',
    targetCount: 100,
    keywords: ['mixed', 'comprehensive', 'mastery', 'test', 'final'],
    sources: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
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
      // Silent fail
    }
  }

  return questions
}

function matchesLevel(question, levelConfig) {
  const questionText = ((question.question || question.question_text || '') + (question.category || '') + (question.subTopic || '')).toLowerCase()
  return levelConfig.keywords.some(keyword => questionText.includes(keyword.toLowerCase()))
}

async function buildLevel4to10Coverage() {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`LEVEL 4–10 ADVANCED QUESTIONS MAPPING`)
  console.log(`${'='.repeat(80)}\n`)

  // Load all batches
  const allBatches = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const batchQuestions = {}

  console.log(`📚 Loading questions...\n`)

  let totalLoaded = 0
  for (const batchNum of allBatches) {
    const qs = await loadBatchQuestions(batchNum)
    batchQuestions[batchNum] = qs
    totalLoaded += qs.length
    console.log(`   Batch ${batchNum}: ${qs.length} questions`)
  }

  console.log(`   Total: ${totalLoaded} questions\n`)

  // Initialize level tracking
  const levelQuestions = {}
  for (let level = 4; level <= 10; level++) {
    levelQuestions[level] = []
  }

  console.log(`🔍 Mapping C1/C2 questions to Levels 4–10...\n`)

  let totalC1C2 = 0
  const allNormalized = {}

  // Normalize all questions first
  for (const batchNum of allBatches) {
    allNormalized[batchNum] = normalizeQuestions(batchQuestions[batchNum])
  }

  // Assign questions to levels
  for (const batchNum of allBatches) {
    const qs = allNormalized[batchNum]

    for (const q of qs) {
      if (q.difficulty === 'C1' || q.difficulty === 'C2') {
        totalC1C2++

        // Try to assign to a level
        for (let level = 4; level <= 10; level++) {
          const config = LEVEL_MAPPINGS[level]
          if (config.sources.includes(batchNum) && matchesLevel(q, config)) {
            levelQuestions[level].push({
              id: q.id,
              batch: batchNum,
              category: q.category || 'Unknown',
              subtopic: q.subtopic || 'Unknown',
              difficulty: q.difficulty,
            })
            break // Assign to first matching level only
          }
        }

        // If not assigned, put in Level 10 (catch-all)
        const assigned = Object.values(levelQuestions).some(arr => arr.some(item => item.id === q.id))
        if (!assigned) {
          levelQuestions[10].push({
            id: q.id,
            batch: batchNum,
            category: q.category || 'Unknown',
            subtopic: q.subtopic || 'Unknown',
            difficulty: q.difficulty,
          })
        }
      }
    }
  }

  console.log(`   Total C1/C2 questions found: ${totalC1C2}\n`)

  // Report coverage
  console.log(`${'='.repeat(80)}`)
  console.log(`LEVEL-WISE COVERAGE:`)
  console.log(`${'='.repeat(80)}\n`)

  const gaps = []
  let totalAdvanced = 0

  for (let level = 4; level <= 10; level++) {
    const config = LEVEL_MAPPINGS[level]
    const questions = levelQuestions[level]
    const count = questions.length
    const percentage = ((count / config.targetCount) * 100).toFixed(1)
    const status = count >= config.targetCount ? '✅' : count >= config.targetCount * 0.7 ? '⚠️' : '❌'
    const bar = '█'.repeat(Math.ceil(count / 2))

    totalAdvanced += count

    console.log(`Level ${level}: ${config.name}`)
    console.log(`${status} ${count.toString().padStart(3)}/${config.targetCount} (${percentage}%) ${bar}`)

    if (count > 0) {
      const samples = questions.slice(0, 3).map(q => q.id).join(', ')
      console.log(`   Sample IDs: ${samples}${count > 3 ? ', ...' : ''}`)
    }

    if (count < config.targetCount) {
      gaps.push({
        level,
        name: config.name,
        needed: config.targetCount - count,
        current: count,
        target: config.targetCount,
      })
    }

    console.log('')
  }

  // Summary
  console.log(`${'='.repeat(80)}`)
  console.log(`SUMMARY:`)
  console.log(`${'='.repeat(80)}`)
  console.log(`\nTotal Advanced (C1/C2) Questions Mapped: ${totalAdvanced}`)
  console.log(`Target for Levels 4–10: 200 (4-9: 20 each, 10: 100)`)
  console.log(`Coverage: ${((totalAdvanced / 200) * 100).toFixed(1)}%`)

  if (gaps.length > 0) {
    console.log(`\n⚠️ GAPS:\n`)
    gaps.forEach(gap => {
      console.log(`   Level ${gap.level} (${gap.name}): need ${gap.needed} (${gap.current}/${gap.target})`)
    })
    const totalNeeded = gaps.reduce((sum, g) => sum + g.needed, 0)
    console.log(`   Total: ${totalNeeded} new questions`)
  } else {
    console.log(`\n✅ All levels have sufficient coverage!`)
  }

  console.log(`${'='.repeat(80)}\n`)

  return {
    levelQuestions,
    totalAdvanced,
    gaps,
    hasGaps: gaps.length > 0,
  }
}

const result = await buildLevel4to10Coverage()
process.exit(result.hasGaps ? 1 : 0)
