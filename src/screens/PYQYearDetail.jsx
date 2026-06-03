import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useProgressContext } from '../hooks/useProgressContext'
import {
  allPYQs, isRealPYQ, isObjective, SECTION_META,
} from '../data/pyqs/index.js'
import Icon from '../components/ui/Icon'

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSectionData(yearQs, section, attempted) {
  const qs     = yearQs.filter(q => q.section === section)
  const objQs  = qs.filter(isObjective)
  const attObj = objQs.filter(q => attempted[q.id])
  const attAll = qs.filter(q => attempted[q.id]).length
  const correct = attObj.filter(q => attempted[q.id]?.isCorrect === true).length
  const accuracy = attObj.length > 0 ? Math.round((correct / attObj.length) * 100) : null

  const actionState = attAll === 0 ? 'start'
    : attAll >= qs.length ? 'review'
    : 'continue'

  return { total: qs.length, attempted: attAll, accuracy, actionState }
}

// ── Section row ───────────────────────────────────────────────────────────────

function SectionRow({ meta, data, isGrammar, onStart }) {
  const { label, icon } = meta
  const { total, attempted: att, accuracy, actionState } = data

  const accColor = accuracy === null ? 'text-on-dim'
    : accuracy >= 70 ? 'text-success' : accuracy >= 50 ? 'text-warn' : 'text-error'

  const actionBtn = actionState === 'review'
    ? { label: 'Review', cls: 'border border-outline text-on-variant hover:bg-surface-low' }
    : actionState === 'continue'
    ? { label: 'Continue', cls: 'border border-accent text-accent hover:bg-accent-dim' }
    : { label: 'Start', cls: 'bg-accent text-white hover:opacity-90' }

  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 border-b border-outline-variant last:border-0 ${
      isGrammar ? 'bg-accent-dim/30' : ''
    }`}>
      <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
        isGrammar ? 'bg-accent-dim' : 'bg-surface-low'
      }`}>
        <Icon name={icon} size={15} className={isGrammar ? 'text-accent' : 'text-on-dim'} />
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-tight ${isGrammar ? 'text-on' : 'text-on'}`}>
          {label}
        </p>
        <div className="flex items-center gap-1.5 text-2xs text-on-dim mt-0.5">
          <span>{total} Q</span>
          <span className="text-outline-variant">·</span>
          <span>{att} attempted</span>
          {accuracy !== null && (
            <>
              <span className="text-outline-variant">·</span>
              <span className={`font-medium ${accColor}`}>{accuracy}%</span>
            </>
          )}
        </div>
      </div>

      {/* Completed chip or action button */}
      {actionState === 'review' && att >= total ? (
        <span className="flex-shrink-0 text-2xs font-medium text-success bg-success-dim border border-success/20 rounded-full px-2.5 py-1 flex items-center gap-1">
          <Icon name="check_circle" size={11} fill className="text-success" />
          Done
        </span>
      ) : (
        <button
          onClick={onStart}
          className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg active:scale-[0.97] transition-all ${actionBtn.cls}`}
        >
          {actionBtn.label}
        </button>
      )}
    </div>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function PYQYearDetail() {
  const navigate    = useNavigate()
  const { year }    = useParams()
  const yearNum     = Number(year)
  const { attempted, bookmarks } = useProgressContext()

  const yearQs = useMemo(
    () => allPYQs.filter(q => q.year === yearNum),
    [yearNum]
  )

  // Unknown year → redirect
  if (yearQs.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        <Icon name="search_off" size={40} className="text-on-dim mb-3" />
        <p className="font-display font-semibold text-base text-on mb-1">Year {year} not found</p>
        <p className="text-sm text-on-variant text-center mb-5">
          No questions have been imported for this year yet.
        </p>
        <button
          onClick={() => navigate('/pyqs')}
          className="bg-surface-low border border-outline-variant text-on text-sm font-medium px-4 py-2.5 rounded-lg"
        >
          Back to PYQ Bank
        </button>
      </div>
    )
  }

  // Per-year global stats
  const objQs        = yearQs.filter(isObjective)
  const attObjQs     = objQs.filter(q => attempted[q.id])
  const attTotal     = yearQs.filter(q => attempted[q.id]).length
  const correct      = attObjQs.filter(q => attempted[q.id]?.isCorrect === true).length
  const accuracy     = attObjQs.length > 0 ? Math.round((correct / attObjQs.length) * 100) : null

  const realCount    = yearQs.filter(isRealPYQ).length
  const sourceStatus = realCount === 0 ? 'sample'
    : realCount === yearQs.length ? 'real'
    : 'partial'

  // Available sections in this year, ordered by SECTION_META
  const yearSections = Object.entries(SECTION_META)
    .filter(([id]) => yearQs.some(q => q.section === id))
    .sort((a, b) => a[1].order - b[1].order)

  // Recommended next: section with most unattempted questions
  const nextSection = yearSections
    .map(([id]) => {
      const qs  = yearQs.filter(q => q.section === id)
      const att = qs.filter(q => attempted[q.id]).length
      return { id, unattempted: qs.length - att }
    })
    .filter(s => s.unattempted > 0)
    .sort((a, b) => b.unattempted - a.unattempted)[0]

  const accColor = accuracy === null ? 'text-on-dim'
    : accuracy >= 70 ? 'text-success' : accuracy >= 50 ? 'text-warn' : 'text-error'

  function practiceSection(section) {
    navigate(`/practice?mode=pyq&year=${yearNum}&section=${section}`)
  }

  function practiceAll() {
    navigate(`/practice?mode=pyq&year=${yearNum}&section=all`)
  }

  return (
    <main className="flex-1 safe-pb overflow-y-auto">
      <div className="max-w-lg mx-auto px-4">

        {/* Back link */}
        <button
          onClick={() => navigate('/pyqs')}
          className="flex items-center gap-1 text-xs text-on-dim hover:text-on mt-4 mb-3 transition-colors"
        >
          <Icon name="arrow_back" size={14} className="text-on-dim" />
          PYQ Bank
        </button>

        {/* Header */}
        <div className="pb-3">
          <p className="text-2xs font-medium text-on-dim uppercase tracking-widest mb-1">
            UPSC CSE Mains — General English
          </p>
          <h1 className="font-display font-bold text-2xl text-on">PYQ — {yearNum}</h1>
        </div>

        {/* Source honesty label */}
        {sourceStatus === 'sample' && (
          <div className="flex gap-2 bg-surface-low border border-outline-variant rounded-xl px-3 py-2 mb-3">
            <Icon name="info" size={14} className="text-on-dim flex-shrink-0 mt-0.5" />
            <p className="text-xs text-on-variant leading-relaxed">
              <span className="font-semibold text-on">Sample practice only.</span>{' '}
              Questions for {yearNum} are UPSC-style, not verified official questions.
            </p>
          </div>
        )}
        {sourceStatus === 'partial' && (
          <div className="flex gap-2 bg-warn-dim border border-warn/20 rounded-xl px-3 py-2 mb-3">
            <Icon name="info" size={14} className="text-warn flex-shrink-0 mt-0.5" />
            <p className="text-xs text-on-variant leading-relaxed">
              <span className="font-semibold text-on">Partial real PYQs.</span>{' '}
              {realCount} of {yearQs.length} questions are verified. The rest are UPSC-style practice.
            </p>
          </div>
        )}
        {sourceStatus === 'real' && (
          <div className="flex gap-2 bg-success-dim border border-success/20 rounded-xl px-3 py-2 mb-3">
            <Icon name="verified" size={14} className="text-success flex-shrink-0 mt-0.5" />
            <p className="text-xs text-on-variant leading-relaxed">
              <span className="font-semibold text-on">Real PYQs imported.</span>{' '}
              All {yearQs.length} questions are verified from the {yearNum} paper.
            </p>
          </div>
        )}

        {/* Stats bento — 2×2 */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-surface-container border border-outline-variant rounded-xl p-3">
            <p className="font-display font-bold text-xl leading-none mb-0.5 text-on">{yearQs.length}</p>
            <p className="text-xs text-on-variant">Total Questions</p>
          </div>
          <div className="bg-surface-container border border-outline-variant rounded-xl p-3">
            <p className="font-display font-bold text-xl leading-none mb-0.5 text-on">{attTotal}</p>
            <p className="text-xs text-on-variant">Attempted</p>
            <p className="text-2xs text-on-dim mt-0.5">
              {yearQs.length > 0 ? `${Math.round((attTotal / yearQs.length) * 100)}%` : '0%'} done
            </p>
          </div>
          <div className="bg-surface-container border border-outline-variant rounded-xl p-3">
            <p className={`font-display font-bold text-xl leading-none mb-0.5 ${accColor}`}>
              {accuracy !== null ? `${accuracy}%` : '—'}
            </p>
            <p className="text-xs text-on-variant">Accuracy</p>
            <p className="text-2xs text-on-dim mt-0.5">objective only</p>
          </div>
          <div className="bg-surface-container border border-outline-variant rounded-xl p-3">
            <p className="font-display font-bold text-xl leading-none mb-0.5 text-on">
              {yearSections.length}
            </p>
            <p className="text-xs text-on-variant">Sections</p>
            <p className="text-2xs text-on-dim mt-0.5">in this year</p>
          </div>
        </div>

        {/* Recommended next — only when there are unattempted questions */}
        {nextSection && (
          <button
            onClick={() => practiceSection(nextSection.id)}
            className="w-full mb-3 flex items-center gap-3 bg-accent-dim border border-accent/20 rounded-xl px-4 py-3 text-left hover:opacity-90 transition-opacity active:scale-[0.99]"
          >
            <Icon name="lightbulb" size={18} fill className="text-accent flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-2xs font-medium text-accent uppercase tracking-wider mb-0.5">Start Here</p>
              <p className="text-sm font-semibold text-on">
                {SECTION_META[nextSection.id]?.label ?? nextSection.id}
              </p>
              <p className="text-xs text-on-dim">{nextSection.unattempted} questions remaining</p>
            </div>
            <Icon name="arrow_forward" size={16} className="text-accent/60 flex-shrink-0" />
          </button>
        )}

        {/* Sections list */}
        <div className="mb-4">
          <p className="text-2xs font-medium text-on-dim uppercase tracking-widest mb-2">Sections</p>
          <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
            {yearSections.map(([id, meta]) => {
              const data = getSectionData(yearQs, id, attempted)
              return (
                <SectionRow
                  key={id}
                  meta={meta}
                  data={data}
                  isGrammar={id === 'grammar'}
                  onStart={() => practiceSection(id)}
                />
              )
            })}
          </div>
        </div>

        {/* Full year practice CTA */}
        <button
          onClick={practiceAll}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-3.5 rounded-xl mb-6 hover:opacity-90 active:scale-[0.99] transition-all"
        >
          <Icon name="play_arrow" size={18} fill className="text-white" />
          Practice All {yearNum} Questions
        </button>

      </div>
    </main>
  )
}
