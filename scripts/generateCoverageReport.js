#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Question Coverage Report Generator
//
// Analyzes all questions and generates comprehensive coverage metrics.
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { normalizeQuestions } from '../src/data/questions/metadataNormalizer.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function loadAllQuestions() {
  const batchesDir = path.join(__dirname, '../src/data/questions/batches')
  const allQuestions = []
  const seenIds = new Set()
  const duplicateIds = []

  const files = fs.readdirSync(batchesDir)
  const batchFiles = files.filter(f => f.startsWith('batch_') && f.endsWith('.js')).sort()

  for (const file of batchFiles) {
    try {
      const filePath = path.join(batchesDir, file)
      const module = await import(`file://${filePath}`)
      const qs = module.default || module[Object.keys(module)[0]]

      if (Array.isArray(qs)) {
        const normalized = normalizeQuestions(qs)
        for (const q of normalized) {
          if (seenIds.has(q.id)) {
            duplicateIds.push(q.id)
          } else {
            seenIds.add(q.id)
            allQuestions.push(q)
          }
        }
      }
    } catch (err) {
      // Silent fail
    }
  }

  return { allQuestions, duplicateIds }
}

async function generateReport() {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`COMPREHENSIVE QUESTION COVERAGE REPORT`)
  console.log(`${'='.repeat(80)}\n`)

  const { allQuestions, duplicateIds } = await loadAllQuestions()

  // 1. Total Questions
  console.log(`1. TOTAL EXISTING QUESTIONS AVAILABLE`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`Total Questions: ${allQuestions.length}\n`)

  // 2-5. Level Coverage
  console.log(`2-5. QUESTIONS MAPPED TO LEVELS`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  const byLevel = {}
  for (let i = 1; i <= 10; i++) {
    byLevel[i] = allQuestions.filter(q => q.level === i)
  }

  for (let level = 1; level <= 10; level++) {
    const count = byLevel[level].length
    console.log(`Level ${level}: ${count} questions`)
  }
  console.log('')

  // 6. Subtopics with < 20 questions
  console.log(`6. SUBTOPICS WITH FEWER THAN 20 QUESTIONS`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  const bySubtopic = {}
  for (const q of allQuestions) {
    const key = q.subtopic || 'Unknown'
    bySubtopic[key] = (bySubtopic[key] || []).concat(q)
  }

  const gapSubtopics = Object.entries(bySubtopic)
    .filter(([_, qs]) => qs.length < 20)
    .sort((a, b) => a[1].length - b[1].length)

  if (gapSubtopics.length > 0) {
    gapSubtopics.forEach(([subtopic, qs]) => {
      console.log(`  ${subtopic}: ${qs.length}/20 questions`)
    })
  } else {
    console.log(`  All subtopics have 20+ questions`)
  }
  console.log('')

  // 7. Subtopics with >= 20 questions
  console.log(`7. SUBTOPICS WITH 20+ QUESTIONS (SUFFICIENT)`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  const sufficientSubtopics = Object.entries(bySubtopic)
    .filter(([_, qs]) => qs.length >= 20)
    .sort((a, b) => b[1].length - a[1].length)

  if (sufficientSubtopics.length > 0) {
    sufficientSubtopics.slice(0, 20).forEach(([subtopic, qs]) => {
      console.log(`  ${subtopic}: ${qs.length} questions`)
    })
    if (sufficientSubtopics.length > 20) {
      console.log(`  ... and ${sufficientSubtopics.length - 20} more`)
    }
  }
  console.log('')

  // 8. Duplicate ID Issues
  console.log(`8. DUPLICATE ID ISSUES`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  if (duplicateIds.length > 0) {
    console.log(`❌ Found ${duplicateIds.length} duplicate IDs:`)
    duplicateIds.slice(0, 10).forEach(id => console.log(`   ${id}`))
    if (duplicateIds.length > 10) {
      console.log(`   ... and ${duplicateIds.length - 10} more`)
    }
  } else {
    console.log(`✅ No duplicate IDs found`)
  }
  console.log('')

  // 9. Missing Required Fields
  console.log(`9. MISSING REQUIRED FIELDS ISSUES`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

  const missingIssues = {
    explanation: [],
    correctAnswer: [],
    options: [],
  }

  for (const q of allQuestions) {
    if (!q.explanation || q.explanation.length < 30) {
      missingIssues.explanation.push(q.id)
    }
    if (q.correct_answer === undefined && q.correctAnswer === undefined) {
      missingIssues.correctAnswer.push(q.id)
    }
    if (!q.options || !Array.isArray(q.options) || q.options.length !== 4) {
      missingIssues.options.push(q.id)
    }
  }

  let hasIssues = false
  if (missingIssues.explanation.length > 0) {
    console.log(`❌ Missing/short explanation: ${missingIssues.explanation.length}`)
    hasIssues = true
  }
  if (missingIssues.correctAnswer.length > 0) {
    console.log(`❌ Missing correct_answer: ${missingIssues.correctAnswer.length}`)
    hasIssues = true
  }
  if (missingIssues.options.length > 0) {
    console.log(`❌ Invalid options: ${missingIssues.options.length}`)
    hasIssues = true
  }

  if (!hasIssues) {
    console.log(`✅ All required fields present in all questions`)
  }
  console.log('')

  // 10. Coverage by Difficulty
  console.log(`BONUS: COVERAGE BY DIFFICULTY`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  const byDifficulty = {}
  for (const q of allQuestions) {
    const diff = q.difficulty || 'Unknown'
    byDifficulty[diff] = (byDifficulty[diff] || 0) + 1
  }

  Object.keys(byDifficulty).sort().forEach(diff => {
    console.log(`${diff}: ${byDifficulty[diff]} questions`)
  })
  console.log('')

  // 11. Coverage by Question Type
  console.log(`BONUS: COVERAGE BY QUESTION TYPE`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  const byType = {}
  for (const q of allQuestions) {
    const type = q.question_type || q.type || 'Unknown'
    byType[type] = (byType[type] || 0) + 1
  }

  Object.entries(byType)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      console.log(`${type}: ${count}`)
    })
  console.log('')

  // 12. Coverage by Topic
  console.log(`BONUS: COVERAGE BY TOPIC`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  const byTopic = {}
  for (const q of allQuestions) {
    const topic = q.topic || 'Unknown'
    byTopic[topic] = (byTopic[topic] || 0) + 1
  }

  Object.entries(byTopic)
    .sort((a, b) => b[1] - a[1])
    .forEach(([topic, count]) => {
      console.log(`${topic}: ${count}`)
    })
  console.log('')

  // 13. Coverage by Mistake Type
  console.log(`BONUS: COVERAGE BY MISTAKE TYPE`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  const byMistakeType = {}
  for (const q of allQuestions) {
    const mistakeType = q.mistake_type || 'Unknown'
    byMistakeType[mistakeType] = (byMistakeType[mistakeType] || 0) + 1
  }

  Object.entries(byMistakeType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .forEach(([type, count]) => {
      console.log(`${type}: ${count}`)
    })

  const totalMistakeTypes = Object.keys(byMistakeType).length
  if (totalMistakeTypes > 20) {
    console.log(`... and ${totalMistakeTypes - 20} more mistake types`)
  }
  console.log('')

  // Summary & Gaps
  console.log(`${'='.repeat(80)}`)
  console.log(`SUMMARY & GAPS`)
  console.log(`${'='.repeat(80)}\n`)

  const gaps = []

  // Level 1 gap
  if (byLevel[1].length < 120) {
    gaps.push({
      scope: 'Level 1',
      needed: 120 - byLevel[1].length,
      current: byLevel[1].length,
    })
  }

  // Level 4 gap
  if (byLevel[4].length < 20) {
    gaps.push({
      scope: 'Level 4 (Sentence Connectors)',
      needed: 20 - byLevel[4].length,
      current: byLevel[4].length,
    })
  }

  // Level 5 gap
  if (byLevel[5].length < 20) {
    gaps.push({
      scope: 'Level 5 (Vocabulary)',
      needed: 20 - byLevel[5].length,
      current: byLevel[5].length,
    })
  }

  // Level 9 gap
  if (byLevel[9].length < 20) {
    gaps.push({
      scope: 'Level 9 (Answer-Writing)',
      needed: 20 - byLevel[9].length,
      current: byLevel[9].length,
    })
  }

  // Subtopic gaps
  for (const [subtopic, qs] of Object.entries(bySubtopic)) {
    if (qs.length < 20 && qs.length > 0) {
      gaps.push({
        scope: `Subtopic: ${subtopic}`,
        needed: 20 - qs.length,
        current: qs.length,
      })
    }
  }

  if (gaps.length > 0) {
    console.log(`NEW QUESTIONS NEEDED:\n`)
    gaps.sort((a, b) => b.needed - a.needed).forEach(gap => {
      console.log(`  ${gap.scope}: ${gap.needed} more (${gap.current}/20)`)
    })
    const totalNeeded = gaps.reduce((sum, g) => sum + g.needed, 0)
    console.log(`\n  TOTAL NEW QUESTIONS REQUIRED: ${totalNeeded}\n`)
  } else {
    console.log(`✅ All levels and subtopics have sufficient coverage!\n`)
  }

  console.log(`${'='.repeat(80)}\n`)
}

await generateReport()
