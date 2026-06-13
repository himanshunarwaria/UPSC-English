import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import {
  getSkillAreas,
  getSubtopicsForSkill,
  getDifficultyGroupsForSkillAndSubtopic,
  searchPracticeCatalog,
} from '../../services/practiceCatalogService'

export default function SkillSelector() {
  const navigate = useNavigate()

  const [selSkill,      setSelSkill]      = useState(null)
  const [selSubtopicId, setSelSubtopicId] = useState(null)
  const [selDifficulty, setSelDifficulty] = useState(null)
  const [query,         setQuery]         = useState('')

  const searchResults = useMemo(() => searchPracticeCatalog(query), [query])

  const skillAreas = useMemo(() => getSkillAreas(), [])

  const subtopics = useMemo(
    () => (selSkill ? getSubtopicsForSkill(selSkill) : []),
    [selSkill]
  )

  const difficultyGroups = useMemo(
    () => (selSkill ? getDifficultyGroupsForSkillAndSubtopic(selSkill, selSubtopicId) : []),
    [selSkill, selSubtopicId]
  )

  const selectedSkillObj = skillAreas.find(s => s.skillId === selSkill)

  const availableCount = useMemo(() => {
    if (!selSkill) return 0
    if (selDifficulty) return difficultyGroups.find(d => d.id === selDifficulty)?.count ?? 0
    if (selSubtopicId) return subtopics.find(st => st.id === selSubtopicId)?.count ?? 0
    return selectedSkillObj?.totalQuestionCount ?? 0
  }, [selSkill, selSubtopicId, selDifficulty, difficultyGroups, subtopics, selectedSkillObj])

  function handleSkillSelect(skillId) {
    if (selSkill === skillId) {
      setSelSkill(null)
    } else {
      setSelSkill(skillId)
    }
    setSelSubtopicId(null)
    setSelDifficulty(null)
  }

  function handleSubtopicChange(e) {
    setSelSubtopicId(e.target.value || null)
    setSelDifficulty(null)
  }

  function handleResultSelect(result) {
    setQuery('')
    setSelSkill(result.skillId)
    setSelSubtopicId(result.type === 'subtopic' ? result.subtopicId : null)
    setSelDifficulty(null)
  }

  function start() {
    if (!selSkill || availableCount === 0) return
    const p = new URLSearchParams({ mode: 'focused', skill: selSkill })
    if (selSubtopicId) p.set('subtopicId', selSubtopicId)
    if (selDifficulty) p.set('difficulty',  selDifficulty)
    navigate(`/practice?${p.toString()}`)
  }

  const detailLine = [
    selectedSkillObj?.title,
    subtopics.find(st => st.id === selSubtopicId)?.label,
    difficultyGroups.find(dg => dg.id === selDifficulty)?.label,
  ].filter(Boolean).join(' · ')

  return (
    <div className="space-y-4">

      {/* Search box */}
      <div className="relative">
        <div className="relative flex items-center">
          <Icon name="search" size={18} className="absolute left-3 text-on-dim pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search Articles, Prepositions, Connectors, Answer Writing…"
            className="w-full bg-surface-container border border-outline-variant rounded-xl pl-9 pr-9 py-3 text-sm text-on placeholder:text-on-dim focus:outline-none focus:border-primary transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 text-on-dim hover:text-on transition-colors"
              aria-label="Clear search"
            >
              <Icon name="close" size={18} />
            </button>
          )}
        </div>

        {/* Results */}
        {query.trim() && (
          <div className="mt-1 bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
            {searchResults.length === 0 ? (
              <p className="px-4 py-3 text-sm text-on-dim">
                No matching topic found. Try Grammar, Vocabulary, Connectors, or Answer Writing.
              </p>
            ) : (
              searchResults.map((result, i) => {
                const subtopicLabel = result.type === 'subtopic' ? result.title.split(' › ')[1] : null
                const displayLine   = result.type === 'subtopic'
                  ? `${subtopicLabel} — ${result.skillTitle}`
                  : result.title
                return (
                  <button
                    key={i}
                    onClick={() => handleResultSelect(result)}
                    className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-surface-low active:bg-surface-low transition-colors border-t border-outline-variant first:border-t-0"
                  >
                    <span className="text-sm font-medium text-on">{displayLine}</span>
                    <span className="text-xs text-on-dim flex-shrink-0">{result.count} Q</span>
                  </button>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* Skill grid */}
      <div>
        <p className="text-xs font-medium text-on-dim uppercase tracking-widest mb-2">Choose a Skill</p>
        <div className="grid grid-cols-2 gap-2">
          {skillAreas.map(skill => {
            const active = selSkill === skill.skillId
            return (
              <button
                key={skill.skillId}
                onClick={() => handleSkillSelect(skill.skillId)}
                className={`text-left rounded-xl border px-3 py-3 transition-all active:scale-[0.98] ${
                  active
                    ? 'bg-primary/10 border-primary/40'
                    : 'bg-surface-container border-outline-variant hover:border-primary/30 hover:bg-primary/5'
                }`}
              >
                <div className="flex items-start gap-1.5 mb-1">
                  <Icon
                    name={skill.icon}
                    size={15}
                    className={`flex-shrink-0 mt-0.5 ${active ? 'text-primary' : 'text-on-variant'}`}
                  />
                  <span className={`text-xs font-semibold leading-tight ${active ? 'text-primary' : 'text-on'}`}>
                    {skill.title}
                  </span>
                </div>
                <p className="text-2xs text-on-dim">
                  {skill.totalQuestionCount} Q
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Dropdowns + summary: only after a skill is selected */}
      {selSkill && (
        <div className="space-y-3">

          {/* Subtopic */}
          <div>
            <p className="text-xs font-medium text-on-dim uppercase tracking-widest mb-2">
              Subtopic <span className="normal-case font-normal">(optional)</span>
            </p>
            <div className="relative">
              <select
                value={selSubtopicId ?? ''}
                onChange={handleSubtopicChange}
                className="w-full appearance-none bg-surface-container border border-outline-variant rounded-xl px-4 py-3 pr-10 text-sm font-medium text-on focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="">All subtopics</option>
                {subtopics.filter(st => st.count > 0).map(st => (
                  <option key={st.id} value={st.id}>{st.label} — {st.count} Q</option>
                ))}
              </select>
              <Icon name="expand_more" size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-dim pointer-events-none" />
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <p className="text-xs font-medium text-on-dim uppercase tracking-widest mb-2">
              Difficulty <span className="normal-case font-normal">(optional)</span>
            </p>
            <div className="relative">
              <select
                value={selDifficulty ?? ''}
                onChange={e => setSelDifficulty(e.target.value || null)}
                className="w-full appearance-none bg-surface-container border border-outline-variant rounded-xl px-4 py-3 pr-10 text-sm font-medium text-on focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="">All difficulties</option>
                {difficultyGroups.filter(dg => dg.count > 0).map(dg => (
                  <option key={dg.id} value={dg.id}>{dg.label} — {dg.description}</option>
                ))}
              </select>
              <Icon name="expand_more" size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-dim pointer-events-none" />
            </div>
          </div>

          {/* Summary + Start */}
          <div className="bg-surface-container border border-outline-variant rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${availableCount > 0 ? 'text-on' : 'text-on-dim'}`}>
                {availableCount > 0 ? `${availableCount} questions` : 'No questions for this selection.'}
              </p>
              {detailLine && (
                <p className="text-xs text-on-dim mt-0.5 truncate">{detailLine}</p>
              )}
            </div>
            <button
              onClick={start}
              disabled={!selSkill || availableCount === 0}
              className="flex-shrink-0 flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-[0.99] disabled:opacity-40 transition-all min-h-[44px]"
            >
              Start
              <Icon name="arrow_forward" size={16} fill className="text-white" />
            </button>
          </div>

          <p className="text-center text-2xs text-on-dim">
            Difficulty levels are organised from Beginner to Exam Level.
          </p>

        </div>
      )}

    </div>
  )
}
