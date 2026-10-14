import { Link } from 'react-router-dom'
import { Stethoscope, User, Check } from 'lucide-react'
import { Backdrop } from '../components/Layout'
const MODES = [
  { to: '/doctor', icon: Stethoscope, name: 'Doctor Mode', tag: 'Advanced clinical insights', cta: 'Enter Doctor Mode', items: ['Detailed patient assessment', 'Coronary artery analysis', 'Advanced risk visualization', '3D cardiac anatomy'] },
  { to: '/patient/login', icon: User, name: 'Patient Mode', tag: 'Understand your cardiovascular risk', cta: 'Enter Patient Mode', items: ['Simple risk summary', 'Understandable explanations', 'Risk factors', 'Interactive heart visualization'] },
]
export default function ChooseMode() {
  return (
    <div className="relative flex min-h-full flex-col items-center justify-center overflow-hidden px-5 py-16">
      <Backdrop />
      <Link to="/" className="absolute left-5 top-5 text-sm text-slate-400 hover:text-cyan2">← Back</Link>
      <div className="absolute left-[12%] top-[18%] h-2 w-2 rounded-full bg-cyan2 shadow-[0_0_14px_#22e5ff]" style={{ animation: 'drift 9s ease-in-out infinite' }} />
      <div className="absolute right-[16%] top-[30%] h-1.5 w-1.5 rounded-full bg-iris shadow-[0_0_12px_#8b7bff]" style={{ animation: 'drift 12s ease-in-out infinite reverse' }} />
      <div className="page-in text-center">
        <h1 className="font-display text-3xl font-light tracking-tight text-white sm:text-5xl">Choose Your Mode</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-slate-400">Select how you would like to use CardioLens.</p>
      </div>
      <div className="page-in mt-14 grid w-full max-w-4xl gap-5 md:grid-cols-2" style={{ animationDelay: '.15s' }}>
        {MODES.map(m => (
          <Link key={m.to} to={m.to} className="glass glass-hover group flex flex-col rounded-2xl p-7 transition hover:-translate-y-1">
            <m.icon className="text-cyan2" size={26} strokeWidth={1.4} />
            <h2 className="mt-5 font-display text-xl text-white">{m.name}</h2><p className="mt-1 text-sm text-slate-400">{m.tag}</p>
            <ul className="my-6 flex-1 space-y-2.5 text-sm text-slate-300">{m.items.map(i => <li key={i} className="flex gap-2.5"><Check size={15} className="mt-0.5 text-cyan2" />{i}</li>)}</ul>
            <span className="text-sm font-semibold text-cyan2 transition group-hover:translate-x-1">{m.cta} →</span>
          </Link>))}
      </div>
    </div>
  )
}
