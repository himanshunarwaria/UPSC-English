import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgressContext } from '../hooks/useProgressContext'
import {
  allPYQs, availableYears, isRealPYQ, isObjective,
} from '../data/pyqs/index.js'
import Icon from '../components/ui/Icon'

// ── Data helpers ──────────────────────────────────────────────────────────────

const SECTION_IDS = new Set(['grammar', 'essay', 'precis', 'comprehension', 'translation', 'vocabulary'])

const SECTION_LABELS = {
  grammar: 'Grammar', essay: 'Essay', precis: 'Précis',
  comprehension: 'Comprehension', translation: 'Translation', vocabulary: 'Vocabulary',
}

const FILTER_CHIPS = [
  { id: 'all',              label: 'All' },
  { id: 'grammar',          label: 'Grammar' },
  { id: 'essay',            label: 'Essay' },
  { id: 'precis',           label: 'Précis' },
  { id: 'comprehension',    label: 'Comprehension' },
  { id: 'translation',      label: 'Translation' },
  { id: 'vocabulary',       label: 'Vocabulary' },
  { id: 'real-pyq',         label: 'Real PYQs' },
  { id: 'sample-practice',  label: 'Sample' },
  { id: 'attempted',        label: 'Attempted' },
  { id: 'unattempted',      label: 'Unattempted' },
  { id: 'wrong',            label: 'Wrong' },
  { id: 'bookmarked',       label: 'Bookmarked' },
]

function filterYearQuestions(year, filter, attempted, bookmarks) {
  let qs = allPYQs.filter(q => q.year === year)
  if (SECTION_IDS.has(filter))        qs = qs.filter(q => q.section === filter)
  else if (filter === 'real-pyq')      qs = qs.filter(isRealPYQ)
  else if (filter === 'sample-practice') qs = qs.filter(q => !isRealPYQ(q))
  else if (filter === 'attempted')     qs = qs.filter(q => !!attempted[q.id])
  else if (filter === 'unattempted')   qs = qs.filter(q => !attempted[q.id])
  else if (filter === 'wrong')         qs = qs.filter(q => attempted[q.id]?.isCorrect === false)
  else if (filter === 'bookmarked')    qs = qs.filter(q => bookmarks.includes(q.id))
  return qs
}

function buildYearCardData(year, filter, attempted, bookmarks) {
  const qs = filterYearQuestions(year, filter, attempted, bookmarks)
  if (qs.length === 0) return null

  // All sections present in the year (regardless of filter — for display)
  const allYearSections = [...new Set(allPYQs.filter(q => q.year === year).map(q => q.section))]

  const realCount    = qs.filter(isRealPYQ).length
  const objQs        = qs.filter(isObjective)
  const attemptedObj = objQs.filter(q => attempted[q.id])
  const correct      = attemptedObj.filter(q => attempted[q.id]?.isCorrect === true).length
  const accuracy     = attemptedObj.length > 0 ? Math.round((correct / attemptedObj.length) * 100) : null
  const attemptedTotal = qs.filter(q => attempted[q.id]).length

  // Source completeness for this year's full question set
  const allYearQs = allPYQs.filter(q => q.year === year)
  const yearRealCount = allYearQs.filter(isRealPYQ).length
  const sourceStatus = yearRealCount === 0 ? 'sample'
    : yearRealCount === allYearQs.length ? 'real'
    : 'partial'

  return { year, total: qs.length, sections: allYearSections, attempted: attemptedTotal, accuracy, sourceStatus }
}

// ── YearCard ─────────────────────────────────────────────────────────────────

function YearCard({ data, onClick }) {
  const { year, total, sections, attempted: att, accuracy, sourceStatus } = data
  const pct = total > 0 ? Math.round((att / total) * 100) : 0

  const actionLabel = att === 0 ? 'Start' : att >= total ? 'Review' : 'Continue'
  const actionIcon  = att >= total && att > 0 ? 'replay' : 'arrow_forward'

  const accColor = accuracy === null ? 'text-on-dim'
    : accuracy >= 70 ? 'text-success' : accuracy >= 50 ? 'text-warn' : 'text-error'

  const sourceChip = sourceStatus === 'real'
    ? { label: 'Real PYQs', cls: 'bg-success-dim text-success border-success/30' }
    : sourceStatus === 'partial'
    ? { label: 'Partial real', cls: 'bg-warn-dim text-warn border-warn/30' }
    : { label: 'Sample', cls: 'bg-surface-low text-on-dim border-outline-variant' }

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-4 flex flex-col gap-3 hover:border-outline transition-colors">

      {/* Year + source badge */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display font-bold text-2xl text-on leading-none">{year}</p>
          <p className="text-xs text-on-variant mt-0.5">UPSC CSE Mains — General English</p>
        </div>
        <span className={`text-2xs font-medium px-1.5 py-0.5 rounded-sm border flex-shrink-0 ${sourceChip.cls}`}>
          {sourceChip.label}
        </span>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-1.5 text-xs text-on-dim flex-wrap">
        <span>{total} Q</span>
        <span className="w-1 h-1 rounded-full bg-outline-variant flex-shrink-0" />
        <span>{att} attempted</span>
        {accuracy !== null && (
          <>
            <span className="w-1 h-1 rounded-full bg-outline-variant flex-shrink-0" />
            <span className={`font-medium ${accColor}`}>{accuracy}% accuracy</span>
          </>
        )}
        {att === 0 && (
          <>
            <span className="w-1 h-1 rounded-full bg-outline-variant flex-shrink-0" />
            <span>Not started</span>
          </>
        )}
      </div>

      {/* Progress bar */}
      {att > 0 && (
        <div className="h-1 bg-surface-low rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              accuracy !== null && accuracy >= 70 ? 'bg-success'
              : accuracy !== null && accuracy >= 50 ? 'bg-warn'
              : 'bg-accent'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {/* Section chips */}
      <div className="flex flex-wrap gap-1">
        {sections.map(s => (
          <span
            key={s}
            className="text-2xs text-on-variant bg-surface-low border border-outline-variant rounded-sm px-1.5 py-0.5"
          >
            {SECTION_LABELS[s] ?? s}
          </span>
        ))}
      </div>

      {/* Action */}
      <div className="pt-2 border-t border-outline-variant flex justify-end">
        <button
          onClick={onClick}
          className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:opacity-80 transition-opacity"
        >
          {actionLabel}
          <Icon name={actionIcon} size={14} className="text-accent" />
        </button>
      </div>
    </div>
  )
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function PYQs() {
  const navigate = useNavigate()
  const { attempted, bookmarks } = useProgressContext()
  const [filter, setFilter] = useState('all')

  const yearCards = useMemo(
    () => availableYears
      .map(year => buildYearCardData(year, filter, attempted, bookmarks))
      .filter(Boolean),
    [filter, attempted, bookmarks]
  )

  const totalAttempted  = allPYQs.filter(q => attempted[q.id]).length
  const hasAnyReal      = allPYQs.some(isRealPYQ)
  const allSampleCount  = allPYQs.filter(q => !isRealPYQ(q)).length
  const missingYearCount = Math.max(0, 15 - availableYears.length)
  const oldestYear      = Math.min(...availableYears)
  const newestYear      = Math.max(...availableYears)

  return (
    <main className="flex-1 safe-pb overflow-y-auto">
      <div className="max-w-lg mx-auto px-4">

        {/* Header */}
        <div className="pt-5 pb-3">
          <p className="text-2xs font-medium text-on-dim uppercase tracking-widest mb-1">
            {availableYears.length} years · {allPYQs.length} questions · {totalAttempted} attempted
          </p>
          <h1 className="font-display font-bold text-2xl text-on">PYQ Bank</h1>
        </div>

        {/* Honesty banner — always shown since no real PYQs exist yet */}
        {!hasAnyReal && (
          <div className="flex gap-2.5 bg-surface-low border border-outline-variant rounded-xl px-3 py-2.5 mb-3">
            <Icon name="info" size={15} className="text-on-dim flex-shrink-0 mt-0.5" />
            <p className="text-xs text-on-variant leading-relaxed">
              <span className="font-semibold text-on">No verified PYQs imported yet.</span>{' '}
              All {allSampleCount} questions are UPSC-style practice — not actual previous year questions.
              Real PYQs can be added to <span className="font-mono text-on">src/data/pyqs/years/</span>.
            </p>
          </div>
        )}

        {/* Random drill CTA */}
        <button
          onClick={() => navigate('/practice?mode=pyq&source=all&section=all')}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-3 rounded-xl mb-4 hover:opacity-90 active:scale-[0.99] transition-all"
        >
          <Icon name="shuffle" size={18} fill className="text-white" />
          Start Random PYQ Drill
        </button>

        {/* Filter chips */}
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 -mx-4 px-4">
          {FILTER_CHIPS.map(chip => (
            <button
              key={chip.id}
              onClick={() => setFilter(chip.id)}
              className={`flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                filter === chip.id
                  ? 'bg-accent text-white border-accent'
                  : 'bg-surface-container text-on-variant border-outline-variant hover:border-accent/30'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Year cards */}
        {yearCards.length > 0 ? (
          <div className="space-y-3 mb-4">
            {yearCards.map(data => (
              <YearCard
                key={data.year}
                data={data}
                onClick={() => navigate(`/pyqs/${data.year}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 mb-4">
            <Icon name="filter_alt_off" size={36} className="text-on-dim mx-auto mb-2" />
            <p className="text-sm font-semibold text-on mb-1">No years match this filter</p>
            <p className="text-xs text-on-dim mb-3">Try a different filter or check back after practising.</p>
            <button onClick={() => setFilter('all')} className="text-xs font-medium text-accent">
              Show all years
            </button>
          </div>
        )}

        {/* Missing years notice */}
        {missingYearCount > 0 && (
          <div className="bg-surface-low border border-outline-variant rounded-xl px-4 py-3 mb-4">
            <p className="text-xs font-semibold text-on mb-1">
              {missingYearCount} year{missingYearCount > 1 ? 's' : ''} not yet imported
            </p>
            <p className="text-xs text-on-dim leading-relaxed">
              This bank covers {oldestYear}–{newestYear} ({availableYears.length} years).
              A full 15-year archive would include 2009–{newestYear}.
              Questions for missing years can be added to the data files.
            </p>
          </div>
        )}

      </div>
    </main>
  )
}
