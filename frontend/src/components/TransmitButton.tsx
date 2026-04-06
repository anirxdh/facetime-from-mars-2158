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
      {/* Outer pulse rings when listening */}
      {isListening && (
        <>
          <div className="absolute -inset-4 rounded-full border border-amber-400/30 pulse-ring" />
          <div
            className="absolute -inset-4 rounded-full border border-amber-400/20 pulse-ring"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute -inset-4 rounded-full border border-amber-400/10 pulse-ring"
            style={{ animationDelay: "1s" }}
          />
        </>
      )}

      {/* Button circle */}
      <div
        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${
          isListening
            ? "bg-amber-400/20 border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)]"
            : isDisabled
              ? "bg-zinc-800/50 border-2 border-zinc-700"
              : "bg-zinc-800/80 border-2 border-zinc-600 hover:border-amber-400/50 hover:bg-amber-400/5"
        }`}
      >
        {/* Inner icon */}
        <div className="flex flex-col items-center gap-1">
          {/* Microphone icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={`transition-colors ${
              isListening ? "text-amber-400" : isDisabled ? "text-zinc-600" : "text-zinc-400"
            }`}
          >
            <path
              d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
              fill="currentColor"
            />
            <path
              d="M19 10v2a7 7 0 0 1-14 0v-2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="12"
              y1="19"
              x2="12"
              y2="23"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span
            className={`text-[8px] uppercase tracking-wider font-bold ${
              isListening ? "text-amber-400" : isDisabled ? "text-zinc-600" : "text-zinc-500"
            }`}
          >
            {isListening ? "Live" : "Hold"}
          </span>
        </div>
      </div>
    </button>
  );
}
