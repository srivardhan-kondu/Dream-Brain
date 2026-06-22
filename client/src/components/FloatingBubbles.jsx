// Soft translucent spheres drifting in the background — the signature
// Dream Brain atmosphere. Purely decorative.
const BUBBLES = [
  { top: '12%', left: '8%', size: 90, delay: '0s', o: 0.5 },
  { top: '22%', left: '78%', size: 130, delay: '1.2s', o: 0.45 },
  { top: '62%', left: '14%', size: 150, delay: '0.6s', o: 0.4 },
  { top: '70%', left: '82%', size: 100, delay: '2s', o: 0.5 },
  { top: '40%', left: '46%', size: 70, delay: '1.6s', o: 0.35 },
  { top: '8%', left: '54%', size: 60, delay: '0.3s', o: 0.4 },
  { top: '84%', left: '40%', size: 110, delay: '2.4s', o: 0.35 },
];

export default function FloatingBubbles() {
  return (
    <div className="bubble-layer" aria-hidden="true">
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="absolute animate-float rounded-full"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            animationDelay: b.delay,
            opacity: b.o,
            background:
              'radial-gradient(circle at 32% 30%, rgba(255,255,255,0.95), rgba(214,206,247,0.35) 60%, rgba(214,206,247,0) 72%)',
            boxShadow: 'inset -8px -10px 24px rgba(170,150,230,0.25)',
          }}
        />
      ))}
    </div>
  );
}
