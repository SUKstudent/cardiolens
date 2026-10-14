import { useEffect, useState } from 'react'
export const Glass = ({ className = '', hover, children, ...p }) => (
  <div className={`glass rounded-xl p-5 sm:p-6 ${hover ? 'glass-hover' : ''} ${className}`} {...p}>{children}</div>
)
export const Title = ({ children, sub }) => (
  <div className="mb-4"><h3 className="font-display text-[15px] font-semibold text-white">{children}</h3>{sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}</div>
)
export const Btn = ({ variant = 'primary', className = '', children, ...p }) => (
  <button {...p} className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan2 disabled:pointer-events-none disabled:opacity-50 ${
    variant === 'primary' ? 'bg-gradient-to-r from-volt to-cyan2 text-void hover:-translate-y-px hover:shadow-[0_0_28px_-4px_rgba(34,229,255,.7)]'
    : 'border border-sky-400/25 text-sky-100 hover:border-cyan2/70 hover:bg-cyan2/5'} ${className}`}>{children}</button>
)
export const Toggle = ({ on, onChange, label }) => (
  <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className="field flex items-center justify-between !py-2.5">
    <span className="text-sm">{label}</span>
    <span className={`h-5 w-9 rounded-full p-0.5 transition ${on ? 'bg-cyan2' : 'bg-slate-700'}`}><span className={`block h-4 w-4 rounded-full bg-void transition-transform ${on ? 'translate-x-4' : ''}`} /></span>
  </button>
)
export function RiskRing({ value = null, size = 220, label = 'Overall risk' }) {
  const [v, setV] = useState(0); const r = 88, c = 2 * Math.PI * r
  useEffect(() => { const t = setTimeout(() => setV(value ?? 0), 150); return () => clearTimeout(t) }, [value])
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <defs><linearGradient id="rg" x1="0" x2="1"><stop offset="0" stopColor="#38bdf8" /><stop offset="1" stopColor="#8b7bff" /></linearGradient></defs>
        <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(56,189,248,.14)" strokeWidth="6" strokeDasharray={value == null ? '2 7' : undefined} />
        <circle cx="100" cy="100" r="74" fill="none" stroke="rgba(139,123,255,.18)" strokeWidth="1" strokeDasharray="1 5" />
        {value != null && <circle cx="100" cy="100" r={r} fill="none" stroke="url(#rg)" strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - v / 100)} style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)', filter: 'drop-shadow(0 0 8px #22e5ff)' }} />}
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <div className="text-xs text-slate-400">{label}</div>
        <div className="font-display text-5xl font-light text-white">{value ?? '--'}<span className="text-xl text-slate-400">%</span></div>
      </div>
    </div>
  )
}
export const Meter = ({ label, value = null }) => (
  <div>
    <div className="mb-1.5 flex justify-between text-sm"><span>{label}</span><span className="text-slate-400">{value == null ? '--' : `${value}%`}</span></div>
    <div className="h-1.5 overflow-hidden rounded-full bg-sky-400/10"><div className={`h-full rounded-full ${value == null ? 'shimmer w-full' : 'bg-gradient-to-r from-volt to-iris'}`} style={value != null ? { width: `${value}%` } : undefined} /></div>
  </div>
)
export const Stat = ({ label, value = null, unit = '%' }) => (
  <Glass hover><div className="text-xs text-slate-400">{label}</div><div className="mt-2 font-display text-3xl font-light text-white">{value ?? '--'}<span className="text-base text-slate-500"> {unit}</span></div></Glass>
)
export const Header = ({ title, sub, right }) => (
  <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><h1 className="font-display text-2xl font-light tracking-tight text-white sm:text-3xl">{title}</h1>{sub && <p className="mt-1.5 text-sm text-slate-400">{sub}</p>}</div>{right}</div>
)
