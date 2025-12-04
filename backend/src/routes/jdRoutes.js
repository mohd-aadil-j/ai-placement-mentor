import express from 'express';
import { createJobProfile, getUserJobProfiles, deleteJobProfile } from '../controllers/jdController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/jd - Create a new job profile
router.post('/', authMiddleware, createJobProfile);

// GET /api/jd - Get all job profiles for authenticated user
router.get('/', authMiddleware, getUserJobProfiles);

// DELETE /api/jd/:jdId - Delete a job profile
router.delete('/:jdId', authMiddleware, deleteJobProfile);

export default router;
