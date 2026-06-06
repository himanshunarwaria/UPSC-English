import { useState } from 'react'
import userTrackingService from '../services/userTrackingService'
import sentenceImproverService from '../services/sentenceImproverService'
import Icon from '../components/ui/Icon'

// ── Output Card ────────────────────────────────────────────────────────────

function OutputCard({ result }) {
  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-4 space-y-3">

      {/* Original Sentence */}
      <div className="bg-surface-low border border-outline-variant rounded-lg p-3">
        <p className="text-2xs font-medium text-on-dim uppercase tracking-wider mb-1">Original Sentence</p>
        <p className="text-sm text-on">{result.original}</p>
      </div>

      {/* Improved Sentence */}
      <div className="bg-success-dim border border-success/30 rounded-lg p-3">
        <p className="text-2xs font-medium text-success uppercase tracking-wider mb-1">UPSC-Style Improvement</p>
        <p className="text-sm text-on leading-relaxed">{result.improved}</p>
      </div>

      {/* What Changed */}
      {result.whatChanged.length > 0 && (
        <div className="bg-surface-low border border-outline-variant rounded-lg p-3">
          <p className="text-2xs font-medium text-on-dim uppercase tracking-wider mb-2">What Changed</p>
          <ul className="space-y-1">
            {result.whatChanged.map((change, i) => (
              <li key={i} className="text-xs text-on-variant flex items-start gap-2">
                <span className="text-on-dim flex-shrink-0 mt-0.5">•</span>
                <span>{change}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Better Vocabulary */}
      {result.vocabularyUsed && result.vocabularyUsed.length > 0 && (
        <div className="bg-accent-dim border border-accent/30 rounded-lg p-3">
          <p className="text-2xs font-medium text-accent uppercase tracking-wider mb-2">Better Vocabulary Used</p>
          <div className="flex flex-wrap gap-2">
            {result.vocabularyUsed.map((word, i) => (
              <span key={i} className="text-2xs bg-surface-container border border-outline-variant px-2 py-1 rounded-sm text-on">
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Grammar Correction */}
      {result.grammarCorrection && (
        <div className="bg-warn-dim border border-warn/20 rounded-lg p-3">
          <p className="text-2xs font-medium text-warn uppercase tracking-wider mb-1">Grammar Correction</p>
          <p className="text-xs text-on-variant">{result.grammarCorrection}</p>
        </div>
      )}

      {/* Connector Used */}
      {result.connectorUsed && (
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
          <p className="text-2xs font-medium text-primary uppercase tracking-wider mb-1">Connector Used</p>
          <p className="text-xs text-on-variant">
            <span className="font-semibold">{result.connectorUsed}</span> — Used to connect related ideas
          </p>
        </div>
      )}

    </div>
  )
}

// ── Main Sentence Builder Screen ───────────────────────────────────────────

export default function SentenceBuilder() {
  const userId = userTrackingService.getLoggedInUserId()

  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleImprove = async () => {
    if (!input.trim()) return

    setLoading(true)

    // Simulate processing delay
    setTimeout(() => {
      const improved = sentenceImproverService.improveSentence(input)

      if (improved) {
        setResult(improved)

        // Track the improvement
        if (userId) {
          sentenceImproverService.trackImprovement(userId, {
            original_sentence: input,
            improved_sentence: improved.improved,
            user_id: userId,
          })
        }
      }

      setLoading(false)
    }, 500)
  }

  const handleExample = (example) => {
    setInput(example.original)
    const improved = sentenceImproverService.improveSentence(example.original)
    if (improved) {
      setResult(improved)
      if (userId) {
        sentenceImproverService.trackImprovement(userId, {
          original_sentence: example.original,
          improved_sentence: improved.improved,
          user_id: userId,
        })
      }
    }
  }

  const examples = sentenceImproverService.getExamples()

  return (
    <main className="flex-1 safe-pb overflow-y-auto">
      <div className="max-w-lg mx-auto px-4">

        {/* Header */}
        <div className="pt-5 pb-4">
          <h1 className="font-display font-bold text-2xl text-on">Sentence Builder</h1>
          <p className="text-sm text-on-variant mt-0.5">Transform simple sentences into UPSC-style formal language</p>
        </div>

        {/* Input Section */}
        <div className="mb-4">
          <label className="text-2xs font-medium text-on-dim uppercase tracking-widest mb-2 block">
            Enter a Simple Sentence
          </label>
          <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleImprove()
                }
              }}
              placeholder="E.g., Government should help poor people."
              rows={3}
              className="w-full px-4 py-3 text-sm text-on bg-surface-container resize-none focus:outline-none placeholder:text-on-dim leading-relaxed"
            />
            <div className="flex items-center justify-between px-4 py-2 border-t border-outline-variant bg-surface-low">
              <p className="text-2xs text-on-dim">Max 300 characters</p>
              <p className="text-2xs font-medium text-on-dim">{input.length}/300</p>
            </div>
          </div>
        </div>

        {/* Improve Button */}
        <button
          onClick={handleImprove}
          disabled={!input.trim() || loading}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-3 rounded-xl hover:opacity-90 active:scale-[0.99] disabled:opacity-40 transition-all mb-6"
        >
          <Icon name={loading ? 'hourglass_empty' : 'auto_fix'} size={18} fill />
          {loading ? 'Improving...' : 'Improve Sentence'}
        </button>

        {/* Output Section */}
        {result && (
          <div className="mb-6">
            <OutputCard result={result} />
          </div>
        )}

        {/* Examples Section */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-on mb-3">Examples to Try</h2>
          <div className="space-y-2">
            {examples.map((example, i) => (
              <button
                key={i}
                onClick={() => handleExample(example)}
                className="w-full text-left bg-surface-low border border-outline-variant rounded-xl px-4 py-3 hover:border-outline hover:bg-surface-container active:scale-[0.99] transition-all"
              >
                <p className="text-sm text-on font-medium">{example.original}</p>
                <p className="text-2xs text-on-dim mt-1">Click to improve →</p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
