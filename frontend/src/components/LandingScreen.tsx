"use client";

import { useState, useEffect, useRef } from "react";

interface LandingScreenProps {
  onAccept: () => void;
}

export function LandingScreen({ onAccept }: LandingScreenProps) {
  const [showButton, setShowButton] = useState(false);
  const [signalStrength, setSignalStrength] = useState(0);
  const strengthRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      strengthRef.current += Math.random() * 12 + 5;
      if (strengthRef.current >= 100) {
        strengthRef.current = 100;
        setSignalStrength(100);
        setShowButton(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        setSignalStrength(Math.round(strengthRef.current));
      }
    }, 120);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center max-w-xl px-6 fade-in">
        {/* Header badge */}
        <div className="inline-block mb-5 px-3 py-1 rounded-full border border-amber-400/20 bg-amber-400/5">
          <span className="text-amber-400/60 text-[9px] tracking-[0.5em] uppercase font-mono">
            Quantum Relay Network v4.2
          </span>
        </div>

        {/* Main title */}
        <div className="mb-3">
          <h1 className="text-amber-400 text-3xl md:text-5xl tracking-[0.15em] uppercase font-bold"
            style={{ textShadow: "0 0 30px rgba(245,158,11,0.4), 0 0 60px rgba(245,158,11,0.2)" }}>
            Incoming
          </h1>
          <h1 className="text-amber-400 text-3xl md:text-5xl tracking-[0.15em] uppercase font-bold"
            style={{ textShadow: "0 0 30px rgba(245,158,11,0.4), 0 0 60px rgba(245,158,11,0.2)" }}>
            Transmission
          </h1>
        </div>

        {/* Divider */}
        <div className="mx-auto w-40 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mb-5" />

        {/* Origin info */}
        <div className="mb-2 text-zinc-300 text-sm tracking-[0.15em] uppercase">
          Origin: Mars Colony One, Dome 7
        </div>
        <div className="mb-8 flex items-center justify-center gap-3 text-zinc-500 text-[10px] font-mono flex-wrap">
          <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900/50">
            Sol 6,847
          </span>
          <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900/50">
            14.6&deg;S, 175.5&deg;E
          </span>
          <span className="px-2 py-0.5 rounded border border-amber-400/20 bg-amber-400/5 text-amber-400/80">
            Year 2158
          </span>
        </div>

        {/* Signal strength bar */}
        <div className="mb-8 mx-auto max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  signalStrength >= 100
                    ? "bg-green-400"
                    : "bg-amber-400 animate-pulse"
                }`}
              />
              <span className="text-zinc-400 text-[10px] uppercase tracking-wider">
                {signalStrength >= 100 ? "Signal Locked" : "Acquiring Signal"}
              </span>
            </div>
            <span
              className={`text-[10px] font-mono font-bold ${
                signalStrength >= 100 ? "text-green-400" : "text-amber-400"
              }`}
            >
              {Math.min(100, Math.round(signalStrength))}%
            </span>
          </div>
          <div className="h-1.5 bg-zinc-800/80 rounded-full overflow-hidden border border-zinc-700/50">
            <div
              className={`h-full rounded-full transition-all duration-150 ${
                signalStrength >= 100
                  ? "bg-gradient-to-r from-green-400 to-green-500"
                  : "bg-gradient-to-r from-amber-500 to-amber-400"
              }`}
              style={{
                width: `${Math.min(100, signalStrength)}%`,
                boxShadow: signalStrength >= 100 ? "0 0 10px rgba(34,197,94,0.3)" : "none",
              }}
            />
          </div>
        </div>

        {/* Caller info card */}
        {showButton && (
          <div className="fade-in mb-6 mx-auto max-w-xs">
            <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/60 backdrop-blur-sm p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-bold text-sm">
                  Z
                </div>
                <div className="text-left">
                  <div className="text-zinc-200 text-sm font-bold">Zeph</div>
                  <div className="text-zinc-500 text-[10px]">
                    Mars-born, 16 &bull; Never been to Earth
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <div className="w-1 h-3 bg-green-400 rounded-full" />
                  <div className="w-1 h-4 bg-green-400 rounded-full" />
                  <div className="w-1 h-5 bg-green-400 rounded-full" />
                  <div className="w-1 h-3 bg-green-400 rounded-full" />
                </div>
              </div>
              <div className="text-zinc-400 text-xs italic leading-relaxed">
                &quot;Yo, is anyone on Earth picking up? This quantum relay
                thing is actually working!&quot;
              </div>
            </div>
          </div>
        )}

        {/* Accept button */}
        {showButton && (
          <div className="fade-in">
            <button
              onClick={onAccept}
              className="relative group cursor-pointer"
            >
              {/* Pulse rings */}
              <div className="absolute -inset-3 rounded-full border border-green-400/20 pulse-ring" />
              <div
                className="absolute -inset-3 rounded-full border border-green-400/15 pulse-ring"
                style={{ animationDelay: "0.5s" }}
              />

              {/* Button */}
              <div className="relative px-10 py-3.5 rounded-full border border-green-400/60 bg-green-400/10 hover:bg-green-400/20 transition-all duration-300"
                style={{ boxShadow: "0 0 20px rgba(34,197,94,0.15)" }}>
                <div className="flex items-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-green-400">
                    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
                  </svg>
                  <span className="text-green-400 text-sm tracking-[0.2em] uppercase font-bold"
                    style={{ textShadow: "0 0 10px rgba(34,197,94,0.5)" }}>
                    Accept Transmission
                  </span>
                </div>
              </div>
            </button>

            <div className="mt-4 text-zinc-600 text-[10px] tracking-wider">
              Microphone access required for two-way communication
            </div>
          </div>
        )}

        {/* Bottom info */}
        <div className="mt-10 flex items-center justify-center gap-4 text-zinc-600 text-[9px] uppercase tracking-[0.3em]">
          <span>Encrypted</span>
          <span className="text-zinc-800">|</span>
          <span>Quantum Link</span>
          <span className="text-zinc-800">|</span>
          <span>225M km</span>
        </div>
      </div>
    </div>
  );
}
