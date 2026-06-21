// Central catalog for Dream Brain: age groups, the four analysis categories,
// their sub-metrics, and the brain regions each metric lights up.
// Everything downstream (scoring, seeding, API responses) reads from here so the
// model stays consistent and is easy to extend when real questions arrive.

export const AGE_GROUPS = [
  {
    key: 'little-explorer',
    name: 'Little Explorer',
    range: 'Below 12',
    description: 'Playful, curious minds discovering how they feel.',
    color: '#34D399', // emerald
    minAge: 0,
    maxAge: 11,
  },
  {
    key: 'bright-seeker',
    name: 'Bright Seeker',
    range: '12 – 14',
    description: 'Growing thinkers finding their own voice.',
    color: '#60A5FA', // blue
    minAge: 12,
    maxAge: 14,
  },
  {
    key: 'rising-mind',
    name: 'Rising Mind',
    range: '14 – 18',
    description: 'Sharper focus, deeper feelings, bigger choices.',
    color: '#8B7CF6', // violet
    minAge: 14,
    maxAge: 18,
  },
  {
    key: 'open-thinker',
    name: 'Open Thinker',
    range: '18 +',
    description: 'Reflective adults mapping how they work.',
    color: '#7C6FE8', // deep violet
    minAge: 18,
    maxAge: 120,
  },
];

// The four top-level analysis lenses shown on the report.
export const CATEGORIES = {
  emotional: {
    key: 'emotional',
    name: 'Emotional Analysis',
    blurb: 'How feelings are sensed, held and balanced.',
    color: '#8B7CF6',
  },
  cognitive: {
    key: 'cognitive',
    name: 'Cognitive Analysis',
    blurb: 'How the mind remembers, focuses and learns.',
    color: '#34D399',
  },
  behavioral: {
    key: 'behavioral',
    name: 'Behavioral Analysis',
    blurb: 'How energy, leadership and connection show up.',
    color: '#60A5FA',
  },
  stress: {
    key: 'stress',
    name: 'Stress Analysis',
    blurb: 'How pressure is met and managed.',
    color: '#F59E0B',
  },
};

// Sub-metrics grouped under each category. `slider` metrics render as a
// left↔right scale (e.g. Introvert ↔ Extrovert) instead of a fill bar.
export const METRICS = {
  // Emotional
  emotionalStability: { key: 'emotionalStability', name: 'Emotional Stability', category: 'emotional' },
  moodPatterns: { key: 'moodPatterns', name: 'Mood Patterns', category: 'emotional' },
  sensitivity: { key: 'sensitivity', name: 'Sensitivity', category: 'emotional' },
  // Cognitive
  memory: { key: 'memory', name: 'Memory', category: 'cognitive' },
  focus: { key: 'focus', name: 'Focus', category: 'cognitive' },
  learningSpeed: { key: 'learningSpeed', name: 'Learning Speed', category: 'cognitive' },
  // Behavioral
  extroversion: { key: 'extroversion', name: 'Extroversion', category: 'behavioral', bipolar: true, slider: { low: 'Introvert', high: 'Extrovert' } },
  leadershipTraits: { key: 'leadershipTraits', name: 'Leadership Traits', category: 'behavioral' },
  socialComfort: { key: 'socialComfort', name: 'Social Comfort', category: 'behavioral' },
  // Stress
  anxietyIndicators: { key: 'anxietyIndicators', name: 'Anxiety Indicators', category: 'stress' },
  pressureHandling: { key: 'pressureHandling', name: 'Pressure Handling', category: 'stress' },
};

// Brain regions surfaced on the "Brain view" and "Active brain regions" panels.
// `metric` is the primary sub-metric that drives the region's score.
// `pos` is an approximate centre (0–100 of the brain illustration box) used to
// place the glow on the front-end SVG.
export const BRAIN_REGIONS = [
  { key: 'prefrontal-cortex', name: 'Prefrontal Cortex', metric: 'focus', categoryColor: 'cognitive', subtitle: 'Focus', zone: 'Cognitive', pos: { x: 26, y: 34 } },
  { key: 'frontal-lobe', name: 'Frontal Lobe', metric: 'leadershipTraits', categoryColor: 'behavioral', subtitle: 'Leadership', zone: 'Behavioral', pos: { x: 34, y: 30 } },
  { key: 'parietal-lobe', name: 'Parietal Lobe', metric: 'learningSpeed', categoryColor: 'cognitive', subtitle: 'Learning Speed', zone: 'Cognitive', pos: { x: 58, y: 26 } },
  { key: 'temporal-lobe', name: 'Temporal Lobe', metric: 'memory', categoryColor: 'cognitive', subtitle: 'Memory', zone: 'Cognitive', pos: { x: 44, y: 62 } },
  { key: 'limbic-system', name: 'Limbic System', metric: 'emotionalStability', categoryColor: 'emotional', subtitle: 'Emotional Stability', zone: 'Emotional', pos: { x: 52, y: 50 } },
  { key: 'amygdala', name: 'Amygdala', metric: 'pressureHandling', categoryColor: 'stress', subtitle: 'Pressure Handling', zone: 'Stress', pos: { x: 60, y: 58 } },
];

// Short, supportive copy for each region used on the brain detail card.
export const REGION_DETAILS = {
  'prefrontal-cortex': 'Plans, decides and keeps attention steady on what matters.',
  'frontal-lobe': 'Drives initiative, leadership and taking the first step.',
  'parietal-lobe': 'Connects ideas and helps new learning click into place.',
  'temporal-lobe': 'Stores memories and makes meaning from sound and words.',
  'limbic-system': 'Holds emotion steady and keeps moods in gentle balance.',
  'amygdala': 'Reads pressure and signals how to respond under stress.',
};

// Qualitative, non-judgemental labels for a 0–100 score.
// Bipolar metrics (e.g. Extroversion) describe a direction on a scale rather than
// a strength, so they get their own neutral, non-judgemental band labels.
export function scoreLabel(score, bipolar = false) {
  if (bipolar) {
    if (score >= 66) return 'Outgoing';
    if (score >= 40) return 'Balanced';
    return 'Reflective';
  }
  if (score >= 70) return 'Strong';
  if (score >= 50) return 'Balanced';
  return 'Growing';
}

export const METRICS_BY_CATEGORY = Object.values(METRICS).reduce((acc, m) => {
  (acc[m.category] ||= []).push(m.key);
  return acc;
}, {});
