import { AGE_GROUPS, CATEGORIES, METRICS, BRAIN_REGIONS } from '../data/catalog.js';

// Static reference data the client uses to render age cards, legends, etc.
export function getMeta(req, res) {
  res.json({
    ageGroups: AGE_GROUPS,
    categories: Object.values(CATEGORIES),
    metrics: Object.values(METRICS),
    regions: BRAIN_REGIONS.map(({ key, name, subtitle, zone, categoryColor, pos }) => ({
      key,
      name,
      subtitle,
      zone,
      categoryColor,
      pos,
    })),
  });
}
