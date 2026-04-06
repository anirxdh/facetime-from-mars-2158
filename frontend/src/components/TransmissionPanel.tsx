"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { WaveformVisualizer } from "./WaveformVisualizer";
import { TransmitButton } from "./TransmitButton";
import { SignalGlitch } from "./SignalGlitch";
import { TopicChips } from "./TopicChips";
import { MarsClock } from "./MarsClock";
import { AmbientSound } from "./AmbientSound";
import { EndCallSummary } from "./EndCallSummary";

interface Message {
  role: "user" | "zeph";
  text: string;
}

interface TransmissionPanelProps {
  sessionId: string | null;
  setSessionId: Dispatch<SetStateAction<string | null>>;
  onFocusChange?: (focus: "mars" | "earth" | "idle") => void;
  character?: string;
}

const API_BASE = "";

function playRadioBeep(ctx: AudioContext, type: "start" | "end") {
  const now = ctx.currentTime;
  const noiseLen = type === "start" ? 0.15 : 0.2;
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * noiseLen, ctx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) {
    noiseData[i] = (Math.random() * 2 - 1) * 0.15;
  }
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 2000;
  filter.Q.value = 1;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.3;
  noiseSource.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noiseSource.start(now);

  const osc = ctx.createOscillator();
  osc.frequency.value = type === "start" ? 1200 : 800;
  osc.type = "sine";
  const beepGain = ctx.createGain();
  beepGain.gain.setValueAtTime(0.08, now);
  beepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
  osc.connect(beepGain);
  beepGain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.15);
}

function playWithRadioEffect(ctx: AudioContext, audioBuffer: AudioBuffer, onEnded: () => void) {
  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 2500;
  bandpass.Q.value = 0.7;
  const waveshaper = ctx.createWaveShaper();
  const curve = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const x = (i / 128) - 1;
    curve[i] = (Math.PI + 3) * x / (Math.PI + 3 * Math.abs(x));
  }
  waveshaper.curve = curve;
  const gain = ctx.createGain();
  gain.gain.value = 1.2;
  source.connect(bandpass);
  bandpass.connect(waveshaper);
  waveshaper.connect(gain);
  gain.connect(ctx.destination);
  source.onended = onEnded;
  source.start();
}

export function TransmissionPanel({
  sessionId,
  setSessionId,
  onFocusChange,
  character = "zeph",
}: TransmissionPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [signalStatus, setSignalStatus] = useState("CONNECTED");
  const [showEndScreen, setShowEndScreen] = useState(false);
  const startTimeRef = useRef(new Date());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  function getAudioCtx() {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    return audioCtxRef.current;
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const introCalledRef = useRef(false);
  useEffect(() => {
    if (introCalledRef.current) return;
    introCalledRef.current = true;

    async function fetchIntro() {
      setIsProcessing(true);
      setSignalStatus("RECEIVING");
      try {
        const res = await fetch(`${API_BASE}/api/intro?character=${character}`);
        const newSessionId = res.headers.get("X-Session-Id");
        const zephText = res.headers.get("X-Zeph-Text");
        if (newSessionId) setSessionId(newSessionId);
        if (res.headers.get("content-type")?.includes("audio")) {
          const blob = await res.blob();
          const decoded = zephText ? decodeURIComponent(zephText) : null;
          if (decoded) setMessages([{ role: "zeph", text: decoded }]);
          await playAudioWithEffects(blob);
        } else {
          const data = await res.json();
          setMessages([{ role: "zeph", text: data.text }]);
          if (data.session_id) setSessionId(data.session_id);
        }
      } catch {
        setMessages([{ role: "zeph", text: "Yo! I'm Zeph, from Mars! Can you hear me?" }]);
      }
      setIsProcessing(false);
      setSignalStatus("CONNECTED");
      onFocusChange?.("idle");
    }
    fetchIntro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playAudioWithEffects = useCallback(async (blob: Blob) => {
    setIsPlaying(true);
    onFocusChange?.("mars");
    try {
      const ctx = getAudioCtx();
      if (ctx.state === "suspended") await ctx.resume();
      playRadioBeep(ctx, "start");
      await new Promise((r) => setTimeout(r, 200));
      const arrayBuf = await blob.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuf);
      await new Promise<void>((resolve) => {
        playWithRadioEffect(ctx, audioBuffer, () => {
          playRadioBeep(ctx, "end");
          setTimeout(() => { setIsPlaying(false); onFocusChange?.("idle"); resolve(); }, 250);
        });
      });
    } catch {
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => { setIsPlaying(false); onFocusChange?.("idle"); URL.revokeObjectURL(url); };
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [onFocusChange]);

  const startListening = useCallback(() => {
    if (isProcessing || isPlaying) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Speech recognition not supported. Try Chrome."); return; }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) transcript += event.results[i][0].transcript;
      setCurrentTranscript(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setCurrentTranscript("");
    setSignalStatus("TRANSMITTING");
    onFocusChange?.("earth");
  }, [isProcessing, isPlaying, onFocusChange]);

  const sendMessage = useCallback(async (text: string) => {
    setMessages((prev) => [...prev, { role: "user", text }]);
    setIsProcessing(true);
    setSignalStatus("SIGNAL IN TRANSIT");
    onFocusChange?.("idle");
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, session_id: sessionId, character }),
      });
      const newSessionId = res.headers.get("X-Session-Id");
      const zephText = res.headers.get("X-Zeph-Text");
      if (newSessionId) setSessionId(newSessionId);
      if (res.headers.get("content-type")?.includes("audio")) {
        const blob = await res.blob();
        if (zephText) {
          try { setMessages((prev) => [...prev, { role: "zeph", text: decodeURIComponent(zephText) }]); }
          catch { setMessages((prev) => [...prev, { role: "zeph", text: zephText }]); }
        }
        setSignalStatus("RECEIVING");
        await playAudioWithEffects(blob);
      } else {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "zeph", text: data.text }]);
        if (data.session_id) setSessionId(data.session_id);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "zeph", text: "...signal dropped. Say that again?" }]);
    }
    setIsProcessing(false);
    setSignalStatus("CONNECTED");
  }, [sessionId, setSessionId, playAudioWithEffects, onFocusChange]);

  const stopListening = useCallback(async () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
    const text = currentTranscript.trim();
    if (!text) { setSignalStatus("CONNECTED"); onFocusChange?.("idle"); return; }
    setCurrentTranscript("");
    await sendMessage(text);
  }, [currentTranscript, sendMessage, onFocusChange]);

  const showTopics = !isListening && !isProcessing && !isPlaying;

  if (showEndScreen) {
    return (
      <EndCallSummary
        messages={messages}
        startTime={startTimeRef.current}
        onClose={() => window.location.reload()}
      />
    );
  }

  const charName = character === "chef_riku" ? "Chef Riku" : character === "dr_nova" ? "Dr. Nova" : "Zeph";

  return (
    <div className="h-full flex flex-col justify-end p-4 md:p-6 noise">
      <SignalGlitch active={!isProcessing} />

      {/* Top HUD bar */}
      <div className="absolute top-0 left-0 right-0 z-20 px-5 py-3 flex items-center justify-between"
        style={{ background: "linear-gradient(180deg, rgba(5,5,8,0.95) 0%, rgba(5,5,8,0.6) 70%, transparent 100%)" }}>
        {/* Left: status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${
              isProcessing ? "bg-[var(--amber)] animate-pulse"
                : isPlaying ? "bg-[var(--mars)] animate-pulse"
                : "bg-[var(--amber)]"
            }`} />
            <span className="text-[var(--amber)]/50 text-[9px] tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-display)" }}>
              {signalStatus}
            </span>
          </div>
          <AmbientSound />
        </div>
        {/* Right: info + controls */}
        <div className="flex items-center gap-3">
          <MarsClock />
          <div className="w-px h-3 bg-white/10" />
          <span className="text-[var(--amber)]/60 text-[9px] tracking-wider uppercase" style={{ fontFamily: "var(--font-display)" }}>
            {charName}
          </span>
          <div className="w-px h-3 bg-white/10" />
          <button
            type="button"
            onClick={() => setShowEndScreen(true)}
            className="text-red-400/40 hover:text-red-400 text-[9px] tracking-wider uppercase transition-colors cursor-pointer"
            style={{ fontFamily: "var(--font-display)" }}
          >
            End
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div className="w-full max-w-lg mx-auto mb-4 max-h-[55vh] overflow-y-auto rounded-2xl p-5 panel panel-glow relative scanlines">
        {messages.length === 0 && (
          <div className="text-[var(--text-dim)] text-xs text-center py-10 tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-display)" }}>
            Awaiting transmission...
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`mb-5 fade-in ${msg.role === "user" ? "text-right" : "text-left"}`}>
            <div className={`text-[8px] mb-2 uppercase tracking-[0.25em] ${
              msg.role === "user" ? "text-[var(--earth-blue)]/40" : "text-[var(--amber)]/40"
            }`} style={{ fontFamily: "var(--font-display)" }}>
              {msg.role === "user" ? "Earth → Mars" : `${charName} → Earth`}
            </div>
            <div className={`inline-block max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
              msg.role === "user"
                ? "rounded-br-md"
                : "rounded-bl-md"
            }`} style={{
              background: msg.role === "user" ? "rgba(74,144,217,0.08)" : "rgba(232,160,52,0.06)",
              border: `1px solid ${msg.role === "user" ? "rgba(74,144,217,0.12)" : "rgba(232,160,52,0.1)"}`,
              color: msg.role === "user" ? "#a8c8e8" : "#d4b483",
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {isListening && currentTranscript && (
          <div className="mb-5 text-right fade-in">
            <div className="text-[8px] text-[var(--earth-blue)]/40 mb-2 uppercase tracking-[0.25em]" style={{ fontFamily: "var(--font-display)" }}>
              Transmitting...
            </div>
            <div className="inline-block max-w-[85%] px-4 py-3 rounded-2xl rounded-br-md text-[13px]"
              style={{ background: "rgba(74,144,217,0.04)", border: "1px solid rgba(74,144,217,0.08)", color: "#a8c8e8" }}>
              {currentTranscript}<span className="blink">|</span>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="mb-5 text-left fade-in">
            <div className="text-[8px] text-[var(--amber)]/40 mb-2 uppercase tracking-[0.25em]" style={{ fontFamily: "var(--font-display)" }}>
              Signal in transit
            </div>
            <div className="inline-flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{ background: "rgba(232,160,52,0.04)", border: "1px solid rgba(232,160,52,0.08)" }}>
              <div className="signal-travel text-[var(--amber)] text-xs">&#x2022; &#x2022; &#x2022;</div>
              <span className="text-[var(--text-dim)] text-[9px] font-mono">225M km</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Topic chips */}
      {showTopics && (
        <div className="w-full max-w-lg mx-auto mb-3">
          <TopicChips onSelect={sendMessage} />
        </div>
      )}

      {/* Controls */}
      <div className="w-full max-w-lg mx-auto">
        {isPlaying && (
          <div className="mb-4">
            <WaveformVisualizer isActive={isPlaying} />
          </div>
        )}

        <div className="flex items-center justify-center">
          <TransmitButton
            isListening={isListening}
            isDisabled={isProcessing || isPlaying}
            onStart={startListening}
            onStop={stopListening}
          />
        </div>

        <div className="mt-3 text-center text-[9px] tracking-[0.2em] uppercase"
          style={{
            fontFamily: "var(--font-display)",
            color: isListening ? "var(--earth-blue)" : isPlaying ? "var(--mars)" : "var(--text-dim)",
          }}>
          {isListening ? "Release to send"
            : isProcessing ? "Signal traveling to Mars..."
            : isPlaying ? `${charName} is speaking...`
            : "Hold to transmit"}
        </div>
      </div>
    </div>
  );
}
