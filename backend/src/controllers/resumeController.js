import multer from 'multer';
import path from 'path';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import Resume from '../models/Resume.js';
import { analyzeResume } from '../services/aiService.js';

// Configure multer for PDF upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

/**
 * Upload and parse PDF resume
 */
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Extract text from PDF
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const rawText = pdfData.text;

    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({ message: 'Could not extract text from PDF' });
    }

    // Create resume record
    const resume = new Resume({
      userId: req.user.userId,
      originalName: req.file.originalname || '',
      filePath: req.file.path,
      rawText,
    });

    await resume.save();

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resume: {
        id: resume._id,
        filePath: resume.filePath,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({ message: 'Error uploading resume', error: error.message });
  }
};

/**
 * Analyze resume using AI service
 */
export const analyzeResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;

    // Find resume
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check ownership
    if (resume.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized access to resume' });
    }

    // Call AI service
    const aiResult = await analyzeResume(resume.rawText);

    // Update resume with AI analysis
    resume.parsedSkills = aiResult.skills || [];
    resume.parsedProjects = aiResult.projects || [];
    resume.summary = aiResult.summary || '';

    await resume.save();

    res.json({
      message: 'Resume analyzed successfully',
      analysis: {
        skills: resume.parsedSkills,
        softSkills: aiResult.softSkills || [],
        projects: resume.parsedProjects,
        summary: resume.summary,
      },
    });
  } catch (error) {
    console.error('Analyze resume error:', error);
    res.status(500).json({ message: 'Error analyzing resume', error: error.message });
  }
};

/**
 * Get all resumes for the authenticated user
 */
export const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.userId }).sort({ createdAt: -1 });

    res.json({
      resumes: resumes.map((r) => ({
        id: r._id,
        filePath: r.filePath,
        name: r.originalName && r.originalName.trim() ? r.originalName : path.basename(r.filePath),
        summary: r.summary,
        skills: r.parsedSkills,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get user resumes error:', error);
    res.status(500).json({ message: 'Error fetching resumes', error: error.message });
  }
};

/**
 * Delete a resume by ID (and remove uploaded file)
 */
export const deleteResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Ownership check
    if (resume.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized access to resume' });
    }

    // Remove file from disk if exists
    if (resume.filePath && fs.existsSync(resume.filePath)) {
      try {
        fs.unlinkSync(resume.filePath);
      } catch (e) {
        console.warn('Failed to remove resume file from disk:', e?.message);
      }
    }

    await resume.deleteOne();

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'Error deleting resume', error: error.message });
  }
};

/**
 * Download a resume file
 */
export const downloadResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (resume.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized access to resume' });
    }

    const filePath = resume.filePath;
    const downloadName = resume.originalName && resume.originalName.trim()
      ? resume.originalName
      : path.basename(filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(filePath, downloadName);
  } catch (error) {
    console.error('Download resume error:', error);
    res.status(500).json({ message: 'Error downloading resume', error: error.message });
  }
};
