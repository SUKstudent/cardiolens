const BASE = (
  import.meta.env.VITE_API_URL || 'http://localhost:8000'
).replace(/\/+$/, '')

const DEFAULT_PROFILE = {
  Age: 55,
  Weight: 70,
  Length: 165,
  Sex: 'Male',
  BMI: 25.7,
  DM: 0,
  HTN: 0,
  'Current Smoker': 0,
  'EX-Smoker': 0,
  FH: 0,
  Obesity: 'N',
  CRF: 'N',
  CVA: 'N',
  'Airway disease': 'N',
  'Thyroid Disease': 'N',
  CHF: 'N',
  DLP: 'N',
  BP: 120,
  PR: 75,
  Edema: 0,
  'Weak Peripheral Pulse': 'N',
  'Lung rales': 'N',
  'Systolic Murmur': 'N',
  'Diastolic Murmur': 'N',
  'Typical Chest Pain': 0,
  Dyspnea: 'N',
  'Function Class': 0,
  Atypical: 'N',
  Nonanginal: 'N',
  'LowTH Ang': 'N',
  'Q Wave': 0,
  'St Elevation': 0,
  'St Depression': 0,
  Tinversion: 0,
  LVH: 'N',
  'Poor R Progression': 'N',
  BBB: 'N',
  FBS: 90,
  CR: 1.0,
  TG: 130,
  LDL: 110,
  HDL: 45,
  BUN: 20,
  ESR: 15,
  HB: 13.5,
  K: 4.2,
  Na: 138,
  WBC: 7000,
  Lymph: 30,
  Neut: 60,
  PLT: 250,
  'EF-TTE': 55,
  'Region RWMA': 0,
  VHD: 'N',
}

export function formToBackend(f = {}) {
  const p = { ...DEFAULT_PROFILE }

  if (f.age !== undefined && f.age !== '') {
    p.Age = Number(f.age)
  }

  if (f.sex === 'Male' || f.sex === 'Female') {
    p.Sex = f.sex
  }

  if (f.sys !== undefined && f.sys !== '') {
    p.BP = Number(f.sys)
  }

  if (f.hr !== undefined && f.hr !== '') {
    p.PR = Number(f.hr)
  }

  p.DM = f.diabetes ? 1 : 0
  p['Current Smoker'] = f.smoking ? 1 : 0

  const other = Array.isArray(f.other) ? f.other : []

  p.FH = other.includes('Family history') ? 1 : 0
  p.HTN = other.includes('Hypertension') ? 1 : 0
  p.Obesity = other.includes('Obesity') ? 'Y' : 'N'

  if (f.chol !== undefined && f.chol !== '') {
    p.LDL = Number(f.chol)
  }

  return p
}

export async function predictRisk(formData) {
  const payload = formToBackend(formData)
  const url = `${BASE}/predict`

  console.log('CardioLens API URL:', url)
  console.log('CardioLens API payload:', payload)

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const body = await res.text()

    console.log('CardioLens API status:', res.status)
    console.log('CardioLens API response:', body)

    if (!res.ok) {
      throw new Error(
        `Prediction failed (${res.status}): ${body}`
      )
    }

    try {
      return JSON.parse(body)
    } catch {
      throw new Error('Backend returned an invalid JSON response.')
    }
  } catch (error) {
    console.error('CardioLens prediction error:', error)
    throw error
  }
}

export async function predictRisk(formData) {
  const payload = formToBackend(formData)
  const url = `${BASE}/predict`

  console.log('CardioLens API URL:', url)
  console.log('CardioLens API payload:', payload)

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const body = await res.text()

  console.log('CardioLens API status:', res.status)
  console.log('CardioLens API response:', body)

  if (!res.ok) {
    throw new Error(`Prediction failed (${res.status}): ${body}`)
  }

  return JSON.parse(body)
}
