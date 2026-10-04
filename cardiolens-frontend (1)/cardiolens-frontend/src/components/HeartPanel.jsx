import { useState } from 'react'
import { levelOf } from './RiskGauge'

// Member 4: swap this SVG for the Three.js / R3F heart, keep the vessel list + onSelect.
const PATHS = {
  LAD: 'M96 52 C112 88 114 122 104 162',
  LCX: 'M72 66 C48 92 54 126 78 142',
  RCA: 'M132 62 C154 84 152 120 130 148',
}
const INFO = {
  LAD: 'Left anterior descending: supplies the front of the heart.',
  LCX: 'Left circumflex: supplies the side and back of the left ventricle.',
  RCA: 'Right coronary artery: supplies the right side and bottom of the heart.',
}

export default function HeartPanel({ result }) {
  const [sel, setSel] = useState('LAD')
  const probs = { LAD: result.lad, LCX: result.lcx, RCA: result.rca }
  return (
    <div className="grid items-center gap-4 sm:grid-cols-[1fr_150px]">
      <svg viewBox="0 0 200 190" className="mx-auto w-full max-w-[240px]" role="img" aria-label="Heart with coronary vessels">
        <defs><radialGradient id="hg" cx="40%" cy="30%"><stop offset="0" stopColor="#D8454D" /><stop offset="1" stopColor="#7A1620" /></radialGradient></defs>
        <path d="M100 180 C30 125 12 80 36 44 C58 14 92 24 100 50 C108 24 142 14 164 44 C188 80 170 125 100 180Z" fill="url(#hg)" />
        <path d="M92 52 C84 20 100 8 112 12 L116 40Z" fill="#3A6EA5" />
        {Object.entries(PATHS).map(([n, d]) => (
          <path key={n} d={d} fill="none" stroke={levelOf(probs[n]).color} strokeLinecap="round"
            strokeWidth={sel === n ? 8 : 5} onClick={() => setSel(n)} className="cursor-pointer" />
        ))}
      </svg>
      <div>
        <ul className="rounded-xl border border-line text-sm" role="tablist" aria-label="Vessel">
          {Object.entries(probs).map(([n, p]) => (
            <li key={n}>
              <button role="tab" aria-selected={sel === n} onClick={() => setSel(n)}
                className={`flex w-full items-center justify-between px-3 py-2 ${sel === n ? 'bg-accent/15' : ''}`}>
                <span className="flex items-center gap-2 font-semibold">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: levelOf(p).color }} />{n}
                </span>
                <span style={{ color: levelOf(p).color }} className="font-semibold">{Math.round(p * 100)}%</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-mute">{INFO[sel]}</p>
      </div>
    </div>
  )
}
