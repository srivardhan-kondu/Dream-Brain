// The friendly brain mascot used on the landing screen and header.
export default function BrainMascot({ size = 120, withRing = true }) {
  return (
    <div
      className={`relative grid place-items-center rounded-full ${withRing ? 'bg-white shadow-soft' : ''}`}
      style={{ width: withRing ? size * 1.5 : size, height: withRing ? size * 1.5 : size }}
    >
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <defs>
          <linearGradient id="brainGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A99CF2" />
            <stop offset="100%" stopColor="#8B7CF6" />
          </linearGradient>
        </defs>
        {/* head / brain blob */}
        <path
          d="M44 24c-10 0-18 7-18 17 0 2 .4 4 1.1 5.7C23 49.7 20 54 20 59c0 6.6 5 12 11.4 12.5C32.6 77.8 38 82 44.4 82c2.4 0 4.7-.6 6.6-1.7 2 1.1 4.2 1.7 6.6 1.7 6.4 0 11.8-4.2 13-10.5C77 71 82 65.6 82 59c0-5-3-9.3-7.1-11.3.7-1.7 1.1-3.7 1.1-5.7 0-10-8-17-18-17-3.2 0-6.2 1-8.7 2.7C46.8 25 45.4 24 44 24Z"
          fill="url(#brainGrad)"
        />
        {/* gentle folds */}
        <path
          d="M51 34v40M40 44c3 2 7 2 11 0M62 56c-3 2-7 2-11 0M44 64c2 1.4 4.5 1.6 7 .6"
          stroke="#fff"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.7"
        />
        {/* face */}
        <circle cx="46" cy="58" r="3.4" fill="#2C2A4A" />
        <circle cx="62" cy="58" r="3.4" fill="#2C2A4A" />
        <circle cx="47.2" cy="56.9" r="1.1" fill="#fff" />
        <circle cx="63.2" cy="56.9" r="1.1" fill="#fff" />
        <path d="M48 66c3 3.4 9 3.4 12 0" stroke="#2C2A4A" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        {/* cheeks */}
        <circle cx="39" cy="64" r="4" fill="#F4A6C0" opacity="0.55" />
        <circle cx="69" cy="64" r="4" fill="#F4A6C0" opacity="0.55" />
      </svg>
    </div>
  );
}
