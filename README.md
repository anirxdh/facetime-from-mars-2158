# FaceTime From Mars 2159

**Talk to colonists on Mars via quantum relay. Year 2159.**

Built for [ElevenLabs x Replit Hackathon](https://elevenlabs.io) (#ElevenHacks)

---

## What is this?

A voice-powered web app where you call people living on Mars in the year 2159. Humans migrated to Mars in 2070 — now it's 90 years later and you can talk to three Mars colonists in real-time via a quantum relay connection.

### The Colonists

| Character | Role | Voice |
|-----------|------|-------|
| **Zeph** | 16-year-old colony kid who's never seen Earth | ElevenLabs custom voice |
| **Chef Riku** | Food designer recreating Earth dishes he's never tasted | ElevenLabs custom voice |
| **Dr. Nova** | Terraforming chief making Mars breathable | ElevenLabs custom voice |

### Features

- **Walkie-talkie voice chat** — hold to talk, release to send
- **3 unique AI characters** with distinct personalities and voices
- **Radio effects** — static bursts and bandpass filter on voice for space feel
- **3D Mars scene** — interactive rotating Mars, Earth, satellite (React Three Fiber)
- **Camera transitions** — view pans to Earth when you talk, Mars when they respond
- **Ambient space sounds** — procedural drone + blips
- **Signal glitches** — random visual disruptions for immersion
- **Mars clock** — live Earth + Mars time display
- **Suggested topics** — conversation starter chips
- **End call summary** — transmission report with stats and highlights

## Tech Stack

- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS + React Three Fiber
- **Backend**: FastAPI (Python)
- **AI Conversation**: Claude API (Anthropic)
- **Voice Synthesis**: ElevenLabs Text-to-Speech API
- **Speech-to-Text**: Browser Web Speech API
- **Deployment**: Replit

## How It Works

```
User holds transmit button → Browser Speech-to-Text → text
  → FastAPI backend
    → Claude API (character-specific prompt → response text)
    → ElevenLabs TTS (character-specific voice → audio)
  → Audio returned to browser
  → Radio effects applied via Web Audio API
  → Plays through speaker with waveform visualization
```

## Setup

### Prerequisites
- [Anthropic API key](https://console.anthropic.com/settings/keys)
- [ElevenLabs API key](https://elevenlabs.io/app/settings/api-keys)

### Run on Replit (recommended)
1. Import this repo on [Replit](https://replit.com)
2. Add Secrets: `ANTHROPIC_API_KEY`, `ELEVENLABS_API_KEY`
3. Click Run — both backend and frontend start automatically

### Run locally
```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # fill in your API keys
python main.py

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/characters` | GET | List available characters |
| `/api/intro?character=zeph` | GET | Get character's intro audio |
| `/api/chat` | POST | Send message, get voice response |
| `/api/health` | GET | Health check |

## Project Structure

```
├── backend/
│   ├── main.py              # FastAPI server, 3 character prompts, Claude + ElevenLabs
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js app router
│   │   └── components/
│   │       ├── LandingScreen.tsx      # Character selection cards
│   │       ├── TransmissionPanel.tsx  # Voice chat interface
│   │       ├── MarsScene.tsx          # 3D scene (R3F)
│   │       ├── TransmitButton.tsx     # Push-to-talk button
│   │       ├── WaveformVisualizer.tsx # Audio waveform
│   │       ├── SignalGlitch.tsx       # Random visual glitches
│   │       ├── TopicChips.tsx         # Conversation starters
│   │       ├── MarsClock.tsx          # Dual Earth/Mars time
│   │       ├── AmbientSound.tsx       # Procedural space audio
│   │       └── EndCallSummary.tsx     # Transmission report
│   └── public/
│       ├── Zeph.png
│       ├── foodengineer.jpg
│       └── Drnova.png
└── README.md
```

## ElevenLabs Integration

- **Voice Design**: Each character uses a unique ElevenLabs voice ID matched to their personality
- **Text-to-Speech**: `eleven_turbo_v2_5` model for low-latency responses
- **Voice Settings**: Tuned per character (stability 0.35, style 0.6) for expressive, human-like speech
- **Radio Processing**: Web Audio API adds bandpass filter + waveshaper distortion for space radio effect

## Built With

- [ElevenLabs](https://elevenlabs.io) — Voice synthesis
- [Replit](https://replit.com) — Development and deployment
- [Claude](https://anthropic.com) — AI conversation
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) — 3D rendering

## Hackathon

**ElevenLabs x Replit Hack 3** | #ElevenHacks

Tag [@Replit](https://twitter.com/Replit) and [@elevenlabsio](https://twitter.com/elevenlabsio) when sharing.

---

*The future is calling — pick up.*
