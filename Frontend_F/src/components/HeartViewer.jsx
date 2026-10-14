import { lazy, Suspense, useState } from 'react'
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Tags,
} from 'lucide-react'

const GlbModel = lazy(() => import('./GlbModel'))

export const ENABLE_GLB = true
export const GLB_URL = '/models/heart.glb'

const Ctl = ({ icon: I, label, on, ...p }) => (
  <button
    {...p}
    aria-label={label}
    title={label}
    className={`grid h-10 w-10 place-content-center rounded-lg border bg-void/60 backdrop-blur transition ${
      on
        ? 'border-cyan2 text-cyan2'
        : 'border-sky-400/20 text-slate-300 hover:border-cyan2/60'
    }`}
  >
    <I size={17} />
  </button>
)

function Placeholder({ spin, zoom, labels, coronary }) {
  const tags = [
    ['LAD', 'top-[16%] left-[64%]'],
    ['LCX', 'top-[44%] -left-2'],
    ['RCA', 'top-[68%] left-[78%]'],
  ]

  return (
    <div
      className="absolute inset-0 grid place-content-center"
      style={{ perspective: 900 }}
    >
      <div
        className="relative h-56 w-56 transition-transform duration-500 sm:h-72 sm:w-72"
        style={{
          transform: `scale(${zoom})`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transformStyle: 'preserve-3d',
            animation: 'spin3d 24s linear infinite',
            animationPlayState: spin ? 'running' : 'paused',
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-full border border-cyan2/40"
              style={{
                transform: `rotateY(${i * 30}deg)`,
                boxShadow: '0 0 18px rgba(34,229,255,.12)',
              }}
            />
          ))}

          {[-60, -30, 0, 30, 60].map((y) => {
            const s =
              Math.cos((y * Math.PI) / 180) * 100

            return (
              <div
                key={y}
                className="absolute rounded-full border border-iris/35"
                style={{
                  width: `${s}%`,
                  height: `${s}%`,
                  left: `${(100 - s) / 2}%`,
                  top: `${(100 - s) / 2}%`,
                  transform: `translateY(${
                    Math.sin((y * Math.PI) / 180) * -110
                  }px) rotateX(90deg)`,
                }}
              />
            )
          })}
        </div>

        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan2/20 blur-2xl" />

        {labels &&
          coronary &&
          tags.map(([t, c]) => (
            <span
              key={t}
              className={`absolute ${c} rounded border border-cyan2/40 bg-void/80 px-2 py-0.5 text-[10px] text-cyan2`}
            >
              {t} · --
            </span>
          ))}
      </div>
    </div>
  )
}

export default function HeartViewer({
  url = GLB_URL,
  coronary = true,
  className = '',
  focus,
  markers,
  onMarker,
  initialSpin = true,
  title = '3D HEART MODEL',
}) {
  const [spin, setSpin] = useState(initialSpin)
  const [zoom, setZoom] = useState(1)
  const [labels, setLabels] = useState(true)

  return (
    <div
      className={`glass relative min-h-[420px] overflow-hidden rounded-xl ${className}`}
    >
      <div className="grid-bg absolute inset-0 opacity-70" />

      <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-volt/10 blur-[90px]" />

      {ENABLE_GLB ? (
        <Suspense fallback={null}>
          <div className="absolute inset-0">
            <GlbModel
              url={url}
              zoom={zoom}
              spin={spin}
              focus={focus}
              markers={labels ? markers : []}
              onMarker={onMarker}
            />
          </div>
        </Suspense>
      ) : (
        <Placeholder
          spin={spin}
          zoom={zoom}
          labels={labels}
          coronary={coronary}
        />
      )}

      {!ENABLE_GLB && (
        <div
          className="pointer-events-none absolute inset-x-[20%] h-px bg-gradient-to-r from-transparent via-cyan2 to-transparent opacity-60"
          style={{
            animation:
              'scan 3.2s ease-in-out infinite alternate',
          }}
        />
      )}

      <div className="absolute left-5 top-5">
        <div className="font-display text-sm tracking-[.2em] text-white">
          {title}
        </div>

        <div className="mt-1 font-mono text-[11px] text-cyan2/80">
          .GLB MODEL LOADED
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
        <Ctl
          icon={RotateCw}
          label="Rotate"
          on={spin}
          onClick={() => setSpin(!spin)}
        />

        <Ctl
          icon={ZoomIn}
          label="Zoom in"
          onClick={() =>
            setZoom((z) =>
              Math.min(2.5, z + 0.25)
            )
          }
        />

        <Ctl
          icon={ZoomOut}
          label="Zoom out"
          onClick={() =>
            setZoom((z) =>
              Math.max(0.35, z - 0.25)
            )
          }
        />

        <Ctl
          icon={RefreshCw}
          label="Reset"
          onClick={() => {
            setZoom(1)
            setSpin(initialSpin)
            setLabels(true)
          }}
        />

        {coronary && (
          <Ctl
            icon={Tags}
            label="Toggle labels"
            on={labels}
            onClick={() => setLabels(!labels)}
          />
        )}
      </div>
    </div>
  )
}