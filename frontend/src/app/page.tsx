"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { LandingScreen } from "@/components/LandingScreen";
import { TransmissionPanel } from "@/components/TransmissionPanel";

const MarsScene = dynamic(() => import("@/components/MarsScene"), {
  ssr: false,
  loading: () => null,
});

type AppState = "landing" | "connecting" | "connected";

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl") || canvas.getContext("webgl2") || canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [canRender3D, setCanRender3D] = useState(false);

  useEffect(() => {
    setCanRender3D(hasWebGL());
  }, []);

  const handleAcceptTransmission = useCallback(() => {
    setAppState("connecting");
    setTimeout(() => {
      setAppState("connected");
    }, 3000);
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#06060a]">
      {/* 3D background - only if WebGL available */}
      {canRender3D && (
        <div className="fixed inset-0 z-0">
          <MarsScene appState={appState} />
        </div>
      )}

      {/* CSS stars fallback - always visible */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() > 0.9 ? 2 : 1}px`,
              height: `${Math.random() > 0.9 ? 2 : 1}px`,
              top: `${(i * 7.3 + i * i * 0.13) % 100}%`,
              left: `${(i * 11.7 + i * i * 0.17) % 100}%`,
              opacity: (i % 5 + 2) / 10,
              animation: `blink ${3 + (i % 4)}s ease-in-out ${(i % 7) * 0.5}s infinite`,
            }}
          />
        ))}
      </div>

      {/* UI layer */}
      <div className="relative z-10 h-full w-full">
        {appState === "landing" && (
          <LandingScreen onAccept={handleAcceptTransmission} />
        )}

        {appState === "connecting" && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center fade-in">
              <div className="mb-6 text-amber-400 glow-amber text-xs tracking-[0.3em] uppercase">
                Establishing quantum relay
              </div>
              <div className="flex items-center justify-center gap-2 mb-6">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-1 bg-amber-400 rounded-full"
                    style={{
                      height: "4px",
                      animation: `waveform 0.8s ease-in-out ${i * 0.15}s infinite`,
                    }}
                  />
                ))}
              </div>
              <div className="text-zinc-600 text-xs font-mono">
                Signal distance: 225 million km
              </div>
            </div>
          </div>
        )}

        {appState === "connected" && (
          <TransmissionPanel
            sessionId={sessionId}
            setSessionId={setSessionId}
          />
        )}
      </div>
    </main>
  );
}
