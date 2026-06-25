// Thin fetch wrapper around the Dream Brain API.
// In dev, relative /api URLs are proxied to Express by Vite (see vite.config.js).
// In production, set VITE_API_URL to the deployed API origin (e.g. your Render URL)
// so the client talks to the backend across domains.
const BASE = `${import.meta.env.VITE_API_URL ?? ''}/api`;

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  getMeta: () => request('/meta'),
  getQuestions: (ageGroup) => request(`/questions/${ageGroup}`),
  submitAssessment: (payload) =>
    request('/assessments', { method: 'POST', body: JSON.stringify(payload) }),
  getAssessment: (id) => request(`/assessments/${id}`),
};
