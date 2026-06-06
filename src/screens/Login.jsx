import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleGoogleSignIn() {
    setError(null)
    setLoading(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Sign-in failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6" style={{ minHeight: '100dvh' }}>

      {/* Logo / Brand */}
      <div className="flex flex-col items-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-5 shadow-lg">
          <span className="material-symbols-outlined text-on-primary" style={{ fontSize: 32 }}>school</span>
        </div>
        <h1 className="text-2xl font-bold font-display text-on tracking-tight">Pure English Prep</h1>
        <p className="text-sm text-on-variant mt-1">UPSC English Practice</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
        <h2 className="text-lg font-semibold font-display text-on mb-1">Welcome back</h2>
        <p className="text-sm text-on-variant mb-8">Sign in to track your progress and continue where you left off.</p>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border border-outline-variant bg-surface-container-low hover:bg-surface-container active:scale-[0.98] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="material-symbols-outlined text-on-variant animate-spin" style={{ fontSize: 20 }}>progress_activity</span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.332 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
              <path d="M6.306 14.691l6.571 4.819C14.655 15.108 19.001 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
              <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.311 0-9.818-3.454-11.34-8.217l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
              <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
            </svg>
          )}
          <span className="text-sm font-semibold text-on">
            {loading ? 'Signing in…' : 'Continue with Google'}
          </span>
        </button>

        {error && (
          <p className="mt-4 text-xs text-center text-error">{error}</p>
        )}
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-on-variant text-center max-w-xs leading-relaxed">
        Your progress is saved to your Google account and syncs across devices.
      </p>

    </div>
  )
}
