"use client";

import { useState, useEffect } from "react";

interface LandingScreenProps {
  onAccept: () => void;
}

export function LandingScreen({ onAccept }: LandingScreenProps) {
  const [showButton, setShowButton] = useState(false);
  const [signalStrength, setSignalStrength] = useState(0);

  useEffect(() => {
    // Simulate signal detection
    const interval = setInterval(() => {
      setSignalStrength((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowButton(true);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center max-w-lg px-6 fade-in">
        {/* Header */}
        <div className="mb-2 text-zinc-600 text-[10px] tracking-[0.5em] uppercase font-mono">
          Quantum Relay Network v4.2
        </div>

        {/* Incoming signal */}
        <div className="mb-8">
          <div className="text-amber-400 glow-amber text-lg tracking-[0.2em] uppercase font-bold mb-3">
            Incoming Transmission
          </div>
          <div className="text-zinc-400 text-xs tracking-widest uppercase">
            Origin: Mars Colony One, Dome 7
          </div>
          <div className="text-zinc-500 text-[10px] mt-1 font-mono">
            Sol 6,847 &bull; 14.6°S, 175.5°E &bull; Year 2058
          </div>
        </div>

        {/* Signal strength bar */}
        <div className="mb-8 mx-auto max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-zinc-500 text-[10px] uppercase tracking-wider">
              Signal Lock
            </span>
            <span className="text-amber-400 text-[10px] font-mono">
              {Math.min(100, Math.round(signalStrength))}%
            </span>
          </div>
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-200"
              style={{ width: `${Math.min(100, signalStrength)}%` }}
            />
          </div>
        </div>

        {/* Accept button */}
        {showButton && (
          <div className="fade-in">
            <button
              onClick={onAccept}
              className="relative group cursor-pointer"
            >
              {/* Pulse rings */}
              <div className="absolute inset-0 rounded-full border border-amber-400/30 pulse-ring" />
              <div
                className="absolute inset-0 rounded-full border border-amber-400/20 pulse-ring"
                style={{ animationDelay: "0.5s" }}
              />

              {/* Button */}
              <div className="relative px-8 py-3 rounded-full border border-amber-400/50 bg-amber-400/5 hover:bg-amber-400/15 transition-all duration-300">
                <span className="text-amber-400 glow-amber text-sm tracking-[0.2em] uppercase font-bold">
                  Accept Transmission
                </span>
              </div>
            </button>

            <div className="mt-6 text-zinc-600 text-[10px] tracking-wider">
              Microphone access required for two-way communication
            </div>
          </div>
        )}

        {/* Bottom info */}
        <div className="mt-12 flex items-center justify-center gap-6 text-zinc-700 text-[9px] uppercase tracking-widest">
          <span>Encrypted</span>
          <span>&bull;</span>
          <span>Low Latency</span>
          <span>&bull;</span>
          <span>225M km</span>
        </div>
      </div>
    </div>
  );
}
