import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/client.js';
import { useAssessment } from '../store/AssessmentContext.jsx';
import TopBar from '../components/TopBar.jsx';

// Small smiling avatar tinted with the group's colour.
function FaceAvatar({ color }) {
  return (
    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl" style={{ background: color }}>
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <circle cx="12" cy="14" r="2.4" fill="#fff" />
        <circle cx="22" cy="14" r="2.4" fill="#fff" />
        <path d="M11 20c2 2.6 10 2.6 12 0" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

export default function AgeSelect() {
  const navigate = useNavigate();
  const { setGroup, setQuestions, setResponses, setReport } = useAssessment();
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');
  const [loadingKey, setLoadingKey] = useState(null);

  useEffect(() => {
    api
      .getMeta()
      .then((d) => setGroups(d.ageGroups))
      .catch((e) => setError(e.message));
  }, []);

  async function choose(group) {
    if (loadingKey) return;
    setLoadingKey(group.key);
    try {
      const data = await api.getQuestions(group.key);
      setGroup(group);
      setQuestions(data.questions);
      setResponses({});
      setReport(null);
      navigate('/quiz');
    } catch (e) {
      setError(e.message);
      setLoadingKey(null);
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <TopBar />
      <section className="mx-auto max-w-5xl px-6 pb-20 pt-6 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-400">Step 1 of 2</p>
        <h1 className="mt-4 text-5xl font-semibold text-ink">Who is taking the journey?</h1>
        <p className="mt-4 text-lg text-slate-500">We gently shape the questions to fit your stage of growing.</p>

        {error && (
          <p className="mx-auto mt-6 max-w-md rounded-2xl bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-700">
            {error}
          </p>
        )}

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {groups.map((g, i) => (
            <motion.button
              key={g.key}
              onClick={() => choose(g)}
              disabled={!!loadingKey}
              className="glass-card group flex items-start gap-5 p-7 text-left transition hover:-translate-y-1 hover:shadow-card disabled:opacity-60"
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.08 * i }}
              whileTap={{ scale: 0.98 }}
            >
              <FaceAvatar color={g.color} />
              <div>
                <span
                  className="pill px-3 py-1 text-xs font-bold text-white"
                  style={{ background: g.color }}
                >
                  {g.range}
                </span>
                <h3 className="mt-2 text-2xl font-bold text-ink">{g.name}</h3>
                <p className="mt-1 text-slate-500">{g.description}</p>
                {loadingKey === g.key && (
                  <p className="mt-2 text-sm font-semibold text-brand-500">Preparing your questions…</p>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        <button onClick={() => navigate('/')} className="mt-12 font-semibold text-slate-500 hover:text-ink">
          ← Back
        </button>
      </section>
    </motion.div>
  );
}
