"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Float, Sparkles, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Camera that smoothly transitions between Mars and Earth views
function CameraController({ focus }: { focus: "mars" | "earth" | "idle" }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 7));

  useFrame((_, delta) => {
    if (focus === "earth") {
      // Pan toward Earth (right side)
      targetPos.current.set(4, 1, -2);
    } else if (focus === "mars") {
      // Pan toward Mars (left side, closer)
      targetPos.current.set(-3, 0, 4);
    } else {
      // Default wide view showing both
      targetPos.current.set(1, 0.5, 7);
    }

    camera.position.lerp(targetPos.current, delta * 1.5);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Mars() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const atmosRef = useRef<THREE.Mesh>(null!);

  const marsTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    const gradient = ctx.createLinearGradient(0, 0, 1024, 512);
    gradient.addColorStop(0, "#c1440e");
    gradient.addColorStop(0.2, "#d4652a");
    gradient.addColorStop(0.4, "#b5451a");
    gradient.addColorStop(0.6, "#a33d15");
    gradient.addColorStop(0.8, "#d4652a");
    gradient.addColorStop(1, "#c1440e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);

    for (let i = 0; i < 8000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const r = Math.random() * 6 + 1;
      const brightness = Math.random() * 40 - 20;
      const red = Math.min(255, Math.max(0, 180 + brightness));
      const green = Math.min(255, Math.max(0, 80 + brightness * 0.5));
      const blue = Math.min(255, Math.max(0, 30 + brightness * 0.3));
      ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${Math.random() * 0.4 + 0.1})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "rgba(220, 200, 180, 0.3)";
    ctx.fillRect(0, 0, 1024, 30);
    ctx.fillRect(0, 482, 1024, 30);

    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = `rgba(80, 40, 20, ${Math.random() * 0.3 + 0.1})`;
      ctx.beginPath();
      ctx.ellipse(
        Math.random() * 1024, 200 + Math.random() * 100,
        Math.random() * 150 + 50, Math.random() * 80 + 30,
        Math.random() * Math.PI, 0, Math.PI * 2
      );
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.06;
    if (atmosRef.current) atmosRef.current.rotation.y += delta * 0.04;
  });

  return (
    <group position={[-2, 0, 0]}>
      <mesh ref={meshRef} scale={2.2}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={marsTexture} metalness={0.1} roughness={0.85} />
      </mesh>
      <mesh ref={atmosRef} scale={2.24}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#ff6b35" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null!);

  const earthTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#1a4b8c";
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = "#2d7d46";
    [[100,60,80,50],[200,40,60,70],[300,70,90,40],[350,120,70,50],[140,140,50,40],[400,50,40,60]].forEach(([x,y,w,h]) => {
      ctx.beginPath();
      ctx.ellipse(x, y, w/2, h/2, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = "rgba(240, 240, 255, 0.7)";
    ctx.fillRect(0, 0, 512, 20);
    ctx.fillRect(0, 236, 512, 20);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.1;
  });

  return (
    <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} position={[5, 1.5, -6]} scale={0.8}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial map={earthTexture} metalness={0.1} roughness={0.7} />
      </mesh>
    </Float>
  );
}

function Satellite() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime() * 0.3;
    groupRef.current.position.x = Math.sin(t) * 4;
    groupRef.current.position.z = Math.cos(t) * 4;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.5 + 2;
    groupRef.current.rotation.y = t;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <boxGeometry args={[0.08, 0.08, 0.15]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.15, 0, 0]}>
        <boxGeometry args={[0.2, 0.01, 0.1]} />
        <meshStandardMaterial color="#2244aa" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[-0.15, 0, 0]}>
        <boxGeometry args={[0.2, 0.01, 0.1]} />
        <meshStandardMaterial color="#2244aa" metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
}

interface MarsSceneProps {
  appState: string;
  focus?: "mars" | "earth" | "idle";
}

export default function MarsScene({ appState, focus = "idle" }: MarsSceneProps) {
  return (
    <div className="fixed inset-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <color attach="background" args={["#06060a"]} />
        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 3, 5]} intensity={1.8} color="#fff5e6" />
        <pointLight position={[-5, -3, -5]} intensity={0.3} color="#ff6b35" />

        <CameraController focus={appState === "connected" ? focus : "idle"} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.3}
          dampingFactor={0.1}
          enableDamping
        />

        <Suspense fallback={null}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
          <Mars />
          <Earth />
          <Satellite />
          <Sparkles count={30} scale={12} size={1.5} speed={0.3} color="#f59e0b" opacity={0.3} />
        </Suspense>
      </Canvas>
    </div>
  );
}
