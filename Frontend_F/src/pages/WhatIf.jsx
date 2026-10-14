import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Glass, Title, Btn, Toggle, Header } from '../components/ui'
import { SampleProfiles, GuardBadge, GuardList, ResultTable } from '../components/Compare'
import { usePatient } from '../context/PatientContext'
import { RANGES } from '../data/profiles'
import { checkInputs, errorsOf, isBlank, toPayload } from '../lib/guard'
import { predictRisk } from '../services/api'

const SLIDERS = ['age', 'sys', 'dia', 'chol', 'hr']
const SCENARIOS = [
  { label: 'Quit smoking', apply: m => ({ ...m, smoking: false }) },
  { label: 'Blood pressure 120/80', apply: m => ({ ...m, sys: '120', dia: '80' }) },
  { label: 'Cholesterol 180', apply: m => ({ ...m, chol: '180' }) },
  { label: '10 years older', apply: m => ({ ...m, age: String(Number(m.age) + 10) }) },
]
const LABELS = { ...Object.fromEntries(SLIDERS.map(k => [k, RANGES[k].label])), diabetes: 'Diabetes', smoking: 'Smoking' }
const show = (k, v) => (typeof v === 'boolean' ? (v ? 'Yes' : 'No') : `${v}${RANGES[k] ? ' ' + RANGES[k].unit : ''}`)

export default function WhatIf() {
  const { form, issues, loadProfile } = usePatient()
  const [mod, setMod] = useState(form)
  const [out, setOut] = useState({ status: 'idle', base: null, alt: null })
  useEffect(() => { setMod(form); setOut({ status: 'idle', base: null, alt: null }) }, [form])

  const ready = !isBlank(form) && !errorsOf(issues).length
  const modIssues = useMemo(() => checkInputs(mod), [mod])
  const changes = useMemo(() => ['age', 'sys', 'dia', 'chol', 'hr', 'diabetes', 'smoking'].filter(k => String(form[k]) !== String(mod[k])).map(k => ({ k, from: form[k], to: mod[k] })), [form, mod])
  const set = (k, v) => setMod(p => ({ ...p, [k]: v }))

  const run = async () => {
    setOut({ status: 'loading', base: null, alt: null })
    try {
      const [base, alt] = await Promise.all([predictRisk(toPayload(form)), predictRisk(toPayload(mod))])
      setOut({ status: 'done', base, alt })
    } catch { setOut({ status: 'offline', base: null, alt: null }) }
  }

  if (!ready) return (<>
    <Header title="What-If Prognosis Simulator" sub="Change a patient's values and compare the original and updated predictions." />
    <Glass>
      <Title sub="Start from a complete patient so there is something to compare against.">Choose a patient first</Title>
      <SampleProfiles onPick={p => loadProfile(p, false)} className="mb-5" />
      <p className="text-sm text-slate-400">Or enter values yourself in <Link to="/doctor/patient-data" className="text-cyan2 hover:underline">Patient Data</Link>. All required fields must be valid.</p>
    </Glass></>)

  return (<>
    <Header title="What-If Prognosis Simulator" sub="Change a patient's values and compare the original and updated predictions." />
    <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
      <Glass>
        <Title sub="Original values are the Patient Data inputs.">Adjust the patient</Title>
        <div className="mb-5 flex flex-wrap gap-2">
          {SCENARIOS.map(s => <button key={s.label} type="button" onClick={() => setMod(s.apply)} className="rounded-full border border-sky-400/20 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan2/60 hover:text-white">{s.label}</button>)}
        </div>
        <div className="space-y-5">
          {SLIDERS.map(k => { const r = RANGES[k], base = Number(form[k]), v = Number(mod[k]); const changed = String(form[k]) !== String(mod[k])
            return (
              <div key={k}>
                <div className="mb-1.5 flex justify-between text-sm"><label htmlFor={`wi-${k}`}>{r.label}</label>
                  <span className={changed ? 'text-cyan2' : 'text-slate-400'}>{mod[k]} {r.unit}{changed && <span className="ml-2 text-xs text-slate-500">was {form[k]}</span>}</span></div>
                <input id={`wi-${k}`} type="range" className="w-full accent-cyan2" min={Math.min(r.min, base, v)} max={Math.max(r.max, base, v)} value={mod[k]} onChange={e => set(k, e.target.value)} />
              </div>) })}
          <div className="grid gap-2 sm:grid-cols-2"><Toggle label="Diabetes" on={mod.diabetes} onChange={v => set('diabetes', v)} /><Toggle label="Smoking" on={mod.smoking} onChange={v => set('smoking', v)} /></div>
        </div>
        <div className="mt-5 space-y-2.5 rounded-lg border border-sky-400/10 bg-void/40 p-4"><GuardBadge issues={modIssues} /><GuardList issues={modIssues} /></div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Btn onClick={run} disabled={!changes.length || errorsOf(modIssues).length > 0 || out.status === 'loading'}>{out.status === 'loading' ? 'Comparing…' : 'Compare predictions'}</Btn>
          <Btn variant="ghost" onClick={() => setMod(form)} disabled={!changes.length}>Reset changes</Btn>
          {!changes.length && <span className="text-xs text-slate-500">Change at least one value to compare.</span>}
        </div>
      </Glass>
      <div className="space-y-5">
        <Glass>
          <Title sub={changes.length ? `${changes.length} value${changes.length > 1 ? 's' : ''} changed` : 'Nothing changed yet'}>Changes</Title>
          {changes.length ? <ul className="space-y-2 text-sm">{changes.map(c => <li key={c.k} className="flex justify-between border-b border-sky-400/10 pb-2 last:border-0"><span className="text-slate-300">{LABELS[c.k]}</span><span><span className="text-slate-500">{show(c.k, c.from)}</span> <span className="text-slate-600">to</span> <span className="text-cyan2">{show(c.k, c.to)}</span></span></li>)}</ul>
            : <p className="text-sm text-slate-400">Move a slider or pick a scenario.</p>}
        </Glass>
        <Glass>
          <Title sub="Both predictions come from the ML model.">Original vs what-if</Title>
          <ResultTable labelA="Original" labelB="What-if" a={out.base} b={out.alt} />
          {out.status === 'offline' && <p role="status" className="mt-4 text-xs text-iris">Prediction model is not connected yet. Your changes are ready to send to the API.</p>}
        </Glass>
      </div>
    </div>
  </>)
}
