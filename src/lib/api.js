// ─── API base URL ─────────────────────────────────────────────────────────────
// Priority: VITE_BACKEND_URL env var → production default
export const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'https://api.vcron.cloud';

export const API = `${BACKEND_URL}/api`;

// ─── Token helpers ────────────────────────────────────────────────────────────
export function getStoredToken() {
  return localStorage.getItem('vchron_token') || null;
}

export function setStoredToken(token) {
  if (token) localStorage.setItem('vchron_token', token);
}

export function clearStoredToken() {
  localStorage.removeItem('vchron_token');
}

// ─── Authenticated fetch ──────────────────────────────────────────────────────
// Sends both the session cookie (for same-origin) AND an Authorization Bearer
// header (for cross-origin / localStorage token fallback).
export function authFetch(url, options = {}) {
  const token = getStoredToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return fetch(url, { ...options, credentials: 'include', headers });
}
