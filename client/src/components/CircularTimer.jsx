// Countdown ring shown beside each question. Pure presentational — the parent
// owns the ticking and passes the remaining seconds.
export default function CircularTimer({ seconds, total }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, seconds / total));
  const dash = c * pct;
  const low = seconds <= 5;

  return (
    <div className="relative grid h-[88px] w-[88px] shrink-0 place-items-center">
      <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
        <circle cx="44" cy="44" r={r} fill="none" stroke="#E6E2FB" strokeWidth="6" />
        <circle
          cx="44"
          cy="44"
          r={r}
          fill="none"
          stroke={low ? '#F59E0B' : '#7C6FE8'}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - dash}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="font-serif text-2xl font-semibold text-ink">{seconds}</span>
        <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-400">sec</span>
      </div>
    </div>
  );
}
