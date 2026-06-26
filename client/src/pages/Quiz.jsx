import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/client.js';
import { useAssessment } from '../store/AssessmentContext.jsx';
import TopBar from '../components/TopBar.jsx';
import CircularTimer from '../components/CircularTimer.jsx';

const PER_QUESTION = 10; // seconds

export default function Quiz() {
  const navigate = useNavigate();
  const { group, questions, responses, setResponses, setReport } = useAssessment();

  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(PER_QUESTION);
  const [view, setView] = useState('grid');
  const [picked, setPicked] = useState(null); // optionId currently animating
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const advancing = useRef(false);

  // No questions in memory (e.g. refresh / deep link) → restart the journey.
  useEffect(() => {
    if (!group || questions.length === 0) navigate('/start', { replace: true });
  }, [group, questions, navigate]);

  const question = questions[index];
  const total = questions.length;
  const isLast = index === total - 1;

  const submit = useCallback(
    async (finalResponses) => {
      setSubmitting(true);
      try {
        const payload = {
          ageGroup: group.key,
          responses: Object.entries(finalResponses).map(([questionId, optionId]) => ({ questionId, optionId })),
        };
        const result = await api.submitAssessment(payload);
        setReport(result);
        navigate(`/results/${result.id}`);
      } catch (e) {
        setError(e.message);
        setSubmitting(false);
        advancing.current = false;
      }
    },
    [group, navigate, setReport]
  );

  const goNext = useCallback(
    (finalResponses) => {
      if (isLast) {
        submit(finalResponses);
      } else {
        setIndex((i) => i + 1);
        setSeconds(PER_QUESTION);
        setPicked(null);
        advancing.current = false;
      }
    },
    [isLast, submit]
  );

  // Per-question countdown. On reaching 0, advance with whatever is answered.
  useEffect(() => {
    if (!question || advancing.current) return undefined;
    if (seconds <= 0) {
      advancing.current = true;
      goNext(responses);
      return undefined;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, question, goNext, responses]);

  function choose(optionId) {
    if (advancing.current || !question) return;
    advancing.current = true;
    setPicked(optionId);
    const next = { ...responses, [question.id]: optionId };
    setResponses(next);
    setTimeout(() => goNext(next), 480);
  }

  if (!question) return null;

  const progress = ((index + (picked ? 1 : 0)) / total) * 100;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <TopBar />
      <section className="mx-auto flex min-h-[calc(100vh-88px)] max-w-3xl flex-col justify-center px-6 pb-16">
        <div className="glass-card p-8 sm:p-10">
          {/* Header: progress + view toggle */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-500">
                Question {index + 1} of {total}
              </p>
              <div className="mt-2 h-1.5 w-44 overflow-hidden rounded-full bg-brand-100">
                <motion.div
                  className="h-full rounded-full bg-brand"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
            <div className="flex rounded-full bg-brand-100 p-1 text-sm font-bold">
              {['grid', 'list'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`rounded-full px-4 py-1.5 capitalize transition ${
                    view === v ? 'bg-brand text-white shadow' : 'text-brand-500'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mt-8 flex items-center gap-6">
                <CircularTimer seconds={seconds} total={PER_QUESTION} />
                <h2 className="font-serif text-3xl font-semibold leading-snug text-ink">{question.text}</h2>
              </div>

              <div className={`mt-8 grid gap-4 ${view === 'grid' ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
                {question.options.map((o) => {
                  const isPicked = picked === o.id;
                  return (
                    <motion.button
                      key={o.id}
                      onClick={() => choose(o.id)}
                      disabled={advancing.current}
                      whileHover={{ scale: advancing.current ? 1 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-4 rounded-3xl border-2 p-5 text-left transition ${
                        isPicked
                          ? 'border-brand bg-brand-50'
                          : 'border-brand-100 bg-white/80 hover:border-brand-300'
                      }`}
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold transition ${
                          isPicked ? 'bg-brand text-white' : 'bg-brand-100 text-brand-600'
                        }`}
                      >
                        {o.id}
                      </span>
                      <span className="font-semibold text-ink">{o.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <p className="mt-8 text-center text-sm text-slate-400">
            {submitting ? 'Mapping your brain…' : 'Choose what feels most true — there are no wrong answers.'}
          </p>
          {error && <p className="mt-3 text-center text-sm font-semibold text-amber-600">{error}</p>}
        </div>
      </section>
    </motion.div>
  );
}
