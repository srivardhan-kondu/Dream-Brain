import { Router } from 'express';
import { getMeta } from '../controllers/metaController.js';
import { getQuestions } from '../controllers/questionController.js';
import { submitAssessment, getAssessment } from '../controllers/assessmentController.js';

const router = Router();

// Small async wrapper so controller throws become 500s instead of hanging.
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/health', (req, res) => res.json({ ok: true, service: 'dream-brain-api' }));
router.get('/meta', wrap(getMeta));
router.get('/questions/:ageGroup', wrap(getQuestions));
router.post('/assessments', wrap(submitAssessment));
router.get('/assessments/:id', wrap(getAssessment));

export default router;
