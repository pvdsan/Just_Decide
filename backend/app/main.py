from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
import logging

app = FastAPI(title="Movie Debate Agent", version="0.1.0")

# --- CORS ---------------------------------------------------------------
frontend_origin = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Health Check -------------------------------------------------------
@app.get("/health")
async def health_check():
    """Kubernetes/Nginx/docker health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        "version": app.version,
    }

# --- Placeholder Models & Routes ---------------------------------------
class UserProfile(BaseModel):
    id: str
    name: str
    age: int
    favorite_films: str
    vibe: str

class StartDebateRequest(BaseModel):
    profiles: List[UserProfile]

@app.post("/api/start")
async def start_debate(req: StartDebateRequest):
    if len(req.profiles) != 4:
        raise HTTPException(status_code=400, detail="Exactly 4 profiles are required.")
    # TODO: integrate DebateOrchestrator
    session_id = "sess_placeholder"
    logging.warning("/api/start called – debate orchestration not yet implemented.")
    return {"session_id": session_id, "status": "pending", "message": "Debate logic not yet implemented"}

@app.get("/api/status/{session_id}")
async def session_status(session_id: str):
    # TODO: implement real session store
    raise HTTPException(status_code=404, detail="Session not found")

@app.get("/api/events/{session_id}")
async def events_stream(session_id: str):
    # SSE placeholder – real implementation will use StreamingResponse
    raise HTTPException(status_code=501, detail="Event stream not implemented") 