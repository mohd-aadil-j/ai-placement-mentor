import express from 'express';
import { generateLearningRoadmap, getUserRoadmaps, deleteRoadmap } from '../controllers/roadmapController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/roadmap/generate - Generate learning roadmap
router.post('/generate', authMiddleware, generateLearningRoadmap);

// GET /api/roadmap - Get all roadmaps for user
router.get('/', authMiddleware, getUserRoadmaps);

// DELETE /api/roadmap/:roadmapId - Delete a roadmap
router.delete('/:roadmapId', authMiddleware, deleteRoadmap);

export default router;
