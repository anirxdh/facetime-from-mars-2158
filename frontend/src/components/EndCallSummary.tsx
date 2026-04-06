"use client";

import { useMemo } from "react";

interface Message {
  role: "user" | "zeph";
  text: string;
}

interface EndCallSummaryProps {
  messages: Message[];
  onClose: () => void;
  startTime: Date;
}

export function EndCallSummary({ messages, onClose, startTime }: EndCallSummaryProps) {
  const duration = useMemo(() => {
    const diffMs = Date.now() - startTime.getTime();
    const totalSec = Math.max(0, Math.floor(diffMs / 1000));
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return { min, sec };
  }, [startTime]);

  const userCount = messages.filter((m) => m.role === "user").length;
  const zephMessages = messages.filter((m) => m.role === "zeph");
  const zephCount = zephMessages.length;

  const highlights = zephMessages
    .slice(0, 3)
    .map((m) => (m.text.length > 50 ? m.text.slice(0, 50) + "..." : m.text));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        background: "rgba(5, 3, 2, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 md:p-8"
        style={{
          background: "linear-gradient(145deg, rgba(20, 12, 6, 0.95) 0%, rgba(12, 8, 4, 0.95) 100%)",
          border: "1px solid rgba(193, 68, 14, 0.25)",
          boxShadow:
            "0 0 60px rgba(193, 68, 14, 0.08), inset 0 0 40px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block mb-3 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10">
            <span className="text-red-400/80 text-[10px] tracking-[0.3em] uppercase font-mono">
              Signal Lost
            </span>
          </div>
          <h2
            className="text-amber-400 text-2xl md:text-3xl font-bold uppercase tracking-wider"
            style={{ textShadow: "0 0 30px rgba(245, 158, 11, 0.25)" }}
          >
            Transmission Ended
          </h2>
          <div className="mx-auto w-32 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent mt-4" />
        </div>

        {/* Stats */}
        <div className="space-y-3 mb-6">
          {/* Duration */}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{
              background: "rgba(245, 158, 11, 0.04)",
              border: "1px solid rgba(245, 158, 11, 0.1)",
            }}
          >
            <span className="text-zinc-500 text-xs font-mono uppercase tracking-wider">
              Duration
            </span>
            <span className="text-amber-300 text-sm font-mono">
              {duration.min} min {duration.sec} sec
            </span>
          </div>

          {/* Messages exchanged */}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{
              background: "rgba(245, 158, 11, 0.04)",
              border: "1px solid rgba(245, 158, 11, 0.1)",
            }}
          >
            <span className="text-zinc-500 text-xs font-mono uppercase tracking-wider">
              Transmissions
            </span>
            <span className="text-amber-300 text-sm font-mono">
              {userCount} sent, {zephCount} received
            </span>
          </div>

          {/* Distance */}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{
              background: "rgba(245, 158, 11, 0.04)",
              border: "1px solid rgba(245, 158, 11, 0.1)",
            }}
          >
            <span className="text-zinc-500 text-xs font-mono uppercase tracking-wider">
              Signal Traveled
            </span>
            <span className="text-amber-300 text-sm font-mono">
              ~450M km total
            </span>
          </div>
        </div>

        {/* Highlights */}
        {highlights.length > 0 && (
          <div className="mb-8">
            <div className="text-orange-400/50 text-[10px] uppercase tracking-[0.2em] font-mono mb-3">
              Transmission Highlights
            </div>
            <div className="space-y-2">
              {highlights.map((text, i) => (
                <div
                  key={i}
                  className="px-4 py-2.5 rounded-xl text-sm text-orange-200/70 leading-relaxed"
                  style={{
                    background: "rgba(193, 68, 14, 0.06)",
                    border: "1px solid rgba(193, 68, 14, 0.12)",
                  }}
                >
                  <span className="text-orange-400/40 mr-2 font-mono text-xs">ZEPH:</span>
                  &ldquo;{text}&rdquo;
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Transmission button */}
        <div className="text-center">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center cursor-pointer gap-3 px-8 py-3.5 rounded-full border-2 border-orange-400/50 bg-orange-400/10 hover:bg-orange-400/20 active:bg-orange-400/30 active:scale-95 transition-all duration-200"
            style={{
              boxShadow:
                "0 0 25px rgba(193, 68, 14, 0.15), inset 0 0 25px rgba(193, 68, 14, 0.05)",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-orange-400"
            >
              <path d="M1 4v6h6" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            <span
              className="text-orange-400 text-sm tracking-[0.15em] uppercase font-bold"
              style={{ textShadow: "0 0 12px rgba(193, 68, 14, 0.5)" }}
            >
              New Transmission
            </span>
          </button>

          <p className="mt-4 text-zinc-700 text-[9px] uppercase tracking-[0.3em] font-mono">
            Mars Colony One will be listening
          </p>
        </div>
      </div>
    </div>
  );
}
