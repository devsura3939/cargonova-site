"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";

// Register the Line primitive so <threeLine> resolves to THREE.Line.
extend({ ThreeLine: THREE.Line });

/* ── Helpers ─────────────────────────────────────────────── */

function useRoutePath() {
  return useMemo(() => {
    const points = [
      new THREE.Vector3(-6.2, 0, 3.4),
      new THREE.Vector3(-3.4, 0, 1.6),
      new THREE.Vector3(-1.2, 0, 0.2),
      new THREE.Vector3(1.6, 0, -0.9),
      new THREE.Vector3(4.4, 0, -1.8),
      new THREE.Vector3(6.4, 0, -2.6),
    ];
    return new THREE.CatmullRomCurve3(points);
  }, []);
}

/** Deterministic pseudo-random so the skyline is stable between renders. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ── Truck ───────────────────────────────────────────────── */

function Truck({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const group = useRef<THREE.Group>(null);
  const wheels = useRef<(THREE.Group | null)[]>([]);
  const progress = useRef(0);
  const lastHeading = useRef(0);
  const reduced = useReducedMotion();

  useFrame((_, delta) => {
    const speed = 0.055 + Math.sin(progress.current * Math.PI * 2) * 0.012;
    const step = delta * speed * (reduced ? 0 : 1);
    progress.current = (progress.current + step) % 1;
    const t = progress.current;
    const pos = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();
    if (group.current) {
      group.current.position.copy(pos);
      group.current.position.y = 0.78;
      const heading = Math.atan2(tangent.x, tangent.z);
      // Lean into turns — bank proportional to heading change.
      let dHeading = heading - lastHeading.current;
      if (dHeading > Math.PI) dHeading -= Math.PI * 2;
      if (dHeading < -Math.PI) dHeading += Math.PI * 2;
      lastHeading.current = heading;
      group.current.rotation.y = heading;
      group.current.rotation.z = THREE.MathUtils.clamp(-dHeading * 3.2, -0.18, 0.18);
      // Spin wheels by distance travelled.
      const arc = step * curve.getLength();
      wheels.current.forEach((w) => {
        if (w) w.rotation.z -= arc / 0.24;
      });
    }
  });

  const wheelRef = (i: number) => (el: THREE.Group | null) => {
    wheels.current[i] = el;
  };

  return (
    <group ref={group}>
      {/* cargo box */}
      <mesh position={[-0.55, 0.55, 0]} castShadow>
        <boxGeometry args={[2.1, 1.15, 1.05]} />
        <meshStandardMaterial color="#004E89" metalness={0.25} roughness={0.55} />
      </mesh>
      <mesh position={[-0.55, 1.14, 0]}>
        <boxGeometry args={[2.12, 0.04, 1.07]} />
        <meshStandardMaterial color="#004E89" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* brand stripe on the box */}
      <mesh position={[-0.55, 0.52, 0.532]}>
        <boxGeometry args={[2.12, 0.07, 0.01]} />
        <meshStandardMaterial color="#1E81B0" emissive="#004E89" emissiveIntensity={0.35} />
      </mesh>
      {/* cabin */}
      <mesh position={[0.85, 0.62, 0]}>
        <boxGeometry args={[0.95, 1.0, 1.02]} />
        <meshStandardMaterial color="#1E81B0" metalness={0.35} roughness={0.35} />
      </mesh>
      {/* windshield */}
      <mesh position={[0.85, 0.88, 0.53]}>
        <boxGeometry args={[0.82, 0.34, 0.02]} />
        <meshStandardMaterial color="#1B1F2A" roughness={0.2} metalness={0.6} />
      </mesh>
      {/* headlights */}
      <mesh position={[1.34, 0.62, 0.36]}>
        <boxGeometry args={[0.02, 0.09, 0.14]} />
        <meshStandardMaterial color="#F9FAFB" emissive="#F9FAFB" emissiveIntensity={1.6} />
      </mesh>
      <mesh position={[1.34, 0.62, -0.36]}>
        <boxGeometry args={[0.02, 0.09, 0.14]} />
        <meshStandardMaterial color="#F9FAFB" emissive="#F9FAFB" emissiveIntensity={1.6} />
      </mesh>
      {/* taillights */}
      <mesh position={[-1.61, 0.62, 0.38]}>
        <boxGeometry args={[0.02, 0.07, 0.12]} />
        <meshStandardMaterial color="#1E81B0" emissive="#004E89" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[-1.61, 0.62, -0.38]}>
        <boxGeometry args={[0.02, 0.07, 0.12]} />
        <meshStandardMaterial color="#1E81B0" emissive="#004E89" emissiveIntensity={1.2} />
      </mesh>
      {/* chassis */}
      <mesh position={[0.05, 0.08, 0]}>
        <boxGeometry args={[3.4, 0.16, 0.5]} />
        <meshStandardMaterial color="#1B1F2A" roughness={0.7} />
      </mesh>
      {/* wheels (spin in useFrame) */}
      {[-1.25, -0.35, 0.75, 1.45].map((x, i) => (
        <group key={x}>
          {[0.42, -0.42].map((z) => (
            <group key={z} position={[x, 0.16, z]} ref={wheelRef(i * 2 + (z > 0 ? 0 : 1))}>
              <mesh rotation={[0, 0, 0]}>
                <cylinderGeometry args={[0.24, 0.24, 0.16, 14]} />
                <meshStandardMaterial color="#1B1F2A" roughness={0.9} />
              </mesh>
              {/* hub cap */}
              <mesh position={[0, 0, 0.082]}>
                <cylinderGeometry args={[0.1, 0.1, 0.01, 10]} />
                <meshStandardMaterial color="#004E89" metalness={0.6} roughness={0.4} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      {/* headlight glow cone ahead of the truck */}
      <pointLight position={[2.1, 0.7, 0]} intensity={10} distance={5.5} color="#F9FAFB" />
    </group>
  );
}

/* ── Cargo plane ─────────────────────────────────────────── */

function CargoPlane() {
  const group = useRef<THREE.Group>(null);
  const progress = useRef(0.35);
  const reduced = useReducedMotion();

  const path = useMemo(() => {
    const pts = [
      new THREE.Vector3(-9.5, 4.4, -1.5),
      new THREE.Vector3(-4.5, 4.9, -6.2),
      new THREE.Vector3(4.5, 4.8, -5.4),
      new THREE.Vector3(9.5, 4.2, -0.5),
      new THREE.Vector3(5.5, 4.9, 5.2),
      new THREE.Vector3(-4.0, 5.0, 6.4),
    ];
    return new THREE.CatmullRomCurve3(pts, true);
  }, []);

  useFrame((_, delta) => {
    if (reduced) return;
    progress.current = (progress.current + delta * 0.021) % 1;
    const t = progress.current;
    const pos = path.getPointAt(t);
    const tangent = path.getTangentAt(t).normalize();
    if (group.current) {
      group.current.position.copy(pos);
      const heading = Math.atan2(tangent.x, tangent.z);
      // Bank into the turn based on heading change.
      const tPrev = (t - 0.01 + 1) % 1;
      const prevHeading = Math.atan2(path.getTangentAt(tPrev).x, path.getTangentAt(tPrev).z);
      let d = heading - prevHeading;
      if (d > Math.PI) d -= Math.PI * 2;
      if (d < -Math.PI) d += Math.PI * 2;
      group.current.rotation.y = heading;
      group.current.rotation.z = THREE.MathUtils.clamp(-d * 2.6, -0.55, 0.55);
      group.current.rotation.x = THREE.MathUtils.clamp(-tangent.y * 1.4, -0.35, 0.35);
    }
  });

  return (
    <group ref={group} scale={0.82}>
      {/* fuselage (pointing +z) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.34, 2.5, 12]} />
        <meshStandardMaterial color="#F9FAFB" metalness={0.4} roughness={0.35} />
      </mesh>
      {/* nose */}
      <mesh position={[0, 0, 1.32]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.3, 0.55, 12]} />
        <meshStandardMaterial color="#F9FAFB" metalness={0.35} roughness={0.4} />
      </mesh>
      {/* cockpit window band */}
      <mesh position={[0, 0.06, 1.12]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.29, 0.29, 0.3, 12, 1, false, Math.PI, Math.PI]} />
        <meshStandardMaterial color="#1B1F2A" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* main wings */}
      <group position={[0, 0.04, 0.1]}>
        <mesh rotation={[0, 0, 0.04]}>
          <boxGeometry args={[4.8, 0.07, 1.15]} />
          <meshStandardMaterial color="#F9FAFB" metalness={0.35} roughness={0.45} />
        </mesh>
        {/* engine pods */}
        <mesh position={[1.15, -0.16, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.5, 10]} />
          <meshStandardMaterial color="#C0C5CE" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[-1.15, -0.16, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.5, 10]} />
          <meshStandardMaterial color="#C0C5CE" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
      {/* tail */}
      <group position={[0, 0.1, -1.18]}>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[0.06, 1.15, 0.5]} />
          <meshStandardMaterial color="#1E81B0" metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[1.6, 0.06, 0.45]} />
          <meshStandardMaterial color="#F9FAFB" metalness={0.35} roughness={0.45} />
        </mesh>
      </group>
      {/* nav light */}
      <mesh position={[-2.42, 0.04, 0.1]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#004E89" />
      </mesh>
      <mesh position={[2.42, 0.04, 0.1]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color="#3bff9d" />
      </mesh>
      {/* blinking beacon */}
      <Beacon />
    </group>
  );
}

function Beacon() {
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(({ clock }) => {
    if (mat.current) {
      mat.current.opacity = Math.sin(clock.elapsedTime * 6) > 0.2 ? 1 : 0.15;
    }
  });
  return (
    <mesh position={[0, 0.72, -1.18]}>
      <sphereGeometry args={[0.06, 8, 8]} />
      <meshBasicMaterial ref={mat} color="#ff4d4d" transparent />
    </mesh>
  );
}

/* ── City skyline with lit windows ───────────────────────── */

function CitySkyline() {
  const rand = seeded(7);
  const blocks = useMemo(
    () =>
      Array.from({ length: 26 }, () => {
        const angle = rand() * Math.PI * 2;
        const r = 9.5 + rand() * 4.5;
        const w = 0.9 + rand() * 1.1;
        const d = 0.9 + rand() * 1.2;
        const h = 1.2 + rand() * 3.6;
        const tilt = (rand() - 0.5) * 0.12;
        return {
          pos: [Math.cos(angle) * r, h / 2, Math.sin(angle) * r] as [number, number, number],
          size: [w, h, d] as [number, number, number],
          rotY: angle + Math.PI / 2 + (rand() - 0.5) * 0.6,
          tilt,
          // a few blocks get a glowing crown so the skyline reads at night
          crown: rand() > 0.68,
          windows: Math.floor(rand() * 3),
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <group>
      {blocks.map((b, i) => (
        <group key={i} position={b.pos} rotation={[0, b.rotY, b.tilt]}>
          <mesh>
            <boxGeometry args={b.size} />
            <meshStandardMaterial
              color="#0e2140"
              metalness={0.25}
              roughness={0.75}
              emissive="#123057"
              emissiveIntensity={b.crown ? 0.9 : 0.25}
            />
          </mesh>
          {/* lit window rows on the facing side */}
          {Array.from({ length: b.windows }).map((_, w) => (
            <mesh
              key={w}
              position={[0, 0, (b.size[2] ?? 1) / 2 + 0.01]}
            >
              <planeGeometry args={[b.size[0] * 0.8, b.size[1] * 0.5]} />
              <meshBasicMaterial
                color={w % 2 === 0 ? "#1E81B0" : "#004E89"}
                transparent
                opacity={0.16 + rand() * 0.25}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/* ── Drifting data particles ─────────────────────────────── */

function Particles() {
  const points = useRef<THREE.Points>(null);
  const reduced = useReducedMotion();

  const { positions, speeds } = useMemo(() => {
    const rand = seeded(42);
    const n = 130;
    const positions = new Float32Array(n * 3);
    const speeds = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      positions[i * 3] = (rand() - 0.5) * 26;
      positions[i * 3 + 1] = rand() * 7;
      positions[i * 3 + 2] = (rand() - 0.5) * 22 - 2;
      speeds[i] = 0.12 + rand() * 0.3;
    }
    return { positions, speeds };
  }, []);

  useFrame(({ clock }) => {
    if (!points.current || reduced) return;
    const dt = clock.getDelta();
    const pos = points.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      let y = pos.getY(i) + speeds[i] * dt;
      if (y > 7.2) y = 0;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color="#5ee2ef"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Existing scene elements ─────────────────────────────── */

function AnimatedRoute({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const lineRef = useRef<THREE.Line>(null);
  const reduced = useReducedMotion();

  useFrame((_, delta) => {
    if (lineRef.current && !reduced) {
      const mat = lineRef.current.material as THREE.LineDashedMaterial & { dashOffset: number };
      mat.dashOffset -= delta * 0.55;
    }
  });

  const points = curve.getPoints(160);
  return (
    <threeLine ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[new Float32Array(points.flatMap((p) => [p.x, p.y + 0.02, p.z])), 3]} />
      </bufferGeometry>
      <lineDashedMaterial
        color="#2ED3E6"
        dashSize={0.22}
        gapSize={0.16}
        transparent
        opacity={0.95}
      />
    </threeLine>
  );
}

function HubPin({
  position,color="#1E81B0",
}: {
  position: [number, number, number];
  color?: string;
}) {
  const ring = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Mesh>(null);
  const reduced = useReducedMotion();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ring.current && !reduced) {
      const s = 1 + Math.sin(t * 1.8) * 0.12;
      ring.current.scale.setScalar(s);
      (ring.current.material as THREE.MeshBasicMaterial).opacity =
        0.5 - Math.sin(t * 1.8) * 0.25;
    }
    if (core.current) {
      core.current.position.y = position[1] + 0.32 + Math.sin(t * 1.5) * 0.06;
    }
  });

  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.18, 0.26, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.24, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
      <mesh ref={core} position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} />
      </mesh>
    </group>
  );
}

function Warehouse({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* building */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <boxGeometry args={[2.4, 1.7, 1.8]} />
        <meshStandardMaterial color="#132c52" metalness={0.2} roughness={0.6} />
      </mesh>
      {/* roof */}
      <mesh position={[0, 1.78, 0]}>
        <boxGeometry args={[2.7, 0.14, 2.1]} />
        <meshStandardMaterial color="#004E89" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* doors */}
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0.55, 0.92]}>
          <boxGeometry args={[0.7, 1.1, 0.02]} />
          <meshStandardMaterial color="#1B1F2A" roughness={0.8} />
        </mesh>
      ))}
      {/* dock lights */}
      <mesh position={[0, 1.5, 0.95]}>
        <boxGeometry args={[0.14, 0.14, 0.02]} />
        <meshBasicMaterial color="#2ED3E6" />
      </mesh>
      <mesh position={[0.62, 1.5, 0.95]}>
        <boxGeometry args={[0.14, 0.14, 0.02]} />
        <meshBasicMaterial color="#2ED3E6" />
      </mesh>
      {/* "BRB Enterprise" sign glow */}
      <mesh position={[0, 2.02, 0.1]}>
        <boxGeometry args={[1.5, 0.12, 0.04]} />
        <meshStandardMaterial color="#F9FAFB" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function Containers({ position }: { position: [number, number, number] }) {
  const stack = [
    { pos: [-1.35, 0.62, 1.1], color: "#004E89" },
    { pos: [-0.45, 0.62, 1.1], color: "#1E81B0" },
    { pos: [-0.45, 1.36, 1.1], color: "#1E81B0" },
    { pos: [-1.35, 1.36, 1.1], color: "#F9FAFB" },
    { pos: [-0.9, 2.1, 1.1], color: "#004E89" },
  ];
  return (
    <group position={position}>
      {stack.map((c, i) => (
        <mesh key={i} position={c.pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.82, 0.74, 1.3]} />
          <meshStandardMaterial color={c.color} metalness={0.35} roughness={0.45} />
        </mesh>
      ))}
      {/* outline strips for realism */}
      {stack.map((c, i) => (
        <mesh key={`s${i}`} position={[c.pos[0], c.pos[1], c.pos[2] + 0.652]}>
          <planeGeometry args={[0.82, 0.74]} />
          <meshBasicMaterial color="#1B1F2A" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function DataLines() {
  const group = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();
  useFrame(({ clock }) => {
    if (group.current && !reduced) {
      group.current.rotation.y = Math.sin(clock.elapsedTime * 0.12) * 0.05;
    }
  });

  const lines = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const angle = (i / 14) * Math.PI * 2;
        const r = 4.6 + (i % 3) * 1.1;
        return {
          start: [Math.cos(angle) * r, 0.06, Math.sin(angle) * r],
          end: [Math.cos(angle + 0.35) * (r - 1.4), 0.06, Math.sin(angle + 0.35) * (r - 1.4)],
          color: i % 3 === 0 ? "#1E81B0" : "#004E89",
        };
      }),
    [],
  );

  return (
    <group ref={group}>
      {lines.map((l, i) => (
        <threeLine key={i}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[new Float32Array([...l.start, ...l.end]), 3]} />
          </bufferGeometry>
          <lineBasicMaterial color={l.color} transparent opacity={0.22} />
        </threeLine>
      ))}
      {lines.slice(0, 8).map((l, i) => (
        <mesh key={`n${i}`} position={l.end as [number, number, number]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial color={l.color} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function RouteLane() {
  return (
    <group>
      {/* road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0.4]}>
        <planeGeometry args={[17, 11]} />
        <meshStandardMaterial color="#0a1526" roughness={0.9} />
      </mesh>
      {/* road edges */}
      {[-1.28, 1.28].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, x * 5.5 + 0.4]}>
          <planeGeometry args={[17, 0.03]} />
          <meshBasicMaterial color="#004E89" transparent opacity={0.5} />
        </mesh>
      ))}
      {/* center line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0.4]}>
        <planeGeometry args={[17, 0.02]} />
        <meshBasicMaterial color="#004E89" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function Rig() {
  const reduced = useReducedMotion();
  useFrame(({ camera, pointer }) => {
    if (reduced) return;
    const targetX = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.7, 0.04);
    const targetY = THREE.MathUtils.lerp(camera.position.y, 5.6 + pointer.y * 0.5, 0.04);
    camera.position.x = targetX;
    camera.position.y = targetY;
    camera.lookAt(0, 0.9, 0);
  });
  return null;
}

/* ── Scene ───────────────────────────────────────────────── */

export default function LogisticsScene() {
  const curve = useRoutePath();

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 5.6, 11.5], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      aria-hidden="true"
    >
      <fog attach="fog" args={["#1B1F2A", 14, 30]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 10, 6]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-5, 4, -4]} intensity={22} color="#1E81B0" />
      <pointLight position={[5, 3, 4]} intensity={16} color="#1E81B0" />

      <group position={[0, 0, -0.6]}>
        <RouteLane />
        <CitySkyline />
        <AnimatedRoute curve={curve} />
        <Truck curve={curve} />
        <HubPin position={[-6.2, 0, 3.4]} color="#1E81B0" />
        <HubPin position={[6.4, 0, -2.6]} color="#1E81B0" />
        <HubPin position={[1.6, 0, -0.9]} color="#1E81B0" />
        <Warehouse position={[-4.6, 0, -1.6]} />
        <Containers position={[4.1, 0, 1.7]} />
        <DataLines />
      </group>

      <CargoPlane />
      <Particles />

      <Rig />
    </Canvas>
  );
}
