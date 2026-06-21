import {
  CATEGORIES,
  METRICS,
  METRICS_BY_CATEGORY,
  BRAIN_REGIONS,
  REGION_DETAILS,
  scoreLabel,
} from '../data/catalog.js';

const NEUTRAL = 65; // fallback when a metric is never touched by any answer

const round = (n) => Math.round(n);
const clamp = (n) => Math.max(0, Math.min(100, n));

// Normalise a stored weights value (Mongoose Map | plain object) to [key, value] pairs.
function weightEntries(weights) {
  if (!weights) return [];
  if (weights instanceof Map) return [...weights.entries()];
  return Object.entries(weights);
}

/**
 * Compute the full Dream Brain report from a set of responses.
 *
 * @param {Array} questions  Question docs/objects for the age group.
 * @param {Array} responses  [{ questionId, optionId }]
 * @param {string} ageGroup
 * @returns {object} report
 */
export function computeReport(questions, responses, ageGroup) {
  const byId = new Map(questions.map((q) => [String(q._id ?? q.id), q]));

  // 1. Accumulate metric contributions from each chosen option.
  const acc = {}; // metricKey -> { sum, count }
  for (const { questionId, optionId } of responses) {
    const question = byId.get(String(questionId));
    if (!question) continue;
    const option = question.options.find((o) => o.id === optionId);
    if (!option) continue;
    for (const [metric, value] of weightEntries(option.weights)) {
      if (!METRICS[metric]) continue;
      (acc[metric] ||= { sum: 0, count: 0 });
      acc[metric].sum += Number(value);
      acc[metric].count += 1;
    }
  }

  // 2. Average each touched metric.
  const metricScores = {};
  for (const key of Object.keys(METRICS)) {
    const a = acc[key];
    if (a && a.count) metricScores[key] = clamp(a.sum / a.count);
  }

  // 3. Fill untouched metrics from their category average, else neutral.
  for (const [category, keys] of Object.entries(METRICS_BY_CATEGORY)) {
    const present = keys.filter((k) => metricScores[k] != null).map((k) => metricScores[k]);
    const fallback = present.length ? present.reduce((s, v) => s + v, 0) / present.length : NEUTRAL;
    for (const k of keys) if (metricScores[k] == null) metricScores[k] = fallback;
  }

  // 4. Build category breakdown.
  const categories = Object.values(CATEGORIES).map((cat) => {
    const metrics = METRICS_BY_CATEGORY[cat.key].map((key) => {
      const score = round(metricScores[key]);
      return {
        key,
        name: METRICS[key].name,
        score,
        label: scoreLabel(score, METRICS[key].bipolar),
        slider: METRICS[key].slider || null,
      };
    });
    const avg = round(metrics.reduce((s, m) => s + m.score, 0) / metrics.length);
    return { ...cat, score: avg, label: scoreLabel(avg), metrics };
  });

  // 5. Brain regions, scored from their primary metric.
  const regions = BRAIN_REGIONS.map((r) => {
    const score = round(metricScores[r.metric]);
    return {
      key: r.key,
      name: r.name,
      subtitle: r.subtitle,
      zone: r.zone,
      categoryColor: r.categoryColor,
      pos: r.pos,
      score,
      label: scoreLabel(score),
      detail: REGION_DETAILS[r.key] || '',
    };
  });

  // 6. Dominant zones = the two highest-scoring regions.
  const dominantZones = [...regions]
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((r) => ({ key: r.key, name: r.name, zone: r.zone, categoryColor: r.categoryColor, score: r.score }));

  const overall = round(categories.reduce((s, c) => s + c.score, 0) / categories.length);

  return {
    ageGroup,
    overall,
    overallLabel: scoreLabel(overall),
    categories,
    regions,
    dominantZones,
    summary: buildSummary(dominantZones),
  };
}

function buildSummary(dominantZones) {
  if (dominantZones.length < 2) return 'Your mind shows a thoughtful, balanced profile with clear strengths to keep nurturing.';
  const [a, b] = dominantZones;
  return `Your mind shows its brightest activity in the ${a.name} and ${b.name}. These responses point to a thoughtful, balanced profile with clear strengths to keep nurturing.`;
}
