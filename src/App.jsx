import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ProgressProvider } from './hooks/useProgressContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ErrorBoundary from './components/ui/ErrorBoundary'
import BottomNav from './components/navigation/BottomNav'
import TopBar from './components/navigation/TopBar'
import ProtectedRoute from './components/routing/ProtectedRoute'
import LevelAccessGuard from './components/routing/LevelAccessGuard'
import Login from './screens/Login'
import Today from './screens/Today'
import Grammar from './screens/Grammar'
import Practice from './screens/Practice'
import PYQs from './screens/PYQs'
import PYQYearDetail from './screens/PYQYearDetail'
import Revision from './screens/Revision'
import Mistakes from './screens/Mistakes'
import LevelTest from './screens/LevelTest'
import VocabularyBank from './screens/VocabularyBank'
import ConnectorPractice from './screens/ConnectorPractice'
import ProgressReport from './screens/ProgressReport'
import SentenceBuilder from './screens/SentenceBuilder'
import Analytics from './screens/Analytics'

function AppContent() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const isPractice = pathname === '/practice'

  // Still resolving auth state — render nothing to avoid flash
  if (user === undefined) return null

  // Not logged in — show full-screen login
  if (user === null) return <Login />

  return (
    <div className="min-h-screen bg-surface flex flex-col" style={{ minHeight: '100dvh' }}>
      {!isPractice && <TopBar />}
      <div className={`flex-1 flex flex-col${!isPractice ? ' pt-14' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Today />} />
          <Route path="/grammar" element={<Grammar />} />
          <Route path="/pyqs" element={<PYQs />} />
          <Route path="/pyqs/:year" element={<PYQYearDetail />} />
          <Route path="/analytics" element={<Analytics />} />

          {/* Protected Routes — Requires Login */}
          <Route path="/practice" element={<ProtectedRoute element={<Practice />} />} />
          <Route path="/level-test" element={<ProtectedRoute element={<LevelTest />} />} />
          <Route path="/revision" element={<ProtectedRoute element={<Revision />} />} />
          <Route path="/mistakes" element={<ProtectedRoute element={<Mistakes />} />} />
          <Route path="/vocabulary" element={<ProtectedRoute element={<VocabularyBank />} />} />
          <Route path="/connectors" element={<ProtectedRoute element={<ConnectorPractice />} />} />
          <Route path="/progress" element={<ProtectedRoute element={<ProgressReport />} />} />
          <Route path="/sentence-builder" element={<ProtectedRoute element={<SentenceBuilder />} />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <ProgressProvider>
            <AppContent />
          </ProgressProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
