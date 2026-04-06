"use client";

interface TransmitButtonProps {
  isListening: boolean;
  isDisabled: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function TransmitButton({
  isListening,
  isDisabled,
  onStart,
  onStop,
}: TransmitButtonProps) {
  return (
    <button
      onMouseDown={isDisabled ? undefined : onStart}
      onMouseUp={isListening ? onStop : undefined}
      onMouseLeave={isListening ? onStop : undefined}
      onTouchStart={isDisabled ? undefined : onStart}
      onTouchEnd={isListening ? onStop : undefined}
      disabled={isDisabled}
      className="relative group cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
    >
      {/* Pulse rings when listening */}
      {isListening && (
        <>
          <div className="absolute -inset-4 rounded-full border border-orange-400/30 pulse-ring pointer-events-none" />
          <div className="absolute -inset-4 rounded-full border border-orange-400/20 pulse-ring pointer-events-none" style={{ animationDelay: "0.5s" }} />
          <div className="absolute -inset-4 rounded-full border border-orange-400/10 pulse-ring pointer-events-none" style={{ animationDelay: "1s" }} />
        </>
      )}

      {/* Button */}
      <div className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${
        isListening
          ? "border-2 border-orange-400"
          : isDisabled
            ? "border-2 border-zinc-700 bg-zinc-800/50"
            : "border-2 border-orange-400/30 hover:border-orange-400/60"
      }`}
        style={{
          background: isListening
            ? "radial-gradient(circle, rgba(193,68,14,0.3) 0%, rgba(193,68,14,0.1) 100%)"
            : isDisabled
              ? undefined
              : "radial-gradient(circle, rgba(193,68,14,0.1) 0%, rgba(10,10,15,0.8) 100%)",
          boxShadow: isListening ? "0 0 30px rgba(193,68,14,0.3), inset 0 0 20px rgba(193,68,14,0.1)" : "none",
        }}>
        <div className="flex flex-col items-center gap-1">
          <svg
            width="24" height="24" viewBox="0 0 24 24" fill="none"
            className={`transition-colors ${
              isListening ? "text-orange-400" : isDisabled ? "text-zinc-600" : "text-orange-400/60"
            }`}
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="currentColor" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className={`text-[8px] uppercase tracking-wider font-bold ${
            isListening ? "text-orange-400" : isDisabled ? "text-zinc-600" : "text-orange-400/50"
          }`}>
            {isListening ? "Live" : "Hold"}
          </span>
        </div>
      </div>
    </button>
  );
}
