import { categoryColor } from '../lib/colors.js';

// A stylised, glowing brain. Regions are placed by their normalised (x, y)
// position; each glow's size/opacity scales with its score, and the selected
// region gets a dashed focus ring — mirroring the reference design.
export default function BrainMap({ regions, selectedKey, onSelect }) {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <svg viewBox="0 0 100 92" className="w-full">
        <defs>
          {regions.map((r) => (
            <radialGradient key={r.key} id={`glow-${r.key}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={categoryColor(r.categoryColor)} stopOpacity="0.85" />
              <stop offset="55%" stopColor={categoryColor(r.categoryColor)} stopOpacity="0.35" />
              <stop offset="100%" stopColor={categoryColor(r.categoryColor)} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {/* Brain silhouette built from soft overlapping lobes */}
        <g stroke="#B7AEEA" strokeWidth="0.6" fill="#C9C0F1" fillOpacity="0.16">
          <ellipse cx="42" cy="44" rx="34" ry="27" />
          <ellipse cx="36" cy="34" rx="16" ry="13" />
          <ellipse cx="56" cy="32" rx="15" ry="12" />
          <ellipse cx="30" cy="50" rx="13" ry="12" />
          <ellipse cx="52" cy="54" rx="15" ry="13" />
          <ellipse cx="66" cy="48" rx="12" ry="13" />
          {/* cerebellum + brain stem */}
          <ellipse cx="72" cy="66" rx="9" ry="8" />
          <path d="M70 73 q2 10 -4 14" fill="none" strokeWidth="0.8" />
        </g>
        <g stroke="#A99CF2" strokeWidth="0.5" fill="none" opacity="0.55">
          <path d="M20 44 q14 -10 28 -2 q12 7 26 1" />
          <path d="M24 56 q16 6 30 -1 q10 -5 18 1" />
          <path d="M44 20 v50" />
        </g>

        {/* Region glows */}
        {regions.map((r) => {
          const radius = 7 + (r.score / 100) * 9; // 7–16
          const selected = r.key === selectedKey;
          return (
            <g key={r.key} className="cursor-pointer" onClick={() => onSelect?.(r.key)}>
              <circle cx={r.pos.x} cy={r.pos.y} r={radius} fill={`url(#glow-${r.key})`} className="animate-pulseGlow" />
              <circle cx={r.pos.x} cy={r.pos.y} r="2.1" fill={categoryColor(r.categoryColor)} />
              {selected && (
                <circle
                  cx={r.pos.x}
                  cy={r.pos.y}
                  r={radius + 4}
                  fill="none"
                  stroke="#2C2A4A"
                  strokeWidth="0.7"
                  strokeDasharray="2 2"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
