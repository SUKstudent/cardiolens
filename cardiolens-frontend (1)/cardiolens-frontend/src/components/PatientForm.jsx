export const NUM = [
  { key: 'age', label: 'Age', unit: 'years', min: 18, max: 100 },
  { key: 'bp', label: 'Resting blood pressure', unit: 'mmHg', min: 80, max: 220, hint: 'Normal is around 120' },
  { key: 'cholesterol', label: 'Cholesterol', unit: 'mg/dL', min: 100, max: 600, hint: 'Below 200 is desirable' },
  { key: 'pulse', label: 'Pulse', unit: 'bpm', min: 40, max: 200 },
]
export const SAMPLES = {
  'Lower-risk sample': { name: 'Sample Patient', age: 35, bp: 118, cholesterol: 175, pulse: 70, sex: 0, smoker: 0, diabetes: 0, st_elevation: 0 },
  'Higher-risk sample': { name: 'Rahul Mehta', age: 62, bp: 160, cholesterol: 260, pulse: 88, sex: 1, smoker: 1, diabetes: 1, st_elevation: 1 },
}
const input = 'mt-1 w-full rounded-lg border border-line bg-canvas px-3 py-2'

export default function PatientForm({ value, onChange, onSubmit, loading }) {
  const set = (k, v) => onChange({ ...value, [k]: v })
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit() }} className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Object.entries(SAMPLES).map(([n, s]) => (
          <button type="button" key={n} onClick={() => onChange(s)} className="rounded-full border border-line px-3 py-1 text-xs font-semibold">{n}</button>
        ))}
      </div>
      <label className="block text-sm font-semibold">Patient name
        <input required value={value.name} onChange={(e) => set('name', e.target.value)} className={input} />
      </label>
      {NUM.map((f) => (
        <label key={f.key} className="block text-sm font-semibold">
          <span className="flex justify-between">{f.label}<span className="font-normal text-mute">{f.unit}</span></span>
          <input type="number" required min={f.min} max={f.max} value={value[f.key]} onChange={(e) => set(f.key, Number(e.target.value))} className={input} />
          <span className="text-xs font-normal text-mute">{f.hint || `Between ${f.min} and ${f.max}`}</span>
        </label>
      ))}
      <select aria-label="Sex" value={value.sex} onChange={(e) => set('sex', Number(e.target.value))} className={input}>
        <option value={1}>Male</option><option value={0}>Female</option>
      </select>
      {[['st_elevation', 'ST elevation present'], ['smoker', 'Currently smokes'], ['diabetes', 'Has diabetes']].map(([k, l]) => (
        <label key={k} className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={!!value[k]} onChange={(e) => set(k, e.target.checked ? 1 : 0)} className="h-4 w-4 accent-heart" /> {l}
        </label>
      ))}
      <button disabled={loading} className="w-full rounded-lg bg-accent py-3 font-display font-semibold text-white disabled:opacity-60">
        {loading ? 'Analysing…' : 'Analyse heart health'}
      </button>
    </form>
  )
}
