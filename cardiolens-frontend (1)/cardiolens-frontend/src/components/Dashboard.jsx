import RiskGauge, { levelOf } from './RiskGauge'
import HeartPanel from './HeartPanel'

const pct = (p) => `${Math.round(p * 100)}%`
const Card = ({ title, sub, id, className = '', children }) => (
  <section id={id} className={`rounded-2xl border border-line bg-surface p-5 ${className}`}>
    {title && <h3 className="text-lg font-bold">{title}</h3>}
    {sub && <p className="text-sm text-mute">{sub}</p>}
    <div className={title ? 'mt-4' : ''}>{children}</div>
  </section>
)
const LABEL = { age: 'Age', bp: 'Blood pressure', cholesterol: 'Cholesterol', st_elevation: 'ST elevation', pulse: 'Pulse' }
const shown = (k, v) => (k === 'st_elevation' ? (v ? 'Present' : 'Absent') : v)
const shapLevel = (v) => { const a = Math.abs(v); return a >= 0.18 ? ['High', '#E5484D'] : a >= 0.1 ? ['Moderate', '#E9A23B'] : ['Low', '#1F9E8F'] }
const TIPS = [['Maintain healthy blood pressure', 'Keep it under 120/80 mmHg'], ['Manage cholesterol levels', 'Choose healthy fats & fibre'],
  ['Stay active', 'At least 30 mins/day'], ['Eat a heart-friendly diet', 'More fruits, vegetables & whole grains'], ['Manage stress', 'Try meditation or deep breathing']]

export default function Dashboard({ result, patient, mode, history }) {
  const lvl = levelOf(result.overall_cad)
  const vessels = [['LAD', result.lad], ['LCX', result.lcx], ['RCA', result.rca]]
  const doctor = mode === 'doctor'

  const overall = (
    <Card title="Overall CAD Probability">
      <div className="flex items-center gap-4">
        <RiskGauge value={result.overall_cad} />
        <div>
          <p className="font-display font-bold" style={{ color: lvl.color }}>{doctor ? 'Elevated model risk' : 'You have a higher risk of CAD'}</p>
          <p className="mt-1 text-sm text-mute">{doctor ? 'Based on the entered clinical and physiological features.' : 'based on the current analysis.'}</p>
        </div>
      </div>
    </Card>
  )
  const vesselCard = (
    <Card title="Vessel Risk">
      <div className="space-y-4">
        {vessels.map(([n, p]) => (
          <div key={n} className="flex items-center gap-3 text-sm font-semibold">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: levelOf(p).color }} />
            <span className="w-9">{n}</span>
            <div className="h-2 flex-1 rounded-full bg-line"><div className="h-2 rounded-full" style={{ width: pct(p), background: levelOf(p).color }} /></div>
            <span className="w-10 text-right">{pct(p)}</span>
          </div>
        ))}
      </div>
    </Card>
  )
  const heartCard = (
    <Card id="heart" title={doctor ? '3D Heart Explorer' : 'Explore Your 3D Heart'} sub="Click on a vessel to view details">
      <HeartPanel result={result} />
    </Card>
  )
  const metric = [['Age', `${patient.age} yrs`], ['Blood Pressure', `${patient.bp} mmHg`], ['Cholesterol', `${patient.cholesterol} mg/dL`], ['ST Elevation', shown('st_elevation', patient.st_elevation)]]
  const metrics = doctor
    ? <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{metric.map(([l, v]) => (
        <Card key={l}><p className="text-xs text-mute">{l}</p><p className="font-display text-xl font-bold">{v}</p></Card>))}</div>
    : <Card title="Key Health Metrics"><div className="grid grid-cols-2 gap-4">{metric.map(([l, v]) => (
        <div key={l}><p className="text-xs text-mute">{l}</p><p className="font-display font-bold">{v}</p></div>))}</div></Card>

  const shap = Object.entries(result.explanations).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
  const why = (
    <Card id="why" title="Why This Prediction?" sub={doctor ? 'Feature contribution (SHAP)' : 'Key factors that contributed to your result'}>
      <div className="space-y-3">
        {shap.map(([k, v]) => { const [l, c] = shapLevel(v); return (
          <div key={k} className="grid grid-cols-[130px_1fr_70px] items-center gap-3 text-sm">
            <span>{LABEL[k] || k} <span className="text-mute">({shown(k, patient[k])})</span></span>
            <div className="h-2 rounded-full bg-line"><div className="h-2 rounded-full" style={{ width: `${Math.min(100, (Math.abs(v) / 0.3) * 100)}%`, background: c }} /></div>
            <span className="text-right font-semibold" style={{ color: c }}>{l}</span>
          </div>) })}
      </div>
      {!doctor && <p className="mt-4 rounded-lg bg-accent/10 p-3 text-xs text-mute">These contributions are based on AI analysis and help explain why your risk is higher. They do not replace a doctor's opinion or diagnosis.</p>}
    </Card>
  )
  const summary = (
    <Card title="Clinical Summary">
      <p className="text-sm text-mute">The model output summarizes patterns learned from the supplied clinical features. It is a prototype decision-support visualization, not a diagnosis.</p>
      <a href="#why" className="mt-4 inline-block rounded-lg border border-accent px-4 py-2 text-sm font-semibold text-accent">View AI Explanation →</a>
    </Card>
  )
  const table = (
    <Card title="Recent Analysis History">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="text-mute"><tr><th className="py-2">{doctor ? 'Patient ID' : 'Report ID'}</th>{doctor && <th>Name</th>}<th>Date</th><th>Overall risk</th><th>Status</th></tr></thead>
          <tbody>{history.map((h) => (
            <tr key={h.id} className="border-t border-line">
              <td className="py-2">{h.id}</td>{doctor && <td>{h.name}</td>}<td>{h.date}</td>
              <td className="font-semibold" style={{ color: levelOf(h.risk).color }}>{pct(h.risk)} {levelOf(h.risk).label}</td>
              <td><span className="rounded-full bg-teal/15 px-2 py-0.5 text-xs font-semibold text-teal">Completed</span></td>
            </tr>))}</tbody>
        </table>
      </div>
    </Card>
  )

  if (doctor) return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1.3fr]">{overall}{vesselCard}{heartCard}</div>
      {metrics}
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">{why}{summary}</div>
      {table}
    </div>
  )
  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        <div className="rounded-2xl border border-line bg-gradient-to-r from-[#E7EEFF] to-[#F4F7FD] p-6 text-[#13213A]">
          <h2 className="text-3xl font-extrabold">Hello {patient.name.split(' ')[0]},</h2>
          <p className="text-lg">Here's your heart health summary</p>
          <p className="mt-2 max-w-md text-sm text-[#52627D]">Our AI has analyzed your health data and found some important insights. Explore the details below.</p>
          <span className="mt-3 inline-block rounded-full bg-teal/15 px-3 py-1 text-xs font-semibold text-teal">Analysis completed · {history[0].date}</span>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">{overall}{vesselCard}{metrics}</div>
        <div className="grid gap-4 lg:grid-cols-2">{heartCard}{why}</div>
        {table}
      </div>
      <aside className="space-y-4">
        <Card title="Simple Steps for a Healthy Heart" sub="Small changes can make a big difference.">
          <ul className="space-y-3">{TIPS.map(([t, s]) => (
            <li key={t} className="rounded-xl border border-line p-3"><p className="text-sm font-semibold">{t}</p><p className="text-xs text-mute">{s}</p></li>))}</ul>
        </Card>
        <Card title="Your Health, Our Priority"><p className="text-sm text-mute">This is an AI-powered analysis and does not replace professional medical advice. Always consult your doctor for diagnosis and treatment.</p></Card>
      </aside>
    </div>
  )
}
