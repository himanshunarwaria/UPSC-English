import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Icon from '../ui/Icon'

const ROUTE_META = {
  '/':               { title: 'Practice' },
  '/grammar':        { title: 'Practice' },
  '/practice':       { title: 'Practice' },
  '/level-test':     { title: 'Level Test' },
  '/pyqs':           { title: 'UPSC PYQs' },
  '/revision':       { title: 'Mistakes' },
  '/mistakes':       { title: 'Mistakes' },
  '/vocabulary':     { title: 'Vocabulary' },
  '/connectors':     { title: 'Connector Practice' },
  '/progress':       { title: 'Progress' },
  '/sentence-builder': { title: 'Sentence Builder' },
  '/analytics':      { title: 'Practice Insights' },
}

function resolveTitle(pathname) {
  if (ROUTE_META[pathname]) return ROUTE_META[pathname].title
  const yearMatch = pathname.match(/^\/pyqs\/(\d{4})$/)
  if (yearMatch) return `PYQ — ${yearMatch[1]}`
  return 'ExamPro'
}

function getInitials(name) {
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

export default function TopBar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const title = resolveTitle(pathname)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-surface-container border-b border-outline-variant">
      <div className="flex items-center h-14 max-w-lg mx-auto px-4">

        {/* Left — app identity icon */}
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <Icon name="school" size={20} className="text-on-dim" />
        </div>

        {/* Center — page title */}
        <div className="flex-1 text-center px-2">
          <p className="text-sm font-semibold font-display text-on truncate">{title}</p>
        </div>

        {/* Right — user avatar + dropdown */}
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-highest flex items-center justify-center focus:outline-none active:scale-95 transition-transform"
            aria-label="Account menu"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <span className="text-2xs font-semibold text-on-variant select-none">
                {getInitials(user?.displayName)}
              </span>
            )}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 w-52 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-outline-variant">
                <p className="text-xs font-semibold text-on truncate">{user?.displayName}</p>
                <p className="text-2xs text-on-variant truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => { setMenuOpen(false); logout() }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-on-variant hover:bg-surface-container active:bg-surface-container-high transition-colors"
              >
                <Icon name="logout" size={16} className="text-on-variant" />
                Sign out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}
