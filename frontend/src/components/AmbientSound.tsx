"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Procedural ambient space sound using Web Audio API.
 * - Low-frequency drone (60-80 Hz) with slow LFO modulation
 * - Occasional high-pitched blips every 5-10 seconds
 * - Very quiet (master volume 0.03)
 * - No audio files needed
 */

const MASTER_VOLUME = 0.03;
const DRONE_FREQ_BASE = 70;
const DRONE_FREQ_DETUNE = 63; // second oscillator slightly detuned
const LFO_RATE = 0.08; // slow oscillation in Hz
const LFO_DEPTH = 10; // frequency deviation in Hz
const BLIP_MIN_INTERVAL = 5000; // ms
const BLIP_MAX_INTERVAL = 10000; // ms
const BLIP_FREQ_MIN = 2200;
const BLIP_FREQ_MAX = 4800;

export function AmbientSound() {
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const blipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const scheduleBlip = useCallback(() => {
    const ctx = ctxRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain) return;

    const delay =
      BLIP_MIN_INTERVAL +
      Math.random() * (BLIP_MAX_INTERVAL - BLIP_MIN_INTERVAL);

    blipTimeoutRef.current = setTimeout(() => {
      if (!ctx || ctx.state === "closed") return;

      const now = ctx.currentTime;
      const freq =
        BLIP_FREQ_MIN + Math.random() * (BLIP_FREQ_MAX - BLIP_FREQ_MIN);
      const duration = 0.06 + Math.random() * 0.1;

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.4 + Math.random() * 0.3, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // Slight stereo pan for spatial feel
      const pan = ctx.createStereoPanner();
      pan.pan.value = Math.random() * 2 - 1;

      osc.connect(gain);
      gain.connect(pan);
      pan.connect(masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.01);

      scheduleBlip();
    }, delay);
  }, []);

  const startAudio = useCallback(() => {
    if (ctxRef.current) return;

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    // Master gain (controls mute and overall volume)
    const masterGain = ctx.createGain();
    masterGain.gain.value = MASTER_VOLUME;
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // --- Drone layer 1: base frequency ---
    const drone1 = ctx.createOscillator();
    drone1.type = "sawtooth";
    drone1.frequency.value = DRONE_FREQ_BASE;

    // --- Drone layer 2: slightly detuned for thickness ---
    const drone2 = ctx.createOscillator();
    drone2.type = "sawtooth";
    drone2.frequency.value = DRONE_FREQ_DETUNE;

    // --- LFO to modulate drone frequencies ---
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = LFO_RATE;

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = LFO_DEPTH;

    lfo.connect(lfoGain);
    lfoGain.connect(drone1.frequency);
    lfoGain.connect(drone2.frequency);

    // --- Low-pass filter to keep the drone muffled ---
    const lpf = ctx.createBiquadFilter();
    lpf.type = "lowpass";
    lpf.frequency.value = 120;
    lpf.Q.value = 1;

    // --- Drone mix gain ---
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.5;

    drone1.connect(lpf);
    drone2.connect(lpf);
    lpf.connect(droneGain);
    droneGain.connect(masterGain);

    // --- Sub bass layer: pure sine very low ---
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.value = 45;

    const subGain = ctx.createGain();
    subGain.gain.value = 0.6;

    sub.connect(subGain);
    subGain.connect(masterGain);

    // Start all oscillators
    const now = ctx.currentTime;
    drone1.start(now);
    drone2.start(now);
    lfo.start(now);
    sub.start(now);

    // Start blip scheduler
    scheduleBlip();

    // Store cleanup function
    cleanupRef.current = () => {
      if (blipTimeoutRef.current) clearTimeout(blipTimeoutRef.current);
      drone1.stop();
      drone2.stop();
      lfo.stop();
      sub.stop();
      ctx.close();
      ctxRef.current = null;
      masterGainRef.current = null;
    };

    setStarted(true);
    setMuted(false);
  }, [scheduleBlip]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (blipTimeoutRef.current) clearTimeout(blipTimeoutRef.current);
      if (ctxRef.current && ctxRef.current.state !== "closed") {
        ctxRef.current.close();
      }
    };
  }, []);

  // Handle mute/unmute by adjusting master gain
  useEffect(() => {
    const masterGain = masterGainRef.current;
    const ctx = ctxRef.current;
    if (!masterGain || !ctx) return;

    if (muted) {
      masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
    } else {
      masterGain.gain.linearRampToValueAtTime(
        MASTER_VOLUME,
        ctx.currentTime + 0.3
      );
    }
  }, [muted]);

  const handleToggle = () => {
    if (!started) {
      // First click — need user gesture to create AudioContext
      startAudio();
    } else {
      setMuted((prev) => !prev);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={muted || !started ? "Enable ambient sound" : "Mute ambient sound"}
      className="flex items-center justify-center w-7 h-7 rounded-md transition-colors"
      style={{
        background: "rgba(193, 68, 14, 0.08)",
        border: "1px solid rgba(193, 68, 14, 0.15)",
      }}
    >
      {muted || !started ? (
        // Muted icon — speaker with X
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-zinc-600"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        // Unmuted icon — speaker with waves
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-orange-400/70"
        >
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  );
}
