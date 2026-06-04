// ─────────────────────────────────────────────────────────────────────────────
// Grammar Question Bank — Central Aggregator
//
// This file imports every approved batch and exports the combined bank.
// Add each new batch import here as it is approved.
//
// IMPORTANT: Do NOT import from generated/pending_review/ here.
// Only import from batches/ after the batch has been reviewed and approved.
//
// Usage in the app:
//   import { grammarBankQuestions, grammarBankStats } from './questions/index.js'
//
// The questions from this bank are in the same format as grammarQuestions.js
// and can be spread into grammarQuestions to extend the bank:
//
//   import { grammarQuestions } from './grammarQuestions.js'
//   import { grammarBankQuestions } from './questions/index.js'
//   const allGrammarQuestions = [...grammarQuestions, ...grammarBankQuestions]
// ─────────────────────────────────────────────────────────────────────────────

// ── Approved batch imports ────────────────────────────────────────────────
// Import all active batches via the batch index.
// The batch index loads all batches (approved + draft under review).

import { questionsFromBatches } from './batches/index.js'

export const grammarBankQuestions = questionsFromBatches

// ── Bank statistics ───────────────────────────────────────────────────────

export const grammarBankStats = {
  totalQuestions:    grammarBankQuestions.length,
  plannedTotal:      1000,
  percentComplete:   grammarBankQuestions.length > 0
    ? Math.round((grammarBankQuestions.length / 1000) * 100)
    : 0,
  topicBreakdown: grammarBankQuestions.reduce((acc, q) => {
    acc[q.topic] = (acc[q.topic] || 0) + 1
    return acc
  }, {}),
  difficultyBreakdown: grammarBankQuestions.reduce((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1
    return acc
  }, {}),
}

export default grammarBankQuestions
