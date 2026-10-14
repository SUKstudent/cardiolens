import { useState } from 'react'
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ClipboardList, Activity, Box, FileText, Info, Home, HeartPulse, ListChecks, Bell, User, PanelLeft, SlidersHorizontal, GitCompare, Compass } from 'lucide-react'
import { usePatient } from '../context/PatientContext'
export const DOCTOR_NAV = [
  { to: '/doctor', label: 'Dashboard', icon: LayoutDashboard, end: true }, { to: '/doctor/patient-data', label: 'Patient Data', icon: ClipboardList },
  { to: '/doctor/risk-analysis', label: 'Risk Analysis', icon: Activity }, { to: '/doctor/what-if', label: 'What-If Simulator', icon: SlidersHorizontal },
  { to: '/doctor/compare', label: 'Compare Patients', icon: GitCompare }, { to: '/doctor/3d-visualization', label: '3D Visualization', icon: Box },
  { to: '/doctor/anatomy-tour', label: 'Anatomy Tour', icon: Compass },
  { to: '/doctor/reports', label: 'Reports', icon: FileText }, { to: '/about', label: 'About', icon: Info }]
export const PATIENT_NAV = [
  { to: '/patient', label: 'Home', icon: Home, end: true }, { to: '/patient/my-risk', label: 'My Risk', icon: HeartPulse },
  { to: '/patient/risk-factors', label: 'Risk Factors', icon: ListChecks }, { to: '/patient/3d-visualization', label: '3D Heart', icon: Box },
  { to: '/patient/anatomy-tour', label: 'Anatomy Tour', icon: Compass },
  { to: '/about', label: 'About', icon: Info }]
export const Logo = () => (
  <Link to="/" className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-content-center rounded-lg border border-cyan2/50"><span className="h-2 w-2 rounded-full bg-cyan2 shadow-[0_0_12px_#22e5ff]" /></span><span className="font-display text-sm tracking-[.3em] text-white">CARDIOLENS</span></Link>
)
export const Backdrop = () => (
  <div className="pointer-events-none fixed inset-0 -z-10"><div className="grid-bg absolute inset-0" /><div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-volt/10 blur-[120px]" /><div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-iris/10 blur-[120px]" /></div>
)
export default function Layout({ mode }) {
  const nav = mode === 'doctor' ? DOCTOR_NAV : PATIENT_NAV
  const [open, setOpen] = useState(true); const { pathname } = useLocation(); const { profile } = usePatient()
  const link = ({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${isActive ? 'bg-cyan2/10 text-cyan2 shadow-[inset_2px_0_0_#22e5ff]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`
  return (
    <div className="relative flex min-h-full">
      <Backdrop />
      <aside className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sky-400/10 bg-void/60 p-4 backdrop-blur-xl transition-all duration-300 md:flex ${open ? 'w-60' : 'w-[72px]'}`}>
        <div className="mb-8 flex items-center justify-between">{open && <Logo />}<button aria-label="Toggle sidebar" onClick={() => setOpen(!open)} className="rounded-md p-1.5 text-slate-400 hover:text-white"><PanelLeft size={18} /></button></div>
        <nav className="flex flex-1 flex-col gap-1">{nav.map(n => <NavLink key={n.to} to={n.to} end={n.end} className={link} title={n.label}><n.icon size={18} />{open && n.label}</NavLink>)}</nav>
        <div className="border-t border-sky-400/10 pt-4 text-xs"><Link to="/mode" className="text-slate-300 hover:text-cyan2">{open ? (mode === 'doctor' ? 'Doctor Mode' : 'Patient Mode') : 'Mode'}</Link>
          {open && <div className="mt-1 flex items-center gap-2 text-slate-500"><span className="h-1.5 w-1.5 animate-[pulseDot_2s_infinite] rounded-full bg-emerald-400" />System Online</div>}</div>
      </aside>
      <div className="min-w-0 flex-1 pb-20 md:pb-0">
        <div className="flex items-center justify-between border-b border-sky-400/10 px-5 py-3 md:justify-end"><div className="md:hidden"><Logo /></div>
          <div className="flex items-center gap-3 text-xs text-slate-400">{mode === 'doctor' && <span className="rounded-md border border-sky-400/15 px-2.5 py-1.5">Patient · <span className="text-slate-200">{profile?.name ?? '--'}</span></span>}
            <button aria-label="Notifications" className="rounded-md p-2 hover:bg-white/5"><Bell size={16} /></button><span className="grid h-8 w-8 place-content-center rounded-full border border-iris/40 bg-iris/10"><User size={15} /></span></div></div>
<main key={pathname} className="page-in mx-auto max-w-6xl px-5 py-8 sm:px-8"><Outlet /></main>
        <div className="border-t border-amber-400/20 bg-amber-400/5 px-5 py-2 text-center text-[11px] text-amber-200 md:px-8">
          ⚠️ Decision-support prototype only — not a medical diagnosis. 3D heart is a reference model, not the patient's scan.
        </div>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex overflow-x-auto border-t border-sky-400/15 bg-void/90 px-1 py-1.5 backdrop-blur-xl md:hidden">
        {nav.map(n => <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `flex shrink-0 grow flex-col items-center gap-0.5 rounded-md px-2 py-1.5 text-[10px] ${isActive ? 'text-cyan2' : 'text-slate-500'}`}><n.icon size={18} />{n.label.split(' ')[0]}</NavLink>)}
      </nav>
    </div>
  )
}