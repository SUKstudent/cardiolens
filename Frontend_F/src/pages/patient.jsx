import { Link, useNavigate } from 'react-router-dom'
import { Glass, Title, Btn, RiskRing, Meter, Header } from '../components/ui'
import HeartViewer from '../components/HeartViewer'
import { usePatient } from '../context/PatientContext'
import { PATIENT_FACTORS } from '../data/placeholder'

export const Disclaimer = () => (
  <p className="mt-10 text-center text-xs text-slate-500">
    CardioLens provides AI-assisted information and does not replace
    professional medical advice.
  </p>
)

export function PatientHome() {
  const { result } = usePatient()
  const navigate = useNavigate()
  const patientName = localStorage.getItem('patientName')

  if (!patientName) {
    return (
      <>
        <Header title="Patient Portal" sub="Please log in to view your profile." />
        <Glass className="text-center py-10">
          <p className="text-sm text-slate-400 mb-4">No patient session active.</p>
          <Btn onClick={() => navigate('/patient/login')}>Go to Login →</Btn>
        </Glass>
      </>
    )
  }

  const risk = result?.overallRisk
  const vesselVals = result
    ? { lad: result.lad, lcx: result.lcx, rca: result.rca }
    : null

  return (
    <>
      <Header title={`Hello, ${patientName}`} sub="Your cardiovascular overview." />

      <Glass className="flex flex-col items-center gap-8 sm:flex-row sm:gap-12">
        <RiskRing value={risk ?? null} label="Your current risk" />
        <div>
          <div className="text-xs text-slate-400">Your current risk</div>
          <div className="font-display text-4xl font-light text-white">
            {risk != null ? `${risk}%` : '--'}
          </div>
          <p className="mt-3 max-w-sm text-sm text-slate-400">
            {risk != null
              ? `Severity: ${result.severity}. Reviewed by your care team.`
              : 'Please ask your doctor to run an analysis.'}
          </p>
        </div>
      </Glass>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <Glass hover>
          <Title>What does this mean?</Title>
          <p className="text-sm text-slate-400">
            {risk != null
              ? `Your model-predicted CAD risk is ${risk}% (${result.severity.toLowerCase()}). This is not a diagnosis — please consult your doctor.`
              : 'Results will appear once your doctor runs an analysis.'}
          </p>
        </Glass>

        <Glass hover>
          <Title>Main risk factors</Title>
          <div className="space-y-4">
            {result?.factors?.length
              ? result.factors.slice(0, 3).map(f => <Meter key={f.name} label={f.name} value={f.weight} />)
              : ['Blood Pressure', 'Cholesterol', 'Smoking'].map(f => <Meter key={f} label={f} />)}
          </div>
        </Glass>

        <Glass hover>
          <Title>Your heart</Title>
          <p className="mb-4 text-sm text-slate-400">See your heart in 3D.</p>
          <Link to="/patient/3d-visualization"><Btn>3D Visualization →</Btn></Link>
        </Glass>
      </div>

      <Disclaimer />
    </>
  )
}

export const PatientRisk = () => {
  const { result } = usePatient()
  const risk = result?.overallRisk
  return (
    <>
      <Header title="My Risk" sub="A simple view of where you stand." />
      <Glass className="flex justify-center py-10">
        <RiskRing value={risk ?? null} size={260} label="Your current risk" />
      </Glass>
      {result && (
        <Glass className="mt-5">
          <Title>Summary</Title>
          <p className="text-sm text-slate-300">
            Your overall CAD risk is <strong>{risk}%</strong> ({result.severity}).
            Vessel-wise predicted probabilities: LAD {(result.lad * 100).toFixed(1)}%,
            LCX {(result.lcx * 100).toFixed(1)}%,
            RCA {(result.rca * 100).toFixed(1)}%.
          </p>
        </Glass>
      )}
      <Disclaimer />
    </>
  )
}

export function PatientFactors() {
  const { result } = usePatient()
  const factors = result?.factors || []
  return (
    <>
      <Header title="Risk Factors" sub="What influenced your result." />
      {factors.length > 0 ? (
        <Glass>
          <div className="space-y-5">
            {factors.map(f => <Meter key={f.name} label={f.name} value={f.weight} />)}
          </div>
        </Glass>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PATIENT_FACTORS.map((f) => (
            <Glass hover key={f.k}>
              <h3 className="font-display text-white">{f.k}</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">{f.t}</p>
            </Glass>
          ))}
        </div>
      )}
      <Disclaimer />
    </>
  )
}

export const PatientViz = () => {
  const { result } = usePatient()
  const markers = result ? [
    { id: 'lad', name: 'LAD', label: `LAD ${(result.lad * 100).toFixed(1)}%`, pos: [0.30, 0.55, 0.40], probability: result.lad },
    { id: 'lcx', name: 'LCX', label: `LCX ${(result.lcx * 100).toFixed(1)}%`, pos: [-0.35, 0.10, 0.55], probability: result.lcx },
    { id: 'rca', name: 'RCA', label: `RCA ${(result.rca * 100).toFixed(1)}%`, pos: [0.55, -0.25, 0.30], probability: result.rca },
  ] : []

  return (
    <>
      <Header title="Your Heart" sub="Drag, zoom and explore."
        right={<Link to="/patient"><Btn variant="ghost">← Back</Btn></Link>} />
      <HeartViewer coronary={false} initialZoom={1.5} className="min-h-[65vh]" markers={markers} />
      <Disclaimer />
    </>
  )
}