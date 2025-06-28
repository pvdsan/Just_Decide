# Movie Debate Agent API Documentation

## Base URL
- **Development**: `http://localhost:8000`
- **Production**: TBD

## Authentication
Currently no authentication required. All endpoints are public.

## Content Type
All endpoints expect and return `application/json` unless specified otherwise.

---

## Endpoints

### Health Check

#### `GET /health`
Simple health check endpoint to verify the API is running.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "version": "0.1.0"
}
```

**Status Codes:**
- `200 OK` - Service is healthy
- `503 Service Unavailable` - Service is down

---

### Debate Management

#### `POST /api/start`
Initiates a new 4-agent movie debate session.

**Request Body:**
```json
{
  "profiles": [
    {
      "id": "user-1",
      "name": "Alice",
      "age": 28,
      "favorite_films": "Inception, The Matrix, Interstellar",
      "vibe": "Looking for something mind-bending tonight"
    },
    {
      "id": "user-2", 
      "name": "Bob",
      "age": 32,
      "favorite_films": "Die Hard, John Wick, Mad Max",
      "vibe": "Want high-energy action"
    },
    // ... 2 more profiles
  ]
}
```

**Response:**
```json
{
  "session_id": "sess_abc123",
  "status": "active",
  "message": "Debate session started successfully",
  "agents": [
    {
      "id": "agent-1",
      "profile": { /* UserProfile */ },
      "personality": "Analytical thinker who values complex narratives",
      "color": "#ef4444",
      "status": "idle"
    }
    // ... 3 more agents
  ]
}
```

**Status Codes:**
- `200 OK` - Session started successfully
- `400 Bad Request` - Invalid profiles (must be exactly 4)
- `422 Unprocessable Entity` - Profile validation errors
- `500 Internal Server Error` - Server error

---

#### `GET /api/status/{session_id}`
Retrieves current status of a debate session.

**Path Parameters:**
- `session_id` (string) - The session identifier

**Response:**
```json
{
  "session": {
    "id": "sess_abc123",
    "status": "active",
    "agents": [ /* Agent[] */ ],
    "current_round": 2,
    "max_rounds": 5,
    "movies_remaining": [ /* Movie[] */ ],
    "final_recommendation": null,
    "started_at": "2024-01-01T12:00:00Z",
    "completed_at": null,
    "happiness_score": null
  },
  "events_count": 47,
  "last_activity": "2024-01-01T12:05:30Z"
}
```

**Status Codes:**
- `200 OK` - Session found
- `404 Not Found` - Session does not exist
- `500 Internal Server Error` - Server error

---

### Event Streaming

#### `GET /api/events/{session_id}`
Server-Sent Events (SSE) stream for real-time MCP events.

**Path Parameters:**
- `session_id` (string) - The session identifier

**Headers:**
- `Accept: text/event-stream`
- `Cache-Control: no-cache`
- `Connection: keep-alive`

**Event Format:**
```
data: {"type": "agent.thought", "timestamp": "2024-01-01T12:00:00Z", "session_id": "sess_abc123", "agent_id": "agent-1", "data": {"thought": "I think we should consider sci-fi movies..."}}

data: {"type": "round.begin", "timestamp": "2024-01-01T12:01:00Z", "session_id": "sess_abc123", "data": {"round": 2, "pairs": [["agent-1", "agent-2"], ["agent-3", "agent-4"]]}}

data: {"type": "consensus.reached", "timestamp": "2024-01-01T12:10:00Z", "session_id": "sess_abc123", "data": {"movie": {"id": 123, "title": "Inception"}, "happiness_score": 0.92}}
```

**Event Types:**
- `session.start` - Debate session initiated
- `session.complete` - Debate session finished
- `round.begin` - New debate round started
- `round.end` - Debate round completed
- `agent.thought` - Agent reasoning/thinking
- `agent.action` - Agent took an action
- `tool.call` - MCP tool was called
- `tool.result` - MCP tool returned result
- `consensus.reached` - Final movie selected
- `error` - Error occurred

**Status Codes:**
- `200 OK` - Stream established
- `404 Not Found` - Session does not exist
- `500 Internal Server Error` - Server error

---

### Movie Management

#### `POST /api/db/embed`
Adds a new movie to the database and FAISS index.

**Request Body:**
```json
{
  "title": "The Matrix",
  "overview": "A computer programmer discovers reality is a simulation...",
  "tags": ["sci-fi", "action", "philosophical"],
  "year": 1999,
  "genre": ["Science Fiction", "Action"]
}
```

**Response:**
```json
{
  "id": 12345,
  "title": "The Matrix",
  "overview": "A computer programmer discovers reality is a simulation...",
  "tags": ["sci-fi", "action", "philosophical"],
  "happiness_score": 0.85,
  "year": 1999,
  "genre": ["Science Fiction", "Action"],
  "embedding": [0.123, -0.456, ...] // 768-dimensional vector
}
```

**Status Codes:**
- `201 Created` - Movie added successfully
- `400 Bad Request` - Invalid movie data
- `409 Conflict` - Movie already exists
- `500 Internal Server Error` - Server error

---

#### `GET /api/search`
Search movies using FAISS vector similarity.

**Query Parameters:**
- `q` (string, required) - Search query
- `k` (integer, optional, default=5) - Number of results to return

**Example:**
```
GET /api/search?q=time%20travel%20adventure&k=10
```

**Response:**
```json
[
  {
    "id": 123,
    "title": "Back to the Future",
    "overview": "A teenager travels back in time...",
    "tags": ["time-travel", "adventure", "comedy"],
    "happiness_score": 0.88,
    "similarity_score": 0.92
  },
  // ... more movies
]
```

**Status Codes:**
- `200 OK` - Search completed
- `400 Bad Request` - Invalid query parameters
- `500 Internal Server Error` - Server error

---

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Profile validation failed",
    "details": {
      "field": "age",
      "issue": "must be between 1 and 120"
    }
  },
  "timestamp": "2024-01-01T12:00:00Z",
  "path": "/api/start"
}
```

## Rate Limiting

- **General endpoints**: 100 requests per minute per IP
- **Event streaming**: 1 connection per session per IP
- **Search endpoints**: 20 requests per minute per IP

## WebSocket Alternative

For environments that don't support SSE, a WebSocket endpoint is available:

```
ws://localhost:8000/api/ws/{session_id}
```

Messages follow the same format as SSE events but wrapped in WebSocket frames.

---

## Development Notes

1. **CORS**: Enabled for `http://localhost:3000` in development
2. **Timeouts**: All endpoints have a 30-second timeout
3. **Logging**: All requests are logged with request ID for debugging
4. **Health Checks**: Docker health checks use `/health` endpoint
5. **Graceful Shutdown**: Server handles SIGTERM for clean shutdown

## Example Usage

### JavaScript/TypeScript
```typescript
// Start a debate
const response = await fetch('/api/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ profiles })
});

// Listen to events
const eventSource = new EventSource(`/api/events/${sessionId}`);
eventSource.onmessage = (event) => {
  const mcpEvent = JSON.parse(event.data);
  console.log('MCP Event:', mcpEvent);
};
```

### cURL
```bash
# Start debate
curl -X POST http://localhost:8000/api/start \
  -H "Content-Type: application/json" \
  -d '{"profiles": [...]}'

# Get session status  
curl http://localhost:8000/api/status/sess_abc123

# Stream events
curl -N -H "Accept: text/event-stream" \
  http://localhost:8000/api/events/sess_abc123
``` 