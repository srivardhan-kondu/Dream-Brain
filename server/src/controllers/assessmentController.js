import { Question } from '../models/Question.js';
import { Assessment } from '../models/Assessment.js';
import { computeReport } from '../services/scoring.js';
import { AGE_GROUPS } from '../data/catalog.js';

const VALID_GROUPS = new Set(AGE_GROUPS.map((g) => g.key));

// POST /api/assessments  { ageGroup, nickname?, responses:[{questionId, optionId}] }
export async function submitAssessment(req, res) {
  const { ageGroup, nickname = '', responses } = req.body || {};

  if (!VALID_GROUPS.has(ageGroup)) {
    return res.status(400).json({ error: 'Unknown age group.' });
  }
  if (!Array.isArray(responses) || responses.length === 0) {
    return res.status(400).json({ error: 'No responses provided.' });
  }

  const questions = await Question.find({ ageGroup });
  if (!questions.length) {
    return res.status(404).json({ error: 'No questions found for this age group. Has the database been seeded?' });
  }

  const report = computeReport(questions, responses, ageGroup);

  const assessment = await Assessment.create({
    ageGroup,
    nickname: String(nickname).slice(0, 60),
    responses,
    result: report,
  });

  const group = AGE_GROUPS.find((g) => g.key === ageGroup);
  res.status(201).json({ id: String(assessment._id), group, report });
}

// GET /api/assessments/:id  -> a previously saved report
export async function getAssessment(req, res) {
  const assessment = await Assessment.findById(req.params.id).lean().catch(() => null);
  if (!assessment) {
    return res.status(404).json({ error: 'Report not found.' });
  }
  const group = AGE_GROUPS.find((g) => g.key === assessment.ageGroup);
  res.json({ id: String(assessment._id), group, nickname: assessment.nickname, report: assessment.result });
}
