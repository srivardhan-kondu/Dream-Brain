import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import FloatingBubbles from './components/FloatingBubbles.jsx';
import Landing from './pages/Landing.jsx';
import AgeSelect from './pages/AgeSelect.jsx';
import Quiz from './pages/Quiz.jsx';
import Results from './pages/Results.jsx';

export default function App() {
  const location = useLocation();

  // Always start a new screen at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen">
      <FloatingBubbles />
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/start" element={<AgeSelect />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/results/:id" element={<Results />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}
