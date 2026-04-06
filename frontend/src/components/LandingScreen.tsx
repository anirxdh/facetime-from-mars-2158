"use client";

import { useState, useEffect, useRef } from "react";

interface LandingScreenProps {
  onAccept: () => void;
}

function useTypewriter(text: string, speed = 50, delay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          setDone(true);
          clearInterval(interval);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayed, done };
}

export function LandingScreen({ onAccept }: LandingScreenProps) {
  const [showButton, setShowButton] = useState(false);
  const [signalStrength, setSignalStrength] = useState(0);
  const [phase, setPhase] = useState(0); // 0=boot, 1=scanning, 2=locked, 3=ready
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Boot sequence typewriter
  const boot1 = useTypewriter("INITIALIZING QUANTUM RELAY NETWORK...", 30, 300);
  const boot2 = useTypewriter("SCANNING DEEP SPACE FREQUENCIES...", 30, 1800);
  const boot3 = useTypewriter("ANOMALY DETECTED — SIGNAL SOURCE: MARS", 30, 3300);

  // Phase progression
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1500),
      setTimeout(() => setPhase(2), 4500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Signal strength ramp after phase 2
  useEffect(() => {
    if (phase < 2) return;
    const interval = setInterval(() => {
      setSignalStrength((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowButton(true);
          setPhase(3);
          return 100;
        }
        return prev + Math.random() * 8 + 3;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [phase]);

  // Play a subtle beep on signal lock
  const playBeep = () => {
    try {
      const ctx = audioCtxRef.current || new AudioContext();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.05;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.stop(ctx.currentTime + 0.3);
    } catch {}
  };

  useEffect(() => {
    if (showButton) playBeep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showButton]);

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center max-w-xl px-6">
        {/* Terminal boot sequence */}
        <div className="mb-8 text-left mx-auto max-w-md space-y-1">
          <div className="text-green-400/70 text-[11px] font-mono tracking-wider">
            {boot1.displayed}
            {!boot1.done && <span className="blink">_</span>}
          </div>
          {boot1.done && (
            <div className="text-green-400/70 text-[11px] font-mono tracking-wider">
              {boot2.displayed}
              {!boot2.done && <span className="blink">_</span>}
            </div>
          )}
          {boot2.done && (
            <div className="text-amber-400 text-[11px] font-mono tracking-wider font-bold">
              {boot3.displayed}
              {!boot3.done && <span className="blink">_</span>}
            </div>
          )}
        </div>

        {/* Main content - fades in after boot */}
        {phase >= 2 && (
          <div className="fade-in">
            {/* Header badge */}
            <div className="inline-block mb-4 px-3 py-1 rounded-full border border-amber-400/20 bg-amber-400/5">
              <span className="text-amber-400/60 text-[9px] tracking-[0.5em] uppercase font-mono">
                Quantum Relay Network v4.2
              </span>
            </div>

            {/* Main title */}
            <div className="mb-2">
              <h1 className="text-amber-400 glow-amber text-3xl md:text-4xl tracking-[0.15em] uppercase font-bold">
                Incoming
              </h1>
              <h1 className="text-amber-400 glow-amber text-3xl md:text-4xl tracking-[0.15em] uppercase font-bold">
                Transmission
              </h1>
            </div>

            {/* Divider line */}
            <div className="mx-auto w-32 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mb-4" />

            {/* Origin info */}
            <div className="mb-2 text-zinc-300 text-sm tracking-[0.15em] uppercase">
              Origin: Mars Colony One, Dome 7
            </div>
            <div className="mb-8 flex items-center justify-center gap-3 text-zinc-500 text-[10px] font-mono">
              <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900/50">
                Sol 6,847
              </span>
              <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900/50">
                14.6°S, 175.5°E
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
                  className={`h-full rounded-full transition-all duration-200 ${
                    signalStrength >= 100
                      ? "bg-gradient-to-r from-green-400 to-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                      : "bg-gradient-to-r from-amber-500 to-amber-400"
                  }`}
                  style={{ width: `${Math.min(100, signalStrength)}%` }}
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
                  <div className="relative px-10 py-3.5 rounded-full border border-green-400/60 bg-green-400/10 hover:bg-green-400/20 transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:shadow-[0_0_30px_rgba(34,197,94,0.25)]">
                    <div className="flex items-center gap-3">
                      {/* Phone icon */}
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-green-400"
                      >
                        <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
                      </svg>
                      <span className="text-green-400 glow-green text-sm tracking-[0.2em] uppercase font-bold">
                        Accept Transmission
                      </span>
                    </div>
                  </div>
                </button>

                <div className="mt-4 text-zinc-600 text-[10px] tracking-wider flex items-center justify-center gap-1.5">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-zinc-600"
                  >
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                    <path d="M19 10v2a7 7 0 01-14 0v-2" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                  Microphone access required for two-way communication
                </div>
              </div>
            )}

            {/* Bottom info */}
            <div className="mt-10 flex items-center justify-center gap-4 text-zinc-700 text-[9px] uppercase tracking-[0.3em]">
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-green-400/40" />
                <span>Encrypted</span>
              </div>
              <span className="text-zinc-800">|</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-amber-400/40" />
                <span>Quantum Link</span>
              </div>
              <span className="text-zinc-800">|</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-blue-400/40" />
                <span>225M km</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
