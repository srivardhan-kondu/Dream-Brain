import { useRef, Suspense, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { categoryColor } from '../lib/colors.js';

const REGION_3D = {
  'prefrontal-cortex': [-0.42,  0.52,  0.70],
  'frontal-lobe':      [ 0.20,  0.72,  0.48],
  'parietal-lobe':     [ 0.58,  0.42, -0.30],
  'temporal-lobe':     [-0.58, -0.20,  0.36],
  'limbic-system':     [ 0.08,  0.04,  0.02],
  'amygdala':          [ 0.32, -0.24,  0.20],
};

const LABEL_OFFSET = {
  'prefrontal-cortex': [-0.72,  0.34],
  'frontal-lobe':      [ 0.60,  0.30],
  'parietal-lobe':     [ 0.62, -0.08],
  'temporal-lobe':     [-0.66, -0.26],
  'limbic-system':     [ 0.65,  0.00],
  'amygdala':          [ 0.62, -0.32],
};

const LOBES = [
  { pos: [0,     0.10,  0.00], s: [1.02, 0.90, 0.84], d: 0.28, spd: 1.4, op: 0.92 },
  { pos: [-0.50, 0.42,  0.22], s: [0.72, 0.65, 0.70], d: 0.34, spd: 1.8, op: 0.74 },
  { pos: [ 0.50, 0.40,  0.16], s: [0.70, 0.63, 0.68], d: 0.32, spd: 2.0, op: 0.74 },
  { pos: [-0.62, 0.02, -0.10], s: [0.58, 0.54, 0.56], d: 0.30, spd: 1.6, op: 0.70 },
  { pos: [ 0.62, 0.02, -0.14], s: [0.56, 0.52, 0.54], d: 0.28, spd: 1.7, op: 0.70 },
  { pos: [-0.55, -0.22, 0.32], s: [0.52, 0.50, 0.50], d: 0.26, spd: 1.5, op: 0.68 },
  { pos: [ 0.55, -0.22, 0.26], s: [0.50, 0.48, 0.48], d: 0.26, spd: 1.9, op: 0.68 },
  { pos: [ 0.00, -0.52,-0.52], s: [0.80, 0.66, 0.60], d: 0.36, spd: 2.2, op: 0.65 },
];

function BrainBody() {
  return (
    <group>
      {LOBES.map((l, i) => (
        <Sphere key={i} args={[1, 48, 48]} position={l.pos} scale={l.s}>
          <MeshDistortMaterial
            color="#130c2e"
            emissive="#2e1a6e"
            emissiveIntensity={0.30}
            distort={l.d}
            speed={l.spd}
            roughness={0.50}
            metalness={0.15}
            transparent
            opacity={l.op}
          />
        </Sphere>
      ))}
    </group>
  );
}

function RegionOrb({ region, isSelected, isHovered, onClick, onPointerOver, onPointerOut }) {
  const outerRef = useRef();
  const coreRef  = useRef();
  const lightRef = useRef();

  const pos3d  = REGION_3D[region.key] ?? [0, 0, 0];
  const col    = categoryColor(region.categoryColor);
  const active = isSelected || isHovered;

  const coreSize = 0.055 + (region.score / 100) * 0.068;
  const glowSize = coreSize * 3.0;
  const emissive = 0.6 + (region.score / 100) * 1.4;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 2.2 + region.score * 0.05) * 0.12;
    if (outerRef.current) outerRef.current.scale.setScalar(active ? pulse * 1.7 : pulse);
    if (coreRef.current)  coreRef.current.scale.setScalar(active ? 1.45 : 1.0);
    if (lightRef.current) lightRef.current.intensity = active
      ? (1.2 + Math.sin(t * 3) * 0.3)
      : (0.4 + Math.sin(t * 1.5) * 0.1);
  });

  const threeColor = useMemo(() => new THREE.Color(col), [col]);
  const offset = LABEL_OFFSET[region.key] ?? [0.6, 0.2];

  return (
    <group
      position={pos3d}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); onPointerOver(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e)  => { e.stopPropagation(); onPointerOut();  document.body.style.cursor = 'auto'; }}
    >
      {/* per-region point light for real bloom without postprocessing */}
      <pointLight ref={lightRef} color={col} intensity={0.4} distance={1.8} decay={2} />

      {/* diffuse halo */}
      <Sphere ref={outerRef} args={[glowSize, 14, 14]}>
        <meshBasicMaterial color={threeColor} transparent opacity={active ? 0.20 : 0.07} depthWrite={false} />
      </Sphere>

      {/* glowing core */}
      <Sphere ref={coreRef} args={[coreSize, 22, 22]}>
        <meshStandardMaterial
          color={threeColor}
          emissive={threeColor}
          emissiveIntensity={active ? emissive * 2.8 : emissive}
          roughness={0.06}
          metalness={0.20}
        />
      </Sphere>

      {/* connector line */}
      <Line
        points={[[0, 0, 0], [offset[0] * 0.88, offset[1] * 0.88, 0]]}
        color={col}
        lineWidth={active ? 1.4 : 0.7}
        transparent
        opacity={active ? 0.95 : 0.40}
      />

      {/* floating label */}
      <Html
        position={[offset[0], offset[1], 0]}
        center={false}
        distanceFactor={4}
        style={{ pointerEvents: 'none' }}
        zIndexRange={[0, 10]}
      >
        <div style={{
          background: active
            ? `linear-gradient(135deg, ${col}30, ${col}10)`
            : 'rgba(8,4,22,0.78)',
          border: `1px solid ${active ? col : col + '44'}`,
          borderRadius: 10,
          padding: '5px 10px',
          minWidth: 116,
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s ease',
          boxShadow: active ? `0 0 18px ${col}55` : 'none',
        }}>
          <div style={{ color: col, fontWeight: 700, fontSize: 9.5, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 2 }}>
            {region.zone}
          </div>
          <div style={{ color: '#ede8ff', fontWeight: 600, fontSize: 12, lineHeight: 1.25, marginBottom: 4 }}>
            {region.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ background: col, borderRadius: 5, padding: '2px 7px', color: '#fff', fontWeight: 800, fontSize: 11 }}>
              {region.score}
            </span>
            <span style={{ color: '#9d93c0', fontSize: 10 }}>{region.subtitle}</span>
          </div>
        </div>
      </Html>
    </group>
  );
}

function Scene({ regions, selectedKey, onSelect }) {
  const [hoveredKey, setHoveredKey] = useState(null);

  return (
    <>
      <ambientLight intensity={0.18} />
      <pointLight position={[ 3,  3,  3]} intensity={1.1} color="#a78bfa" />
      <pointLight position={[-3, -2, -2]} intensity={0.7} color="#60a5fa" />
      <pointLight position={[ 0,  4,  0]} intensity={0.55} color="#f9a8d4" />
      <pointLight position={[ 0, -3,  2]} intensity={0.35} color="#34d399" />

      <Suspense fallback={null}>
        <BrainBody />
        {regions.map((r) => (
          <RegionOrb
            key={r.key}
            region={r}
            isSelected={r.key === selectedKey}
            isHovered={r.key === hoveredKey}
            onClick={() => onSelect?.(r.key)}
            onPointerOver={() => setHoveredKey(r.key)}
            onPointerOut={() => setHoveredKey(null)}
          />
        ))}
      </Suspense>

      <OrbitControls
        enablePan={false}
        minDistance={2.2}
        maxDistance={5.8}
        autoRotate
        autoRotateSpeed={0.45}
        enableDamping
        dampingFactor={0.06}
      />
    </>
  );
}

export default function Brain3D({ regions, selectedKey, onSelect }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl"
      style={{ height: 480, background: 'radial-gradient(ellipse at 40% 45%, #0e0628 0%, #04020d 100%)' }}
    >
      <Canvas
        camera={{ position: [0, 0.1, 3.4], fov: 44 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <Scene regions={regions} selectedKey={selectedKey} onSelect={onSelect} />
      </Canvas>

      {/* category legend */}
      <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-1.5">
        {[
          { label: 'Cognitive',  color: '#34D399' },
          { label: 'Emotional',  color: '#8B7CF6' },
          { label: 'Behavioral', color: '#60A5FA' },
          { label: 'Stress',     color: '#F59E0B' },
        ].map((l) => (
          <span key={l.label} className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: l.color }}>
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: l.color, boxShadow: `0 0 6px ${l.color}` }} />
            {l.label}
          </span>
        ))}
      </div>

      <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-[11px] text-white/35 tracking-wide">
        Drag to rotate · Hover or click a region to explore
      </p>
    </div>
  );
}
