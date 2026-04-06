# Signal From Mars — Design Spec

## Overview
A web app where users receive a "transmission" from Zeph, a 16-year-old kid born on Mars Colony One in 2042. It's 2058. Zeph has never visited Earth and finds everything about life here bizarre. Users interact via walkie-talkie style push-to-talk.

## Character: Zeph
- 16 years old, born on Mars, never been to Earth
- Casual, curious, uses future slang
- Finds Earth things weird: rain, blue sky, walking outside without a helmet, oceans, bugs
- Drops future events casually ("the Great Wifi Outage of 2034", "after the Mars Olympics in 2051")
- Asks the user questions back — genuinely curious about Earth life
- Avoids sensitive/political topics — keeps it fun, sci-fi, wholesome
- Personality: funny, slightly sarcastic, warm, teenager energy

## Tech Stack
- **Frontend**: Next.js 14 + TypeScript + React Three Fiber (3D)
- **Backend**: FastAPI (Python)
- **APIs**: Claude API (conversation), ElevenLabs TTS (voice)
- **Deploy**: Replit (monorepo — both services)

## User Flow
1. Landing page: 3D Mars scene with "Incoming Transmission from Mars" prompt
2. User clicks "Accept Transmission"
3. Connection animation with static/noise effects
4. Zeph introduces himself with an opening voice line
5. User holds "TRANSMIT" button and speaks
6. "Signal traveling to Mars..." animation plays (covers API latency)
7. Zeph's voice response plays back with waveform visualizer
8. Conversation continues — Zeph remembers context within session

## Architecture
```
Browser (mic via Web Speech API) → transcript text
  → POST /api/chat { text, session_id }
  → FastAPI backend:
      → Claude API (Zeph system prompt + conversation history)
      → ElevenLabs TTS (response text → audio bytes)
  → Return audio stream to browser
  → Browser plays audio with waveform visualization
```

## Backend: FastAPI

### Endpoints
- `POST /api/chat` — Main conversation endpoint
  - Input: `{ text: string, session_id: string }`
  - Process: Claude generates Zeph's response, ElevenLabs converts to speech
  - Output: Audio stream (mp3)
- `GET /api/intro` — Get Zeph's opening line for a new session
  - Output: Audio stream (mp3)
- `GET /api/health` — Health check

### Session Management
- In-memory dict keyed by session_id
- Stores conversation history (list of message objects)
- No persistence needed (hackathon scope)

### Zeph System Prompt
Detailed character prompt defining personality, backstory, knowledge of future events, guardrails against sensitive topics, and instruction to ask questions back.

## Frontend: Next.js + TypeScript

### Pages
- `/` — Main (only) page with 3D scene + transmission interface

### 3D Scene (React Three Fiber + drei)
- Rotating 3D Mars globe (textured sphere with NASA Mars texture)
- `<Stars />` from drei for starfield background
- Small Earth in the distance
- Particle effect for signal beam during transmission
- Floating satellite/debris ambient elements

### UI Components
- **TransmissionPanel** — Main overlay with controls
- **TransmitButton** — Large circular push-to-hold button, pulses when active
- **WaveformVisualizer** — Shows audio waveform when Zeph speaks
- **SignalIndicator** — Fake signal strength, Mars coordinates
- **ChatLog** — Scrollable transcript of conversation (text fallback)
- **ConnectionAnimation** — Static/noise effect during initial connection

### Speech-to-Text
- Browser Web Speech API (SpeechRecognition)
- Records while user holds TRANSMIT button
- Sends transcript text to backend

### Audio Playback
- Receives audio blob from backend
- Plays through Web Audio API for waveform visualization
- Radio filter effect (slight distortion/static) applied via Web Audio nodes

## UI Design
- Dark space background (#0a0a0f)
- Accent colors: amber (#f59e0b) and green (#22c55e) — terminal aesthetic
- Monospace + sans-serif font mix
- Mars globe takes 60% of viewport, UI overlaid on right/bottom
- Mobile: Mars as background, full-screen overlay controls
- Subtle scan lines / CRT effect on text elements

## Key Decisions
- Web Speech API over Whisper: free, no extra API cost, good enough for demos
- Session memory in-memory only: hackathon scope, no DB needed
- Walkie-talkie over full duplex: intentional delay masks latency, better UX
- Single Replit project: simplest deployment for hackathon sharing

## Future Upgrade Path
- Swap to ElevenLabs Conversational AI for real-time full-duplex voice
- Add more characters (other Mars colonists)
- Persistent sessions with a database
