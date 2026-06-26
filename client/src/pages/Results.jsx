import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api/client.js';
import { useAssessment } from '../store/AssessmentContext.jsx';
import TopBar from '../components/TopBar.jsx';
import { lazy, Suspense } from 'react';
const Brain3D = lazy(() => import('../components/Brain3D.jsx'));
import ScoreMeter from '../components/ScoreMeter.jsx';
import { categoryColor, LABEL_STYLES } from '../lib/colors.js';

const LEGEND = [
  { key: 'emotional', name: 'Emotional' },
  { key: 'cognitive', name: 'Cognitive' },
  { key: 'behavioral', name: 'Behavioral' },
  { key: 'stress', name: 'Stress' },
];

export default function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { report: cached, reset } = useAssessment();

  const [data, setData] = useState(() => (cached && cached.id === id ? cached : null));
  const [error, setError] = useState('');
  const [view, setView] = useState('brain');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (data) return;
    api
      .getAssessment(id)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [id, data]);

  const report = data?.report;
  const group = data?.group;

  // Default the highlighted region to the top dominant zone.
  useEffect(() => {
    if (report && !selected) setSelected(report.dominantZones[0]?.key);
  }, [report, selected]);

  const activeRegion = useMemo(
    () => report?.regions.find((r) => r.key === selected) || report?.regions[0],
    [report, selected]
  );

  function saveReport() {
    const blob = new Blob([JSON.stringify({ id, group, report }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dream-brain-report-${id}.json`;
    // Firefox needs the anchor in the DOM, and revoking must be deferred until
    // the download has actually started or the click is cancelled.
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function takeAgain() {
    reset();
    navigate('/start');
  }

  if (error) {
    return (
      <div>
        <TopBar />
        <div className="mx-auto mt-20 max-w-md px-6 text-center">
          <p className="rounded-2xl bg-amber-100 px-4 py-3 font-semibold text-amber-700">{error}</p>
          <button onClick={() => navigate('/start')} className="btn-primary mt-6">
            Start again
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div>
        <TopBar />
        <p className="mt-24 text-center font-semibold text-slate-500">Loading your brain map…</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <TopBar />
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-4">
        {/* Title */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">
            {group?.name} · {group?.range} · Brain Analysis Report
          </p>
          <h1 className="mt-3 text-5xl font-semibold text-ink sm:text-6xl">Inside Your Dream Brain</h1>

          <div className="mt-7 inline-flex rounded-full bg-white/70 p-1 text-sm font-bold shadow-soft">
            {['brain', 'data'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-full px-6 py-2.5 capitalize transition ${
                  view === v ? 'bg-brand text-white shadow' : 'text-slate-500'
                }`}
              >
                {v} view
              </button>
            ))}
          </div>
        </div>

        {/* Hero panel */}
        <div className="glass-card mt-8 p-6 sm:p-9">
          {view === 'brain' ? (
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <Suspense fallback={<div className="flex h-[440px] items-center justify-center rounded-3xl bg-[#04020d] text-sm text-white/40">Loading 3D brain…</div>}>
                  <Brain3D regions={report.regions} selectedKey={selected} onSelect={setSelected} />
                </Suspense>
                <div className="mt-4 flex flex-wrap justify-center gap-5 text-sm font-semibold text-slate-500">
                  {LEGEND.map((l) => (
                    <span key={l.key} className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: categoryColor(l.key) }} />
                      {l.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl border border-white/70 bg-white/70 p-6">
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Dominant Zones</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {report.dominantZones.map((z) => (
                      <span
                        key={z.key}
                        className="pill px-4 py-2 font-bold text-white"
                        style={{ background: categoryColor(z.categoryColor) }}
                      >
                        {z.name}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 leading-relaxed text-slate-600">{report.summary}</p>
                </div>

                {activeRegion && (
                  <motion.div
                    key={activeRegion.key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border border-white/70 bg-white/60 p-6"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="grid h-12 w-12 place-items-center rounded-2xl text-lg font-bold text-white"
                        style={{ background: categoryColor(activeRegion.categoryColor) }}
                      >
                        {activeRegion.score}
                      </span>
                      <div>
                        <h3 className="text-xl font-bold text-ink">{activeRegion.name}</h3>
                        <p className="text-sm text-slate-500">
                          {activeRegion.zone} zone · {activeRegion.subtitle}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 leading-relaxed text-slate-600">{activeRegion.detail}</p>
                    <p className="mt-3 text-sm text-slate-400">Tap a glowing region or a card below to explore.</p>
                  </motion.div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {report.categories.map((c) => (
                <div key={c.key} className="rounded-3xl border border-white/70 bg-white/70 p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-serif text-xl font-semibold text-ink">
                      <span className="h-3 w-3 rounded-full" style={{ background: categoryColor(c.key) }} />
                      {c.name}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${LABEL_STYLES[c.label]}`}>
                      {c.score} · {c.label}
                    </span>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-brand-100">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: categoryColor(c.key) }}
                      initial={{ width: 0 }}
                      animate={{ width: `${c.score}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <p className="mt-3 text-sm text-slate-500">{c.blurb}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detailed analysis cards */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {report.categories.map((c, i) => (
            <motion.div
              key={c.key}
              className="glass-card p-7"
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.08 * i }}
            >
              <h3 className="flex items-center gap-2.5 font-serif text-2xl font-semibold text-ink">
                <span className="h-3 w-3 rounded-full" style={{ background: categoryColor(c.key) }} />
                {c.name}
              </h3>
              <p className="mt-1 text-slate-500">{c.blurb}</p>
              <div className="mt-6 space-y-5">
                {c.metrics.map((m) => (
                  <ScoreMeter
                    key={m.key}
                    name={m.name}
                    score={m.score}
                    label={m.label}
                    color={categoryColor(c.key)}
                    slider={m.slider}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Active brain regions */}
        <div className="glass-card mt-8 p-7 sm:p-9">
          <h3 className="font-serif text-3xl font-semibold text-ink">Active brain regions</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {report.regions.map((r) => {
              const isActive = r.key === selected;
              return (
                <button
                  key={r.key}
                  onClick={() => {
                    setSelected(r.key);
                    setView('brain');
                  }}
                  className={`rounded-3xl border-2 p-5 text-left transition hover:-translate-y-0.5 ${
                    isActive ? 'bg-white/80' : 'border-brand-100 bg-white/50'
                  }`}
                  style={isActive ? { borderColor: categoryColor(r.categoryColor) } : undefined}
                >
                  <div className="flex items-start justify-between">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: categoryColor(r.categoryColor) }} />
                    <span className="font-serif text-3xl font-semibold text-ink">{r.score}</span>
                  </div>
                  <h4 className="mt-3 text-lg font-bold text-ink">{r.name}</h4>
                  <p className="text-sm text-slate-500">{r.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button onClick={takeAgain} className="btn-primary">
            Take it again
          </button>
          <button onClick={saveReport} className="btn-ghost">
            Save report
          </button>
        </div>

        <p className="mx-auto mt-8 max-w-xl text-center text-sm leading-relaxed text-slate-400">
          This reflective profile is designed for self-awareness and learning — it is not a medical or
          clinical diagnosis.
        </p>
      </section>
    </motion.div>
  );
}
