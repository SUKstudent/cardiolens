import { useEffect, useState } from 'react'
import { predict } from './api'
import PatientForm, { SAMPLES } from './components/PatientForm'
import Dashboard from './components/Dashboard'

const NAV = {
  doctor: [['Overview', '#top'], ['Patient Profile', '#top'], ['3D Heart Explorer', '#heart'], ['AI Explanation', '#why'], ['Reports', '#top'], ['Settings', '#top']],
  patient: [['Home', '#top'], ['My Health Profile', '#top'], ['AI Analysis', '#why'], ['3D Heart Explorer', '#heart'], ['Reports', '#top'], ['Health Tips', '#top'], ['Settings', '#top']],
}
const fmt = () => new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })

export default function App() {
  const [patient, setPatient] = useState(SAMPLES['Higher-risk sample'])
  const [shown, setShown] = useState(null)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [mode, setMode] = useState('doctor')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  async function run(p = patient) {
    setLoading(true); setError('')
    try {
      const r = await predict(p)
      setResult(r); setShown(p); setOpen(false)
      setHistory((h) => [{ id: `CL-${2048 + h.length}`, name: p.name, date: fmt(), risk: r.overall_cad }, ...h])
    } catch (e) { setError(e.message || 'Could not get a prediction.') }
    finally { setLoading(false) }
  }
  useEffect(() => { run() }, [])
  useEffect(() => { const k = (e) => e.key === 'Escape' && setOpen(false); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k) }, [])

  const modeSelect = (cls) => (
    <select aria-label="Experience mode" value={mode} onChange={(e) => setMode(e.target.value)} className={`rounded-lg border border-line bg-surface px-3 py-2 text-sm font-semibold ${cls}`}>
      <option value="doctor">Doctor Mode</option><option value="patient">Patient Mode</option>
    </select>
  )

  return (
    <div data-theme={mode} className="min-h-screen bg-canvas text-fg md:flex">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-side p-4 md:flex">
        <div className="mb-6"><p className="font-display text-xl font-extrabold">Cardio<span className="text-heart">Lens</span></p>
          <p className="text-xs text-mute">{mode === 'doctor' ? 'AI-Powered Cardiac Insights' : 'AI for a Healthier Heart'}</p></div>
        <nav className="flex-1 space-y-1">{NAV[mode].map(([l, h], i) => (
          <a key={l} href={h} className={`block rounded-lg px-3 py-2 text-sm font-semibold ${i === 0 ? 'bg-accent text-white' : 'text-mute hover:bg-accent/10'}`}>{l}</a>))}</nav>
        <label className="mt-4 text-xs text-mute">Experience Mode{modeSelect('mt-1 w-full')}</label>
      </aside>

      <div className="min-w-0 flex-1" id="top">
        <header className="flex items-center gap-3 border-b border-line p-4">
          <p className="font-display font-extrabold md:hidden">Cardio<span className="text-heart">Lens</span></p>
          <div className="hidden flex-1 md:block" />
          {modeSelect('md:hidden ml-auto')}
          <button onClick={() => setOpen(true)} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white">+ New Analysis</button>
          <span className="hidden rounded-full bg-accent/20 px-3 py-2 text-xs font-bold sm:block">{mode === 'doctor' ? 'Dr. Sharma' : 'Patient Mode'}</span>
        </header>
        <main className="p-4 md:p-6" aria-live="polite">
          {mode === 'doctor' && <div className="mb-4"><h1 className="text-3xl font-extrabold">Cardiac Risk Overview</h1>
            <p className="text-sm text-mute">{shown ? `${shown.name} · ` : ''}Analysis updated just now · Prototype, not a diagnosis</p></div>}
          {error && <p role="alert" className="mb-4 rounded-lg bg-heart/10 p-3 text-sm text-heart">{error}</p>}
          {loading && !result && <div className="h-64 animate-pulse rounded-2xl bg-line" aria-label="Loading" />}
          {result && shown && <Dashboard result={result} patient={shown} mode={mode} history={history} />}
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="New analysis">
          <div data-theme={mode} className="max-h-full w-full max-w-md overflow-y-auto rounded-2xl border border-line bg-surface p-6 text-fg">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">New Analysis</h2>
              <button onClick={() => setOpen(false)} aria-label="Close" className="px-2 text-xl">×</button></div>
            <PatientForm value={patient} onChange={setPatient} onSubmit={() => run(patient)} loading={loading} />
          </div>
        </div>
      )}
    </div>
  )
}
