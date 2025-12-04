import Resume from '../models/Resume.js';
import JobProfile from '../models/JobProfile.js';
import Analysis from '../models/Analysis.js';
import { compareResumeWithJD } from '../services/aiService.js';

/**
 * Compare resume with job description using AI
 */
export const compareResumeAndJD = async (req, res) => {
  try {
    const { resumeId, jobProfileId } = req.body;

    // Validate input
    if (!resumeId || !jobProfileId) {
      return res.status(400).json({ message: 'Resume ID and Job Profile ID are required' });
    }

    // Fetch resume
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check resume ownership
    if (resume.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized access to resume' });
    }

    // Fetch job profile
    const jobProfile = await JobProfile.findById(jobProfileId);
    if (!jobProfile) {
      return res.status(404).json({ message: 'Job profile not found' });
    }

    // Check job profile ownership
    if (jobProfile.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized access to job profile' });
    }

    // Call AI service
    const aiResult = await compareResumeWithJD(
      resume.rawText,
      jobProfile.jdText,
      jobProfile.title
    );

    // Create analysis record
    const analysis = new Analysis({
      userId: req.user.userId,
      resumeId: resume._id,
      jobProfileId: jobProfile._id,
      atsScore: aiResult.atsScore || 0,
      matchScore: aiResult.matchScore || 0,
      strengths: aiResult.strengths || [],
      weaknesses: aiResult.weaknesses || [],
      missingSkills: aiResult.missingSkills || [],
      projectSuggestions: aiResult.projectSuggestions || [],
      learningSuggestions: aiResult.learningSuggestions || [],
    });

    await analysis.save();

    res.status(201).json({
      message: 'Analysis completed successfully',
      analysis: {
        id: analysis._id,
        atsScore: analysis.atsScore,
        matchScore: analysis.matchScore,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        missingSkills: analysis.missingSkills,
        projectSuggestions: analysis.projectSuggestions,
        learningSuggestions: analysis.learningSuggestions,
        createdAt: analysis.createdAt,
      },
    });
  } catch (error) {
    console.error('Compare resume and JD error:', error);
    res.status(500).json({ message: 'Error comparing resume and job description', error: error.message });
  }
};

/**
 * Get all analyses for the authenticated user
 */
export const getUserAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user.userId })
      .populate('resumeId', 'filePath summary')
      .populate('jobProfileId', 'title company')
      .sort({ createdAt: -1 });

    res.json({
      analyses: analyses.map((a) => ({
        id: a._id,
        atsScore: a.atsScore,
        matchScore: a.matchScore,
        strengths: a.strengths,
        weaknesses: a.weaknesses,
        missingSkills: a.missingSkills,
        projectSuggestions: a.projectSuggestions,
        learningSuggestions: a.learningSuggestions,
        resume: a.resumeId,
        jobProfile: a.jobProfileId,
        createdAt: a.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get user analyses error:', error);
    res.status(500).json({ message: 'Error fetching analyses', error: error.message });
  }
};
