const BASE = (
  import.meta.env.VITE_API_URL || 'http://localhost:8000'
).replace(/\/+$/, '')

const DEFAULT_PROFILE = {
  Age: 55, Weight: 70, Length: 165, Sex: 'Male', BMI: 25.7,
  DM: 0, HTN: 0, 'Current Smoker': 0, 'EX-Smoker': 0, FH: 0,
  Obesity: 'N', CRF: 'N', CVA: 'N', 'Airway disease': 'N',
  'Thyroid Disease': 'N', CHF: 'N', DLP: 'N', BP: 120, PR: 75,
  Edema: 0, 'Weak Peripheral Pulse': 'N', 'Lung rales': 'N',
  'Systolic Murmur': 'N', 'Diastolic Murmur': 'N',
  'Typical Chest Pain': 0, Dyspnea: 'N', 'Function Class': 0,
  Atypical: 'N', Nonanginal: 'N', 'LowTH Ang': 'N',
  'Q Wave': 0, 'St Elevation': 0, 'St Depression': 0, Tinversion: 0,
  LVH: 'N', 'Poor R Progression': 'N', BBB: 'N',
  FBS: 90, CR: 1.0, TG: 130, LDL: 110, HDL: 45,
  BUN: 20, ESR: 15, HB: 13.5, K: 4.2, Na: 138,
  WBC: 7000, Lymph: 30, Neut: 60, PLT: 250,
  'EF-TTE': 55, 'Region RWMA': 0, VHD: 'N',
}

export function formToBackend(f) {
  const p = { ...DEFAULT_PROFILE }
  if (f.age) p.Age = Number(f.age)
  if (f.sex === 'Male' || f.sex === 'Female') p.Sex = f.sex
  if (f.sys) p.BP = Number(f.sys)
  if (f.hr) p.PR = Number(f.hr)
  p.DM = f.diabetes ? 1 : 0
  p['Current Smoker'] = f.smoking ? 1 : 0
  const other = f.other || []
  p.FH = other.includes('Family history') ? 1 : 0
  p.HTN = other.includes('Hypertension') ? 1 : 0
  p.Obesity = other.includes('Obesity') ? 'Y' : 'N'
  if (f.chol) p.LDL = Number(f.chol)
  return p
}

export async function predictRisk(formData) {
  const payload = formToBackend(formData)
  const res = await fetch(`${BASE}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Prediction failed (${res.status})`)
  return res.json()
}

export async function checkHealth() {
  const res = await fetch(`${BASE}/health`)
  if (!res.ok) throw new Error('Backend unreachable')
  return res.json()
}
