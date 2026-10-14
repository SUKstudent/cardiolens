import { useNavigate } from 'react-router-dom'
import { Header, Glass, Title, Btn } from '../components/ui'
import { usePatient } from '../context/PatientContext'
import { SAMPLE_PROFILES } from '../data/profiles'

export default function PatientLogin() {
  const navigate = useNavigate()
  const { loadProfile } = usePatient()

  const login = (profile) => {
    localStorage.setItem('patientId', profile.id)
    localStorage.setItem('patientName', profile.name)
    loadProfile(profile, true)
    navigate('/patient')
  }

  return (
    <>
      <Header title="Patient Portal" sub="Log in as a demo patient to view your risk profile." />
      <Glass>
        <Title sub="Demo accounts for illustration. Not real patients.">Select Patient Account</Title>
        <div className="grid gap-3 sm:grid-cols-2">
          {SAMPLE_PROFILES.map(p => (
            <button
              key={p.id}
              onClick={() => login(p)}
              className="rounded-lg border border-sky-400/20 bg-void/40 p-4 text-left transition hover:border-cyan2 hover:bg-cyan2/5"
            >
              <div className="font-display text-white">{p.name}</div>
              <div className="mt-1 text-xs text-slate-400">{p.desc}</div>
              <div className="mt-2 text-[11px] text-slate-500">
                Age {p.values.age} · {p.values.sex}
              </div>
            </button>
          ))}
        </div>
      </Glass>
    </>
  )
}