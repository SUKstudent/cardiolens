import { useMemo, useState } from 'react'
import { Glass, Title, Btn, Header } from '../components/ui'
import { GuardBadge, ResultTable } from '../components/Compare'
import { usePatient } from '../context/PatientContext'
import { SAMPLE_PROFILES } from '../data/profiles'
import { checkInputs, isBlank, errorsOf, toPayload } from '../lib/guard'
import { predictRisk } from '../services/api'

const yn = v => (v ? 'Yes' : 'No')
const ROWS = [
  ['Age', v => (v.age ? `${v.age} years` : '--')],
  ['Sex', v => v.sex || '--'],
  ['Blood pressure', v => (v.sys && v.dia ? `${v.sys}/${v.dia} mmHg` : '--')],
  ['Cholesterol', v => (v.chol ? `${v.chol} mg/dL` : '--')],
  ['Heart rate', v => (v.hr ? `${v.hr} bpm` : '--')],
  ['Diabetes', v => yn(v.diabetes)],
  ['Smoking', v => yn(v.smoking)],
  ['Other factors', v => (v.other.length ? v.other.join(', ') : 'None')],
]

const Pick = ({ label, value, onChange, options }) => (
  <label className="block"><span className="mb-1.5 block text-xs text-slate-400">{label}</span>
    <select className="field" value={value} onChange={onChange}>{options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select></label>)

export default function Twins() {
  const { form } = usePatient()
  const options = useMemo(() => [
    ...(isBlank(form) ? [] : [{ id: 'current', name: 'Current patient', values: form }]),
    ...SAMPLE_PROFILES.map(p => ({ id: p.id, name: `${p.name} · ${p.desc}`, values: p.values })),
  ], [form])
  const [aId, setA] = useState('demo-a'), [bId, setB] = useState('demo-c')
  const A = options.find(o => o.id === aId) || options[0], B = options.find(o => o.id === bId) || options[1]
  const [out, setOut] = useState({ status: 'idle', a: null, b: null })
  const pick = (setter) => e => { setter(e.target.value); setOut({ status: 'idle', a: null, b: null }) }
  const iA = checkInputs(A.values), iB = checkInputs(B.values)
  const blocked = errorsOf(iA).length + errorsOf(iB).length > 0

  const run = async () => {
    setOut({ status: 'loading', a: null, b: null })
    try { const [a, b] = await Promise.all([predictRisk(toPayload(A.values)), predictRisk(toPayload(B.values))]); setOut({ status: 'done', a, b }) }
    catch { setOut({ status: 'offline', a: null, b: null }) }
  }

  return (<>
    <Header title="Cardiac Twin Comparator" sub="Compare two patient profiles and their predicted results side by side." />
    <Glass>
      <div className="grid gap-4 sm:grid-cols-2">
        <Pick label="Patient 1" value={A.id} onChange={pick(setA)} options={options} />
        <Pick label="Patient 2" value={B.id} onChange={pick(setB)} options={options} />
      </div>
      <div className="mt-6 overflow-x-auto"><div className="min-w-[520px] text-sm">
        <div className="grid grid-cols-[1fr_1.3fr_1.3fr] gap-3 border-b border-sky-400/15 pb-3 text-xs text-slate-400">
          <span>Clinical parameter</span><span className="space-y-1.5"><span className="block text-white">Patient 1</span><GuardBadge issues={iA} /></span><span className="space-y-1.5"><span className="block text-white">Patient 2</span><GuardBadge issues={iB} /></span>
        </div>
        {ROWS.map(([label, get]) => { const x = get(A.values), y = get(B.values), diff = x !== y
          return (
            <div key={label} className="grid grid-cols-[1fr_1.3fr_1.3fr] items-center gap-3 border-b border-sky-400/10 py-3 last:border-0">
              <span className="text-slate-400">{label}</span>
              <span className={diff ? 'text-cyan2' : 'text-slate-300'}>{x}</span>
              <span className={diff ? 'text-cyan2' : 'text-slate-300'}>{y}</span>
            </div>) })}
      </div></div>
      <p className="mt-3 text-xs text-slate-500">Highlighted rows differ between the two patients.</p>
    </Glass>
    <Glass className="mt-5">
      <Title sub="Both predictions come from the ML model.">Predicted results</Title>
      <ResultTable labelA="Patient 1" labelB="Patient 2" a={out.a} b={out.b} />
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Btn onClick={run} disabled={blocked || A.id === B.id || out.status === 'loading'}>{out.status === 'loading' ? 'Comparing…' : 'Compare predictions'}</Btn>
        {A.id === B.id && <span className="text-xs text-slate-500">Choose two different patients.</span>}
        {blocked && <span className="text-xs text-rose-300">One profile has invalid or missing inputs. Fix it in Patient Data.</span>}
        {out.status === 'offline' && <span role="status" className="text-xs text-iris">Prediction model is not connected yet. Both profiles are ready to send to the API.</span>}
      </div>
      <p className="mt-4 text-xs text-slate-500">Change on the right is Patient 2 minus Patient 1.</p>
    </Glass>
  </>)
}
