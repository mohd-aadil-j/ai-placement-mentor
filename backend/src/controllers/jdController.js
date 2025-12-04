import JobProfile from '../models/JobProfile.js';

/**
 * Create a new job profile
 */
export const createJobProfile = async (req, res) => {
  try {
    const { title, company, jdText } = req.body;

    // Validate input
    if (!title || !company || !jdText) {
      return res.status(400).json({ message: 'Title, company, and job description text are required' });
    }

    // Create job profile
    const jobProfile = new JobProfile({
      userId: req.user.userId,
      title,
      company,
      jdText,
    });

    await jobProfile.save();

    res.status(201).json({
      message: 'Job profile created successfully',
      jobProfile: {
        id: jobProfile._id,
        title: jobProfile.title,
        company: jobProfile.company,
        createdAt: jobProfile.createdAt,
      },
    });
  } catch (error) {
    console.error('Create job profile error:', error);
    res.status(500).json({ message: 'Error creating job profile', error: error.message });
  }
};

/**
 * Get all job profiles for the authenticated user
 */
export const getUserJobProfiles = async (req, res) => {
  try {
    const jobProfiles = await JobProfile.find({ userId: req.user.userId }).sort({ createdAt: -1 });

    res.json({
      jobProfiles: jobProfiles.map((jd) => ({
        id: jd._id,
        title: jd.title,
        company: jd.company,
        jdText: jd.jdText,
        createdAt: jd.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get user job profiles error:', error);
    res.status(500).json({ message: 'Error fetching job profiles', error: error.message });
  }
};

/**
 * Delete a job profile
 */
export const deleteJobProfile = async (req, res) => {
  try {
    const { jdId } = req.params;
    const jobProfile = await JobProfile.findById(jdId);

    if (!jobProfile) {
      return res.status(404).json({ message: 'Job profile not found' });
    }

    // Check ownership
    if (jobProfile.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this job profile' });
    }

    await JobProfile.findByIdAndDelete(jdId);

    res.json({ message: 'Job profile deleted successfully' });
  } catch (error) {
    console.error('Delete job profile error:', error);
    res.status(500).json({ message: 'Error deleting job profile', error: error.message });
  }
};
