import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { sendMessage, getConversationHistory } from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer storage setup
const uploadDir = path.join(process.cwd(), 'uploads', 'chat');
try { fs.mkdirSync(uploadDir, { recursive: true }); } catch (e) {}
const upload = multer({ dest: uploadDir });

// POST /api/chat/send - Send message to AI mentor (supports optional file)
router.post('/send', authMiddleware, upload.single('file'), sendMessage);

// GET /api/chat/history - Get conversation history
router.get('/history', authMiddleware, getConversationHistory);

export default router;
