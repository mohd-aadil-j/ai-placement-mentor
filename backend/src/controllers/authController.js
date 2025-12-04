import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { fetchLeetCodeStats, fetchGitHubStats } from './codingStatsController.js';

/**
 * Register a new user
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, targetRole } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      email,
      passwordHash,
      targetRole: targetRole || '',
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        avatarUrl: user.avatarUrl || '',
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        avatarUrl: user.avatarUrl || '',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

/**
 * Get current authenticated user profile
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      targetRole: user.targetRole,
      avatarUrl: user.avatarUrl || '',
      leetcodeUsername: user.leetcodeUsername || '',
      githubUsername: user.githubUsername || '',
      leetcodeData: user.leetcodeData || {},
      githubData: user.githubData || {},
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

/**
 * Update current user profile (name, targetRole)
 */
export const updateMe = async (req, res) => {
  try {
    const { name, targetRole, leetcodeUsername, githubUsername } = req.body;
    const updates = {};
    if (typeof name === 'string') updates.name = name;
    if (typeof targetRole === 'string') updates.targetRole = targetRole;
    if (typeof leetcodeUsername === 'string') updates.leetcodeUsername = leetcodeUsername;
    if (typeof githubUsername === 'string') updates.githubUsername = githubUsername;

    const user = await User.findByIdAndUpdate(req.user.userId, updates, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      message: 'Profile updated',
      user: { id: user._id, name: user.name, email: user.email, targetRole: user.targetRole, avatarUrl: user.avatarUrl || '' },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

/**
 * Upload avatar image and update profile
 */
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { avatarUrl },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      message: 'Avatar updated',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        avatarUrl: user.avatarUrl || '',
      },
      avatarUrl: user.avatarUrl || '',
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ message: 'Error uploading avatar', error: error.message });
  }
};

/**
 * Sync LeetCode stats: fetch from API and store in user document
 */
export const syncLeetCode = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.leetcodeUsername) {
      return res.status(400).json({ message: 'LeetCode username not set in profile' });
    }
    const data = await fetchLeetCodeStats(user.leetcodeUsername);
    if (data.error) return res.status(404).json({ message: data.error });
    user.leetcodeData = data;
    await user.save();
    res.json({
      message: 'LeetCode stats synced',
      leetcodeData: user.leetcodeData,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        avatarUrl: user.avatarUrl || '',
        leetcodeUsername: user.leetcodeUsername || '',
        githubUsername: user.githubUsername || '',
        leetcodeData: user.leetcodeData || {},
        githubData: user.githubData || {},
      },
    });
  } catch (error) {
    console.error('Sync LeetCode error:', error);
    res.status(500).json({ message: 'Error syncing LeetCode', error: error.message });
  }
};

/**
 * Sync GitHub stats: fetch from API and store in user document
 */
export const syncGitHub = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.githubUsername) {
      return res.status(400).json({ message: 'GitHub username not set in profile' });
    }
    const data = await fetchGitHubStats(user.githubUsername);
    if (data.error) return res.status(404).json({ message: data.error });
    user.githubData = data;
    await user.save();
    res.json({
      message: 'GitHub stats synced',
      githubData: user.githubData,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        avatarUrl: user.avatarUrl || '',
        leetcodeUsername: user.leetcodeUsername || '',
        githubUsername: user.githubUsername || '',
        leetcodeData: user.leetcodeData || {},
        githubData: user.githubData || {},
      },
    });
  } catch (error) {
    console.error('Sync GitHub error:', error);
    res.status(500).json({ message: 'Error syncing GitHub', error: error.message });
  }
};

/**
 * Change password
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return res.status(400).json({ message: 'Current password is incorrect' });
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
};
