import express from 'express';
import { 
  createInterview, 
  getUserInterviews, 
  updateInterviewRoundStatus,
  deleteInterview 
} from '../controllers/interviewController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/interview - Create a new interview schedule
router.post('/', authMiddleware, createInterview);

// GET /api/interview - Get all interviews for user
router.get('/', authMiddleware, getUserInterviews);

// PATCH /api/interview/:interviewId/round - Update round status
router.patch('/:interviewId/round', authMiddleware, updateInterviewRoundStatus);

// DELETE /api/interview/:interviewId - Delete an interview
router.delete('/:interviewId', authMiddleware, deleteInterview);

export default router;
