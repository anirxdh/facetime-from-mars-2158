"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { LandingScreen } from "@/components/LandingScreen";
import { TransmissionPanel } from "@/components/TransmissionPanel";

const MarsScene = dynamic(() => import("@/components/MarsScene"), {
  ssr: false,
  loading: () => null, // Don't block UI while 3D loads
});

type AppState = "landing" | "connecting" | "connected";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [show3D, setShow3D] = useState(false);

  // Delay 3D scene to let UI render first
  useEffect(() => {
    const timer = setTimeout(() => setShow3D(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAcceptTransmission = useCallback(() => {
    setAppState("connecting");
    setTimeout(() => {
      setAppState("connected");
    }, 3000);
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#06060a]">
      {/* 3D background - loads independently, never blocks UI */}
      {show3D && (
        <div className="fixed inset-0 z-0">
          <MarsScene appState={appState} />
        </div>
      )}

      {/* Stars fallback if 3D hasn't loaded */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.2,
              animation: `blink ${2 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite`,
            }}
          />
        ))}
      </div>

      {/* UI layer - always visible */}
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
