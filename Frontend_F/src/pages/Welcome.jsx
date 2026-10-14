import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Backdrop } from '../components/Layout'

const SYMBOL_IMAGE = '/images/caduceus.png' // save the caduceus image here (public/images/caduceus.png)

export default function Welcome() {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <div className="relative flex min-h-full items-center overflow-hidden px-5 py-12 sm:px-8 lg:py-0">
      <Backdrop />
      <style>{`@media (prefers-reduced-motion: no-preference){.cl-float{animation:cl-float 9s ease-in-out infinite}}@keyframes cl-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}`}</style>

      <div className="page-in relative z-10 mx-auto grid w-full max-w-6xl items-center gap-6 lg:min-h-screen lg:grid-cols-[1fr_1fr] lg:gap-8">
        {/* LEFT — branding */}
        <div className="text-center lg:text-left">
          <h1 className="font-display text-4xl font-light tracking-[.3em] text-white sm:text-5xl lg:text-6xl">CARDIOLENS</h1>
          <p className="mt-5 bg-gradient-to-r from-volt via-cyan2 to-iris bg-clip-text font-display text-base text-transparent sm:text-lg">
            Machine Learning-Powered Cardiac Intelligence
          </p>
          <div className="mx-auto my-7 h-px w-24 bg-gradient-to-r from-cyan2/70 to-transparent lg:mx-0" />
          <h2 className="font-display text-2xl font-light leading-snug text-slate-100 sm:text-3xl">Your Heart Through A Smarter Lens</h2>

          <Link
            to="/mode"
            className="group mt-10 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-volt to-cyan2 px-8 py-3 text-sm font-semibold text-void transition-all duration-200 hover:-translate-y-px hover:shadow-[0_0_28px_-4px_rgba(34,229,255,.7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan2"
          >
            Explore CardioLens
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* RIGHT — medical symbol */}
        <div className="relative mx-auto aspect-square w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[520px]">
          {/* restrained cyan / violet atmosphere */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 48%, rgba(59,130,246,.22), transparent 62%),' +
                'radial-gradient(circle at 78% 30%, rgba(34,229,255,.10), transparent 55%),' +
                'radial-gradient(circle at 22% 72%, rgba(139,123,255,.10), transparent 55%)',
            }}
          />

          {!failed && (
            <img
              src={SYMBOL_IMAGE}
              alt="Medical caduceus symbol"
              draggable={false}
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              className={`cl-float absolute inset-0 h-full w-full select-none object-contain transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
              style={{
                // dissolve the image's navy background into the page
                WebkitMaskImage: 'radial-gradient(circle at 50% 50%, #000 36%, transparent 70%)',
                maskImage: 'radial-gradient(circle at 50% 50%, #000 36%, transparent 70%)',
                filter: 'drop-shadow(0 0 22px rgba(34,229,255,.18))',
              }}
            />
          )}

          {failed && import.meta.env.DEV && (
            <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center text-xs text-slate-500">
              Add the symbol image at public{SYMBOL_IMAGE}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}