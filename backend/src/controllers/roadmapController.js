import { generateRoadmap } from '../services/aiService.js';
import Roadmap from '../models/Roadmap.js';

/**
 * Generate learning roadmap using AI and save it
 */
export const generateLearningRoadmap = async (req, res) => {
  try {
    const { targetRole, timeframeMonths, currentSkills } = req.body;

    // Validate input
    if (!targetRole || !timeframeMonths) {
      return res.status(400).json({ message: 'Target role and timeframe are required' });
    }

    if (timeframeMonths < 1 || timeframeMonths > 24) {
      return res.status(400).json({ message: 'Timeframe must be between 1 and 24 months' });
    }

    // Call AI service
    const roadmapData = await generateRoadmap(
      targetRole,
      timeframeMonths,
      currentSkills || []
    );

    // Save to database
    const roadmap = new Roadmap({
      user: req.user.userId,
      targetRole,
      timeframeMonths,
      currentSkills: currentSkills || [],
      roadmap: roadmapData,
    });

    await roadmap.save();

    res.json({
      message: 'Roadmap generated successfully',
      roadmap: {
        id: roadmap._id,
        targetRole: roadmap.targetRole,
        timeframeMonths: roadmap.timeframeMonths,
        currentSkills: roadmap.currentSkills,
        roadmap: roadmap.roadmap,
        createdAt: roadmap.createdAt,
      },
    });
  } catch (error) {
    console.error('Generate roadmap error:', error);
    res.status(500).json({ message: 'Error generating roadmap', error: error.message });
  }
};

/**
 * Get all roadmaps for the authenticated user
 */
export const getUserRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user.userId }).sort({ createdAt: -1 });

    res.json({
      roadmaps: roadmaps.map((r) => ({
        id: r._id,
        targetRole: r.targetRole,
        timeframeMonths: r.timeframeMonths,
        currentSkills: r.currentSkills,
        roadmap: r.roadmap,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get roadmaps error:', error);
    res.status(500).json({ message: 'Error fetching roadmaps', error: error.message });
  }
};

/**
 * Delete a roadmap
 */
export const deleteRoadmap = async (req, res) => {
  try {
    const { roadmapId } = req.params;
    const roadmap = await Roadmap.findById(roadmapId);

    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }

    // Check ownership
    if (roadmap.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this roadmap' });
    }

    await Roadmap.findByIdAndDelete(roadmapId);

    res.json({ message: 'Roadmap deleted successfully' });
  } catch (error) {
    console.error('Delete roadmap error:', error);
    res.status(500).json({ message: 'Error deleting roadmap', error: error.message });
  }
};
