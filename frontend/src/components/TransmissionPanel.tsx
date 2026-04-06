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

interface Message {
  role: "user" | "zeph";
  text: string;
}

interface TransmissionPanelProps {
  sessionId: string | null;
  setSessionId: Dispatch<SetStateAction<string | null>>;
}

const API_BASE = "";

export function TransmissionPanel({
  sessionId,
  setSessionId,
}: TransmissionPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [signalStatus, setSignalStatus] = useState("CONNECTED");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch intro on mount
  useEffect(() => {
    async function fetchIntro() {
      setIsProcessing(true);
      setSignalStatus("RECEIVING");
      try {
        const res = await fetch(`${API_BASE}/api/intro`);
        const newSessionId = res.headers.get("X-Session-Id");
        const zephText = res.headers.get("X-Zeph-Text");

        if (newSessionId) setSessionId(newSessionId);

        if (res.headers.get("content-type")?.includes("audio")) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const decoded = zephText ? decodeURIComponent(zephText) : null;
          playAudio(url);
          if (decoded) {
            setMessages([{ role: "zeph", text: decoded }]);
          }
        } else {
          const data = await res.json();
          setMessages([{ role: "zeph", text: data.text }]);
          if (data.session_id) setSessionId(data.session_id);
        }
      } catch {
        setMessages([
          {
            role: "zeph",
            text: "Yo! Is this thing working? I'm Zeph, calling from Mars! Can you hear me? This quantum relay is so sol!",
          },
        ]);
      }
      setIsProcessing(false);
      setSignalStatus("CONNECTED");
    }

    fetchIntro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playAudio = useCallback((url: string) => {
    setIsPlaying(true);
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => {
      setIsPlaying(false);
      URL.revokeObjectURL(url);
    };
    audio.onerror = () => {
      setIsPlaying(false);
    };
    audio.play().catch(() => setIsPlaying(false));
  }, []);

  const startListening = useCallback(() => {
    if (isProcessing || isPlaying) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser. Try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setCurrentTranscript(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setCurrentTranscript("");
    setSignalStatus("TRANSMITTING");
  }, [isProcessing, isPlaying]);

  const stopListening = useCallback(async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);

    const text = currentTranscript.trim();
    if (!text) {
      setSignalStatus("CONNECTED");
      return;
    }

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text }]);
    setCurrentTranscript("");
    setIsProcessing(true);
    setSignalStatus("SIGNAL IN TRANSIT");

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, session_id: sessionId }),
      });

      const newSessionId = res.headers.get("X-Session-Id");
      const zephText = res.headers.get("X-Zeph-Text");
      if (newSessionId) setSessionId(newSessionId);

      if (res.headers.get("content-type")?.includes("audio")) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        if (zephText) {
          try {
            setMessages((prev) => [
              ...prev,
              { role: "zeph", text: decodeURIComponent(zephText) },
            ]);
          } catch {
            setMessages((prev) => [
              ...prev,
              { role: "zeph", text: zephText },
            ]);
          }
        }
        setSignalStatus("RECEIVING");
        playAudio(url);
      } else {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "zeph", text: data.text }]);
        if (data.session_id) setSessionId(data.session_id);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "zeph",
          text: "*static* ...signal dropped for a sec. Say that again?",
        },
      ]);
    }

    setIsProcessing(false);
    setSignalStatus("CONNECTED");
  }, [currentTranscript, sessionId, setSessionId, playAudio]);

  return (
    <div className="h-full flex flex-col items-end justify-end p-4 md:p-8">
      {/* Top bar — signal info */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-2 h-2 rounded-full ${
              isProcessing
                ? "bg-amber-400 animate-pulse"
                : isPlaying
                  ? "bg-green-400 animate-pulse"
                  : "bg-green-400"
            }`}
          />
          <span className="text-zinc-500 text-[10px] tracking-[0.3em] uppercase font-mono">
            {signalStatus}
          </span>
        </div>
        <div className="text-zinc-600 text-[10px] font-mono tracking-wider">
          MARS COLONY ONE &bull; DOME 7
        </div>
      </div>

      {/* Chat area */}
      <div className="w-full max-w-md ml-auto mb-4 max-h-[50vh] overflow-y-auto rounded-lg bg-black/40 backdrop-blur-md border border-zinc-800/50 p-4 scanlines">
        {messages.length === 0 && (
          <div className="text-zinc-600 text-xs text-center py-8 tracking-wider">
            Awaiting transmission...
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 fade-in ${msg.role === "user" ? "text-right" : "text-left"}`}
          >
            <div className="text-[10px] text-zinc-600 mb-1 uppercase tracking-wider font-mono">
              {msg.role === "user" ? "You → Mars" : "Zeph → Earth"}
            </div>
            <div
              className={`inline-block max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                msg.role === "user"
                  ? "bg-amber-400/10 text-amber-300 border border-amber-400/20"
                  : "bg-green-400/10 text-green-300 border border-green-400/20"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Current transcript while listening */}
        {isListening && currentTranscript && (
          <div className="mb-3 text-right fade-in">
            <div className="text-[10px] text-zinc-600 mb-1 uppercase tracking-wider font-mono">
              Transmitting...
            </div>
            <div className="inline-block max-w-[85%] px-3 py-2 rounded-lg text-sm bg-amber-400/5 text-amber-400/60 border border-amber-400/10">
              {currentTranscript}
              <span className="blink">|</span>
            </div>
          </div>
        )}

        {/* Processing indicator */}
        {isProcessing && (
          <div className="mb-3 text-left fade-in">
            <div className="text-[10px] text-zinc-600 mb-1 uppercase tracking-wider font-mono">
              Signal in transit
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-400/5 border border-green-400/10">
              <div className="signal-travel text-green-400 text-xs">
                &#x2022; &#x2022; &#x2022;
              </div>
              <span className="text-green-400/50 text-xs">225M km</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Waveform + Transmit button */}
      <div className="w-full max-w-md ml-auto">
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

        <div className="mt-3 text-center text-zinc-600 text-[10px] tracking-wider uppercase">
          {isListening
            ? "Release to send"
            : isProcessing
              ? "Signal traveling to Mars..."
              : isPlaying
                ? "Zeph is speaking..."
                : "Hold to transmit"}
        </div>
      </div>
    </div>
  );
}
