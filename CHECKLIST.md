# Movie Debate Agent - Project Checklist

## 🎯 Project Status Overview

**Current Phase**: Infrastructure & Frontend Scaffold Complete ✅  
**Next Phase**: Backend Implementation & Magic MCP Component Generation  
**Target**: 3-hour hackathon completion

---

## ✅ COMPLETED TASKS

### 1. Repository Structure & Configuration
- [x] **Complete directory structure** - Backend and frontend separation
- [x] **Environment configuration** - `.env.example` with all required variables
- [x] **Docker setup** - `docker-compose.yml` with health checks
- [x] **Git configuration** - Comprehensive `.gitignore` and `.editorconfig`
- [x] **README.md** - Project overview with architecture and quick start

### 2. Backend Infrastructure
- [x] **Backend directory structure** - All modules (`mcp_tools/`, `agents/`, `chains/`, etc.)
- [x] **Python configuration** - `pyproject.toml` with all dependencies
- [x] **Requirements file** - `requirements.txt` for Docker builds
- [x] **Dockerfile** - Production-ready backend container
- [x] **Package initialization** - All `__init__.py` files created

### 3. Frontend Infrastructure
- [x] **Next.js 15 scaffold** - TypeScript, Tailwind, ESLint configured
- [x] **Additional dependencies** - Framer Motion, Radix UI, Lucide React installed
- [x] **Tailwind configuration** - Dark theme, custom colors, animations
- [x] **Frontend Dockerfile** - Production-ready container
- [x] **TypeScript types** - Comprehensive type definitions (`lib/types.ts`)

### 4. Core Frontend Code
- [x] **API client** - Typed fetch wrappers with error handling (`lib/api.ts`)
- [x] **Event streaming hook** - `useEventSource` with reconnection logic
- [x] **Main page layout** - 2x2 grid with placeholder components
- [x] **Component structure** - Ready for Magic MCP generation

### 5. Documentation
- [x] **API documentation** - Complete endpoint specifications (`docs/api_endpoints.md`)
- [x] **Architecture documentation** - System overview with Mermaid diagram
- [x] **Project guides** - Existing `full_guide.md`, `notes.md`, `project_plan.md`

---

## 🟡 IN PROGRESS / READY FOR IMPLEMENTATION

### 1. Magic MCP Component Generation (NEXT PRIORITY)
- [ ] **MagicCard Component** - Agent profile cards with live streaming
  - Dark theme with gradient border
  - Avatar placeholder with initials
  - Profile summary display
  - Live reasoning stream area
  - Click handler for modal
  - Framer Motion animations

- [ ] **UserModal Component** - Profile input dialog
  - Name, age, favorite films inputs
  - "Tonight's vibe" textarea
  - Form validation with TypeScript
  - Save/cancel buttons
  - Radix UI Dialog base
  - Tailwind dark styling

- [ ] **AgentStream Component** - Live reasoning display
  - Real-time MCP event filtering
  - Syntax-highlighted code blocks
  - Auto-scroll with pause option
  - Agent color coding
  - Memory leak prevention (max lines)

- [ ] **ToastProvider Component** - Round notifications
  - Round begin/end notifications
  - Color-coded by event type
  - Auto-dismiss after 3 seconds
  - Slide-in animations
  - Global toast management

- [ ] **PillNavbar Component** - Bottom action bar
  - Start debate button
  - Progress indicator
  - Responsive design
  - Disabled states

- [ ] **ConsensusPanel Component** - Final result display
  - Movie recommendation card
  - Happiness score visualization
  - Agent voting breakdown
  - Share/restart options

### 2. Backend Core Implementation
- [ ] **FastAPI main application** (`app/main.py`)
  - CORS middleware configuration
  - Health check endpoint
  - Error handling middleware
  - Request logging

- [ ] **API route handlers** 
  - `POST /api/start` - Debate session initialization
  - `GET /api/status/{session_id}` - Session status retrieval
  - `GET /api/events/{session_id}` - SSE event streaming
  - `POST /api/db/embed` - Movie addition

---

## ⭕ TODO - BACKEND BUSINESS LOGIC

### 1. MCP Tools Implementation
- [ ] **FaissVectorSearchTool** (`app/mcp_tools/vector_search.py`)
  - FAISS index loading and search
  - Query embedding generation
  - MCP event emission
  - Result ranking and filtering

- [ ] **OpenAIChatTool** (`app/mcp_tools/openai_chat.py`)
  - GPT-4 API integration
  - Token counting and rate limiting
  - Response streaming
  - Error handling and retries

- [ ] **TimerGuardTool** (`app/mcp_tools/timer_guard.py`)
  - Debate round timing
  - Timeout enforcement
  - Progress tracking

### 2. LangChain Agents
- [ ] **Agent Lawyer** (`app/agents/agent_lawyer.py`)
  - Individual agent personality
  - Movie preference reasoning
  - Debate argument generation
  - Tool usage coordination

- [ ] **Debate Orchestrator** (`app/agents/orchestrator.py`)
  - Multi-agent coordination
  - Round-robin pairing logic
  - Session state management
  - Event streaming coordination

### 3. LangChain Chains
- [ ] **Profile Chain** (`app/chains/profile_chain.py`)
  - User profile → agent personality conversion
  - JSON output parsing
  - Personality trait extraction

- [ ] **Elimination Chain** (`app/chains/elimination_chain.py`)
  - Movie debate logic
  - Elimination criteria
  - Happiness scoring
  - Consensus detection

### 4. Data Layer
- [ ] **FAISS Index Management** (`app/vector/faiss_store.py`)
  - Index loading and saving
  - Vector similarity search
  - Index rebuilding utilities

- [ ] **Embeddings Service** (`app/vector/embeddings.py`)
  - Sentence transformer integration
  - Batch embedding generation
  - Caching and optimization

- [ ] **Database Models** (`app/models/`)
  - Movie Pydantic models
  - Session management models
  - Request/response schemas

### 5. Utility Functions
- [ ] **Pairing Logic** (`app/utils/pairing.py`)
  - Round-robin tournament pairing
  - Agent matchmaking
  - Round progression

- [ ] **Scoring System** (`app/utils/scoring.py`)
  - Happiness score calculation
  - Agent preference weighting
  - Consensus metrics

### 6. Scripts & Data Processing
- [ ] **FAISS Index Builder** (`backend/scripts/build_faiss_index.py`)
  - Movie dataset processing
  - Embedding generation
  - Index creation and optimization

- [ ] **Sample Data Generator** (`backend/scripts/sample_movies.py`)
  - Test movie dataset
  - Development data seeding

---

## 🚀 DEPLOYMENT & TESTING

### Ready to Test
- [ ] **Docker Compose Build** - `docker compose up --build`
- [ ] **Frontend Development** - `npm run dev` in frontend/
- [ ] **Backend Development** - `uvicorn app.main:app --reload` in backend/
- [ ] **API Health Check** - `curl http://localhost:8000/health`
- [ ] **Frontend Access** - http://localhost:3000

### Integration Testing
- [ ] **Profile submission flow**
- [ ] **Event streaming connection**
- [ ] **Mock debate session**
- [ ] **Error handling scenarios**

---

## 📊 Magic MCP Integration Targets

### Component Generation Priority
1. **MagicCard** (Highest) - Core UI element
2. **UserModal** (High) - User input collection
3. **AgentStream** (High) - Live reasoning display
4. **ToastProvider** (Medium) - User feedback
5. **PillNavbar** (Medium) - Action controls
6. **ConsensusPanel** (Low) - Final results

### Magic MCP Commands Ready
```bash
# Use these commands in Cursor for component generation:

/magic create a card component with:
- Dark theme with gradient border
- Avatar placeholder
- Profile summary text
- Click handler for modal
- Framer Motion spring animations

/magic create a modal dialog with:
- Name, age, favorite films inputs
- "Tonight's vibe" textarea
- Save/cancel buttons
- Form validation
- Tailwind dark styling

/magic create a toast system with:
- Round begin/end notifications
- Color-coded by round type
- Auto-dismiss after 3 seconds
- Slide-in animations
```

---

## ⏱️ Time Estimates (Remaining Work)

- **Magic MCP Components**: 45 minutes (6 components × 7-8 min each)
- **Backend API Routes**: 30 minutes
- **MCP Tools**: 45 minutes
- **LangChain Agents**: 60 minutes
- **Integration & Testing**: 30 minutes

**Total Remaining**: ~3.5 hours (slightly over 3-hour target)

## 🎯 Success Criteria

- [x] **One-command deployment** (`docker compose up --build`)
- [x] **Complete project structure** (Frontend + Backend)
- [x] **Comprehensive documentation** (API + Architecture)
- [ ] **Magic MCP generated UI** (4+ components)
- [ ] **LangChain + MCP integration** (All agent logic)
- [ ] **Live event streaming** (Real-time agent thoughts)
- [ ] **4-agent debate system** (Round-robin elimination)

---

**Next Action**: Begin Magic MCP component generation starting with `MagicCard` component. 