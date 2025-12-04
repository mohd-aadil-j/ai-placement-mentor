import express from 'express';
import { compareResumeAndJD, getUserAnalyses } from '../controllers/analysisController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/analysis/compare - Compare resume with job description
router.post('/compare', authMiddleware, compareResumeAndJD);

// GET /api/analysis - Get all analyses for authenticated user
router.get('/', authMiddleware, getUserAnalyses);

export default router;
