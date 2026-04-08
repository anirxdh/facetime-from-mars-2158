# Signal From Mars

A real-time voice chat app where you talk to Zeph, a 16-year-old Martian, powered by Claude AI and ElevenLabs TTS.

## Architecture

- **Frontend**: Next.js 16 (React 19, Three.js/WebGL Mars scene, Tailwind CSS v4)
  - Runs on port 5000
  - Located in `/frontend`
- **Backend**: FastAPI (Python) with Anthropic + ElevenLabs APIs
  - Runs on port 8000
  - Located in `/backend`
  - Frontend proxies `/api/*` calls to the backend via Next.js rewrites

## Running the App

Two workflows handle the services:
- **Backend** — `cd backend && python main.py` (port 8000, console output)
- **Start application** — `cd frontend && npm run dev` (port 5000, webview)

## Environment Variables Required

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | API key for OpenAI (chat responses) |
| `ELEVENLABS_API_KEY` | API key for ElevenLabs (text-to-speech) |
| `ELEVENLABS_VOICE_ID` | (Optional) ElevenLabs voice ID, defaults to Adam |

## Key Files

- `backend/main.py` — FastAPI server, Zeph's system prompt, /api/chat and /api/intro endpoints
- `frontend/src/components/TransmissionPanel.tsx` — Main chat UI with voice input/output
- `frontend/src/components/MarsScene.tsx` — Three.js 3D Mars background
- `frontend/next.config.ts` — Next.js config with API proxy rewrites

## Security

- CORS restricted to localhost:5000 only (requests proxied through Next.js)
- API keys loaded from environment variables via python-dotenv
