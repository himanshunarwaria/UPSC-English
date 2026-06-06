import { useLocation } from 'react-router-dom'
import Icon from '../ui/Icon'

const ROUTE_META = {
  '/':          { title: "Today's Practice" },
  '/grammar':   { title: 'Grammar Drill' },
  '/practice':  { title: 'Active Practice' },
  '/level-test': { title: 'Level Test' },
  '/pyqs':      { title: 'UPSC PYQs' },
  '/revision':  { title: 'Revision Queue' },
  '/mistakes':  { title: 'Mistake Review' },
  '/vocabulary': { title: 'Vocabulary Bank' },
  '/connectors': { title: 'Connector Practice' },
  '/progress': { title: 'Progress Report' },
  '/sentence-builder': { title: 'Sentence Builder' },
  '/analytics': { title: 'Weakness Analytics' },
}

function resolveTitle(pathname) {
  if (ROUTE_META[pathname]) return ROUTE_META[pathname].title
  const yearMatch = pathname.match(/^\/pyqs\/(\d{4})$/)
  if (yearMatch) return `PYQ — ${yearMatch[1]}`
  return 'ExamPro'
}

export default function TopBar() {
  const { pathname } = useLocation()
  const title = resolveTitle(pathname)

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

        {/* Right — avatar placeholder */}
        <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0">
          <span className="text-2xs font-semibold text-on-variant select-none">UP</span>
        </div>

      </div>
    </header>
  )
}
