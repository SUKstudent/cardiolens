import { Canvas, useThree, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  useGLTF,
  Environment,
  Center,
  Html,
} from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Vector3, Box3 } from 'three'

function CameraZoom({ zoom }) {
  const { camera } = useThree()

  useEffect(() => {
    // Higher zoom = camera moves closer
    camera.position.z = 4 / zoom
    camera.updateProjectionMatrix()
  }, [camera, zoom])

  return null
}

const _v = new Vector3()

// Glides the camera to `focus` (a position array) whenever focus or zoom changes,
// then hands control back to the user.
function CameraRig({ focus, zoom, controls }) {
  const { camera } = useThree()
  const t = useRef(0)

  useEffect(() => { t.current = 1.6 }, [focus, zoom])

  useFrame((_, dt) => {
    if (t.current <= 0) return
    t.current -= dt
    camera.position.lerp(_v.set(...focus).multiplyScalar(1 / zoom), 1 - Math.exp(-dt * 4))
    controls.current?.target.set(0, 0, 0)
    controls.current?.update()
  })

  return null
}

function probabilityToColor(p) {
  if (p == null) return '#22d3ee'
  if (p < 0.3) return '#22c55e'
  if (p < 0.6) return '#eab308'
  return '#dc2626'
}

function Markers({ markers, onMarker }) {
  return markers.map((m) => {
    const color = probabilityToColor(m.probability)
    return (
      <Html key={m.id} position={m.pos} center zIndexRange={[20, 0]}>
        <button
          type="button"
          aria-label={m.name}
          onClick={() => onMarker?.(m.id)}
          style={{
            borderColor: color,
            color: m.active ? '#fff' : color,
            boxShadow: m.active ? `0 0 14px ${color}` : undefined,
            background: m.active ? `${color}33` : 'rgba(0,0,0,0.8)',
          }}
          className="whitespace-nowrap rounded border px-2 py-0.5 text-[11px] backdrop-blur transition"
        >
          {m.label}
        </button>
      </Html>
    )
  })
}

function Heart({ url }) {
  const { scene } = useGLTF(url)

  // Har model ko 1 unit ooncha bana deta hai
  const scale = useMemo(() => {
    const size = new Box3().setFromObject(scene).getSize(new Vector3())
    return size.y > 0 ? 1 / size.y : 1
  }, [scene])

  return (
    <Center>
      <primitive object={scene} scale={scale} />
    </Center>
  )
}

export default function GlbModel({
  url,
  zoom = 1,
  spin = true,
  focus,
  markers = [],
  onMarker,
}) {
  const controls = useRef()

  return (
    <Canvas
      camera={{
        position: [0, 0, 4],
        fov: 45,
      }}
    >
      <ambientLight intensity={0.6} />

      <directionalLight
        position={[3, 4, 5]}
        intensity={1.2}
      />

      <Suspense fallback={null}>
        <Heart url={url} />
        <Markers markers={markers} onMarker={onMarker} />
        <Environment preset="city" />
      </Suspense>

      {focus ? (
        <CameraRig focus={focus} zoom={zoom} controls={controls} />
      ) : (
        <CameraZoom zoom={zoom} />
      )}

      <OrbitControls
        ref={controls}
        enableDamping
        dampingFactor={0.08}
        autoRotate={spin}
        autoRotateSpeed={1.5}
        minDistance={1.4}
        maxDistance={10}
      />
    </Canvas>
  )
}