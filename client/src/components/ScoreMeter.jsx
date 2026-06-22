import { motion } from 'framer-motion';
import { LABEL_STYLES } from '../lib/colors.js';

// A single sub-metric row: name + label chip on top, animated fill bar below.
// When `slider` is provided it renders a centre-knob scale (e.g. Introvert ↔
// Extrovert) instead of a left-anchored fill.
export default function ScoreMeter({ name, score, label, color, slider }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold text-ink">{name}</span>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${LABEL_STYLES[label] || 'bg-brand-100 text-brand-700'}`}>
          {label}
        </span>
      </div>

      {slider ? (
        <div>
          <div className="relative h-2 rounded-full bg-brand-100">
            <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${score}%`, background: color }} />
            <motion.div
              className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ink bg-white shadow"
              initial={{ left: '50%' }}
              animate={{ left: `${score}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 16 }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs font-semibold text-brand-400">
            <span>{slider.low}</span>
            <span>{slider.high}</span>
          </div>
        </div>
      ) : (
        <div className="h-2.5 overflow-hidden rounded-full bg-brand-100">
          <motion.div
            className="h-full rounded-full"
            style={{ background: color }}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
        </div>
      )}
    </div>
  );
}
