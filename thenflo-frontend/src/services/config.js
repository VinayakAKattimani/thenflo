// Central switchboard. Each existing capability has its own flag so they can
// be flipped to real Gateway calls independently as contracts are confirmed —
// flipping one never requires touching UI components, only apiClient.js.
//
// Automated Browsing has no flag: it has no backend yet by design, and its
// service (browsingService.js) is mock-only until a Gateway contract exists.

export const GATEWAY_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const USE_MOCK = {
  auth: import.meta.env.VITE_USE_MOCK_AUTH !== 'false',
  conversations: import.meta.env.VITE_USE_MOCK_CONVERSATIONS !== 'false',
  knowledge: import.meta.env.VITE_USE_MOCK_KNOWLEDGE !== 'false',
  audio: import.meta.env.VITE_USE_MOCK_AUDIO !== 'false'
};
