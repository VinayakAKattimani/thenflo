# ThenFLo Frontend

A from-scratch React (Vite) frontend for ThenFLo, covering the existing
capabilities (Conversations, Voice, Knowledge) and a complete, production-shaped
UI for the upcoming **Automated Browsing** capability, which has no backend yet.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Visit `http://localhost:5173`. Log in or register — auth is mocked by default,
so any email/password works.

## Architecture

```
src/
├── components/       Shared + feature components (nav, common UI, browsing/*)
├── context/           AuthContext — session state
├── layouts/            AppShell — sidebar + routed content
├── pages/                One folder per route (Home, Conversations, Voice,
│                          Knowledge, Browsing, Analytics, Settings, Profile, Auth)
├── services/            All backend communication lives here. UI components
│   ├── apiClient.js      never call fetch() directly.
│   ├── config.js
│   ├── authService.js
│   ├── conversationService.js
│   ├── knowledgeService.js
│   ├── audioService.js
│   ├── browsingService.js
│   └── mock/mockData.js
└── styles/               Design tokens + global styles
```

### The service-abstraction pattern

Every feature has one service file (`conversationService.js`,
`knowledgeService.js`, etc). Components only ever import and call functions
from these files — never `fetch`, never a hardcoded URL. Each service
function currently branches on a mock flag from `services/config.js`:

```js
export async function listConversations() {
  if (USE_MOCK.conversations) {
    // realistic in-memory mock data
  }
  return request('/api/v1/conversations'); // real Gateway call
}
```

**`apiClient.js`** is the single seam between the app and the network. It
already talks to one Gateway base URL (`VITE_API_BASE_URL`, default
`http://localhost:8000`) and attaches the stored auth token — the frontend
never calls a microservice directly.

### Connecting real APIs (Conversations / Voice / Knowledge)

1. Confirm the exact Gateway contract (method, path, headers, request/response
   shape, error shape, streaming behavior) — see the Auth/Audio paths already
   noted in `.env.example` and inline in each service file as a starting point.
2. In the relevant service file, replace the mock branch's return value with
   a call to `request(path, { method, body, ... })` using the exact path.
3. Flip the matching flag in `.env` to `false` (e.g. `VITE_USE_MOCK_KNOWLEDGE=false`).
4. No component changes are needed — they already only depend on each
   service function's return shape.

### Automated Browsing

`browsingService.js` has **no backend today** and is intentionally mock-only
— there's no flag to flip yet. It simulates the task lifecycle
(`starting → opening_website → navigating → reading_page → interacting →
completed/failed/stopped`) with realistic timing so every UI state in
`components/browsing/*` and `pages/Browsing/Browsing.jsx` can be exercised
end-to-end today.

When a real Browsing backend exists (Frontend → Gateway → Browsing Service →
Browser Automation Engine), each exported function in `browsingService.js` —
`createTask`, `getTask`, `listTasks`, `subscribeToTask`, `stopTask` — is
replaced with real Gateway calls (the last one likely becomes a WebSocket/SSE
subscription rather than a mock timer). Nothing in `Browsing.jsx` or the
`BrowserPreview`, `TaskWorkspace`, `TaskStatusTimeline`, or `TaskHistoryList`
components needs to change, because they were built against these function
signatures and return shapes, not against the fact that they're mocked.

`BrowserPreview` already accepts `screenshotUrl` and `streamUrl` props for a
still frame or a live stream — today neither is ever passed, so it always
renders its placeholder state.

## What's mocked vs. real right now

| Capability | Status |
|---|---|
| Auth | Mocked (flip `VITE_USE_MOCK_AUTH=false` once the Gateway contract is confirmed) |
| Conversations | Mocked |
| Voice | Real microphone capture (MediaRecorder) + mocked transcription/synthesis response |
| Knowledge | Mocked (real file upload flow is wired, just posts to a mock) |
| Automated Browsing | Fully mocked — no backend exists yet, by design |
| Analytics | Static illustrative data — no service abstraction yet |
