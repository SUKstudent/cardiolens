import { Link } from 'react-router-dom'
import { Glass, Title, Btn, Toggle, RiskRing, Meter, Stat, Header } from '../components/ui'
import HeartViewer from '../components/HeartViewer'
import { SampleProfiles, GuardBadge, GuardList } from '../components/Compare'
import { ARTERIES, STENOSIS, FACTORS } from '../data/placeholder'
import { usePatient } from '../context/PatientContext'
import { issueFor, isBlank } from '../lib/guard'

// Defined outside PatientForm so inputs keep focus while typing.
const L = ({ t, issue, children }) => (
  <label className="block"><span className="mb-1.5 block text-xs text-slate-400">{t}</span>{children}
    {issue && <span role="alert" className={`mt-1 block text-[11px] ${issue.level === 'error' ? 'text-rose-300' : 'text-amber-200'}`}>{issue.msg}</span>}</label>
)
const tone = i => (i ? (i.level === 'error' ? '!border-rose-400/60' : '!border-amber-300/60') : '')

export function PatientForm() {
  const { form: f, edit: set, issues, attempted, status, analyze, loadProfile, clear, profile } = usePatient()
  const OTHER = ['Family history', 'Hypertension', 'Obesity', 'Sedentary lifestyle']
  const is = k => issueFor(issues, k, attempted)
  const num = (k, props = {}) => <input className={`field ${tone(is(k))}`} type="number" value={f[k]} onChange={e => set(k, e.target.value)} {...props} />
  const msg = { offline: 'Prediction model is not connected yet. Your inputs are ready to send to the API.', blocked: 'Fix the highlighted inputs before analyzing.' }[status]
  return (
    <Glass>
      <Title sub="Pick a demo patient or enter values, then run the assessment.">Patient data</Title>
      <SampleProfiles active={profile?.id} onPick={p => loadProfile(p, true)} className="mb-6" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <L t="Age" issue={is('age')}>{num('age', { placeholder: 'years' })}</L>
        <L t="Sex" issue={is('sex')}><select className={`field ${tone(is('sex'))}`} value={f.sex} onChange={e => set('sex', e.target.value)}><option value="">Select</option><option>Female</option><option>Male</option></select></L>
        <L t="Blood pressure (mmHg)" issue={is('sys') || is('dia')}><div className="flex gap-2">{num('sys', { placeholder: 'Sys' })}{num('dia', { placeholder: 'Dia' })}</div></L>
        <L t="Cholesterol (mg/dL)" issue={is('chol')}>{num('chol')}</L>
        <L t="Heart rate (bpm)" issue={is('hr')}>{num('hr')}</L>
        <div className="grid gap-2 self-end"><Toggle label="Diabetes" on={f.diabetes} onChange={v => set('diabetes', v)} /><Toggle label="Smoking" on={f.smoking} onChange={v => set('smoking', v)} /></div>
      </div>
      <div className="mt-5"><span className="mb-2 block text-xs text-slate-400">Other cardiovascular risk factors</span>
        <div className="flex flex-wrap gap-2">{OTHER.map(o => { const on = f.other.includes(o); return <button key={o} type="button" onClick={() => set('other', on ? f.other.filter(x => x !== o) : [...f.other, o])} className={`rounded-full border px-3 py-1.5 text-xs transition ${on ? 'border-cyan2 bg-cyan2/10 text-cyan2' : 'border-sky-400/20 text-slate-400 hover:text-white'}`}>{o}</button> })}</div></div>
      {!isBlank(f) && <div className="mt-5 space-y-2.5 rounded-lg border border-sky-400/10 bg-void/40 p-4"><GuardBadge issues={issues} /><GuardList issues={issues} showMissing={attempted} /></div>}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Btn onClick={() => analyze(f)} disabled={status === 'loading'}>{status === 'loading' ? 'Analyzing…' : 'Analyze Risk'}</Btn>
        <Btn variant="ghost" onClick={clear}>Clear</Btn>
        {msg && <span role="status" className="text-xs text-iris">{msg}</span>}
      </div>
    </Glass>
  )
}
export function FactorList() {
  const { result } = usePatient()
  const live = result?.factors?.length ? result.factors : null
  return (
    <Glass><Title sub={live ? 'Contribution of each factor to this prediction.' : 'Appears after you run an analysis.'}>Risk factors</Title>
      <div className="space-y-5">{live ? live.map(x => <Meter key={x.name} label={x.name} value={x.weight} />) : FACTORS.map(x => <Meter key={x} label={x} />)}</div></Glass>
  )
}
function Summary() {
  const { result: r, resultWarnings, stale } = usePatient()
  return (
    <Glass>
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-12">
        <RiskRing value={r?.overallRisk ?? null} />
        <div className="grid w-full flex-1 gap-5 sm:grid-cols-3"><div><div className="text-xs text-slate-400">CAD probability</div><div className="mt-1 font-display text-2xl text-white">{r?.cadProbability ?? '--'} %</div></div>
          <div><div className="text-xs text-slate-400">Severity</div><div className="mt-1 font-display text-2xl text-white">{r?.severity ?? '--'}</div></div>
          <div><div className="text-xs text-slate-400">Model confidence</div><div className="mt-1 font-display text-2xl text-white">{r?.confidence ?? '--'} %</div></div></div>
      </div>
      {r && resultWarnings.length > 0 && <div className="mt-6 border-t border-sky-400/10 pt-4"><div className="mb-2 text-xs text-amber-200">This result used inputs outside the supported range:</div><GuardList issues={resultWarnings} /></div>}
      {r && stale && <p className="mt-4 text-xs text-slate-400">Inputs changed since this result. Run Analyze Risk to update it.</p>}
    </Glass>
  )
}

export function DoctorDashboard() {
  return (<>
    <Header title="Cardiovascular Risk Assessment" sub="AI-assisted cardiovascular analysis and visualization." />
    <div className="space-y-6"><PatientForm /><Summary /><FactorList />
      <div className="flex flex-wrap gap-3"><Link to="/doctor/3d-visualization"><Btn>3D Visualization →</Btn></Link><Link to="/doctor/risk-analysis"><Btn variant="ghost">Detailed Risk Analysis →</Btn></Link><Link to="/doctor/reports"><Btn variant="ghost">Generate Report →</Btn></Link></div></div>
  </>)
}
export const DoctorPatientData = () => (<><Header title="Patient Data" sub="Clinical inputs for the risk model." /><PatientForm /></>)

export function DoctorViz() {
  const { result } = usePatient()
  const vesselValue = (k) => {
    if (!result) return '--'
    const v = result[k]
    return v != null ? `${(v * 100).toFixed(1)}%` : '--'
  }
  const vesselLabel = (v) => {
    if (v === '--') return 'Awaiting data'
    const n = parseFloat(v)
    if (n >= 60) return 'High'
    if (n >= 30) return 'Moderate'
    return 'Low'
  }

  const markers = result ? [
    { id: 'lad', name: 'LAD', label: `LAD ${vesselValue('lad')}`, pos: [0.30, 0.55, 0.40], probability: result.lad },
    { id: 'lcx', name: 'LCX', label: `LCX ${vesselValue('lcx')}`, pos: [-0.35, 0.10, 0.55], probability: result.lcx },
    { id: 'rca', name: 'RCA', label: `RCA ${vesselValue('rca')}`, pos: [0.55, -0.25, 0.30], probability: result.rca },
  ] : []

  return (
    <div className="-mx-2 sm:mx-0">
      <Header title="3D Cardiac Visualization" sub="Interactive anatomical viewer." right={<Link to="/doctor"><Btn variant="ghost">← Back to Dashboard</Btn></Link>} />
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <HeartViewer
          className="min-h-[60vh]"
          markers={markers}
        />
        <div className="space-y-5">
          <Glass>
            <Title>Coronary arteries</Title>
            <div className="space-y-4">
              {['lad', 'lcx', 'rca'].map((k) => (
                <div key={k} className="flex items-center justify-between border-b border-sky-400/10 pb-3 last:border-0 last:pb-0">
                  <div>
                    <div className="font-display text-white">{k.toUpperCase()}</div>
                    <div className="text-xs text-slate-500">
                      {k === 'lad' && 'Left Anterior Descending'}
                      {k === 'lcx' && 'Left Circumflex'}
                      {k === 'rca' && 'Right Coronary Artery'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white">{vesselValue(k)}</div>
                    <div className="text-xs text-slate-500">{vesselLabel(vesselValue(k))}</div>
                  </div>
                </div>
              ))}
            </div>
          </Glass>
          <Glass>
            <Title sub="Model probability color scale.">Stenosis legend</Title>
            <div className="grid grid-cols-2 gap-3">
              {STENOSIS.map(s => (
                <div key={s.k} className="flex items-center gap-2 text-sm">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.c, boxShadow: `0 0 10px ${s.c}` }} />
                  {s.k}
                </div>
              ))}
            </div>
          </Glass>
        </div>
      </div>
    </div>
  )
}
export function DoctorRisk() {
  const { result: r } = usePatient()
  return (<>
    <Header title="Risk Analysis" sub="Detailed model output and explainability." />
    <div className="grid gap-5 sm:grid-cols-3"><Stat label="Overall risk" value={r?.overallRisk} /><Stat label="CAD probability" value={r?.cadProbability} /><Stat label="Model confidence" value={r?.confidence} /></div>
    <div className="mt-5 grid gap-5 lg:grid-cols-2">
      <Glass><Title>Risk factor contribution</Title><div className="flex h-48 items-end justify-between gap-3">{FACTORS.map(f => <div key={f} className="flex flex-1 flex-col items-center gap-2"><div className="shimmer w-full rounded-t-md border border-sky-400/15" style={{ height: '35%' }} /><span className="text-[10px] text-slate-500">{f.split(' ')[0]}</span></div>)}</div></Glass>
      <Glass className="flex items-center justify-center"><RiskRing size={200} label="Risk distribution" /></Glass>
    </div>
    <Glass className="relative mt-5 overflow-hidden"><div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-iris/15 blur-3xl" /><Title>AI explanation</Title>
      <p className="max-w-2xl text-sm leading-relaxed text-slate-300">AI-generated explanation will appear here after the prediction model is connected.</p>
      <div className="mt-5 space-y-2.5">{[90, 75, 55].map(w => <div key={w} className="shimmer h-2.5 rounded" style={{ width: `${w}%` }} />)}</div></Glass>
  </>)
}
export function DoctorReports() {
  const S = [['Patient summary', 'Demographics and clinical inputs will appear here.'], ['Risk assessment', 'Overall risk, CAD probability and confidence.'], ['Risk factors', 'Ranked contributors from the model.'], ['Coronary artery findings', 'LAD, LCX and RCA status once available.'], ['AI explanation', 'Plain-language model rationale.']]
  return (<>
    <Header title="Reports" sub="Preview the clinical report." right={<Btn>Generate Report</Btn>} />
    <Glass className="mx-auto max-w-3xl !p-8 sm:!p-10"><div className="mb-8 flex justify-between border-b border-sky-400/15 pb-5"><span className="font-display tracking-[.3em] text-white">CARDIOLENS</span><span className="text-xs text-slate-500">Report preview · --</span></div>
      <div className="space-y-7">{S.map(([t, d]) => <section key={t}><h3 className="font-display text-sm text-cyan2">{t}</h3><p className="mt-1.5 text-sm text-slate-400">{d}</p><div className="shimmer mt-3 h-2 w-4/5 rounded" /></section>)}</div></Glass>
  </>)
}
