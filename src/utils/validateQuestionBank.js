#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// UPSC Grammar Bank Validator
//
// Run:  node src/utils/validateQuestionBank.js
//   or: npm run validate:questions
//
// Exit codes:
//   0 — all checks passed (warnings allowed)
//   1 — one or more ERROR-level failures found
//
// Reports:
//   Structural errors   → ERROR  (critical, must fix before merging)
//   Quality warnings    → WARN   (review and improve)
//   Quality rejections  → REJECT (remove from bank immediately)
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync } from 'fs'
import { resolve, dirname }  from 'path'
import { fileURLToPath } from 'url'

import {
  ALLOWED_CATEGORIES,
  ALLOWED_TYPES,
  ALLOWED_DIFFICULTIES,
  ALLOWED_SOURCE_STATUSES,
  TIME_BOUNDS,
  BROAD_RULE_NAMES,
  SCHOOL_LEVEL_PATTERNS,
  FAKE_PYQ_PATTERNS,
  QUALITY_THRESHOLD_WARN,
  QUALITY_THRESHOLD_REJECT,
  REQUIRED_FIELDS,
} from '../data/questions/questionSchema.js'

import { grammarBankQuestions as BANK } from '../data/questions/index.js'
import { BANK_TOTALS }                 from '../data/questions/questionBankPlan.js'

// ─────────────────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url))
const PASS = '✓'
const FAIL = '✗'
const WARN_ICON = '⚠'
const SEP  = '━'.repeat(66)
const SEP2 = '─'.repeat(66)

// ANSI colours (suppressed in CI if NO_COLOR is set)
const NO_COLOR = process.env.NO_COLOR || process.env.CI
const c = {
  reset:  NO_COLOR ? '' : '\x1b[0m',
  bold:   NO_COLOR ? '' : '\x1b[1m',
  red:    NO_COLOR ? '' : '\x1b[31m',
  green:  NO_COLOR ? '' : '\x1b[32m',
  yellow: NO_COLOR ? '' : '\x1b[33m',
  cyan:   NO_COLOR ? '' : '\x1b[36m',
  dim:    NO_COLOR ? '' : '\x1b[2m',
}

// ─────────────────────────────────────────────────────────────────────────────
// Issue accumulator
// ─────────────────────────────────────────────────────────────────────────────

const issues = []

function addIssue(level, questionId, check, message) {
  issues.push({ level, questionId, check, message })
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Structural validators
// ─────────────────────────────────────────────────────────────────────────────

function checkRequiredFields(q) {
  for (const field of REQUIRED_FIELDS) {
    if (q[field] === undefined || q[field] === null || q[field] === '') {
      addIssue('ERROR', q.id || '(no id)', 'required-fields', `Missing required field: '${field}'`)
    }
  }
}

function checkIdFormat(q) {
  if (!q.id) return
  if (!/^[a-z]{2,5}_\d{3}_\d{4}$/.test(q.id)) {
    addIssue('ERROR', q.id, 'id-format',
      `ID format invalid. Expected {code}_{batch:3d}_{seq:4d}, got '${q.id}'`)
  }
}

function checkAllowedValues(q) {
  if (q.category && !ALLOWED_CATEGORIES.has(q.category)) {
    addIssue('ERROR', q.id, 'category',
      `Invalid category '${q.category}'. Must be one of the 16 allowed values.`)
  }
  if (q.type && !ALLOWED_TYPES.has(q.type)) {
    addIssue('ERROR', q.id, 'type',
      `Invalid type '${q.type}'. Must be one of: ${[...ALLOWED_TYPES].join(', ')}.`)
  }
  if (q.difficulty && !ALLOWED_DIFFICULTIES.has(q.difficulty)) {
    addIssue('ERROR', q.id, 'difficulty',
      `Invalid difficulty '${q.difficulty}'. Must be B1|B2|C1|C2 (not easy/medium/hard).`)
  }
  if (q.sourceStatus && !ALLOWED_SOURCE_STATUSES.has(q.sourceStatus)) {
    addIssue('ERROR', q.id, 'source-status',
      `Invalid sourceStatus '${q.sourceStatus}'. Must be 'sample-practice' or 'real-pyq'.`)
  }
  if (q.section && q.section !== 'Grammar') {
    addIssue('ERROR', q.id, 'section',
      `Section must be 'Grammar', got '${q.section}'.`)
  }
  if (q.examFocus && q.examFocus !== 'UPSC CSE Compulsory English') {
    addIssue('ERROR', q.id, 'exam-focus',
      `examFocus must be 'UPSC CSE Compulsory English', got '${q.examFocus}'.`)
  }
}

function checkOptions(q) {
  if (!Array.isArray(q.options)) {
    addIssue('ERROR', q.id, 'options', 'options must be an array')
    return
  }
  if (q.options.length !== 4) {
    addIssue('ERROR', q.id, 'options',
      `options must have exactly 4 elements, found ${q.options.length}`)
    return
  }
  q.options.forEach((opt, i) => {
    if (typeof opt !== 'string' || opt.trim() === '') {
      addIssue('ERROR', q.id, 'options', `options[${i}] is empty or not a string`)
    }
  })
  // All 4 options must be distinct
  const unique = new Set(q.options.map(o => o.trim().toLowerCase()))
  if (unique.size < 4) {
    addIssue('ERROR', q.id, 'options', 'All 4 options must be distinct')
  }
}

function checkCorrectAnswer(q) {
  if (typeof q.correctAnswer !== 'number') {
    addIssue('ERROR', q.id, 'correct-answer', 'correctAnswer must be a number')
    return
  }
  if (q.correctAnswer < 0 || q.correctAnswer > 3 || !Number.isInteger(q.correctAnswer)) {
    addIssue('ERROR', q.id, 'correct-answer',
      `correctAnswer must be integer 0–3, got ${q.correctAnswer}`)
  }
}

function checkEstimatedTime(q) {
  if (typeof q.estimatedTime !== 'number' || q.estimatedTime <= 0) {
    addIssue('ERROR', q.id, 'estimated-time', 'estimatedTime must be a positive number (minutes)')
    return
  }
  const bounds = TIME_BOUNDS[q.type]
  if (bounds && (q.estimatedTime < bounds.min || q.estimatedTime > bounds.max)) {
    addIssue('WARN', q.id, 'estimated-time',
      `estimatedTime ${q.estimatedTime}m is outside realistic range [${bounds.min}–${bounds.max}] for type '${q.type}'`)
  }
}

function checkBatchNo(q) {
  if (typeof q.batchNo !== 'number' || !Number.isInteger(q.batchNo) || q.batchNo < 1) {
    addIssue('ERROR', q.id, 'batch-no', 'batchNo must be a positive integer')
    return
  }
  // Cross-check: batch number in ID should match batchNo field
  if (q.id && q.id.match(/^[a-z]+_(\d{3})_/)) {
    const idBatch = parseInt(q.id.match(/^[a-z]+_(\d{3})_/)[1], 10)
    if (idBatch !== q.batchNo) {
      addIssue('ERROR', q.id, 'batch-no',
        `batchNo field (${q.batchNo}) does not match batch number in ID (${idBatch})`)
    }
  }
}

function checkTags(q) {
  if (!Array.isArray(q.tags) || q.tags.length === 0) {
    addIssue('ERROR', q.id, 'tags', 'tags must be a non-empty array')
    return
  }
  if (q.tags.length < 2) {
    addIssue('WARN', q.id, 'tags', 'tags array has only 1 entry — add at least the category code and difficulty')
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Content quality validators
// ─────────────────────────────────────────────────────────────────────────────

function checkQuestionText(q) {
  if (!q.question) return
  if (q.question.length < 40) {
    addIssue('WARN', q.id, 'question-length',
      `Question too short (${q.question.length} chars). UPSC-level questions need more context.`)
  }
  if (q.question.length > 400) {
    addIssue('WARN', q.id, 'question-length',
      `Question very long (${q.question.length} chars). Split into passage + sub-questions if needed.`)
  }
  // School-level detection
  for (const { pattern, reason } of SCHOOL_LEVEL_PATTERNS) {
    if (pattern.test(q.question)) {
      addIssue('WARN', q.id, 'school-level', `School-level content detected: ${reason}`)
    }
  }
}

function checkExplanation(q) {
  if (!q.explanation) return
  if (q.explanation.length < 50) {
    addIssue('WARN', q.id, 'explanation',
      `Explanation too short (${q.explanation.length} chars, min 50). State the rule explicitly.`)
  }
  if (q.explanation.length > 250) {
    addIssue('WARN', q.id, 'explanation',
      `Explanation too long (${q.explanation.length} chars, max 250). Be concise.`)
  }
  // Explanation that just says "Option X is correct" without stating the rule
  if (/^option [abcd] is (correct|right)/i.test(q.explanation.trim())) {
    addIssue('ERROR', q.id, 'explanation',
      "Explanation must state the grammar rule, not just confirm the answer ('Option B is correct').")
  }
}

function checkTrap(q) {
  if (!q.trap) {
    addIssue('ERROR', q.id, 'trap', 'trap field is required for all questions')
    return
  }
  if (q.trap.length < 30) {
    addIssue('WARN', q.id, 'trap',
      `Trap too vague (${q.trap.length} chars, min 30). Name the specific cognitive shortcut.`)
  }
  // Generic trap statements that add no value
  const genericTraps = [
    /aspirants may confuse/i,
    /students often make this mistake/i,
    /this is a common error/i,
    /people don'?t know this rule/i,
  ]
  for (const pattern of genericTraps) {
    if (pattern.test(q.trap)) {
      addIssue('WARN', q.id, 'trap',
        `Trap is too generic ('${q.trap.slice(0, 50)}...'). Describe the specific mislead.`)
    }
  }
}

function checkRuleTested(q) {
  if (!q.ruleTested) return
  if (BROAD_RULE_NAMES.has(q.ruleTested)) {
    addIssue('ERROR', q.id, 'rule-tested',
      `ruleTested '${q.ruleTested}' is too broad — it's just the category name. ` +
      `Use a specific sub-rule like "Neither...nor proximity rule".`)
  }
  if (q.ruleTested.length < 15) {
    addIssue('WARN', q.id, 'rule-tested',
      `ruleTested '${q.ruleTested}' may be too brief. Be more specific.`)
  }
}

function checkSkillTested(q) {
  if (!q.skillTested) {
    addIssue('ERROR', q.id, 'skill-tested', 'skillTested field is required')
    return
  }
  if (q.skillTested.length < 20) {
    addIssue('WARN', q.id, 'skill-tested',
      `skillTested '${q.skillTested}' is too brief — describe the exam skill developed.`)
  }
}

function checkSourceHonesty(q) {
  if (!q.sourceStatus || !q.sourceLabel) return
  // Check for fake PYQ claims in sourceLabel
  for (const pattern of FAKE_PYQ_PATTERNS) {
    if (pattern.test(q.sourceLabel) && q.sourceStatus !== 'real-pyq') {
      addIssue('ERROR', q.id, 'source-honesty',
        `sourceLabel '${q.sourceLabel}' implies a real PYQ but sourceStatus is 'sample-practice'.`)
    }
  }
  // Check sourceLabel is honest when sourceStatus is sample-practice
  if (q.sourceStatus === 'sample-practice' && q.sourceLabel === 'UPSC PYQ') {
    addIssue('ERROR', q.id, 'source-honesty',
      "sourceLabel 'UPSC PYQ' is misleading for a sample-practice question. Use 'UPSC-style Practice'.")
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Cross-question validators (requires full bank)
// ─────────────────────────────────────────────────────────────────────────────

function checkDuplicateIds(questions) {
  const seen  = new Map()
  const dupes = []
  for (const q of questions) {
    if (!q.id) continue
    if (seen.has(q.id)) {
      dupes.push(q.id)
      addIssue('ERROR', q.id, 'duplicate-id',
        `Duplicate ID — also found at position ${seen.get(q.id)}. IDs must be globally unique.`)
    } else {
      seen.set(q.id, questions.indexOf(q))
    }
  }
  return dupes.length
}

function checkDuplicateQuestionText(questions) {
  const stems  = new Map()
  let dupCount = 0
  for (const q of questions) {
    if (!q.question) continue
    const key = q.question.toLowerCase().replace(/[^a-z0-9 ]/g, '').slice(0, 80).trim()
    if (stems.has(key)) {
      dupCount++
      addIssue('WARN', q.id, 'duplicate-text',
        `Similar question text detected (first 80 chars match ID '${stems.get(key)}'). ` +
        `Review for duplication.`)
    } else {
      stems.set(key, q.id)
    }
  }
  return dupCount
}

function checkDifficultyBalance(questions) {
  if (questions.length < 10) return  // Not enough to report
  const counts = { B1: 0, B2: 0, C1: 0, C2: 0 }
  for (const q of questions) {
    if (counts[q.difficulty] !== undefined) counts[q.difficulty]++
  }
  const total = questions.length
  const pcts  = Object.fromEntries(
    Object.entries(counts).map(([k, v]) => [k, Math.round((v / total) * 100)])
  )
  // Acceptable ranges: B1 10-20%, B2 30-40%, C1 35-45%, C2 8-15%
  const ranges = { B1: [10, 20], B2: [30, 40], C1: [35, 45], C2: [8, 15] }
  for (const [level, [min, max]] of Object.entries(ranges)) {
    if (pcts[level] < min || pcts[level] > max) {
      addIssue('WARN', '(bank-wide)', 'difficulty-balance',
        `${level} difficulty is ${pcts[level]}% of bank (target: ${min}–${max}%). ` +
        `Adjust batch composition.`)
    }
  }
  return counts
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Quality scorer
// ─────────────────────────────────────────────────────────────────────────────

function scoreTrap(q) {
  if (!q.trap || q.trap.length === 0)  return 0
  if (q.trap.length < 30)             return 1
  if (q.trap.length < 60)             return 2
  return 3
}

function scoreExplanation(q) {
  if (!q.explanation || q.explanation.length === 0) return 0
  if (q.explanation.length < 50)                    return 1
  if (q.explanation.length < 80)                    return 2
  // Bonus: names a specific rule (has grammar-related capital terms)
  const hasRuleName = /\b(noun|verb|pronoun|clause|participle|subjunctive|gerund|infinitive|preposition|conjunction|agreement|backshift|passive|active|tense|article|determiner|modifier|correlative|conditional|indirect|reported|formal|collocation|parallel)\b/i.test(q.explanation)
  return hasRuleName ? 3 : 2
}

function scoreRuleSpec(q) {
  if (!q.ruleTested || q.ruleTested.length === 0)   return 0
  if (BROAD_RULE_NAMES.has(q.ruleTested))            return 0
  if (q.ruleTested.length < 20)                      return 1
  return 2
}

function scoreNonObvious(q) {
  if (!q.question) return 0
  if (q.question.length < 40) return 0
  // Check for formal register markers
  const formalMarkers = /\b(committee|ministry|government|authority|pursuant|regulation|provision|circular|notification|tribunal|legislature|ordinance|directive|mandate|resolution|commissioner|director|secretary|officer|official|report|submission|procedure|protocol)\b/i
  const hasFormalContext = formalMarkers.test(q.question)
  if (q.question.length >= 80 && hasFormalContext) return 2
  if (q.question.length >= 50) return 1
  return 0
}

export function computeQualityScore(q) {
  const trapScore    = scoreTrap(q)
  const explScore    = scoreExplanation(q)
  const ruleScore    = scoreRuleSpec(q)
  const obvScore     = scoreNonObvious(q)
  const total        = trapScore + explScore + ruleScore + obvScore
  return {
    total,
    breakdown: { trap: trapScore, explanation: explScore, ruleSpec: ruleScore, nonObvious: obvScore },
  }
}

function applyQualityScores(questions) {
  let lowCount    = 0
  let rejectCount = 0
  for (const q of questions) {
    const { total, breakdown } = computeQualityScore(q)
    q.qualityScore = total  // Mutate in place for report

    if (total < QUALITY_THRESHOLD_REJECT) {
      rejectCount++
      addIssue('REJECT', q.id, 'quality-score',
        `Score ${total}/10 — REJECTED. ` +
        `trap=${breakdown.trap}/3 explanation=${breakdown.explanation}/3 ruleSpec=${breakdown.ruleSpec}/2 nonObvious=${breakdown.nonObvious}/2. ` +
        `Remove from bank.`)
    } else if (total < QUALITY_THRESHOLD_WARN) {
      lowCount++
      addIssue('WARN', q.id, 'quality-score',
        `Score ${total}/10 — below threshold of ${QUALITY_THRESHOLD_WARN}. ` +
        `trap=${breakdown.trap}/3 explanation=${breakdown.explanation}/3 ruleSpec=${breakdown.ruleSpec}/2 nonObvious=${breakdown.nonObvious}/2. ` +
        `Improve before publishing.`)
    }
  }
  return { lowCount, rejectCount }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Run all validators
// ─────────────────────────────────────────────────────────────────────────────

function validateAll(questions) {
  // Per-question checks
  for (const q of questions) {
    checkRequiredFields(q)
    checkIdFormat(q)
    checkAllowedValues(q)
    checkOptions(q)
    checkCorrectAnswer(q)
    checkEstimatedTime(q)
    checkBatchNo(q)
    checkTags(q)
    checkQuestionText(q)
    checkExplanation(q)
    checkTrap(q)
    checkRuleTested(q)
    checkSkillTested(q)
    checkSourceHonesty(q)
  }

  // Bank-wide checks
  const dupIds    = checkDuplicateIds(questions)
  const dupTexts  = checkDuplicateQuestionText(questions)
  const diffCounts = checkDifficultyBalance(questions)

  // Quality scoring
  const { lowCount, rejectCount } = applyQualityScores(questions)

  return { dupIds, dupTexts, diffCounts, lowCount, rejectCount }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. Report printer
// ─────────────────────────────────────────────────────────────────────────────

function printReport(questions, stats) {
  const errors   = issues.filter(i => i.level === 'ERROR')
  const warns    = issues.filter(i => i.level === 'WARN')
  const rejects  = issues.filter(i => i.level === 'REJECT')

  console.log(`\n${c.bold}${SEP}${c.reset}`)
  console.log(`${c.bold} UPSC Grammar Bank Validator v2.0${c.reset}`)
  console.log(SEP)

  // ── Bank status ────────────────────────────────────────────────────────────
  const pct = questions.length > 0
    ? Math.round((questions.length / BANK_TOTALS.total) * 100)
    : 0
  console.log(`\n${c.bold} Bank Status${c.reset}`)
  console.log(SEP2)
  console.log(`  Questions loaded      : ${c.bold}${questions.length}${c.reset}`)
  console.log(`  Planned target        : ${BANK_TOTALS.total}`)
  console.log(`  Completion            : ${c.bold}${pct}%${c.reset}  (${questions.length} / ${BANK_TOTALS.total})`)

  if (questions.length === 0) {
    console.log(`\n  ${c.yellow}${WARN_ICON} Bank is empty — no questions to validate.${c.reset}`)
    console.log(`    Add approved batches to src/data/questions/batches/`)
    console.log(`    then import them in src/data/questions/index.js\n`)
  }

  // ── Category breakdown ─────────────────────────────────────────────────────
  if (questions.length > 0) {
    console.log(`\n${c.bold} Category Breakdown${c.reset}`)
    console.log(SEP2)
    const catCounts = {}
    for (const q of questions) {
      catCounts[q.category] = (catCounts[q.category] || 0) + 1
    }
    for (const [cat, count] of Object.entries(catCounts).sort((a,b) => b[1]-a[1])) {
      console.log(`  ${String(count).padStart(5)}  ${cat}`)
    }
  }

  // ── Difficulty distribution ────────────────────────────────────────────────
  if (questions.length > 0 && stats.diffCounts) {
    console.log(`\n${c.bold} Difficulty Distribution${c.reset}`)
    console.log(SEP2)
    const counts = stats.diffCounts
    const total  = questions.length
    for (const level of ['B1', 'B2', 'C1', 'C2']) {
      const n   = counts[level] || 0
      const pct = total > 0 ? Math.round((n / total) * 100) : 0
      const bar = '█'.repeat(Math.round(pct / 2)) + '░'.repeat(50 - Math.round(pct / 2))
      console.log(`  ${level}  ${String(n).padStart(5)} (${String(pct).padStart(3)}%)  ${bar.slice(0,30)}`)
    }
  }

  // ── Validation results ─────────────────────────────────────────────────────
  console.log(`\n${c.bold} Validation Results${c.reset}`)
  console.log(SEP2)

  const checkResults = [
    { name: 'Unique IDs',           pass: stats.dupIds === 0,    detail: stats.dupIds > 0 ? `${stats.dupIds} duplicates` : 'all unique' },
    { name: 'Unique question stems', pass: stats.dupTexts === 0,  detail: stats.dupTexts > 0 ? `${stats.dupTexts} similar pairs` : 'no duplicates detected' },
    { name: 'Quality scores ≥ 7',   pass: stats.lowCount === 0,  detail: stats.lowCount > 0 ? `${stats.lowCount} below threshold` : 'all passing' },
    { name: 'No auto-rejects',      pass: stats.rejectCount === 0, detail: stats.rejectCount > 0 ? `${stats.rejectCount} rejected` : 'none rejected' },
    { name: 'No structural errors', pass: errors.length === 0,    detail: errors.length > 0 ? `${errors.length} errors` : 'clean' },
  ]

  for (const { name, pass, detail } of checkResults) {
    const icon  = pass ? `${c.green}${PASS}${c.reset}` : `${c.red}${FAIL}${c.reset}`
    const info  = pass ? `${c.dim}${detail}${c.reset}` : `${c.red}${detail}${c.reset}`
    console.log(`  ${icon}  ${name.padEnd(28)} ${info}`)
  }

  // ── Issues list ────────────────────────────────────────────────────────────
  if (issues.length > 0) {
    console.log(`\n${c.bold} Issues (${issues.length} total)${c.reset}`)
    console.log(SEP2)

    const printGroup = (level, list, color) => {
      if (list.length === 0) return
      const label = { ERROR: 'ERRORS', WARN: 'WARNINGS', REJECT: 'AUTO-REJECTS' }[level]
      console.log(`\n  ${color}${c.bold}${label} (${list.length})${c.reset}`)
      for (const issue of list) {
        const id  = String(issue.questionId).padEnd(18)
        const chk = String(`[${issue.check}]`).padEnd(22)
        console.log(`    ${color}${id}${c.reset} ${c.dim}${chk}${c.reset} ${issue.message}`)
      }
    }

    printGroup('REJECT', rejects, c.red)
    printGroup('ERROR',  errors,  c.red)
    printGroup('WARN',   warns,   c.yellow)
  }

  // ── Final result ───────────────────────────────────────────────────────────
  console.log(`\n${c.bold}${SEP}${c.reset}`)
  const hasCritical = errors.length > 0 || rejects.length > 0
  if (questions.length === 0) {
    console.log(`${c.bold} Status: ${c.cyan}EMPTY BANK${c.reset}${c.bold} — add batches to begin validation.${c.reset}`)
  } else if (hasCritical) {
    console.log(`${c.bold} Result: ${c.red}FAILED${c.reset}${c.bold} — ${errors.length} error(s), ${rejects.length} auto-reject(s).${c.reset}`)
    console.log(` Fix all ERRORs and REJECTS before merging batches into production.`)
  } else if (warns.length > 0) {
    console.log(`${c.bold} Result: ${c.yellow}PASSED WITH WARNINGS${c.reset}${c.bold} — ${warns.length} warning(s).${c.reset}`)
    console.log(` Bank is usable, but consider improving flagged questions.`)
  } else {
    console.log(`${c.bold} Result: ${c.green}PASSED${c.reset}${c.bold} — all checks clean.${c.reset}`)
  }
  console.log(`${c.bold}${SEP}${c.reset}\n`)

  return hasCritical
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. Entry point
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const questions = BANK

  // Run all validators
  const stats = validateAll(questions)

  // Print report
  const failed = printReport(questions, stats)

  // Exit code
  process.exit(failed ? 1 : 0)
}

main()
