"use client";

interface LandingScreenProps {
  onAccept: () => void;
}

export function LandingScreen({ onAccept }: LandingScreenProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <style>{`
        @keyframes fill-bar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes reveal {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes dot-green {
          0%, 90% { background-color: #f59e0b; }
          100% { background-color: #22c55e; }
        }
        @keyframes text-swap-color {
          0%, 90% { color: #a1a1aa; }
          100% { color: #22c55e; }
        }
        @keyframes bar-color {
          0%, 90% { background: linear-gradient(to right, #f97316, #f59e0b); }
          100% { background: linear-gradient(to right, #22c55e, #4ade80); }
        }
        .signal-bar-fill {
          animation: fill-bar 2.3s ease-out forwards, bar-color 2.5s ease-out forwards;
        }
        .signal-dot {
          animation: dot-green 2.5s ease-out forwards;
        }
        .signal-label {
          animation: text-swap-color 2.5s ease-out forwards;
        }
        .reveal-after-signal {
          opacity: 0;
          animation: reveal 0.6s ease-out 2.6s forwards;
        }
      `}</style>

      <div className="text-center max-w-xl px-6 fade-in">
        {/* Header badge */}
        <div className="inline-block mb-5 px-3 py-1 rounded-full border border-amber-400/20 bg-amber-400/5">
          <span className="text-amber-400/60 text-[9px] tracking-[0.5em] uppercase font-mono">
            Quantum Relay Network v4.2
          </span>
        </div>

        {/* Main title */}
        <div className="mb-3">
          <h1
            className="text-amber-400 text-3xl md:text-5xl tracking-[0.15em] uppercase font-bold"
            style={{ textShadow: "0 0 30px rgba(245,158,11,0.4), 0 0 60px rgba(245,158,11,0.2)" }}
          >
            Incoming
          </h1>
          <h1
            className="text-amber-400 text-3xl md:text-5xl tracking-[0.15em] uppercase font-bold"
            style={{ textShadow: "0 0 30px rgba(245,158,11,0.4), 0 0 60px rgba(245,158,11,0.2)" }}
          >
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
          <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900/50">Sol 6,847</span>
          <span className="px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900/50">14.6&deg;S, 175.5&deg;E</span>
          <span className="px-2 py-0.5 rounded border border-amber-400/20 bg-amber-400/5 text-amber-400/80">Year 2158</span>
        </div>

        {/* Signal strength bar */}
        <div className="mb-8 mx-auto max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full signal-dot" />
              <span className="text-[10px] uppercase tracking-wider signal-label">
                Acquiring Signal
              </span>
            </div>
          </div>
          <div className="h-1.5 bg-zinc-800/80 rounded-full overflow-hidden border border-zinc-700/50">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 signal-bar-fill" />
          </div>
        </div>

        {/* Everything below reveals after signal locks — pure CSS delay, no JS */}

        {/* Caller info card */}
        <div className="reveal-after-signal mb-6 mx-auto max-w-xs">
          <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/60 backdrop-blur-sm p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-black font-bold text-sm">
                Z
              </div>
              <div className="text-left">
                <div className="text-zinc-200 text-sm font-bold">Zeph</div>
                <div className="text-zinc-500 text-[10px]">Mars-born, 16 &bull; Never been to Earth</div>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <div className="w-1 h-3 bg-green-400 rounded-full" />
                <div className="w-1 h-4 bg-green-400 rounded-full" />
                <div className="w-1 h-5 bg-green-400 rounded-full" />
                <div className="w-1 h-3 bg-green-400 rounded-full" />
              </div>
            </div>
            <div className="text-zinc-400 text-xs italic leading-relaxed">
              &quot;Yo, is anyone on Earth picking up? This quantum relay thing is actually working!&quot;
            </div>
          </div>
        </div>

        {/* Accept button */}
        <div className="reveal-after-signal">
          <button onClick={onAccept} className="relative group cursor-pointer">
            <div className="absolute -inset-3 rounded-full border border-green-400/20 pulse-ring" />
            <div className="absolute -inset-3 rounded-full border border-green-400/15 pulse-ring" style={{ animationDelay: "0.5s" }} />
            <div
              className="relative px-10 py-3.5 rounded-full border border-green-400/60 bg-green-400/10 hover:bg-green-400/20 transition-all duration-300"
              style={{ boxShadow: "0 0 20px rgba(34,197,94,0.15)" }}
            >
              <div className="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-green-400">
                  <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
                </svg>
                <span className="text-green-400 text-sm tracking-[0.2em] uppercase font-bold" style={{ textShadow: "0 0 10px rgba(34,197,94,0.5)" }}>
                  Accept Transmission
                </span>
              </div>
            </div>
          </button>
          <div className="mt-4 text-zinc-600 text-[10px] tracking-wider">
            Microphone access required for two-way communication
          </div>
        </div>

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
