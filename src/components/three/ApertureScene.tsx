import { Suspense, useRef, Component, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Group, Mesh } from "three";
import { prefersReducedMotion } from "@/lib/gsapSetup";

// Palette-matched: crimson accent + gold-ish warm rim light + obsidian base,
// no HDR/environment map fetch — two hand-placed lights instead, so the
// scene has zero network dependency beyond the JS bundle itself.

function ApertureRing() {
  const groupRef = useRef<Group>(null);
  // The continuous idle tumble, tracked separately from the group's actual
  // applied rotation — pointer parallax is added on TOP of this each frame,
  // never accumulated into it, or the ring would spin faster the longer the
  // cursor sat still in one spot.
  const base = useRef({ x: 0, y: 0, z: 0 });
  const reduced = prefersReducedMotion();

  useFrame((state, delta) => {
    if (reduced || !groupRef.current) return;
    // A torus is rotationally symmetric around its own face-normal axis, so
    // spinning it on Z alone is invisible — the tumble has to move on X/Y to
    // actually read as motion (Z stays as a slow tertiary spin for texture).
    base.current.x += delta * 0.09;
    base.current.y += delta * 0.14;
    base.current.z += delta * 0.03;

    // Subtle pointer parallax layered on top when the cursor is over the
    // canvas — a bonus, not the primary motion, so the piece still feels
    // alive even as a background element no one's pointing at.
    const { x, y } = state.pointer;
    groupRef.current.rotation.x = base.current.x + y * 0.15;
    groupRef.current.rotation.y = base.current.y + x * 0.2;
    groupRef.current.rotation.z = base.current.z;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <torusGeometry args={[1.6, 0.09, 32, 100]} />
        <meshStandardMaterial color="#A51D2D" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 6]}>
        <torusGeometry args={[1.15, 0.045, 32, 100]} />
        <meshStandardMaterial color="#C13A4C" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh>
        <circleGeometry args={[0.55, 48]} />
        <meshStandardMaterial color="#0B0B0C" metalness={0.4} roughness={0.6} />
      </mesh>
    </group>
  );
}

function Bokeh({ position, scale, color }: { position: [number, number, number]; scale: number; color: string }) {
  const meshRef = useRef<Mesh>(null);
  return (
    <Float speed={1.4} rotationIntensity={0} floatIntensity={1.6} enabled={!prefersReducedMotion()}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.5} transparent opacity={0.5} />
      </mesh>
    </Float>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 3, 4]} intensity={1.4} color="#F4F2ED" />
      <pointLight position={[-3, -2, 2]} intensity={12} color="#A51D2D" />
      <pointLight position={[2, -1, -2]} intensity={6} color="#C13A4C" />
    </>
  );
}

/** Catches WebGL/context-creation failures (unsupported browser, exhausted
 * GPU contexts, etc.) and falls back to nothing rather than crashing the
 * page — the hero still has its photography behind this, so losing just
 * the 3D layer is a graceful degradation, not a broken homepage. */
class SceneErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function ApertureScene({ className }: { className?: string }) {
  return (
    <SceneErrorBoundary>
      <Canvas
        className={className}
        camera={{ position: [0, 0, 5], fov: 40 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      >
        <Suspense fallback={null}>
          <Lights />
          <ApertureRing />
          <Bokeh position={[-2.1, 1.1, -1.5]} scale={0.28} color="#D9BE8C" />
          <Bokeh position={[2.3, -1.3, -2]} scale={0.4} color="#641722" />
          <Bokeh position={[1.6, 1.6, -1]} scale={0.18} color="#A51D2D" />
        </Suspense>
      </Canvas>
    </SceneErrorBoundary>
  );
}
