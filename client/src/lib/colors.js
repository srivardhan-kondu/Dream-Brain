// Category → colour mapping mirrored from the server catalog so meters, dots
// and the brain map all stay visually consistent.
export const CATEGORY_COLORS = {
  emotional: '#8B7CF6',
  cognitive: '#34D399',
  behavioral: '#60A5FA',
  stress: '#F59E0B',
};

export const LABEL_STYLES = {
  Strong: 'bg-emerald-100 text-emerald-700',
  Balanced: 'bg-sky-100 text-sky-700',
  Growing: 'bg-amber-100 text-amber-700',
  // Bipolar (Extroversion) — neutral, non-judgemental band labels.
  Outgoing: 'bg-violet-100 text-violet-700',
  Reflective: 'bg-indigo-100 text-indigo-700',
};

export function categoryColor(key) {
  return CATEGORY_COLORS[key] || '#7C6FE8';
}
