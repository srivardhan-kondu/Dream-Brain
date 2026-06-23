// Dream Brain question bank loader.
//
// The real, psychologist-style item bank lives in `dream_brain_question_bank.json`
// (240 items: 60 per age group, each mapping to one of the 11 trait dimensions).
// This module reads that file and transforms each item into a seed-ready Question
// document for the existing scoring engine — every option carries a single-metric
// `weights` map, so the engine averages weights per metric exactly as before.
//
// Source bank keys are mapped onto the app's catalog keys here, so the bank stays
// the single source of truth and can be regenerated without touching the engine.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const bank = JSON.parse(readFileSync(join(__dirname, 'dream_brain_question_bank.json'), 'utf8'));

// Bank ageGroup keys -> catalog age-group keys (see catalog.js AGE_GROUPS).
const AGE_GROUP_MAP = {
  below_12: 'little-explorer',
  age_12_14: 'bright-seeker',
  age_14_18: 'rising-mind',
  age_18_plus: 'open-thinker',
};

// Bank dimension names -> catalog metric keys (see catalog.js METRICS).
const METRIC_MAP = {
  'Emotional Stability': 'emotionalStability',
  'Mood Patterns': 'moodPatterns',
  Sensitivity: 'sensitivity',
  Memory: 'memory',
  Focus: 'focus',
  'Learning Speed': 'learningSpeed',
  Extroversion: 'extroversion',
  'Leadership Traits': 'leadershipTraits',
  'Social Comfort': 'socialComfort',
  'Anxiety Indicators': 'anxietyIndicators',
  'Pressure Handling': 'pressureHandling',
};

// Per-group running order counter so each group's questions get unique `order`s.
const orderByGroup = {};

export const ALL_QUESTIONS = bank.questions.map((item) => {
  const ageGroup = AGE_GROUP_MAP[item.ageGroup];
  const metric = METRIC_MAP[item.dimension];
  if (!ageGroup) throw new Error(`Unknown bank ageGroup: ${item.ageGroup}`);
  if (!metric) throw new Error(`Unknown bank dimension: ${item.dimension}`);

  orderByGroup[ageGroup] = (orderByGroup[ageGroup] || 0) + 1;

  return {
    ageGroup,
    order: orderByGroup[ageGroup],
    category: item.domain.toLowerCase(), // Emotional -> emotional, etc.
    metric, // primary metric this item scores (used for balanced sampling)
    text: item.text,
    options: item.options.map((o) => ({
      id: o.key,
      label: o.text,
      weights: { [metric]: o.weight },
    })),
  };
});

export const BANK_META = bank.meta;
