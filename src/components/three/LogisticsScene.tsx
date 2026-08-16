"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";

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

function Truck({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const group = useRef<THREE.Group>(null);
  const progress = useRef(0);
  const reduced = useReducedMotion();

  useFrame((_, delta) => {
    const speed = 0.055 + Math.sin(progress.current * Math.PI * 2) * 0.012;
    progress.current = (progress.current + delta * speed * (reduced ? 0 : 1)) % 1;
    const t = progress.current;
    const pos = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();
    if (group.current) {
      group.current.position.copy(pos);
      group.current.position.y = 0.78;
      group.current.rotation.y = Math.atan2(tangent.x, tangent.z);
    }
  });

  return (
    <group ref={group}>
      {/* cargo box */}
      <mesh position={[-0.55, 0.55, 0]} castShadow>
        <boxGeometry args={[2.1, 1.15, 1.05]} />
        <meshStandardMaterial color="#12315e" metalness={0.25} roughness={0.55} />
      </mesh>
      <mesh position={[-0.55, 1.14, 0]}>
        <boxGeometry args={[2.12, 0.04, 1.07]} />
        <meshStandardMaterial color="#1e4578" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* cabin */}
      <mesh position={[0.85, 0.62, 0]}>
        <boxGeometry args={[0.95, 1.0, 1.02]} />
        <meshStandardMaterial color="#1677ff" metalness={0.35} roughness={0.35} />
      </mesh>
      {/* windshield */}
      <mesh position={[0.85, 0.88, 0.53]}>
        <boxGeometry args={[0.82, 0.34, 0.02]} />
        <meshStandardMaterial color="#0b1f3a" roughness={0.2} metalness={0.6} />
      </mesh>
      {/* chassis */}
      <mesh position={[0.05, 0.08, 0]}>
        <boxGeometry args={[3.4, 0.16, 0.5]} />
        <meshStandardMaterial color="#08111f" roughness={0.7} />
      </mesh>
      {/* wheels */}
      {[-1.25, -0.35, 0.75, 1.45].map((x) => (
        <group key={x} position={[x, 0.16, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.42]}>
            <cylinderGeometry args={[0.24, 0.24, 0.16, 14]} />
            <meshStandardMaterial color="#0a0f18" roughness={0.9} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.42]}>
            <cylinderGeometry args={[0.24, 0.24, 0.16, 14]} />
            <meshStandardMaterial color="#0a0f18" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

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
  position,
  color = "#1677ff",
  label,
}: {
  position: [number, number, number];
  color?: string;
  label?: string;
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
      {label ? (
        <group position={[0, 0.5, 0]}>
          {/* label billboard kept minimal to avoid font loading in WebGL */}
          <mesh position={[0, -0.06, 0]}>
            <boxGeometry args={[1.05, 0.16, 0.02]} />
            <meshBasicMaterial color="#08111f" transparent opacity={0.72} />
          </mesh>
        </group>
      ) : null}
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
      <mesh position={[0, 1.78, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[2.7, 0.14, 2.1]} />
        <meshStandardMaterial color="#1e4578" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* doors */}
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0.55, 0.92]}>
          <boxGeometry args={[0.7, 1.1, 0.02]} />
          <meshStandardMaterial color="#0b1f3a" roughness={0.8} />
        </mesh>
      ))}
      {/* dock light */}
      <mesh position={[0, 1.5, 0.95]}>
        <boxGeometry args={[0.14, 0.14, 0.02]} />
        <meshBasicMaterial color="#2ED3E6" />
      </mesh>
    </group>
  );
}

function Containers({ position }: { position: [number, number, number] }) {
  const stack = [
    { pos: [-1.35, 0.62, 1.1], color: "#1677ff" },
    { pos: [-0.45, 0.62, 1.1], color: "#ff8a3d" },
    { pos: [-0.45, 1.36, 1.1], color: "#2ed3e6" },
    { pos: [-1.35, 1.36, 1.1], color: "#e3efff" },
    { pos: [-0.9, 2.1, 1.1], color: "#1677ff" },
  ];
  return (
    <group position={position}>
      {stack.map((c, i) => (
        <mesh key={i} position={c.pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.82, 0.74, 1.3]} />
          <meshStandardMaterial color={c.color} metalness={0.35} roughness={0.45} />
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
          color: i % 3 === 0 ? "#2ed3e6" : "#1677ff",
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
      {/* floating nodes */}
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
      {/* center line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0.4]}>
        <planeGeometry args={[17, 0.02]} />
        <meshBasicMaterial color="#1e4578" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function Rig() {
  const reduced = useReducedMotion();
  useFrame(({ camera, pointer }, delta) => {
    if (reduced) return;
    const targetX = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.7, 0.04);
    const targetY = THREE.MathUtils.lerp(camera.position.y, 5.6 + pointer.y * 0.5, 0.04);
    camera.position.x = targetX;
    camera.position.y = targetY;
    camera.lookAt(0, 0.9, 0);
    void delta;
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
      <fog attach="fog" args={["#08111f", 14, 26]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 10, 6]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-5, 4, -4]} intensity={22} color="#1677ff" />
      <pointLight position={[5, 3, 4]} intensity={16} color="#2ed3e6" />

      <group position={[0, 0, -0.6]}>
        <RouteLane />
        <AnimatedRoute curve={curve} />
        <Truck curve={curve} />
        <HubPin position={[-6.2, 0, 3.4]} color="#2ed3e6" />
        <HubPin position={[6.4, 0, -2.6]} color="#ff8a3d" />
        <HubPin position={[1.6, 0, -0.9]} color="#1677ff" />
        <Warehouse position={[-4.6, 0, -1.6]} />
        <Containers position={[4.1, 0, 1.7]} />
        <DataLines />
      </group>

      <Rig />
    </Canvas>
  );
}
