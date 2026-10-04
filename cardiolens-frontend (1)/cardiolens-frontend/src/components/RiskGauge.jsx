export const levelOf = (p) =>
  p >= 0.6 ? { label: 'High', color: '#E5484D' } : p >= 0.35 ? { label: 'Moderate', color: '#E9A23B' } : { label: 'Low', color: '#1F9E8F' }

export default function RiskGauge({ value }) {
  const { label, color } = levelOf(value)
  return (
    <div role="img" aria-label={`Overall risk ${Math.round(value * 100)} percent, ${label}`} className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r="42" pathLength="100" fill="none" stroke="var(--line)" strokeWidth="9" />
        <circle cx="50" cy="50" r="42" pathLength="100" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={`${Math.max(value * 100, 1)} 100`} className="motion-safe:transition-all motion-safe:duration-700" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-extrabold">{Math.round(value * 100)}%</span>
        <span className="text-xs font-semibold" style={{ color }}>{label} Risk</span>
      </div>
    </div>
  )
}
