import { Navigate } from 'react-router-dom'
import routeProtectionService from '../../services/routeProtectionService'

/**
 * Route component that protects pages requiring login
 * If user not logged in, redirects to home (/)
 * If user not logged in, initializes their progress
 *
 * @param {Object} props - Component props
 * @param {React.Component} props.element - Page component to render if authorized
 * @returns {React.ReactElement}
 */
export default function ProtectedRoute({ element }) {
  const userId = routeProtectionService.getLoggedInUserId()

  // Not logged in: redirect to home
  if (!userId) {
    return <Navigate to="/" replace />
  }

  // Logged in: initialize progress if needed, then render
  routeProtectionService.initializeUserProgress(userId)
  return element
}
