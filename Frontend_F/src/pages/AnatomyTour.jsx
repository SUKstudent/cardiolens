import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Glass, Title, Btn, Header } from '../components/ui'
import HeartViewer from '../components/HeartViewer'
import { Disclaimer } from './patient'
import { TOUR } from '../data/anatomy'
import { STENOSIS } from '../data/placeholder'
import { usePatient } from '../context/PatientContext'

const INSIDE_URL = '/models/human-heart-anatomy.glb'

const GROUPS = [
  { key: 'ext', title: 'Outside · coronary arteries' },
  { key: 'int', title: 'Inside the heart' },
]

export default function AnatomyTour() {
  const [i, setI] = useState(0)
  const { result } = usePatient()
  const step = TOUR[i]
  const inside = step.model === 'int'


  const markers = TOUR
    .filter(s => s.pos && s.model === step.model)
    .map(s => ({ id: s.id, name: s.title, label: s.label ?? s.id, pos: s.pos, active: s.id === step.id }))

  const go = n => setI(Math.min(TOUR.length - 1, Math.max(0, n)))
  const status = result?.arteries?.find(a => a.id === (step.artery ?? step.id))?.status
  const colour = STENOSIS.find(s => s.k.toLowerCase() === String(status).toLowerCase())?.c

  return (<>
    <Header title="Guided 3D Anatomy Tour" sub="First the coronary arteries on the outside, then the chambers and valves inside." />
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <HeartViewer
        url={inside ? INSIDE_URL : undefined}
        className="!min-h-0 h-[300px] sm:h-[420px] lg:h-[540px]"
        focus={step.cam}
        markers={markers}
        onMarker={id => go(TOUR.findIndex(s => s.id === id))}
        initialSpin={false}
        title={inside ? 'INSIDE THE HEART' : '3D HEART TOUR'}
      />
      <div className="space-y-5">
        <Glass>
          <div className="text-xs text-slate-500">Step {i + 1} of {TOUR.length} · {inside ? 'Inside' : 'Outside'}</div>
          <h2 className="mt-1 font-display text-lg text-white">{step.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{step.text}</p>
          {status && <div className="mt-4 flex items-center gap-2 text-sm"><span className="h-2.5 w-2.5 rounded-full" style={{ background: colour, boxShadow: `0 0 10px ${colour}` }} />Predicted status: {status}</div>}
          <div className="mt-6 flex gap-3">
            <Btn variant="ghost" onClick={() => go(i - 1)} disabled={i === 0}><ChevronLeft size={16} />Back</Btn>
            <Btn onClick={() => go(i + 1)} disabled={i === TOUR.length - 1}>Next<ChevronRight size={16} /></Btn>
          </div>
        </Glass>
      </div>
    </div>

    <Glass className="mt-5">
      <Title>Steps</Title>
      <div className="space-y-4">
        {GROUPS.map(g => (
          <div key={g.key}>
            <div className="mb-2 text-[11px] uppercase tracking-widest text-slate-500">{g.title}</div>
            <ol className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
              {TOUR.map((s, n) => s.model === g.key && (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => go(n)}
                    aria-current={n === i ? 'step' : undefined}
                    className={`h-full w-full rounded-lg px-3 py-2 text-left text-sm transition ${n === i ? 'bg-cyan2/10 text-cyan2' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    {s.title}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-500">Label positions are approximate. Drag the heart to look around.</p>
    </Glass>

    <Disclaimer />
  </>)
}