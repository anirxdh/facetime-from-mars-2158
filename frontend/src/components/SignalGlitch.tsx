"use client";

import { useState, useEffect, useRef } from "react";

interface SignalGlitchProps {
  /** Only glitch when active (i.e. connected state) */
  active: boolean;
}

export function SignalGlitch({ active }: SignalGlitchProps) {
  const [glitching, setGlitching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) {
      setGlitching(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    function scheduleGlitch() {
      const delay = 15000 + Math.random() * 15000; // 15-30 seconds
      timerRef.current = setTimeout(() => {
        setGlitching(true);
        setTimeout(() => {
          setGlitching(false);
          scheduleGlitch();
        }, 200);
      }, delay);
    }

    scheduleGlitch();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active]);

  if (!glitching) return null;

  return (
    <div className="signal-glitch-overlay" aria-hidden="true">
      <div className="signal-glitch-scanlines" />
      <div className="signal-glitch-color-shift" />
    </div>
  );
}
