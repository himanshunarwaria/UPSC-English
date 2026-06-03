export default function Icon({ name, size = 24, fill = false, className = '' }) {
  return (
    <span
      className={`material-symbols-outlined leading-none select-none ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${fill ? 400 : 300}, 'GRAD' 0, 'opsz' ${size}`,
      }}
    >
      {name}
    </span>
  )
}
