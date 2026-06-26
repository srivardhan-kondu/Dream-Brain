import { Question } from '../models/Question.js';
import { AGE_GROUPS } from '../data/catalog.js';

const VALID_GROUPS = new Set(AGE_GROUPS.map((g) => g.key));

const SESSION_SIZE = 60; // full evaluation — all 60 questions for the age group

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Draw a balanced sample of `count` questions by round-robin across metrics, so a
// short session still touches as many trait dimensions as possible. Returns a
// fresh random selection each call (re-takers get variety from the 60-item pool).
function sampleBalanced(docs, count) {
  if (docs.length <= count) return shuffle(docs);
  const byMetric = {};
  for (const q of shuffle(docs)) (byMetric[q.metric] ||= []).push(q);
  const metrics = Object.keys(byMetric);
  const out = [];
  let i = 0;
  while (out.length < count && i < count * metrics.length) {
    const bucket = byMetric[metrics[i % metrics.length]];
    if (bucket && bucket.length) out.push(bucket.pop());
    i++;
  }
  return shuffle(out);
}

// GET /api/questions/:ageGroup  -> a balanced session of questions (without weights)
export async function getQuestions(req, res) {
  const { ageGroup } = req.params;
  if (!VALID_GROUPS.has(ageGroup)) {
    return res.status(400).json({ error: 'Unknown age group.' });
  }

  const docs = await Question.find({ ageGroup }).lean();
  if (!docs.length) {
    return res.status(404).json({ error: 'No questions found for this age group. Has the database been seeded?' });
  }

  const session = sampleBalanced(docs, SESSION_SIZE);

  // Strip scoring weights so answers can't be reverse-engineered on the client.
  const questions = session.map((q) => ({
    id: String(q._id),
    category: q.category,
    text: q.text,
    options: q.options.map((o) => ({ id: o.id, label: o.label })),
  }));

  res.json({ ageGroup, count: questions.length, questions });
}
