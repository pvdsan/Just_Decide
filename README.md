# Movie Debate Agent 🎬

**AI-powered multi-agent movie recommendation system with live reasoning streams**

A 3-hour hackathon build showcasing LangChain + MCP architecture where four AI "lawyer" agents debate to reach consensus on the perfect movie for your group.

## 🏗️ Architecture

```
┌───────────────┐   WebSocket/SSE   ┌────────────────┐
│ Next.js 15 UI │◄──────────────────│ FastAPI Backend│
│ (Magic MCP)   │                   │  • LangChain   │
└───────────────┘                   │  • MCP server  │
     ▲  ▲   ▲                       │  • Debate loop │
     │  │   │                       │  • Faiss index │
     │  │   └── REST: /start, /status, /embed ──────┐
     │  └────── Faiss vectors over HTTP ─────────────┤
     └──────────── Facebook AI Faiss (in-memory) ────┘
```

## 🚀 Quick Start

1. **Clone & Setup**
   ```bash
   git clone <repo-url>
   cd Just_Decide
   cp .env.example .env
   # Edit .env with your OPENAI_API_KEY
   ```

2. **One-Command Boot**
   ```bash
   docker compose up --build
   ```

3. **Access**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 📁 Project Structure

```
Just_Decide/
├── backend/                 # FastAPI + LangChain + MCP
│   ├── app/
│   │   ├── main.py         # FastAPI factory + routes
│   │   ├── mcp_tools/      # MCP-wrapped tools
│   │   ├── agents/         # LangChain agent definitions
│   │   ├── chains/         # LangChain chain logic
│   │   ├── vector/         # FAISS index management
│   │   └── models/         # Pydantic data models
│   └── scripts/            # Index building utilities
├── frontend/               # Next.js 15 + TypeScript
│   └── src/
│       ├── components/     # Magic MCP generated UI
│       ├── hooks/          # Event streaming hooks
│       └── lib/            # API client & types
└── docs/                   # Architecture & API docs
```

## 🎯 Core Features

- **Live MCP Reasoning Stream**: Watch each agent think in real-time
- **4-Agent Debate System**: Round-robin elimination tournament
- **FAISS Vector Search**: Free, fast movie similarity matching
- **Magic MCP Integration**: Auto-generated UI components
- **One-Command Deploy**: `docker compose up --build`

## 🔧 Tech Stack

- **Backend**: FastAPI 1.4, LangChain, MCP, FAISS
- **Frontend**: Next.js 15, TypeScript, Tailwind, Framer Motion
- **AI**: OpenAI GPT-4, Sentence Transformers
- **Data**: Wikipedia movie plots dataset

## 📊 Port Map

| Service  | Port | Purpose |
|----------|------|---------|
| Frontend | 3000 | Next.js UI |
| Backend  | 8000 | FastAPI + MCP |
| Postgres | 5432 | Movie metadata (optional) |

## 🎬 Demo Flow

1. Four users input quick profiles (name, age, favorite films, tonight's vibe)
2. Each profile generates a "lawyer" agent with distinct personality
3. Agents search FAISS index for candidate movies
4. Round-robin debate eliminates movies until consensus
5. Live reasoning stream shows each agent's thoughts
6. Final recommendation with happiness score

---

**Built for the 3-hour hackathon challenge** ⚡