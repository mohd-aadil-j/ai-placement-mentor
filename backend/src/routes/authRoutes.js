import express from 'express';
import { register, login, getMe, updateMe, changePassword, uploadAvatar, syncLeetCode, syncGitHub } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { getLeetCode, getGitHub } from '../controllers/codingStatsController.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me
router.get('/me', authMiddleware, getMe);

// PUT /api/auth/me
router.put('/me', authMiddleware, updateMe);

// PUT /api/auth/change-password
router.put('/change-password', authMiddleware, changePassword);

// Configure multer storage for avatars
const avatarsDir = path.resolve('uploads', 'avatars');
if (!fs.existsSync(avatarsDir)) {
	fs.mkdirSync(avatarsDir, { recursive: true });
}
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, avatarsDir);
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname);
		const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
		cb(null, `${Date.now()}_${base}${ext}`);
	},
});
const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
		if (allowed.includes(file.mimetype)) return cb(null, true);
		cb(new Error('Only image files are allowed'));
	},
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// PUT /api/auth/avatar
router.put('/avatar', authMiddleware, upload.single('avatar'), uploadAvatar);

// PUT /api/auth/sync-leetcode
router.put('/sync-leetcode', authMiddleware, syncLeetCode);

// PUT /api/auth/sync-github
router.put('/sync-github', authMiddleware, syncGitHub);

// Public endpoints for coding stats (Phase 1)
// GET /api/coding/leetcode/:username
// GET /api/coding/github/:username
const codingRouter = express.Router();
codingRouter.get('/leetcode/:username', getLeetCode);
codingRouter.get('/github/:username', getGitHub);

export { codingRouter };

export default router;
