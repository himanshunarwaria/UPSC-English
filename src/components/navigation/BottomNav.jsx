import { NavLink, useLocation } from 'react-router-dom'

const tabs = [
  { to: '/', icon: 'today', label: 'Today' },
  { to: '/grammar', icon: 'menu_book', label: 'Grammar' },
  { to: '/pyqs', icon: 'history_edu', label: 'PYQs' },
  { to: '/revision', icon: 'replay', label: 'Revision' },
  { to: '/mistakes', icon: 'error', label: 'Mistakes' },
  { to: '/practice?mode=select', icon: 'quiz', label: 'Practice' },
]

export default function BottomNav() {
  const location = useLocation()

  // Hide during active practice — immersive mode
  if (location.pathname === '/practice') return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface-container border-t border-outline-variant safe-bottom z-50">
      <div className="flex items-stretch max-w-lg mx-auto">
        {tabs.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[52px] transition-colors ${
                isActive ? 'text-accent' : 'text-on-dim hover:text-on-variant'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined text-[22px] leading-none"
                  style={{
                    fontVariationSettings: isActive
                      ? "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24"
                      : "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24",
                  }}
                >
                  {icon}
                </span>
                <span className={`text-2xs font-medium ${isActive ? 'text-accent' : 'text-on-dim'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
