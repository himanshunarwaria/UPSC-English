export default function Badge({ children, variant = 'default', size = 'sm' }) {
  const variants = {
    default: 'bg-surface-low text-on-variant',
    primary: 'bg-accent-dim text-accent',
    success: 'bg-success-dim text-success',
    error: 'bg-error-dim text-error',
    warn: 'bg-warn-dim text-warn',
  }
  const sizes = {
    xs: 'text-2xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
  }
  return (
    <span className={`inline-flex items-center rounded font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  )
}
