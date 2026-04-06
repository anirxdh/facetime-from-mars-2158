"use client";

import { useState } from "react";

interface LandingScreenProps {
  onAccept: (character: string) => void;
}

const characters = [
  {
    id: "zeph",
    image: "/Zeph.png",
    color: "#e8a034",
    name: "Zeph",
    role: "Colony Kid, 16",
  },
  {
    id: "chef_riku",
    image: "/foodengineer.jpg",
    color: "#e85d4a",
    name: "Chef Riku",
    role: "Food Designer, 34",
  },
  {
    id: "dr_nova",
    image: "/Drnova.png",
    color: "#9b7ae8",
    name: "Dr. Nova",
    role: "Terraforming Chief, 41",
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

      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--mars)]/20 to-transparent" />

      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-[var(--amber)]/10 bg-[var(--amber)]/5">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--amber)]" style={{ animation: "glow-pulse 2s ease-in-out infinite" }} />
          <span className="text-[var(--amber)]/60 text-[10px] tracking-[0.5em] uppercase" style={{ fontFamily: "var(--font-display)" }}>
            Quantum Relay v4.2
          </span>
        </div>

        <h1
          className="text-4xl md:text-6xl font-bold uppercase tracking-wider leading-[0.9] mb-3"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--amber)",
            textShadow: "0 0 60px rgba(232,160,52,0.25), 0 0 120px rgba(193,68,14,0.15)",
          }}
        >
          FaceTime From Mars
        </h1>

        <p className="text-[var(--text-dim)] text-xs tracking-[0.3em] uppercase">
          Mars Colony One &middot; Year 2158
        </p>
      </div>

      {/* Signal bar */}
      <div className="w-full max-w-sm mb-8">
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

      {/* Character cards */}
      <div
        className="w-full max-w-2xl mb-8"
        style={{ animation: "reveal-up 3s ease-out forwards", opacity: 0 }}
      >
        <div className="grid grid-cols-3 gap-4">
          {characters.map((c) => {
            const active = selected === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(c.id)}
                className="text-left rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
                style={{
                  background: "#0c0a08",
                  border: `2px solid ${active ? c.color + "60" : "rgba(255,255,255,0.06)"}`,
                  boxShadow: active ? `0 4px 30px ${c.color}20, 0 0 0 1px ${c.color}15` : "none",
                  opacity: active ? 1 : 0.5,
                  transform: active ? "scale(1)" : "scale(0.96)",
                }}
              >
                {/* Image */}
                <div className="w-full aspect-square overflow-hidden bg-[#080604]">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover transition-transform duration-500"
                    style={{ transform: active ? "scale(1.05)" : "scale(1)" }}
                  />
                </div>

                {/* Info bar */}
                <div className="px-4 py-3 bg-white">
                  <div className="text-black text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
                    {c.name}
                  </div>
                  <div className="text-black/50 text-[10px] mt-0.5">
                    {c.role}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Call button */}
      <div style={{ animation: "reveal-up 3.4s ease-out forwards", opacity: 0 }}>
        <button
          type="button"
          onClick={() => onAccept(selected)}
          className="inline-flex items-center gap-3 px-10 py-4 rounded-full cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: `linear-gradient(135deg, ${char.color}15, ${char.color}08)`,
            border: `2px solid ${char.color}50`,
            boxShadow: `0 0 30px ${char.color}15`,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: char.color }}>
            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
          </svg>
          <span
            className="text-sm tracking-[0.2em] uppercase font-bold"
            style={{ color: char.color, fontFamily: "var(--font-display)" }}
          >
            Call {char.name}
          </span>
        </button>

        <p className="mt-4 text-center text-[var(--text-dim)] text-[9px] tracking-[0.2em] uppercase">
          Microphone required
        </p>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--mars)]/10 to-transparent" />
    </div>
  );
}
