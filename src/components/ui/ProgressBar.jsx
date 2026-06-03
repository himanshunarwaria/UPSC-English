export default function ProgressBar({ value, max = 100, variant = 'primary', label, showPercent = false, thin = false }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  const colors = {
    primary: 'bg-accent',
    success: 'bg-success',
    warn: 'bg-warn',
    error: 'bg-error',
  }
  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-on-variant">{label}</span>}
          {showPercent && <span className="text-xs font-medium text-on">{pct}%</span>}
        </div>
      )}
      <div className={`w-full bg-surface-low rounded-full overflow-hidden ${thin ? 'h-1.5' : 'h-2'}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors[variant]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
