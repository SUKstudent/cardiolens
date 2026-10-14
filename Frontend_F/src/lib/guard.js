import { RANGES } from '../data/profiles'

const REQUIRED = ['age', 'sex', 'sys', 'dia', 'chol', 'hr']
const NAMES = { ...Object.fromEntries(Object.entries(RANGES).map(([k, r]) => [k, r.label])), sex: 'Sex' }

// Issue: { field, kind: 'missing' | 'invalid' | 'range', level: 'error' | 'warn', msg }
// 'error' blocks the prediction, 'warn' lets it run but flags it as less reliable.
export function checkInputs(f) {
  const out = []
  for (const k of REQUIRED) {
    const v = f[k]
    if (v === '' || v == null) { out.push({ field: k, kind: 'missing', level: 'error', msg: `${NAMES[k]} is missing.` }); continue }
    if (k === 'sex') continue
    const r = RANGES[k], n = Number(v)
    if (!Number.isFinite(n)) out.push({ field: k, kind: 'invalid', level: 'error', msg: `${r.label} must be a number.` })
    else if (n < r.hardMin || n > r.hardMax) out.push({ field: k, kind: 'invalid', level: 'error', msg: `${n} ${r.unit} is not a valid ${r.label.toLowerCase()}. Check for a typo.` })
    else if (n < r.min || n > r.max) out.push({ field: k, kind: 'range', level: 'warn', msg: `${n} is outside the supported range (${r.min}–${r.max} ${r.unit}). The prediction may be unreliable.` })
  }
  const s = Number(f.sys), d = Number(f.dia)
  if (!out.some(i => i.field === 'sys' || i.field === 'dia') && s && d && d >= s)
    out.push({ field: 'dia', kind: 'invalid', level: 'error', msg: 'Diastolic pressure must be lower than systolic.' })
  return out
}
export const errorsOf = issues => issues.filter(i => i.level === 'error')
export const warningsOf = issues => issues.filter(i => i.level === 'warn')
export const issueFor = (issues, field, showMissing = true) => issues.find(i => i.field === field && (showMissing || i.kind !== 'missing'))
export const isBlank = f => REQUIRED.every(k => f[k] === '' || f[k] == null)

// Numbers instead of strings for the API.
export function toPayload(f) {
  const n = v => (v === '' || v == null ? null : Number(v))
  return { ...f, age: n(f.age), sys: n(f.sys), dia: n(f.dia), chol: n(f.chol), hr: n(f.hr) }
}
