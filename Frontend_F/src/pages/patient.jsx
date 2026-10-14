
import { Link } from 'react-router-dom'
import {
  Glass,
  Title,
  Btn,
  RiskRing,
  Meter,
  Header,
} from '../components/ui'
import HeartViewer from '../components/HeartViewer'
import { PATIENT_FACTORS } from '../data/placeholder'

export const Disclaimer = () => (
  <p className="mt-10 text-center text-xs text-slate-500">
    CardioLens provides AI-assisted information and does not replace
    professional medical advice.
  </p>
)

export function PatientHome() {
  return (
    <>
      <Header title="Your Cardiovascular Overview" />

      <Glass className="flex flex-col items-center gap-8 sm:flex-row sm:gap-12">
        <RiskRing label="Your current risk" />

        <div>
          <div className="text-xs text-slate-400">
            Your current risk
          </div>

          <div className="font-display text-4xl font-light text-white">
            --
          </div>

          <p className="mt-3 max-w-sm text-sm text-slate-400">
            Your result will show here once your information has been analyzed.
          </p>
        </div>
      </Glass>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <Glass hover>
          <Title>What does this mean?</Title>
          <p className="text-sm text-slate-400">
            A plain-language summary of your result will appear here.
          </p>
        </Glass>

        <Glass hover>
          <Title>Main risk factors</Title>
          <div className="space-y-4">
            {['Blood Pressure', 'Cholesterol', 'Smoking'].map((f) => (
              <Meter key={f} label={f} />
            ))}
          </div>
        </Glass>

        <Glass hover>
          <Title>Your heart</Title>
          <p className="mb-4 text-sm text-slate-400">
            See your heart in an interactive 3D view.
          </p>

          <Link to="/patient/3d-visualization">
            <Btn>3D Visualization →</Btn>
          </Link>
        </Glass>
      </div>

      <Disclaimer />
    </>
  )
}

export const PatientRisk = () => (
  <>
    <Header
      title="My Risk"
      sub="A simple view of where you stand."
    />

    <Glass className="flex justify-center py-10">
      <RiskRing size={260} label="Your current risk" />
    </Glass>

    <Disclaimer />
  </>
)

export function PatientFactors() {
  return (
    <>
      <Header
        title="Risk Factors"
        sub="What each measure means for your heart."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PATIENT_FACTORS.map((f) => (
          <Glass hover key={f.k}>
            <h3 className="font-display text-white">
              {f.k}
            </h3>

            <div className="mt-3 space-y-1 text-sm text-slate-400">
              <div>
                Current value:{' '}
                <span className="text-slate-200">--</span>
              </div>

              <div>
                Status:{' '}
                <span className="text-slate-200">--</span>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              {f.t}
            </p>
          </Glass>
        ))}
      </div>

      <Disclaimer />
    </>
  )
}

export const PatientViz = () => (
  <>
    <Header
      title="Your Heart"
      sub="Drag, zoom and explore."
      right={
        <Link to="/patient">
          <Btn variant="ghost">← Back</Btn>
        </Link>
      }
    />

    <HeartViewer
      coronary={false}
      initialZoom={1.5}
      className="min-h-[65vh]"
    />

    <Disclaimer />
  </>
)
