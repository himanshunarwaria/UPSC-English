import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import {
  getAvailableLevels,
  getTopicsForLevel,
  getSubtopicsForLevelAndTopic,
  filterQuestions,
} from '../../services/questionFilterService'

export default function LevelSelector() {
  const navigate = useNavigate()
  const levels = getAvailableLevels()

  const [selLevel,    setSelLevel]    = useState(null)
  const [selTopic,    setSelTopic]    = useState(null)
  const [selSubtopic, setSelSubtopic] = useState(null)

  const topics    = selLevel != null ? getTopicsForLevel(selLevel) : []
  const subtopics = selLevel != null && selTopic != null
    ? getSubtopicsForLevelAndTopic(selLevel, selTopic)
    : []

  const previewCount = filterQuestions({
    ...(selLevel != null  && { level: selLevel }),
    ...(selTopic != null  && { topic: selTopic }),
    ...(selSubtopic != null && { subtopic: selSubtopic }),
  }).length

  function handleLevelSelect(lv) {
    if (selLevel === lv) { setSelLevel(null); setSelTopic(null); setSelSubtopic(null) }
    else                 { setSelLevel(lv);   setSelTopic(null); setSelSubtopic(null) }
  }

  function handleTopicSelect(tp) {
    if (selTopic === tp) { setSelTopic(null); setSelSubtopic(null) }
    else                 { setSelTopic(tp);   setSelSubtopic(null) }
  }

  function start() {
    if (selLevel == null) return
    const p = new URLSearchParams({ mode: 'focused', level: String(selLevel) })
    if (selTopic)    p.set('topic',    selTopic)
    if (selSubtopic) p.set('subtopic', selSubtopic)
    navigate(`/practice?${p.toString()}`)
  }

  return (
    <div className="space-y-4">

      {/* Level cards */}
      <div>
        <p className="text-xs font-medium text-on-dim uppercase tracking-widest mb-2">Choose Level</p>
        <div className="space-y-1.5">
          {levels.map(({ level: lv, title, difficultyLabel, shortDescription, questionCount }) => (
            <button
              key={lv}
              onClick={() => handleLevelSelect(lv)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all active:scale-[0.99] ${
                selLevel === lv
                  ? 'bg-primary/10 border-primary text-on'
                  : 'bg-surface-container border-outline-variant hover:border-primary/30'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                selLevel === lv ? 'bg-primary text-white' : 'bg-surface-low text-on-variant border border-outline-variant'
              }`}>
                {lv}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-semibold text-on truncate">{title}</p>
                  <span className={`text-2xs font-medium flex-shrink-0 ${selLevel === lv ? 'text-primary' : 'text-on-dim'}`}>
                    {difficultyLabel}
                  </span>
                </div>
                <p className="text-2xs text-on-dim mt-0.5 truncate">{shortDescription}</p>
              </div>
              <span className="text-2xs text-on-dim flex-shrink-0 tabular-nums">{questionCount} Q</span>
            </button>
          ))}
        </div>
      </div>

      {/* Topic chips — appear after level selection */}
      {topics.length > 0 && (
        <div>
          <p className="text-xs font-medium text-on-dim uppercase tracking-widest mb-2">Choose Topic</p>
          <div className="flex flex-wrap gap-1.5">
            {topics.map(tp => {
              const count = filterQuestions({ level: selLevel, topic: tp }).length
              return (
                <button
                  key={tp}
                  onClick={() => count > 0 && handleTopicSelect(tp)}
                  disabled={count === 0}
                  className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold border transition-all min-h-[44px] ${
                    selTopic === tp
                      ? 'bg-accent text-white border-accent'
                      : count === 0
                        ? 'bg-surface-low border-outline-variant text-on-dim opacity-40 cursor-not-allowed'
                        : 'bg-surface-container border-outline-variant text-on-variant hover:border-accent/40'
                  }`}
                >
                  {tp}
                  <span className={`text-2xs tabular-nums ${selTopic === tp ? 'text-white/70' : 'text-on-dim'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Subtopic chips — only when multiple options exist */}
      {subtopics.length > 1 && (
        <div>
          <p className="text-xs font-medium text-on-dim uppercase tracking-widest mb-2">
            Subtopic <span className="normal-case font-normal">(optional)</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {subtopics.map(st => {
              const count = filterQuestions({ level: selLevel, topic: selTopic, subtopic: st }).length
              return (
                <button
                  key={st}
                  onClick={() => count > 0 && setSelSubtopic(selSubtopic === st ? null : st)}
                  disabled={count === 0}
                  className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold border transition-all min-h-[44px] ${
                    selSubtopic === st
                      ? 'bg-surface-container border-accent text-accent'
                      : count === 0
                        ? 'bg-surface-low border-outline-variant text-on-dim opacity-40 cursor-not-allowed'
                        : 'bg-surface-container border-outline-variant text-on-variant hover:border-accent/40'
                  }`}
                >
                  {st}
                  <span className={`text-2xs tabular-nums ${selSubtopic === st ? 'text-accent/70' : 'text-on-dim'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Preview + Start — appears when level is selected */}
      {selLevel != null && (
        <div className="bg-surface-container border border-outline-variant rounded-xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-on">
              {previewCount > 0 ? `${previewCount} questions` : 'No questions for this selection'}
            </p>
            <p className="text-xs text-on-dim mt-0.5 truncate">
              {[`Level ${selLevel}`, selTopic, selSubtopic].filter(Boolean).join(' · ')}
            </p>
          </div>
          <button
            onClick={start}
            disabled={previewCount === 0}
            className="flex-shrink-0 flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 active:scale-[0.99] disabled:opacity-40 transition-all min-h-[44px]"
          >
            Start
            <Icon name="arrow_forward" size={16} fill className="text-white" />
          </button>
        </div>
      )}

    </div>
  )
}
