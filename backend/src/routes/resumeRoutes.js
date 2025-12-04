import express from 'express';
import { upload, uploadResume, analyzeResumeById, getUserResumes, deleteResume, downloadResume } from '../controllers/resumeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/resume/upload - Upload and parse PDF resume
router.post('/upload', authMiddleware, upload.single('resume'), uploadResume);

// POST /api/resume/analyze/:resumeId - Analyze resume using AI
router.post('/analyze/:resumeId', authMiddleware, analyzeResumeById);

// GET /api/resume - Get all resumes for authenticated user
router.get('/', authMiddleware, getUserResumes);

// DELETE /api/resume/:resumeId - Delete a resume
router.delete('/:resumeId', authMiddleware, deleteResume);

// GET /api/resume/:resumeId/download - Download resume file
router.get('/:resumeId/download', authMiddleware, downloadResume);

export default router;
