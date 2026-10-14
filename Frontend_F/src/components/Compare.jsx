import { ShieldCheck, ShieldAlert, ShieldX, Users } from 'lucide-react'
import { SAMPLE_PROFILES } from '../data/profiles'
import { errorsOf, warningsOf } from '../lib/guard'

// ---- Feature 1: sample profile picker ------------------------------------
export function SampleProfiles({ active, onPick, className = '' }) {
  return (
    <div className={className}>
      <div className="mb-2 flex items-center gap-2 text-xs text-slate-400"><Users size={14} />Load a demo patient (sample inputs, not real people)</div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {SAMPLE_PROFILES.map(p => (
          <button key={p.id} type="button" onClick={() => onPick(p)}
            className={`rounded-lg border p-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan2 ${active === p.id ? 'border-cyan2 bg-cyan2/10' : 'border-sky-400/20 hover:border-cyan2/60 hover:bg-cyan2/5'}`}>
            <div className="font-display text-sm text-white">{p.name}</div>
            <div className="mt-0.5 text-xs text-slate-400">{p.desc}</div>
          </button>))}
      </div>
    </div>
  )
}

// ---- Feature 2: reliability guard badge + list ---------------------------
export function GuardBadge({ issues }) {
  const e = errorsOf(issues).length, w = warningsOf(issues).length
  const [Icon, cls, text] = e ? [ShieldX, 'border-rose-400/40 text-rose-300', `${e} to fix`]
    : w ? [ShieldAlert, 'border-amber-300/40 text-amber-200', `${w} outside supported range`]
    : [ShieldCheck, 'border-emerald-400/40 text-emerald-300', 'Inputs look reliable']
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${cls}`}><Icon size={13} />{text}</span>
}
export function GuardList({ issues, showMissing = true }) {
  const list = issues.filter(i => showMissing || i.kind !== 'missing')
  if (!list.length) return null
  return (
    <ul className="space-y-1.5" aria-label="Input checks">
      {list.map((i, n) => (
        <li key={n} className={`flex gap-2 text-xs ${i.level === 'error' ? 'text-rose-300' : 'text-amber-200'}`}>
          <span aria-hidden className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />{i.msg}
        </li>))}
    </ul>
  )
}

// ---- Features 3 & 4: side-by-side prediction table -----------------------
const ROWS = [
  { k: 'overallRisk', label: 'Overall risk', unit: '%', risk: true },
  { k: 'cadProbability', label: 'CAD probability', unit: '%', risk: true },
  { k: 'severity', label: 'Severity' },
  { k: 'confidence', label: 'Model confidence', unit: '%' },
]
const fmt = (v, u = '') => (v == null ? '--' : `${v}${u}`)
function Delta({ row, a, b }) {
  const x = a?.[row.k], y = b?.[row.k]
  if (x == null || y == null) return <span className="text-slate-600">--</span>
  if (!row.unit) return x === y ? <span className="text-slate-500">No change</span> : <span className="text-cyan2">Changed</span>
  const d = Math.round((y - x) * 10) / 10
  if (d === 0) return <span className="text-slate-500">No change</span>
  const tone = row.risk ? (d > 0 ? 'text-rose-300' : 'text-emerald-300') : 'text-slate-300'
  return <span className={tone}>{d > 0 ? '+' : ''}{d} pts</span>
}
export function ResultTable({ labelA, labelB, a, b }) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[460px] text-sm">
        <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr] gap-3 border-b border-sky-400/15 pb-2 text-xs text-slate-400">
          <span>Prediction</span><span>{labelA}</span><span>{labelB}</span><span>Change</span>
        </div>
        {ROWS.map(r => (
          <div key={r.k} className="grid grid-cols-[1.3fr_1fr_1fr_1fr] items-center gap-3 border-b border-sky-400/10 py-3 last:border-0">
            <span className="text-slate-300">{r.label}</span>
            <span className="font-display text-white">{fmt(a?.[r.k], r.unit)}</span>
            <span className="font-display text-white">{fmt(b?.[r.k], r.unit)}</span>
            <Delta row={r} a={a} b={b} />
          </div>))}
      </div>
    </div>
  )
}
