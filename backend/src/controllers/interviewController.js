import axios from 'axios';
import Interview from '../models/Interview.js';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Create a new interview schedule
 */
export const createInterview = async (req, res) => {
  try {
    const { company, position, interviewDate, rounds, additionalNotes, userSkills } = req.body;

    if (!company || !position || !interviewDate || !rounds || rounds.length === 0) {
      return res.status(400).json({ message: 'Company, position, interview date, and at least one round are required' });
    }

    // Generate preparation plan using AI
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/ai/interview-prep-plan`, {
      company,
      position,
      interview_date: interviewDate,
      rounds: rounds.map(r => ({
        roundName: r.roundName,
        roundType: r.roundType,
        description: r.description || ''
      })),
      user_skills: userSkills || [],
      additional_notes: additionalNotes || ''
    });

    const preparationPlan = aiResponse.data.preparationPlan;

    // Create interview record
    const interview = new Interview({
      user: req.user.userId,
      company,
      position,
      interviewDate,
      rounds,
      additionalNotes,
      preparationPlan,
    });

    await interview.save();

    res.status(201).json({
      message: 'Interview scheduled and preparation plan generated successfully',
      interview: {
        id: interview._id,
        company: interview.company,
        position: interview.position,
        interviewDate: interview.interviewDate,
        rounds: interview.rounds,
        preparationPlan: interview.preparationPlan,
        status: interview.status,
        createdAt: interview.createdAt,
      },
    });
  } catch (error) {
    console.error('Create interview error:', error);
    res.status(500).json({ 
      message: 'Error creating interview', 
      error: error.response?.data?.detail || error.message 
    });
  }
};

/**
 * Get all interviews for authenticated user
 */
export const getUserInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.userId }).sort({ interviewDate: 1 });

    res.json({
      interviews: interviews.map((interview) => ({
        id: interview._id,
        company: interview.company,
        position: interview.position,
        interviewDate: interview.interviewDate,
        rounds: interview.rounds,
        additionalNotes: interview.additionalNotes,
        preparationPlan: interview.preparationPlan,
        status: interview.status,
        createdAt: interview.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get interviews error:', error);
    res.status(500).json({ message: 'Error fetching interviews', error: error.message });
  }
};

/**
 * Update interview round status
 */
export const updateInterviewRoundStatus = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { roundIndex, status } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (roundIndex >= interview.rounds.length) {
      return res.status(400).json({ message: 'Invalid round index' });
    }

    interview.rounds[roundIndex].status = status;
    await interview.save();

    res.json({
      message: 'Round status updated',
      interview: {
        id: interview._id,
        rounds: interview.rounds,
      },
    });
  } catch (error) {
    console.error('Update round status error:', error);
    res.status(500).json({ message: 'Error updating round status', error: error.message });
  }
};

/**
 * Delete an interview
 */
export const deleteInterview = async (req, res) => {
  try {
    const { interviewId } = req.params;
    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this interview' });
    }

    await Interview.findByIdAndDelete(interviewId);

    res.json({ message: 'Interview deleted successfully' });
  } catch (error) {
    console.error('Delete interview error:', error);
    res.status(500).json({ message: 'Error deleting interview', error: error.message });
  }
};
