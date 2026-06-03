import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ProgressProvider } from './hooks/useProgressContext'
import ErrorBoundary from './components/ui/ErrorBoundary'
import BottomNav from './components/navigation/BottomNav'
import TopBar from './components/navigation/TopBar'
import Today from './screens/Today'
import Grammar from './screens/Grammar'
import Practice from './screens/Practice'
import PYQs from './screens/PYQs'
import PYQYearDetail from './screens/PYQYearDetail'
import Revision from './screens/Revision'
import Analytics from './screens/Analytics'

// AppContent uses useLocation inside the Router context so it can
// conditionally hide the TopBar and remove the pt-14 offset on /practice.
function AppContent() {
  const { pathname } = useLocation()
  const isPractice = pathname === '/practice'

  return (
    <div className="min-h-screen bg-surface flex flex-col" style={{ minHeight: '100dvh' }}>
      {!isPractice && <TopBar />}
      <div className={`flex-1 flex flex-col${!isPractice ? ' pt-14' : ''}`}>
        <Routes>
          <Route path="/" element={<Today />} />
          <Route path="/grammar" element={<Grammar />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/pyqs" element={<PYQs />} />
          <Route path="/pyqs/:year" element={<PYQYearDetail />} />
          <Route path="/revision" element={<Revision />} />
          <Route path="/analytics" element={<Analytics />} />
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
        <ProgressProvider>
          <AppContent />
        </ProgressProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
