import { useState, useCallback, useEffect } from 'react'
import {
  getInitialState,
  saveState,
  updateStreak,
  getTopicStats,
  computeReadiness,
  getTodayAttempted,
  getTodayCorrect,
} from '../utils/storage'

export default function useProgress() {
  const [state, setState] = useState(getInitialState)

  // Persist on every state change
  useEffect(() => {
    saveState(state)
  }, [state])

  // Update streak on mount
  useEffect(() => {
    setState(prev => {
      const newStreak = updateStreak(prev.streak)
      if (newStreak.count === prev.streak.count && newStreak.lastDate === prev.streak.lastDate) {
        return prev
      }
      return { ...prev, streak: newStreak }
    })
  }, [])

  const recordAnswer = useCallback((question, selectedAnswer) => {
    const isCorrect = selectedAnswer === question.correctAnswer
    setState(prev => {
      const newAttempted = {
        ...prev.attempted,
        [question.id]: {
          selectedAnswer,
          isCorrect,
          topic: question.topic,
          timestamp: new Date().toISOString(),
        },
      }
      // Add to revision queue if wrong
      const alreadyInQueue = prev.revisionQueue.includes(question.id)
      let newQueue = prev.revisionQueue
      if (!isCorrect && !alreadyInQueue) {
        newQueue = [...prev.revisionQueue, question.id]
      } else if (isCorrect && alreadyInQueue) {
        newQueue = prev.revisionQueue.filter(id => id !== question.id)
      }
      return { ...prev, attempted: newAttempted, revisionQueue: newQueue }
    })
    return isCorrect
  }, [])

  // For subjective questions (essay, précis, comprehension, translation) there is
  // no auto-grading. The student self-marks after comparing with the model answer.
  // selfRating: 'mastered' clears it; 'review' adds it to the revision queue.
  const recordReview = useCallback((question, selfRating) => {
    const needsReview = selfRating === 'review'
    setState(prev => {
      const newAttempted = {
        ...prev.attempted,
        [question.id]: {
          selectedAnswer: null,
          isCorrect: null,          // subjective — never counts toward accuracy
          selfRating,
          topic: question.topic,
          timestamp: new Date().toISOString(),
        },
      }
      const inQueue = prev.revisionQueue.includes(question.id)
      let newQueue = prev.revisionQueue
      if (needsReview && !inQueue) newQueue = [...prev.revisionQueue, question.id]
      else if (!needsReview && inQueue) newQueue = prev.revisionQueue.filter(id => id !== question.id)
      return { ...prev, attempted: newAttempted, revisionQueue: newQueue }
    })
  }, [])

  const toggleBookmark = useCallback((questionId) => {
    setState(prev => {
      const isBookmarked = prev.bookmarks.includes(questionId)
      return {
        ...prev,
        bookmarks: isBookmarked
          ? prev.bookmarks.filter(id => id !== questionId)
          : [...prev.bookmarks, questionId],
      }
    })
  }, [])

  const removeFromRevision = useCallback((questionId) => {
    setState(prev => ({
      ...prev,
      revisionQueue: prev.revisionQueue.filter(id => id !== questionId),
    }))
  }, [])

  const resetProgress = useCallback(() => {
    setState({
      attempted: {},
      bookmarks: [],
      revisionQueue: [],
      streak: { lastDate: null, count: 0 },
      sessions: [],
    })
  }, [])

  const topicStats = getTopicStats(state.attempted)
  const readiness = computeReadiness(state.attempted, state.revisionQueue)
  const todayAttempted = getTodayAttempted(state.attempted)
  const todayCorrect = getTodayCorrect(state.attempted)

  return {
    attempted: state.attempted,
    bookmarks: state.bookmarks,
    revisionQueue: state.revisionQueue,
    streak: state.streak,
    topicStats,
    readiness,
    todayAttempted,
    todayCorrect,
    recordAnswer,
    recordReview,
    toggleBookmark,
    removeFromRevision,
    resetProgress,
    isBookmarked: (id) => state.bookmarks.includes(id),
    isAttempted: (id) => id in state.attempted,
    wasCorrect: (id) => state.attempted[id]?.isCorrect ?? null,
  }
}
