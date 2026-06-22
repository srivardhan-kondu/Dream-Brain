import { createContext, useContext, useMemo, useState } from 'react';

// Holds the in-progress journey: which age group was picked, the loaded
// questions, the user's answers, and the most recently computed report (so the
// results screen can render instantly without an extra round-trip).
const AssessmentContext = createContext(null);

export function AssessmentProvider({ children }) {
  const [group, setGroup] = useState(null); // age group object
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({}); // questionId -> optionId
  const [report, setReport] = useState(null); // { id, group, report }

  const value = useMemo(
    () => ({
      group,
      setGroup,
      questions,
      setQuestions,
      responses,
      setResponses,
      report,
      setReport,
      reset() {
        setQuestions([]);
        setResponses({});
        setReport(null);
      },
    }),
    [group, questions, responses, report]
  );

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error('useAssessment must be used within AssessmentProvider');
  return ctx;
}
