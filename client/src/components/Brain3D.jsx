import { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { categoryColor } from '../lib/colors.js';

// 3D anatomical positions for each brain region
const REGION_3D = {
  'prefrontal-cortex': [-0.42, 0.52, 0.68],
  'frontal-lobe':      [ 0.18, 0.70, 0.46],
  'parietal-lobe':     [ 0.55, 0.40, -0.28],
  'temporal-lobe':     [-0.55, -0.20, 0.36],
  'limbic-system':     [ 0.08,  0.04,  0.02],
  'amygdala':          [ 0.30, -0.24, 0.20],
};

// Lobe shapes: [position, scale, distort speed] — layered to form an organic brain mass
const LOBES = [
  { pos: [0,     0.10,  0.00], s: [1.02, 0.90, 0.84], d: 0.28, spd: 1.4 }, // main cerebrum
  { pos: [-0.50, 0.42,  0.22], s: [0.72, 0.65, 0.70], d: 0.34, spd: 1.8 }, // left frontal
  { pos: [ 0.50, 0.40,  0.16], s: [0.70, 0.63, 0.68], d: 0.32, spd: 2.0 }, // right frontal
  { pos: [-0.62, 0.02, -0.10], s: [0.58, 0.54, 0.56], d: 0.30, spd: 1.6 }, // left parietal
  { pos: [ 0.62, 0.02, -0.14], s: [0.56, 0.52, 0.54], d: 0.28, spd: 1.7 }, // right parietal
  { pos: [-0.55, -0.22, 0.32], s: [0.52, 0.50, 0.50], d: 0.26, spd: 1.5 }, // left temporal
  { pos: [ 0.55, -0.22, 0.26], s: [0.50, 0.48, 0.48], d: 0.26, spd: 1.9 }, // right temporal
  { pos: [ 0.00, -0.52,-0.52], s: [0.80, 0.66, 0.60], d: 0.36, spd: 2.2 }, // cerebellum
];

const BRAIN_COLOR   = '#130c2e';
const BRAIN_EMISSIVE = '#2e1a6e';

function BrainBody() {
  return (
    <group>
      {LOBES.map((l, i) => (
        <Sphere key={i} args={[1, 56, 56]} position={l.pos} scale={l.s}>
          <MeshDistortMaterial
            color={BRAIN_COLOR}
            emissive={BRAIN_EMISSIVE}
            emissiveIntensity={0.25}
            distort={l.d}
            speed={l.spd}
            roughness={0.55}
            metalness={0.12}
            transparent
            opacity={i === 0 ? 0.90 : 0.72}
          />
        </Sphere>
      ))}
    </group>
  );
}

function RegionOrb({ region, isSelected, onClick }) {
  const outerRef = useRef();
  const coreRef  = useRef();
  const pos3d    = REGION_3D[region.key] ?? [0, 0, 0];
  const col      = categoryColor(region.categoryColor);
  const coreSize = 0.058 + (region.score / 100) * 0.072;
  const glowSize = coreSize * 2.8;
  const emissive = 0.5 + (region.score / 100) * 1.2;

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 2.2 + region.score * 0.05) * 0.10;
    if (outerRef.current) outerRef.current.scale.setScalar(isSelected ? pulse * 1.5 : pulse);
    if (coreRef.current)  coreRef.current.scale.setScalar(isSelected ? 1.35 : 1.0);
  });

  const threeColor = useMemo(() => new THREE.Color(col), [col]);

  return (
    <group position={pos3d} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* diffuse halo */}
      <Sphere ref={outerRef} args={[glowSize, 16, 16]}>
        <meshBasicMaterial color={threeColor} transparent opacity={isSelected ? 0.22 : 0.09} depthWrite={false} />
      </Sphere>
      {/* glowing core */}
      <Sphere ref={coreRef} args={[coreSize, 24, 24]}>
        <meshStandardMaterial
          color={threeColor}
          emissive={threeColor}
          emissiveIntensity={isSelected ? emissive * 2.6 : emissive}
          roughness={0.08}
          metalness={0.25}
        />
      </Sphere>
    </group>
  );
}

function Scene({ regions, selectedKey, onSelect }) {
  return (
    <>
      <ambientLight intensity={0.20} />
      <pointLight position={[ 3,  3,  3]} intensity={1.0} color="#a78bfa" />
      <pointLight position={[-3, -2, -2]} intensity={0.6} color="#60a5fa" />
      <pointLight position={[ 0,  4,  0]} intensity={0.5} color="#f9a8d4" />
      <pointLight position={[ 0, -3,  2]} intensity={0.3} color="#34d399" />

      <Suspense fallback={null}>
        <BrainBody />
        {regions.map((r) => (
          <RegionOrb
            key={r.key}
            region={r}
            isSelected={r.key === selectedKey}
            onClick={() => onSelect?.(r.key)}
          />
        ))}
        <Environment preset="night" />
      </Suspense>

      <OrbitControls
        enablePan={false}
        minDistance={2.2}
        maxDistance={5.5}
        autoRotate
        autoRotateSpeed={0.55}
        enableDamping
        dampingFactor={0.06}
      />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.15}
          luminanceSmoothing={0.85}
          intensity={2.2}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

export default function Brain3D({ regions, selectedKey, onSelect }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl"
      style={{
        height: 440,
        background: 'radial-gradient(ellipse at 40% 45%, #0e0628 0%, #04020d 100%)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0.1, 3.3], fov: 44 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <Scene regions={regions} selectedKey={selectedKey} onSelect={onSelect} />
      </Canvas>

      {/* hint overlay */}
      <p className="pointer-events-none absolute bottom-4 left-0 right-0 text-center text-xs text-white/40 tracking-wide">
        Drag to rotate · Click a glowing region to explore
      </p>
    </div>
  );
}
