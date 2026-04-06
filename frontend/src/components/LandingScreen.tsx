"use client";

import { useState } from "react";

interface LandingScreenProps {
  onAccept: (character: string) => void;
}

const characters = [
  {
    id: "zeph",
    avatar: "Z",
    color: "#e8a034",
    name: "Zeph",
    role: "Colony Kid",
    age: 16,
    detail: "Never visited Earth",
    quote: "Yo, is anyone picking up?",
  },
  {
    id: "chef_riku",
    avatar: "R",
    color: "#e85d4a",
    name: "Chef Riku",
    role: "Food Designer",
    age: 34,
    detail: "2nd gen Mars-born",
    quote: "Tell me what you ate today!",
  },
  {
    id: "dr_nova",
    avatar: "N",
    color: "#9b7ae8",
    name: "Dr. Nova",
    role: "Terraforming Chief",
    age: 41,
    detail: "Mars-born pioneer",
    quote: "5 min before the dust storm.",
  },
] as const;

export function LandingScreen({ onAccept }: LandingScreenProps) {
  const [selected, setSelected] = useState("zeph");
  const char = characters.find((c) => c.id === selected)!;

  return (
    <div className="h-full flex flex-col items-center justify-center px-4 py-8 noise">
      <style>{`
        @keyframes bar-fill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes reveal-up {
          0%, 70% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--mars)]/20 to-transparent" />

      {/* Header cluster */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-[var(--amber)]/10 bg-[var(--amber)]/5">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--amber)]" style={{ animation: "glow-pulse 2s ease-in-out infinite" }} />
          <span className="text-[var(--amber)]/60 text-[10px] tracking-[0.5em] uppercase" style={{ fontFamily: "var(--font-display)" }}>
            Quantum Relay v4.2
          </span>
        </div>

        <h1
          className="text-5xl md:text-7xl font-black uppercase tracking-wider leading-[0.9] mb-4"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--amber)",
            textShadow: "0 0 60px rgba(232,160,52,0.25), 0 0 120px rgba(193,68,14,0.15)",
          }}
        >
          Signal<br />From Mars
        </h1>

        <p className="text-[var(--text-dim)] text-xs tracking-[0.3em] uppercase">
          Mars Colony One &middot; Dome 7 &middot; Year 2158
        </p>
      </div>

      {/* Signal acquisition bar */}
      <div className="w-full max-w-md mb-10">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[var(--amber)]/50 text-[9px] tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-display)" }}>
            Signal Lock
          </span>
          <span className="text-[var(--amber)]/30 text-[9px] font-mono">225M KM</span>
        </div>
        <div className="h-[3px] bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, var(--mars), var(--amber))",
              animation: "bar-fill 2.5s ease-out forwards",
              boxShadow: "0 0 8px var(--mars-glow)",
            }}
          />
        </div>
      </div>

      {/* Character selector — the star of the show */}
      <div
        className="w-full max-w-2xl mb-8"
        style={{ animation: "reveal-up 3.2s ease-out forwards", opacity: 0 }}
      >
        <p className="text-center text-[var(--text-dim)] text-[9px] tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "var(--font-display)" }}>
          Choose your contact
        </p>

        <div className="grid grid-cols-3 gap-3">
          {characters.map((c) => {
            const active = selected === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(c.id)}
                className="relative text-left rounded-xl p-4 transition-all duration-300 cursor-pointer group"
                style={{
                  background: active
                    ? `linear-gradient(135deg, ${c.color}10 0%, ${c.color}05 100%)`
                    : "rgba(255,255,255,0.02)",
                  border: `1px solid ${active ? c.color + "40" : "rgba(255,255,255,0.04)"}`,
                  boxShadow: active ? `0 0 30px ${c.color}15, inset 0 0 30px ${c.color}08` : "none",
                  opacity: active ? 1 : 0.45,
                  transform: active ? "scale(1)" : "scale(0.97)",
                }}
              >
                {/* Active indicator dot */}
                {active && (
                  <div
                    className="absolute top-3 right-3 w-2 h-2 rounded-full"
                    style={{ background: c.color, boxShadow: `0 0 8px ${c.color}` }}
                  />
                )}

                {/* Avatar */}
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center text-black font-bold text-sm mb-3"
                  style={{
                    background: `linear-gradient(135deg, ${c.color}, ${c.color}99)`,
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {c.avatar}
                </div>

                {/* Info */}
                <div className="text-white text-sm font-bold mb-0.5" style={{ fontFamily: "var(--font-display)" }}>
                  {c.name}
                </div>
                <div className="text-[10px] mb-2" style={{ color: c.color + "90" }}>
                  {c.role} &middot; {c.age}
                </div>
                <div className="text-[var(--text-dim)] text-[10px] leading-relaxed">
                  {c.detail}
                </div>

                {/* Quote */}
                <div className="mt-3 pt-3 border-t" style={{ borderColor: active ? c.color + "15" : "rgba(255,255,255,0.03)" }}>
                  <p className="text-[11px] italic" style={{ color: active ? c.color + "80" : "var(--text-dim)" }}>
                    &ldquo;{c.quote}&rdquo;
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Call button */}
      <div
        style={{ animation: "reveal-up 3.6s ease-out forwards", opacity: 0 }}
        className="text-center"
      >
        <button
          type="button"
          onClick={() => onAccept(selected)}
          className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: `linear-gradient(135deg, ${char.color}15, ${char.color}08)`,
            border: `2px solid ${char.color}50`,
            boxShadow: `0 0 30px ${char.color}15`,
          }}
        >
          {/* Phone icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: char.color }}>
            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
          </svg>
          <span
            className="text-sm tracking-[0.2em] uppercase font-bold"
            style={{ color: char.color, fontFamily: "var(--font-display)", textShadow: `0 0 20px ${char.color}40` }}
          >
            Call {char.name}
          </span>
        </button>

        <p className="mt-4 text-[var(--text-dim)] text-[9px] tracking-[0.2em] uppercase">
          Microphone required &middot; Encrypted channel
        </p>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--mars)]/10 to-transparent" />
    </div>
  );
}
