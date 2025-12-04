import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { 
  sendMessageToAssistant, 
  getAssistantConversation,
  clearAssistantConversation 
} from '../controllers/classroomController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer storage setup
const uploadDir = path.join(process.cwd(), 'uploads', 'classroom');
try { fs.mkdirSync(uploadDir, { recursive: true }); } catch (e) {}
const upload = multer({ dest: uploadDir });

// POST /api/classroom/send - Send message to assistant (supports optional file)
router.post('/send', authMiddleware, upload.single('file'), sendMessageToAssistant);

// GET /api/classroom/:assistantType - Get conversation history
router.get('/:assistantType', authMiddleware, getAssistantConversation);

// DELETE /api/classroom/:assistantType - Clear conversation
router.delete('/:assistantType', authMiddleware, clearAssistantConversation);

export default router;
