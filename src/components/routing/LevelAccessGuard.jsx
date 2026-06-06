import { Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import routeProtectionService from '../../services/routeProtectionService'
import Icon from '../ui/Icon'

/**
 * Route guard component for level-specific routes
 * Checks if user can access the requested level
 * If not, redirects to home with a message
 *
 * @param {Object} props - Component props
 * @param {number} props.level - Level number being accessed
 * @param {React.Component} props.element - Page component to render if authorized
 * @returns {React.ReactElement}
 */
export default function LevelAccessGuard({ level, element }) {
  const userId = routeProtectionService.getLoggedInUserId()
  const [redirecting, setRedirecting] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    // Not logged in: redirect immediately
    if (!userId) {
      setRedirecting(true)
      return
    }

    // Check level access
    const access = routeProtectionService.canAccessLevel(userId, level)

    if (!access.canAccess) {
      // Can't access: show message and redirect
      setMessage(access.reason)
      setRedirecting(true)

      // Store message in sessionStorage so home page can show it
      sessionStorage.setItem(
        'levelAccessDeniedMessage',
        access.reason || 'Level not accessible'
      )
    }
  }, [userId, level])

  // Redirecting due to access denial
  if (redirecting) {
    return <Navigate to="/" replace />
  }

  // Authorized: render the protected element
  return element
}
