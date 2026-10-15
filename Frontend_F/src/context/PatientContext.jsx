import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { EMPTY_FORM } from '../data/profiles'
import { checkInputs, errorsOf, warningsOf, toPayload } from '../lib/guard'
import { predictRisk } from '../services/api'

const Ctx = createContext(null)
export const usePatient = () => useContext(Ctx)

function mapBackendToUI(data) {
  if (!data) return null
  const cad = data.overall_cad ?? 0
  const lad = data.lad ?? 0
  const lcx = data.lcx ?? 0
  const rca = data.rca ?? 0
  const avg = (lad + lcx + rca) / 3
  const pct = (n) => Math.round(n * 1000) / 10

  const expl = data.explanations?.overall_cad || []
  const maxAbs = Math.max(0.0001, ...expl.map((x) => Math.abs(x.shap_value)))
  const factors = expl.slice(0, 5).map((x) => {
    const arrow = x.shap_value >= 0 ? '↑' : '↓'
    const rawVal = typeof x.value === 'number' ? x.value.toFixed(1) : x.value
    return {
      name: `${x.feature} (${rawVal}) ${arrow} ${Math.abs(x.shap_value).toFixed(2)}`,
      weight: Math.round((Math.abs(x.shap_value) / maxAbs) * 100),
    }
  })

  const severity = cad >= 0.6 ? 'High' : cad >= 0.3 ? 'Moderate' : 'Low'

  return {
    overallRisk: pct(cad),
    cadProbability: pct(cad),
    severity,
    confidence: pct(avg),
    factors,
    // Raw values for 3D viewer
    lad,
    lcx,
    rca,
    overall_cad: cad,
    explanations: data.explanations,
  }
}

export function PatientProvider({ children }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [profile, setProfile] = useState(null)          // loaded demo profile, if any
  const [run, setRun] = useState(null)                  // { data, warnings, inputs } from the last prediction
  const [status, setStatus] = useState('idle')          // idle | loading | done | blocked | offline
  const [attempted, setAttempted] = useState(false)     // show "missing" errors only after a try
  const issues = useMemo(() => checkInputs(form), [form])

  const edit = useCallback((k, v) => { setForm(p => ({ ...p, [k]: v })); setProfile(null) }, [])

  const analyze = useCallback(async (values) => {
    const found = checkInputs(values)
    setAttempted(true)
    if (errorsOf(found).length) { setStatus('blocked'); return null }
    setStatus('loading')
    try {
      const raw = await predictRisk(toPayload(values))
      const data = mapBackendToUI(raw)
      setRun({ data, warnings: warningsOf(found), inputs: values })
      setStatus('done')
      return data
    }  
  catch (error) {
  console.error('Analyze Risk failed:', error)
  setStatus('offline')
  return null
}
  }, [])

  // One click: fill the form with a demo profile and run the real prediction.
  const loadProfile = useCallback((p, autoRun = true) => {
    setForm(p.values); setProfile(p); setRun(null); setStatus('idle'); setAttempted(false)
    if (autoRun) analyze(p.values)
  }, [analyze])

  const clear = useCallback(() => { setForm(EMPTY_FORM); setProfile(null); setRun(null); setStatus('idle'); setAttempted(false) }, [])

  const stale = !!run && JSON.stringify(run.inputs) !== JSON.stringify(form)
  const value = { form, edit, profile, issues, attempted, status, analyze, loadProfile, clear,
    result: run?.data ?? null, resultWarnings: run?.warnings ?? [], stale }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
