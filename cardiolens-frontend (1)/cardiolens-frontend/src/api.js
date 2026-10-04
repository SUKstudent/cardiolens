// API contract (frozen): POST /predict
// in:  { age, bp, cholesterol, ... }
// out: { overall_cad, lad, lcx, rca, explanations: { feature: shap_value } }
const BASE = import.meta.env.VITE_API_URL

function mockPredict(p) {
  const risk = Math.min(0.95, Math.max(0.05,
    (p.age - 30) / 120 + (p.bp - 110) / 250 + (p.cholesterol - 160) / 600))
  const r = (x) => Math.round(Math.min(0.99, x) * 100) / 100
  return {
    overall_cad: r(risk), lad: r(risk * 1.1), lcx: r(risk * 0.6), rca: r(risk * 0.25),
    explanations: {
      age: (p.age - 30) / 110, bp: (p.bp - 110) / 150, cholesterol: (p.cholesterol - 160) / 400,
      st_elevation: p.st_elevation ? 0.2 : 0.02, pulse: (p.pulse - 100) / 200,
    },
  }
}

export async function predict(patient) {
  if (!BASE) return new Promise((res) => setTimeout(() => res(mockPredict(patient)), 600))
  const res = await fetch(`${BASE}/predict`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patient),
  })
  if (!res.ok) throw new Error(`Server returned ${res.status}. Check that the backend is running.`)
  return res.json()
}
