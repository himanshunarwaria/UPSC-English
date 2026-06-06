import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import userTrackingService from '../services/userTrackingService'
import { getVocabularyBank, getVocabularyTopics, searchVocabulary } from '../data/vocabularyBank'
import Badge from '../components/ui/Badge'
import Icon from '../components/ui/Icon'

// ── Empty State ────────────────────────────────────────────────────────────

function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="text-center py-12">
      <Icon name={icon} size={36} className="text-on-dim mx-auto mb-3" />
      <p className="text-sm font-semibold text-on mb-1">{title}</p>
      {subtitle && (
        <p className="text-xs text-on-dim mb-4 leading-relaxed max-w-[250px] mx-auto">{subtitle}</p>
      )}
    </div>
  )
}

// ── Vocabulary Card ────────────────────────────────────────────────────────

function VocabularyCard({ item, isLearned, onToggleLearned }) {
  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-4 mb-3">
      {/* Header with learn button */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="default" size="xs">{item.topic}</Badge>
            <Badge variant="default" size="xs">L{item.level}</Badge>
          </div>
        </div>
        <button
          onClick={() => onToggleLearned(item.id)}
          className={`flex-shrink-0 px-3 py-1 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] ${
            isLearned
              ? 'bg-success-dim border border-success/20 text-success'
              : 'bg-surface-low border border-outline-variant text-on-variant hover:border-accent/30'
          }`}
        >
          {isLearned ? '✓ Learned' : 'Save Word'}
        </button>
      </div>

      {/* Common → Advanced word */}
      <div className="mb-3">
        <p className="text-2xs text-on-dim font-medium mb-0.5">Common Word</p>
        <p className="text-lg font-bold text-on">{item.common_word}</p>
      </div>

      {/* Arrow */}
      <div className="flex justify-center mb-2">
        <Icon name="arrow_downward" size={16} className="text-on-dim" />
      </div>

      {/* Advanced word */}
      <div className="mb-3 p-2.5 bg-accent-dim border border-accent/30 rounded-lg">
        <p className="text-2xs text-on-dim font-medium mb-0.5">Advanced Replacement</p>
        <p className="text-lg font-bold text-accent">{item.advanced_word}</p>
      </div>

      {/* Meaning */}
      <div className="mb-3 p-3 bg-surface-low border border-outline-variant rounded-lg">
        <p className="text-2xs text-on-dim font-medium mb-0.5">Meaning</p>
        <p className="text-sm text-on-variant leading-relaxed">{item.meaning}</p>
      </div>

      {/* Example sentence */}
      <div className="p-3 bg-surface-low border border-outline-variant rounded-lg">
        <p className="text-2xs text-on-dim font-medium mb-0.5">Example</p>
        <p className="text-sm text-on italic leading-relaxed">"{item.example_sentence}"</p>
      </div>
    </div>
  )
}

// ── Main Vocabulary Bank screen ────────────────────────────────────────────

export default function VocabularyBank() {
  const navigate = useNavigate()
  const userId = userTrackingService.getLoggedInUserId()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('all')
  const [showLearned, setShowLearned] = useState(false)

  // Get all vocabulary
  const allVocab = useMemo(() => getVocabularyBank(), [])
  const topics = useMemo(() => getVocabularyTopics(), [])

  // Get user progress
  const userLearnedIds = useMemo(() => {
    if (!userId) return new Set()
    const learned = userTrackingService.getUserLearnedVocabulary(userId)
    return new Set(learned.map(v => v.vocabulary_id))
  }, [userId])

  const vocabStats = useMemo(() => {
    return userId ? userTrackingService.getUserVocabularyStats(userId) : { total: 0, learned: 0, percentage: 0 }
  }, [userId])

  // Filter vocabulary
  const filteredVocab = useMemo(() => {
    let result = allVocab

    // Search filter
    if (searchQuery.trim()) {
      result = searchVocabulary(searchQuery)
    }

    // Topic filter
    if (selectedTopic !== 'all') {
      result = result.filter(v => v.topic === selectedTopic)
    }

    // Learned filter
    if (showLearned) {
      result = result.filter(v => userLearnedIds.has(v.id))
    }

    return result
  }, [searchQuery, selectedTopic, showLearned, userLearnedIds])

  const handleToggleLearned = (vocabId) => {
    if (!userId) {
      navigate('/')
      return
    }
    userTrackingService.toggleVocabularyLearned(userId, vocabId)
    // Re-render will happen due to userLearnedIds dependency update
  }

  return (
    <main className="flex-1 safe-pb overflow-y-auto">
      <div className="max-w-lg mx-auto px-4">

        {/* Header */}
        <div className="pt-5 pb-4">
          <h1 className="font-display font-bold text-2xl text-on">Vocabulary Bank</h1>
          <p className="text-sm text-on-variant mt-0.5">Common → Advanced word replacements</p>
        </div>

        {/* Progress Card (if logged in) */}
        {userId && vocabStats.total > 0 && (
          <div className="mb-4 p-4 bg-accent-dim border border-accent/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xs text-on-dim font-medium mb-1">Words Learned</p>
                <p className="font-display font-bold text-2xl text-accent">
                  {vocabStats.learned} / {vocabStats.total}
                </p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-display font-bold text-accent">{vocabStats.percentage}%</p>
                <p className="text-2xs text-on-dim">Progress</p>
              </div>
            </div>
            <div className="mt-2 h-2 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all"
                style={{ width: `${vocabStats.percentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Search bar */}
        <div className="mb-4">
          <div className="relative">
            <Icon name="search" size={16} className="absolute left-3 top-3 text-on-dim" />
            <input
              type="text"
              placeholder="Search words..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-outline-variant rounded-xl bg-surface-container text-on placeholder:text-on-dim focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Topic filter */}
        <div className="mb-4 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedTopic('all')}
            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
              selectedTopic === 'all'
                ? 'bg-accent text-white'
                : 'bg-surface-container border border-outline-variant text-on-variant hover:border-accent/30'
            }`}
          >
            All Topics
          </button>
          {topics.map(topic => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                selectedTopic === topic
                  ? 'bg-accent text-white'
                  : 'bg-surface-container border border-outline-variant text-on-variant hover:border-accent/30'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Learned filter toggle */}
        {userId && (
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setShowLearned(!showLearned)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                showLearned
                  ? 'bg-success-dim border border-success/20 text-success'
                  : 'bg-surface-low border border-outline-variant text-on-variant hover:bg-outline-variant'
              }`}
            >
              <Icon name="check_circle" size={14} />
              {showLearned ? 'Showing Learned' : 'Show All'}
            </button>
          </div>
        )}

        {/* Vocabulary cards or empty state */}
        {filteredVocab.length === 0 ? (
          <EmptyState
            icon={searchQuery ? 'search_off' : 'bookmark_border'}
            title={searchQuery ? 'No words found' : 'No vocabulary items'}
            subtitle={searchQuery ? 'Try a different search term.' : 'Start with common words and learn advanced replacements.'}
          />
        ) : (
          <div className="mb-6">
            <p className="text-xs text-on-dim mb-3">
              {filteredVocab.length} word{filteredVocab.length !== 1 ? 's' : ''}
            </p>
            {filteredVocab.map(vocab => (
              <VocabularyCard
                key={vocab.id}
                item={vocab}
                isLearned={userLearnedIds.has(vocab.id)}
                onToggleLearned={handleToggleLearned}
              />
            ))}
          </div>
        )}

      </div>
    </main>
  )
}
