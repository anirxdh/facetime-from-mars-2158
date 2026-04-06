"use client";

interface LandingScreenProps {
  onAccept: () => void;
}

export function LandingScreen({ onAccept }: LandingScreenProps) {
  return (
    <div className="flex h-full items-center justify-center px-4">
      <style>{`
        @keyframes fill-signal {
          0% { width: 0%; background: linear-gradient(90deg, #f97316, #f59e0b); }
          85% { width: 95%; background: linear-gradient(90deg, #f97316, #f59e0b); }
          100% { width: 100%; background: linear-gradient(90deg, #22c55e, #4ade80); box-shadow: 0 0 12px rgba(34,197,94,0.4); }
        }
        @keyframes appear {
          0%, 80% { opacity: 0; transform: translateY(12px); pointer-events: none; }
          100% { opacity: 1; transform: translateY(0); pointer-events: auto; }
        }
        @keyframes dot-change {
          0%, 85% { background: #f59e0b; }
          100% { background: #22c55e; }
        }
        @keyframes label-change {
          0%, 85% { opacity: 1; }
          86% { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes label-appear {
          0%, 85% { opacity: 0; }
          86% { opacity: 1; }
          100% { opacity: 1; }
        }
      `}</style>

      <div className="text-center w-full max-w-md">
        {/* Network badge */}
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5">
          <span className="text-amber-500/70 text-[10px] tracking-[0.4em] uppercase">
            Quantum Relay Network v4.2
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-amber-400 text-4xl md:text-6xl font-bold uppercase tracking-wider leading-tight mb-2"
          style={{ textShadow: "0 0 40px rgba(245,158,11,0.3), 0 0 80px rgba(245,158,11,0.15)" }}
        >
          Incoming<br />Transmission
        </h1>

        {/* Divider */}
        <div className="mx-auto w-48 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent my-6" />

        {/* Origin */}
        <p className="text-zinc-300 text-sm tracking-widest uppercase mb-3">
          Origin: Mars Colony One, Dome 7
        </p>
        <div className="flex items-center justify-center gap-2 text-[10px] font-mono mb-10 flex-wrap">
          <span className="px-2.5 py-1 rounded-md border border-zinc-700/60 bg-zinc-800/40 text-zinc-400">
            Sol 6,847
          </span>
          <span className="px-2.5 py-1 rounded-md border border-zinc-700/60 bg-zinc-800/40 text-zinc-400">
            14.6&deg;S, 175.5&deg;E
          </span>
          <span className="px-2.5 py-1 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-400 font-bold">
            Year 2158
          </span>
        </div>

        {/* Signal bar with CSS-only animation */}
        <div className="mx-auto max-w-sm mb-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ animation: "dot-change 3s ease-out forwards" }} />
              <span className="text-zinc-400 text-[10px] uppercase tracking-widest relative">
                <span style={{ animation: "label-change 3s ease-out forwards" }}>Acquiring Signal</span>
                <span className="absolute left-0 text-green-400" style={{ animation: "label-appear 3s ease-out forwards", opacity: 0 }}>Signal Locked</span>
              </span>
            </div>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/40">
            <div className="h-full rounded-full" style={{ animation: "fill-signal 3s ease-out forwards" }} />
          </div>
        </div>

        {/* Card and button — CSS appear animation with 3s delay, always in DOM */}
        <div style={{ animation: "appear 3.5s ease-out forwards", opacity: 0 }}>
          {/* Caller card */}
          <div className="mx-auto max-w-sm mb-8">
            <div className="rounded-2xl border border-zinc-700/40 bg-zinc-900/70 backdrop-blur p-5 text-left">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-black font-bold text-lg shrink-0">
                  Z
                </div>
                <div className="min-w-0">
                  <div className="text-white text-base font-bold">Zeph</div>
                  <div className="text-zinc-500 text-xs">Mars-born &bull; Age 16 &bull; Never visited Earth</div>
                </div>
                <div className="ml-auto flex items-end gap-0.5 shrink-0">
                  <div className="w-1 h-2 bg-green-400 rounded-sm" />
                  <div className="w-1 h-3 bg-green-400 rounded-sm" />
                  <div className="w-1 h-4 bg-green-400 rounded-sm" />
                  <div className="w-1 h-5 bg-green-400 rounded-sm" />
                </div>
              </div>
              <p className="text-zinc-400 text-sm italic leading-relaxed">
                &quot;Yo, is anyone on Earth picking up? This quantum relay thing is actually working!&quot;
              </p>
            </div>
          </div>

          {/* Accept button */}
          <button
            type="button"
            onClick={() => { onAccept(); }}
            className="inline-flex items-center justify-center cursor-pointer gap-3 px-10 py-4 rounded-full border-2 border-green-400/50 bg-green-400/10 hover:bg-green-400/20 active:bg-green-400/30 active:scale-95 transition-all duration-200"
            style={{ boxShadow: "0 0 25px rgba(34,197,94,0.15), inset 0 0 25px rgba(34,197,94,0.05)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-green-400">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
            </svg>
            <span className="text-green-400 text-base tracking-[0.15em] uppercase font-bold"
              style={{ textShadow: "0 0 12px rgba(34,197,94,0.5)" }}>
              Accept Transmission
            </span>
          </button>

          <p className="mt-5 text-zinc-600 text-[10px] tracking-widest uppercase">
            Microphone access required
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 flex items-center justify-center gap-5 text-zinc-700 text-[9px] uppercase tracking-[0.3em]">
          <span>Encrypted</span>
          <span className="text-zinc-800">&bull;</span>
          <span>Quantum Link</span>
          <span className="text-zinc-800">&bull;</span>
          <span>225M km</span>
        </div>
      </div>
    </div>
  );
}
