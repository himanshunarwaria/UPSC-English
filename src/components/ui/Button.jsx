export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  icon,
  className = '',
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded transition-all select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2'

  const variants = {
    primary: 'bg-primary text-white hover:opacity-90 active:scale-[0.98] disabled:opacity-40',
    secondary: 'bg-surface-low text-on border border-outline-variant hover:bg-outline-variant active:scale-[0.98] disabled:opacity-40',
    ghost: 'text-on-variant hover:bg-surface-low active:scale-[0.98] disabled:opacity-40',
    danger: 'bg-error text-white hover:opacity-90 active:scale-[0.98] disabled:opacity-40',
  }

  const sizes = {
    sm: 'text-sm h-8 px-3',
    md: 'text-sm h-10 px-4',
    lg: 'text-base h-12 px-6',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {icon && <span className="material-symbols-outlined text-[18px] leading-none" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>{icon}</span>}
      {children}
    </button>
  )
}
