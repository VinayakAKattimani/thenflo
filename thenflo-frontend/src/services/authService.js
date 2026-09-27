import { request, mockDelay, ApiError } from './apiClient.js';
import { USE_MOCK } from './config.js';
import { mockUser } from './mock/mockData.js';

const TOKEN_KEY = 'thenflo_access_token';

function storeSession(user, token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem('thenflo_user', JSON.stringify(user));
  } catch {
    /* storage unavailable — session just won't persist across reloads */
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('thenflo_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  try {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  } catch {
    return false;
  }
}

export async function login({ email, password }) {
  if (USE_MOCK.auth) {
    await mockDelay(600);
    if (!email || !password) {
      throw new ApiError('Email and password are required.', { status: 400, code: 'VALIDATION_ERROR' });
    }
    const token = 'mock_token_' + Date.now();
    const user = { ...mockUser, email };
    storeSession(user, token);
    return { user, accessToken: token };
  }

  // Real path — wire to the confirmed Gateway contract, e.g.
  // POST /api/v1/auth/login. Left generic on purpose: do not assume the
  // exact request/response shape until it's verified against the Gateway.
  const data = await request('/api/v1/auth/login', { method: 'POST', body: { email, password } });
  storeSession(data.user, data.accessToken || data.access_token);
  return data;
}

export async function register({ name, email, password }) {
  if (USE_MOCK.auth) {
    await mockDelay(700);
    const token = 'mock_token_' + Date.now();
    const user = { ...mockUser, name, email };
    storeSession(user, token);
    return { user, accessToken: token };
  }
  const data = await request('/api/v1/auth/register', { method: 'POST', body: { name, email, password } });
  storeSession(data.user, data.accessToken || data.access_token);
  return data;
}

export async function refresh() {
  if (USE_MOCK.auth) {
    await mockDelay(300);
    return { accessToken: 'mock_token_' + Date.now() };
  }
  return request('/api/v1/auth/refresh', { method: 'POST' });
}

export function logout() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('thenflo_user');
  } catch {
    /* no-op */
  }
}
