"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function Mars({ appState }: { appState: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const atmosRef = useRef<THREE.Mesh>(null!);

  // Procedural Mars texture - no download needed
  const marsTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    // Base Mars color
    const gradient = ctx.createLinearGradient(0, 0, 1024, 512);
    gradient.addColorStop(0, "#c1440e");
    gradient.addColorStop(0.2, "#d4652a");
    gradient.addColorStop(0.4, "#b5451a");
    gradient.addColorStop(0.6, "#a33d15");
    gradient.addColorStop(0.8, "#d4652a");
    gradient.addColorStop(1, "#c1440e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);

    // Add surface detail noise
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

    // Add polar ice caps
    ctx.fillStyle = "rgba(220, 200, 180, 0.3)";
    ctx.fillRect(0, 0, 1024, 30);
    ctx.fillRect(0, 482, 1024, 30);

    // Add dark regions (like Syrtis Major)
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = `rgba(80, 40, 20, ${Math.random() * 0.3 + 0.1})`;
      ctx.beginPath();
      ctx.ellipse(
        Math.random() * 1024,
        200 + Math.random() * 100,
        Math.random() * 150 + 50,
        Math.random() * 80 + 30,
        Math.random() * Math.PI,
        0,
        Math.PI * 2
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

  const scale = appState === "connected" ? 1.8 : 2.5;
  const posX = appState === "connected" ? -3.5 : 0;

  return (
    <group position={[posX, 0, 0]}>
      {/* Mars sphere */}
      <mesh ref={meshRef} scale={scale}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={marsTexture}
          metalness={0.1}
          roughness={0.85}
        />
      </mesh>
      {/* Atmosphere glow */}
      <mesh ref={atmosRef} scale={scale * 1.02}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#ff6b35"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
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

    // Ocean base
    ctx.fillStyle = "#1a4b8c";
    ctx.fillRect(0, 0, 512, 256);

    // Land masses (simplified)
    ctx.fillStyle = "#2d7d46";
    const lands = [
      [100, 60, 80, 50], [200, 40, 60, 70], [300, 70, 90, 40],
      [350, 120, 70, 50], [140, 140, 50, 40], [400, 50, 40, 60],
    ];
    lands.forEach(([x, y, w, h]) => {
      ctx.beginPath();
      ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Polar caps
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
      <mesh ref={meshRef} position={[6, 2, -8]} scale={0.3}>
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
      {/* Body */}
      <mesh>
        <boxGeometry args={[0.08, 0.08, 0.15]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Solar panels */}
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

export default function MarsScene({ appState }: { appState: string }) {
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

        <Suspense fallback={null}>
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={0.5}
          />
          <Mars appState={appState} />
          <Earth />
          <Satellite />
          <Sparkles
            count={30}
            scale={12}
            size={1.5}
            speed={0.3}
            color="#f59e0b"
            opacity={0.3}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
