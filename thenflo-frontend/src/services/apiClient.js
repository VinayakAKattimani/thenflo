import { GATEWAY_BASE_URL } from './config.js';

export class ApiError extends Error {
  constructor(message, { status, code, details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function getStoredToken() {
  try {
    return localStorage.getItem('thenflo_access_token');
  } catch {
    return null;
  }
}

/**
 * Real Gateway request path.
 *
 * IMPORTANT: This deliberately assumes nothing about individual endpoint
 * request/response shapes beyond a conventional REST/JSON envelope over a
 * single Gateway host. It is NOT wired to any specific invented endpoint.
 * Once real Gateway contracts (from OpenAPI / route inspection) are
 * confirmed, each service's mock branch is replaced with a call through
 * `request(...)` using the *exact* path, method, headers and body shape
 * the Gateway actually expects.
 */
export async function request(path, { method = 'GET', body, headers = {}, isFormData = false, signal } = {}) {
  const token = getStoredToken();

  const finalHeaders = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers
  };

  let res;
  try {
    res = await fetch(`${GATEWAY_BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
      signal
    });
  } catch (networkErr) {
    throw new ApiError('Could not reach the Gateway. Is it running?', {
      status: 0,
      code: 'NETWORK_ERROR',
      details: networkErr
    });
  }

  const contentType = res.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await res.json().catch(() => null) : await res.blob();

  if (!res.ok) {
    throw new ApiError((payload && payload.message) || res.statusText, {
      status: res.status,
      code: payload && payload.code,
      details: payload
    });
  }

  return payload;
}

/** Simulated network latency + jitter so mock UI states feel real. */
export function mockDelay(ms = 500) {
  const jitter = Math.random() * 250;
  return new Promise((resolve) => setTimeout(resolve, ms + jitter));
}
