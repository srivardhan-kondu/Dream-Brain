import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BrainMascot from '../components/BrainMascot.jsx';

const FACTS = [
  { color: '#8B7CF6', text: '~20 sec per question' },
  { color: '#34D399', text: 'No right or wrong answers' },
  { color: '#F59E0B', text: 'Private & just for you' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <motion.section
      className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.span
        className="pill bg-white/80 text-brand-600 shadow-soft"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        <span className="grid h-5 w-5 place-items-center rounded-full bg-brand text-white">✦</span>
        A GENTLE MIND ASSESSMENT
      </motion.span>

      <motion.div
        className="my-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.1 }}
      >
        <BrainMascot size={92} />
      </motion.div>

      <motion.h1
        className="text-6xl font-semibold tracking-tight text-ink sm:text-7xl"
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.18 }}
      >
        Dream Brain
      </motion.h1>

      <motion.p
        className="mt-6 max-w-xl text-lg leading-relaxed text-slate-500"
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.26 }}
      >
        A calm, quick journey through how your mind feels, thinks and grows — ending with a
        personal map of your brain.
      </motion.p>

      <motion.button
        className="btn-primary mt-10 text-lg"
        onClick={() => navigate('/start')}
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.34 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        Begin the journey <span aria-hidden>→</span>
      </motion.button>

      <motion.div
        className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-slate-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.42 }}
      >
        {FACTS.map((f) => (
          <span key={f.text} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: f.color }} />
            {f.text}
          </span>
        ))}
      </motion.div>
    </motion.section>
  );
}
