import userTrackingService from './userTrackingService'

/**
 * Check if user is logged in
 * @returns {boolean}
 */
export function isLoggedIn() {
  return !!userTrackingService.getLoggedInUserId()
}

/**
 * Get currently logged-in user ID
 * @returns {string|null}
 */
export function getLoggedInUserId() {
  return userTrackingService.getLoggedInUserId()
}

/**
 * Check if user can access a specific level
 * New users start at Level 1
 * Locked levels require 80% on previous level test
 *
 * @param {string} userId - User ID
 * @param {number} level - Level number (1-10)
 * @returns {Object} { canAccess: boolean, reason: string }
 */
export function canAccessLevel(userId, level) {
  if (!userId) {
    return { canAccess: false, reason: 'User not logged in' }
  }

  if (level < 1 || level > 10) {
    return { canAccess: false, reason: 'Invalid level' }
  }

  // Level 1 is always accessible
  if (level === 1) {
    return { canAccess: true, reason: null }
  }

  // Check if user has unlocked this level
  const progress = userTrackingService.getCurrentUserProgress(userId)
  if (!progress) {
    return { canAccess: false, reason: 'Progress not initialized' }
  }

  const unlockedLevels = progress.unlockedLevels || [1]
  const canAccess = unlockedLevels.includes(level)

  if (!canAccess) {
    return {
      canAccess: false,
      reason: `Complete your Level ${level - 1} test to unlock this level`
    }
  }

  return { canAccess: true, reason: null }
}

/**
 * Initialize user progress if not already initialized
 * New users start at Level 1
 *
 * @param {string} userId - User ID
 * @returns {Object} User progress object
 */
export function initializeUserProgress(userId) {
  if (!userId) return null

  let progress = userTrackingService.getCurrentUserProgress(userId)

  // If progress doesn't exist, initialize it
  if (!progress) {
    userTrackingService.initializeUserProgress(userId)
    progress = userTrackingService.getCurrentUserProgress(userId)
  }

  return progress
}

/**
 * Check if a route is protected (requires login)
 * @param {string} pathname - Route path
 * @returns {boolean}
 */
export function isProtectedRoute(pathname) {
  const protectedRoutes = [
    '/practice',
    '/level-test',
    '/mistakes',
    '/vocabulary',
    '/progress',
    '/sentence-builder',
    '/revision',
  ]

  return protectedRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))
}

/**
 * Get the redirectable login page path
 * (not fully defined yet, but placeholder for future auth page)
 * @returns {string}
 */
export function getLoginPagePath() {
  return '/' // For now, redirect to dashboard (no dedicated login page)
}

/**
 * Filter user attempts by user ID (privacy)
 * @param {string} userId - User ID
 * @returns {Array} User's attempts only
 */
export function getPrivateAttempts(userId) {
  if (!userId) return []
  return userTrackingService.getAttempts(userId) || []
}

/**
 * Filter user mistakes by user ID (privacy)
 * @param {string} userId - User ID
 * @param {string} status - Optional: 'pending', 'revised', 'mastered'
 * @returns {Array} User's mistakes only
 */
export function getPrivateMistakes(userId, status = null) {
  if (!userId) return []
  return userTrackingService.getMistakes(userId, status) || []
}

/**
 * Filter user tests by user ID (privacy)
 * @param {string} userId - User ID
 * @param {number} level - Optional: specific level
 * @returns {Array} User's tests only
 */
export function getPrivateTests(userId, level = null) {
  if (!userId) return []
  return userTrackingService.getTestAttempts(userId, level) || []
}

/**
 * Filter user vocabulary by user ID (privacy)
 * @param {string} userId - User ID
 * @returns {Array} User's learned vocabulary only
 */
export function getPrivateVocabulary(userId) {
  if (!userId) return []
  return userTrackingService.getUserLearnedVocabulary(userId) || []
}

export default {
  isLoggedIn,
  getLoggedInUserId,
  canAccessLevel,
  initializeUserProgress,
  isProtectedRoute,
  getLoginPagePath,
  getPrivateAttempts,
  getPrivateMistakes,
  getPrivateTests,
  getPrivateVocabulary,
}
