"use client";

import { useState } from "react";

interface LandingScreenProps {
  onAccept: (character: string) => void;
}

const characters = [
  {
    id: "zeph",
    avatar: "Z",
    gradient: "from-amber-400 to-orange-600",
    name: "Zeph",
    subtitle: "Mars-born \u2022 Age 16 \u2022 Never visited Earth",
    quote: "Yo, is anyone picking up?",
  },
  {
    id: "chef_riku",
    avatar: "R",
    gradient: "from-red-400 to-rose-600",
    name: "Chef Riku",
    subtitle: "Food Designer \u2022 Age 34 \u2022 2nd gen Mars-born",
    quote: "Tell me what you ate today!",
  },
  {
    id: "dr_nova",
    avatar: "N",
    gradient: "from-violet-400 to-purple-600",
    name: "Dr. Nova",
    subtitle: "Terraforming Chief \u2022 Age 41 \u2022 Mars-born",
    quote: "5 minutes before the dust storm hits.",
  },
] as const;

export function LandingScreen({ onAccept }: LandingScreenProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string>("zeph");

  const selectedData = characters.find((c) => c.id === selectedCharacter)!;
  const buttonLabel = `Call ${selectedData.name}`;

  return (
    <div className="flex h-full items-center justify-center px-4">
      <style>{`
        @keyframes fill-signal {
          0% { width: 0%; }
          100% { width: 100%; box-shadow: 0 0 12px rgba(245,158,11,0.4); }
        }
        @keyframes appear {
          0%, 80% { opacity: 0; transform: translateY(12px); pointer-events: none; }
          100% { opacity: 1; transform: translateY(0); pointer-events: auto; }
        }
        @keyframes dot-pulse {
          0%, 85% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>

      <div className="text-center w-full max-w-2xl">
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
          <span className="px-2.5 py-1 rounded-md border border-zinc-700/60 bg-zinc-800/40 text-zinc-400">Sol 6,847</span>
          <span className="px-2.5 py-1 rounded-md border border-zinc-700/60 bg-zinc-800/40 text-zinc-400">14.6&deg;S, 175.5&deg;E</span>
          <span className="px-2.5 py-1 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-400 font-bold">Year 2158</span>
        </div>

        {/* Signal bar */}
        <div className="mx-auto max-w-sm mb-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400" style={{ animation: "dot-pulse 3s ease-out forwards" }} />
              <span className="text-amber-400/70 text-[10px] uppercase tracking-widest">
                Acquiring Signal
              </span>
            </div>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/40">
            <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400" style={{ animation: "fill-signal 3s ease-out forwards" }} />
          </div>
        </div>

        {/* Cards and button */}
        <div style={{ animation: "appear 3.5s ease-out forwards", opacity: 0 }}>
          {/* Character cards — horizontal scrollable row */}
          <div className="mb-8 -mx-4 px-4">
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide justify-center">
              {characters.map((char) => {
                const isSelected = selectedCharacter === char.id;
                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => setSelectedCharacter(char.id)}
                    className={`
                      flex-shrink-0 w-56 rounded-2xl border backdrop-blur p-5 text-left
                      transition-all duration-200 cursor-pointer snap-center
                      ${
                        isSelected
                          ? "border-orange-400/60 bg-zinc-900/80"
                          : "border-zinc-700/30 bg-zinc-900/40 opacity-50 hover:opacity-75"
                      }
                    `}
                    style={
                      isSelected
                        ? { boxShadow: "0 0 20px rgba(251,146,60,0.15), 0 0 40px rgba(251,146,60,0.05)" }
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${char.gradient} flex items-center justify-center text-black font-bold text-sm shrink-0`}
                      >
                        {char.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="text-white text-sm font-bold">{char.name}</div>
                        <div className="text-zinc-500 text-[10px] leading-tight">{char.subtitle}</div>
                      </div>
                    </div>
                    <p className="text-zinc-400 text-xs italic leading-relaxed">
                      &quot;{char.quote}&quot;
                    </p>
                    {isSelected && (
                      <div className="flex items-end gap-0.5 mt-3">
                        <div className="w-1 h-2 bg-orange-400 rounded-sm" />
                        <div className="w-1 h-3 bg-orange-400 rounded-sm" />
                        <div className="w-1 h-4 bg-amber-400 rounded-sm" />
                        <div className="w-1 h-5 bg-amber-400 rounded-sm" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accept button */}
          <button
            type="button"
            onClick={() => { onAccept(selectedCharacter); }}
            className="inline-flex items-center justify-center cursor-pointer gap-3 px-10 py-4 rounded-full border-2 border-orange-400/50 bg-orange-400/10 hover:bg-orange-400/20 active:bg-orange-400/30 active:scale-95 transition-all duration-200"
            style={{ boxShadow: "0 0 25px rgba(193,68,14,0.15), inset 0 0 25px rgba(193,68,14,0.05)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-orange-400">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
            </svg>
            <span className="text-orange-400 text-base tracking-[0.15em] uppercase font-bold"
              style={{ textShadow: "0 0 12px rgba(193,68,14,0.5)" }}>
              {buttonLabel}
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
