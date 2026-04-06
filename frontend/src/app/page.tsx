"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { LandingScreen } from "@/components/LandingScreen";
import { TransmissionPanel } from "@/components/TransmissionPanel";

const MarsScene = dynamic(() => import("@/components/MarsScene"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-[#06060a] flex items-center justify-center">
      <p className="text-amber-400 glow-amber text-sm tracking-widest uppercase">
        Calibrating quantum relay...
      </p>
    </div>
  ),
});

type AppState = "landing" | "connecting" | "connected";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleAcceptTransmission = useCallback(() => {
    setAppState("connecting");
    setTimeout(() => {
      setAppState("connected");
    }, 3000);
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <MarsScene appState={appState} />

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
