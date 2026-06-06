import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { initializeUserProgress } from '../../services/userTrackingService'

export default function ProtectedRoute({ element }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/" replace />

  initializeUserProgress(user.uid)
  return element
}
