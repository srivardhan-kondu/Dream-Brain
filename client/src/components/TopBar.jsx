import { Link } from 'react-router-dom';
import BrainMascot from './BrainMascot.jsx';

// Minimal sticky header with the brand mark.
export default function TopBar() {
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
      <Link to="/" className="flex items-center gap-3">
        <BrainMascot size={26} withRing={false} />
        <span className="font-serif text-xl font-semibold text-ink">Dream Brain</span>
      </Link>
      <span className="pill bg-white/70 text-brand-600 shadow-soft">
        <span className="h-2 w-2 rounded-full bg-brand" />
        A gentle mind assessment
      </span>
    </header>
  );
}
