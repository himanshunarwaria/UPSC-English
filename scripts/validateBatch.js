#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// Batch Validation Script
//
// Validates a single question batch for required fields, normalization, and errors.
// Usage: node scripts/validateBatch.js <batchNumber>
// Example: node scripts/validateBatch.js 1
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { normalizeQuestions, getNormalizationStats } from '../src/data/questions/metadataNormalizer.js'
import { validateQuestion } from '../src/data/questions/questionValidator.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Get batch number from command line args
const batchNum = process.argv[2]

if (!batchNum || isNaN(batchNum) || batchNum < 1 || batchNum > 10) {
  console.error('Usage: node validateBatch.js <batchNumber>')
  console.error('Example: node validateBatch.js 1')
  process.exit(1)
}

const batchNumber = parseInt(batchNum, 10)

// ── Load batch parts ──────────────────────────────────────────────────────────

async function loadBatchParts(batchNum) {
  const batchesDir = path.join(__dirname, '../src/data/questions/batches')
  const parts = []

  // List all files in batches dir
  const files = fs.readdirSync(batchesDir)
  const batchNumStr = String(batchNum).padStart(3, '0')

  // Find all part files for this batch (batch_001_part_01, batch_001_part_02, etc.)
  const partFiles = files
    .filter(f => f.startsWith(`batch_${batchNumStr}_part_`) && f.endsWith('.js'))
    .sort()

  if (partFiles.length === 0) {
    console.warn(`No part files found for batch ${batchNum}`)
    return []
  }

  for (const partFile of partFiles) {
    try {
      const filePath = path.join(batchesDir, partFile)
      const module = await import(`file://${filePath}`)
      const questions = module.default || module[Object.keys(module)[0]]

      if (Array.isArray(questions)) {
        parts.push(...questions)
      } else {
        console.warn(`Warning: ${partFile} did not export array`)
      }
    } catch (err) {
      console.error(`Error loading ${partFile}:`, err.message)
    }
  }

  return parts
}

// ── Main validation ──────────────────────────────────────────────────────────

async function validateBatch() {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`BATCH ${batchNumber} VALIDATION REPORT`)
  console.log(`${'='.repeat(80)}\n`)

  // Load questions
  const originalQuestions = await loadBatchParts(batchNumber)

  if (originalQuestions.length === 0) {
    console.error(`No questions found for batch ${batchNumber}`)
    process.exit(1)
  }

  console.log(`📋 Loaded: ${originalQuestions.length} questions`)

  // Normalize
  const normalizedQuestions = normalizeQuestions(originalQuestions)
  const stats = getNormalizationStats(originalQuestions, normalizedQuestions)

  console.log(`\n📊 NORMALIZATION STATS:`)
  console.log(`   Level inferred: ${stats.fieldsInferred.level}/${originalQuestions.length}`)
  console.log(`   Topic inferred: ${stats.fieldsInferred.topic}/${originalQuestions.length}`)
  console.log(`   Subtopic inferred: ${stats.fieldsInferred.subtopic}/${originalQuestions.length}`)
  console.log(`   Question Type mapped: ${stats.fieldsInferred.question_type}/${originalQuestions.length}`)
  console.log(`   Mistake Type inferred: ${stats.fieldsInferred.mistake_type}/${originalQuestions.length}`)

  // Validate
  const seenIds = new Set()
  const validQuestions = []
  const normalizedButNotFull = []
  const questionsWithErrors = []

  console.log(`\n✅ DETAILED VALIDATION:\n`)

  for (let i = 0; i < normalizedQuestions.length; i++) {
    const origQ = originalQuestions[i]
    const normQ = normalizedQuestions[i]
    const qIndex = i + 1

    // Check for critical errors (before normalization)
    const criticalErrors = []

    // Required fields that CANNOT be inferred
    if (!origQ.id) {
      criticalErrors.push('Missing id (cannot infer)')
    } else if (seenIds.has(origQ.id)) {
      criticalErrors.push(`Duplicate id: ${origQ.id}`)
    } else {
      seenIds.add(origQ.id)
    }

    if (!origQ.question && !origQ.question_text) {
      criticalErrors.push('Missing question text')
    }

    if (origQ.options === undefined || !Array.isArray(origQ.options) || origQ.options.length !== 4) {
      criticalErrors.push('Missing or invalid options (not 4)')
    }

    if (origQ.correctAnswer === undefined) {
      criticalErrors.push('Missing correctAnswer')
    }

    if (!origQ.explanation) {
      criticalErrors.push('Missing explanation')
    }

    // Check if normalized question passes validation
    const validationResult = validateQuestion(normQ, new Set())

    if (criticalErrors.length > 0) {
      questionsWithErrors.push({
        index: qIndex,
        id: origQ.id || 'UNKNOWN',
        errors: criticalErrors,
      })
    } else if (validationResult.errors.length === 0) {
      validQuestions.push(normQ.id)
    } else {
      normalizedButNotFull.push({
        index: qIndex,
        id: normQ.id,
        errors: validationResult.errors,
        warnings: validationResult.warnings,
      })
    }
  }

  // Report
  console.log(`✅ Valid & fully normalized: ${validQuestions.length}/${originalQuestions.length}`)
  console.log(`⚠️ Normalized but schema warnings: ${normalizedButNotFull.length}/${originalQuestions.length}`)
  console.log(`❌ Critical errors (cannot normalize): ${questionsWithErrors.length}/${originalQuestions.length}`)

  if (normalizedButNotFull.length > 0) {
    console.log(`\n📝 Questions needing review (normalized but with warnings):\n`)
    normalizedButNotFull.slice(0, 5).forEach(q => {
      console.log(`   Q#${q.index} (${q.id}):`)
      q.errors.forEach(err => console.log(`     ❌ ${err}`))
      q.warnings.forEach(warn => console.log(`     ⚠️ ${warn}`))
    })
    if (normalizedButNotFull.length > 5) {
      console.log(`   ... and ${normalizedButNotFull.length - 5} more`)
    }
  }

  if (questionsWithErrors.length > 0) {
    console.log(`\n🔴 CRITICAL ERRORS (Real issues, not normalizable):\n`)
    questionsWithErrors.slice(0, 5).forEach(q => {
      console.log(`   Q#${q.index} (${q.id}):`)
      q.errors.forEach(err => console.log(`     ❌ ${err}`))
    })
    if (questionsWithErrors.length > 5) {
      console.log(`   ... and ${questionsWithErrors.length - 5} more`)
    }
  }

  // Category distribution
  const categories = {}
  normalizedQuestions.forEach(q => {
    const topic = q.topic || 'Unknown'
    categories[topic] = (categories[topic] || 0) + 1
  })

  console.log(`\n📚 CATEGORY DISTRIBUTION:`)
  Object.entries(categories).forEach(([topic, count]) => {
    console.log(`   ${topic}: ${count} questions`)
  })

  // Level distribution
  const levels = {}
  normalizedQuestions.forEach(q => {
    const level = q.level || 'Unknown'
    levels[level] = (levels[level] || 0) + 1
  })

  console.log(`\n📈 LEVEL DISTRIBUTION:`)
  for (let i = 1; i <= 10; i++) {
    const count = levels[i] || 0
    const bar = '█'.repeat(Math.ceil(count / 2))
    console.log(`   Level ${i}: ${count.toString().padStart(2)} ${bar}`)
  }

  // Summary
  console.log(`\n${'='.repeat(80)}`)
  console.log(`SUMMARY:`)
  console.log(`${'='.repeat(80)}`)
  console.log(`Total Questions: ${originalQuestions.length}`)
  console.log(`Fully Valid: ${validQuestions.length} (${((validQuestions.length / originalQuestions.length) * 100).toFixed(1)}%)`)
  console.log(`Normalized: ${normalizedQuestions.length} (${((normalizedQuestions.length / originalQuestions.length) * 100).toFixed(1)}%)`)
  console.log(`Errors: ${questionsWithErrors.length}`)

  if (questionsWithErrors.length === 0) {
    console.log(`\n✅ BATCH ${batchNumber} VALIDATION PASSED`)
    console.log(`All questions are valid or successfully normalized.`)
  } else {
    console.log(`\n⚠️ BATCH ${batchNumber} NEEDS REVIEW`)
    console.log(`${questionsWithErrors.length} questions have critical errors.`)
  }

  console.log(`${'='.repeat(80)}\n`)

  // Exit code
  process.exit(questionsWithErrors.length > 0 ? 1 : 0)
}

// Run validation
validateBatch().catch(err => {
  console.error('Validation error:', err)
  process.exit(1)
})
