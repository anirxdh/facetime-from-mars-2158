"use client";

import { useState, useEffect } from "react";

/**
 * Mars time reference:
 * A Mars solar day (sol) is 24h 39m 35.244s = 88,775.244 Earth seconds.
 * We pick an arbitrary epoch: 2000-01-06 00:00:00 UTC as Sol 0, 00:00:00 MST.
 * (This is a simplified version of Mars Sol Date for the hackathon narrative.)
 */

const MARS_SOL_SECONDS = 88_775.244;
const MARS_EPOCH_MS = Date.UTC(2000, 0, 6, 0, 0, 0); // Jan 6 2000 UTC

interface MarsTime {
  sol: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getMarsTime(now: Date): MarsTime {
  const elapsedMs = now.getTime() - MARS_EPOCH_MS;
  const elapsedMarsSeconds = elapsedMs / 1000;
  const totalSols = elapsedMarsSeconds / MARS_SOL_SECONDS;

  const sol = Math.floor(totalSols);
  const fractionalSol = totalSols - sol;

  // A Mars sol has 24 Mars-hours, each 61.65 Mars-seconds longer than Earth hours,
  // but we display in familiar 24h format where 1 Mars-hour = sol/24
  const marsSecondsInDay = fractionalSol * MARS_SOL_SECONDS;
  const marsHour = Math.floor(marsSecondsInDay / 3698.9685); // 88775.244 / 24
  const remaining = marsSecondsInDay - marsHour * 3698.9685;
  const marsMinute = Math.floor(remaining / 61.6494475); // 3698.9685 / 60
  const marsSecond = Math.floor(remaining - marsMinute * 61.6494475);

  return {
    sol,
    hours: marsHour,
    minutes: marsMinute,
    seconds: marsSecond,
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function MarsClock() {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const utcH = pad(now.getUTCHours());
  const utcM = pad(now.getUTCMinutes());
  const utcS = pad(now.getUTCSeconds());

  const mars = getMarsTime(now);
  const marsH = pad(mars.hours);
  const marsMin = pad(mars.minutes);
  const marsS = pad(mars.seconds);

  return (
    <div
      className="font-mono text-[9px] leading-tight tracking-wider select-none"
      style={{ letterSpacing: "0.08em" }}
    >
      <div className="text-zinc-500">
        EARTH{" "}
        <span className="text-zinc-400">
          {utcH}:{utcM}:{utcS} UTC
        </span>
      </div>
      <div className="text-orange-400/60">
        MARS{" "}
        <span className="text-orange-300/80">
          Sol {mars.sol}
        </span>
        <span className="text-orange-400/40"> {"\u2022"} </span>
        <span className="text-orange-300/80">
          {marsH}:{marsMin}:{marsS} MST
        </span>
      </div>
    </div>
  );
}
