import { Link } from 'react-router-dom'
import { Brain, Box, Eye, Cpu } from 'lucide-react'
import { Glass, Header } from '../components/ui'
import { Backdrop, Logo } from '../components/Layout'
const F = [[Brain, 'AI risk assessment', 'Estimates cardiovascular risk from routine clinical inputs.'], [Box, '3D cardiac visualization', 'Explore the heart and coronary arteries in an interactive viewer.'], [Eye, 'Explainable results', 'See which factors drive each result, in plain language.'], [Cpu, 'Technology', 'React, Three.js, FastAPI and a machine-learning prediction model.']]
export default function About() {
  return (
    <div className="relative min-h-full"><Backdrop />
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8"><div className="mb-14 flex items-center justify-between"><Logo /><Link to="/mode" className="text-sm text-slate-400 hover:text-cyan2">← Choose mode</Link></div>
        <div className="page-in"><Header title="What is CardioLens?" sub="An AI platform that turns cardiovascular data into clear risk insight and an explorable 3D heart." />
          <div className="grid gap-5 sm:grid-cols-2">{F.map(([I, t, d]) => <Glass hover key={t}><I className="text-cyan2" size={22} strokeWidth={1.4} /><h3 className="mt-4 font-display text-white">{t}</h3><p className="mt-1.5 text-sm text-slate-400">{d}</p></Glass>)}</div></div></div></div>)
}
