// Thin fetch wrapper around the Dream Brain API. Uses relative /api URLs which
// Vite proxies to the Express server in dev (see vite.config.js).

const BASE = '/api';

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
