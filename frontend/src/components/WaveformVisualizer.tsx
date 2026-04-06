"use client";

import { useEffect, useRef } from "react";

interface WaveformVisualizerProps {
  isActive: boolean;
}

export function WaveformVisualizer({ isActive }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const bars = 40;
    const barWidth = canvas.width / bars;

    function draw() {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);

      for (let i = 0; i < bars; i++) {
        const height = isActive
          ? Math.random() * 30 + 4
          : 2;

        const x = i * barWidth;
        const y = (canvas!.height - height) / 2;

        // Gradient from green to amber
        const ratio = i / bars;
        const r = Math.round(34 + ratio * (245 - 34));
        const g = Math.round(197 + ratio * (158 - 197));
        const b = Math.round(94 + ratio * (11 - 94));

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
        ctx.fillRect(x + 1, y, barWidth - 2, height);
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [isActive]);

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-green-400 text-[10px] uppercase tracking-wider">
          Zeph
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={300}
        height={40}
        className="mx-3"
      />
      <div className="text-zinc-600 text-[10px] font-mono">
        AUDIO
      </div>
    </div>
  );
}
