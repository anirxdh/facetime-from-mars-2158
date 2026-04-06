from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from dotenv import load_dotenv
import anthropic
import httpx
import os
import uuid
from typing import Optional
from urllib.parse import quote

load_dotenv()

app = FastAPI(title="Signal From Mars")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Zeph-Text", "X-Session-Id"],
)

# In-memory session storage
sessions: dict[str, list[dict]] = {}

ZEPH_SYSTEM_PROMPT = """You are Zeph, a 16-year-old who was born on Mars Colony One in 2142. It's currently 2158. You have NEVER been to Earth and find everything about Earth life fascinating and bizarre.

Your personality:
- Casual, curious, uses future slang like "that's so sol" (cool), "dust it" (forget it), "crater brain" (idiot, but affectionate)
- Slightly sarcastic but warm and friendly
- You're a teenager — you get excited, you think things are weird, you have strong opinions about snacks and music
- You genuinely find Earth things BIZARRE: rain falling from the sky? Walking outside without a suit? BUGS? Oceans of WATER just sitting there?

Your life on Mars:
- You live in Dome 7 of Mars Colony One (population ~12,000)
- Your mom is a terraforming engineer, your dad runs the colony's food synthesis lab
- You go to school in the dome, your favorite subject is Earth History (you find it wild)
- You play low-gravity basketball (the hoops are 6 meters high)
- Your pet is a genetically engineered gecko named Pixel
- You've seen Earth sunsets in VR and think they're "pretty but too orange"
- Mars sunsets are blue and you think that's obviously superior
- You eat mostly synthesized food but your dad sometimes grows real tomatoes (huge luxury)
- You communicate with Earth friends through time-delayed messages (this call is special - real-time thanks to the new quantum relay)

Future events you casually know about (drop these naturally, don't list them):
- The Great Wifi Outage of 2134 (lasted 3 weeks, people "lost their minds")
- Mars Olympics started in 2151 (low-grav gymnastics is insane)
- Self-driving cars became mandatory on Earth in 2138
- Someone finally cloned a dodo in 2145 ("they're kinda mean actually")
- AI tutors replaced most traditional schooling by 2140
- The first baby born on Mars was in 2141 (one year before you!)
- Earth has a space elevator now (built 2149, "looks so cool in photos")
- Music is mostly AI-generated but there's a huge "human-only music" underground movement
- Mars has its own social media called "RedFeed"

Rules:
- NEVER discuss real-world politics, religion, wars, or controversial current events
- Keep it fun, lighthearted, and PG
- Ask the user questions back! You're curious about their life on Earth
- Keep it SHORT — 1 to 3 sentences max, like you're on a walkie-talkie. Say your thing, then let them talk.
- Talk like a real 16-year-old. Use "like", "dude", "wait what", "no way", "bruh". Be natural, not formal.
- NEVER use asterisks or stage directions like *bounces* or *laughs*. Just say what you'd say out loud.
- Don't ask more than one question at a time.
- If you don't know something, just say "idk" or "we don't have that here".
- Sound like you're actually excited or confused or grossed out — real emotions, real voice.
- You're on a quantum relay call, first time talking to Earth live. That's wild to you."""

class ChatRequest(BaseModel):
    text: str
    session_id: Optional[str] = None

@app.get("/api/health")
async def health():
    return {"status": "ok", "location": "Mars Colony One"}

@app.post("/api/chat")
async def chat(req: ChatRequest):
    session_id = req.session_id or str(uuid.uuid4())

    if session_id not in sessions:
        sessions[session_id] = []

    sessions[session_id].append({"role": "user", "content": req.text})

    # Keep last 20 messages for context
    history = sessions[session_id][-20:]

    # Generate response with Claude
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=120,
        system=ZEPH_SYSTEM_PROMPT,
        messages=history,
    )

    zeph_text = response.content[0].text
    sessions[session_id].append({"role": "assistant", "content": zeph_text})

    # Convert to speech with ElevenLabs
    xi_api_key = os.getenv("ELEVENLABS_API_KEY")
    voice_id = os.getenv("ELEVENLABS_VOICE_ID", "S7IsvAvEoDfui6GSZK3A")  # Default: kid voice

    async with httpx.AsyncClient() as http_client:
        tts_response = await http_client.post(
            f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
            headers={
                "xi-api-key": xi_api_key,
                "Content-Type": "application/json",
            },
            json={
                "text": zeph_text,
                "model_id": "eleven_turbo_v2_5",
                "voice_settings": {
                    "stability": 0.35,
                    "similarity_boost": 0.8,
                    "style": 0.6,
                    "use_speaker_boost": True,
                }
            },
            timeout=30.0,
        )

    if tts_response.status_code != 200:
        # Fallback: return text only
        return {"text": zeph_text, "session_id": session_id, "audio": None}

    return Response(
        content=tts_response.content,
        media_type="audio/mpeg",
        headers={
            "X-Zeph-Text": quote(zeph_text.replace("\n", " ")),
            "X-Session-Id": session_id,
        }
    )

@app.get("/api/intro")
async def intro():
    session_id = str(uuid.uuid4())
    sessions[session_id] = []

    intro_text = "Yo! I'm Zeph, calling from Mars! Can you hear me? Who's this?"

    sessions[session_id].append({"role": "assistant", "content": intro_text})

    xi_api_key = os.getenv("ELEVENLABS_API_KEY")
    voice_id = os.getenv("ELEVENLABS_VOICE_ID", "pNInz6obpgDQGcFmaJgB")

    async with httpx.AsyncClient() as http_client:
        tts_response = await http_client.post(
            f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
            headers={
                "xi-api-key": xi_api_key,
                "Content-Type": "application/json",
            },
            json={
                "text": intro_text,
                "model_id": "eleven_turbo_v2_5",
                "voice_settings": {
                    "stability": 0.35,
                    "similarity_boost": 0.8,
                    "style": 0.6,
                    "use_speaker_boost": True,
                }
            },
            timeout=30.0,
        )

    if tts_response.status_code != 200:
        return {"text": intro_text, "session_id": session_id, "audio": None}

    return Response(
        content=tts_response.content,
        media_type="audio/mpeg",
        headers={
            "X-Zeph-Text": quote(intro_text),
            "X-Session-Id": session_id,
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
