// ─────────────────────────────────────────────────────────────────────────────
// Enhanced Question Validator for UPSC English Grammar Bank
//
// Validates questions against comprehensive schema requirements.
// Checks required fields, types, levels, and relationships.
// ─────────────────────────────────────────────────────────────────────────────

import {
  ALLOWED_TYPES,
  ALLOWED_DIFFICULTIES,
  ALLOWED_LEVELS,
  ALLOWED_MISTAKE_TYPES,
  ALLOWED_CATEGORIES,
} from './questionSchema.js'

/**
 * Validate a single question against all schema requirements
 * Supports both legacy field names (question, correctAnswer, type)
 * and new field names (question_text, correct_answer, question_type)
 * @param {Object} question - Question object to validate
 * @param {Set} seenIds - Set of previously seen question IDs (for uniqueness check)
 * @returns {Object} - { isValid: boolean, errors: string[], warnings: string[] }
 */
export function validateQuestion(question, seenIds = new Set()) {
  const errors = []
  const warnings = []

  // Normalize field names (support both legacy and new names)
  const q = {
    ...question,
    question_text: question.question_text || question.question,
    correct_answer: question.correct_answer !== undefined ? question.correct_answer : question.correctAnswer,
    question_type: question.question_type || question.type,
  }

  // 1. Check required fields exist
  const requiredFields = [
    'id',
    'level',
    'topic',
    'subtopic',
    'question_type',
    'question_text',
    'correct_answer',
    'explanation',
    'difficulty',
    'mistake_type',
  ]

  for (const field of requiredFields) {
    if (!(field in q) || q[field] === undefined || q[field] === null) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  // 2. Check ID format and uniqueness
  if (q.id) {
    if (typeof q.id !== 'string' || q.id.trim().length === 0) {
      errors.push('ID must be a non-empty string')
    } else if (seenIds.has(q.id)) {
      errors.push(`Duplicate ID: ${q.id}`)
    } else {
      seenIds.add(q.id)
    }
  }

  // 3. Check level is 1-10
  if (q.level !== undefined) {
    if (!Number.isInteger(q.level) || !ALLOWED_LEVELS.has(q.level)) {
      errors.push(`Level must be an integer from 1 to 10, got: ${q.level}`)
    }
  }

  // 4. Check topic exists (string, non-empty)
  if (q.topic !== undefined) {
    if (typeof q.topic !== 'string' || q.topic.trim().length === 0) {
      errors.push('Topic must be a non-empty string')
    }
  }

  // 5. Check subtopic exists (string, non-empty)
  if (q.subtopic !== undefined) {
    if (typeof q.subtopic !== 'string' || q.subtopic.trim().length === 0) {
      errors.push('Subtopic must be a non-empty string')
    }
  }

  // 6. Check question_type exists and is valid
  if (q.question_type !== undefined) {
    if (!ALLOWED_TYPES.has(q.question_type)) {
      errors.push(`Invalid question_type: ${q.question_type}. Allowed: ${Array.from(ALLOWED_TYPES).join(', ')}`)
    }
  }

  // 7. Check options exist for MCQs
  if (q.question_type === 'mcq' || q.question_type === 'mcq-correction' || q.question_type === 'error-spotting') {
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      errors.push('MCQ/error-spotting questions must have exactly 4 options')
    } else {
      const uniqueOptions = new Set(q.options)
      if (uniqueOptions.size !== 4) {
        errors.push('All 4 options must be unique')
      }
    }
  }

  // 8. Check correct_answer exists
  if (q.correct_answer !== undefined) {
    if (typeof q.question_type === 'string' && (q.question_type.includes('mcq') || q.question_type === 'error-spotting')) {
      if (!Number.isInteger(q.correct_answer) || q.correct_answer < 0 || q.correct_answer > 3) {
        errors.push(`correct_answer must be 0-3 for MCQ, got: ${q.correct_answer}`)
      }
    }
  }

  // 9. Check explanation exists (string, min 30 chars)
  if (q.explanation !== undefined) {
    if (typeof q.explanation !== 'string' || q.explanation.trim().length < 30) {
      errors.push('Explanation must be a string with at least 30 characters')
    }
  }

  // 10. Check difficulty is valid
  if (q.difficulty !== undefined) {
    if (!ALLOWED_DIFFICULTIES.has(q.difficulty)) {
      errors.push(`Invalid difficulty: ${q.difficulty}. Must be B1, B2, C1, or C2`)
    }
  }

  // 11. Check mistake_type is valid
  if (q.mistake_type !== undefined) {
    if (!ALLOWED_MISTAKE_TYPES.has(q.mistake_type)) {
      const allowed = Array.from(ALLOWED_MISTAKE_TYPES).join(', ')
      errors.push(`Invalid mistake_type: ${q.mistake_type}. Allowed: ${allowed}`)
    }
  }

  // Additional validation checks
  // 12. Check question_text length and format
  if (q.question_text !== undefined) {
    if (typeof q.question_text !== 'string' || q.question_text.trim().length < 20) {
      warnings.push('question_text should be at least 20 characters')
    }
  }

  // 13. Check for common issues
  if (q.explanation && q.explanation.length > 300) {
    warnings.push('Explanation is very long (>300 chars) — consider condensing')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Validate an array of questions
 * @param {Array} questions - Array of question objects
 * @returns {Object} - { totalQuestions, validCount, invalidCount, details: [] }
 */
export function validateQuestionArray(questions) {
  if (!Array.isArray(questions)) {
    return {
      totalQuestions: 0,
      validCount: 0,
      invalidCount: 1,
      details: [{ error: 'Input must be an array' }],
    }
  }

  const seenIds = new Set()
  const details = []
  let validCount = 0
  let invalidCount = 0

  for (let i = 0; i < questions.length; i++) {
    const result = validateQuestion(questions[i], seenIds)
    if (result.isValid) {
      validCount++
    } else {
      invalidCount++
      details.push({
        index: i,
        id: questions[i]?.id || 'unknown',
        errors: result.errors,
        warnings: result.warnings,
      })
    }
  }

  return {
    totalQuestions: questions.length,
    validCount,
    invalidCount,
    details: details.slice(0, 20), // Return first 20 errors for clarity
  }
}

/**
 * Get validation summary as string
 * @param {Object} validationResult - Result from validateQuestionArray
 * @returns {string} - Formatted validation summary
 */
export function formatValidationSummary(validationResult) {
  const { totalQuestions, validCount, invalidCount, details } = validationResult

  let summary = `\n=== VALIDATION SUMMARY ===\n`
  summary += `Total Questions: ${totalQuestions}\n`
  summary += `Valid: ${validCount}\n`
  summary += `Invalid: ${invalidCount}\n`

  if (invalidCount > 0 && details.length > 0) {
    summary += `\n=== FIRST ERRORS ===\n`
    details.forEach((detail, idx) => {
      if (idx < 5) {
        summary += `\nQuestion #${detail.index + 1} (${detail.id}):\n`
        detail.errors.forEach(err => {
          summary += `  ❌ ${err}\n`
        })
        if (detail.warnings.length > 0) {
          detail.warnings.forEach(warn => {
            summary += `  ⚠️ ${warn}\n`
          })
        }
      }
    })
  }

  return summary
}

export default {
  validateQuestion,
  validateQuestionArray,
  formatValidationSummary,
}
