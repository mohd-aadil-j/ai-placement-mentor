import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Analyze resume text using AI service
 */
export const analyzeResume = async (resumeText) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/ai/analyze-resume`, {
      resume_text: resumeText,
    }, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('AI Service Error (analyze-resume):', error.message);
    if (error.response) {
      console.error('AI Service Response Status:', error.response.status);
      console.error('AI Service Response Data:', error.response.data);
    }
    throw new Error('Failed to analyze resume with AI service');
  }
};

/**
 * Compare resume with job description using AI service
 */
export const compareResumeWithJD = async (resumeText, jdText, targetRole) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/ai/compare-resume-jd`, {
      resume_text: resumeText,
      jd_text: jdText,
      target_role: targetRole,
    });
    return response.data;
  } catch (error) {
    console.error('AI Service Error (compare-resume-jd):', error.message);
    throw new Error('Failed to compare resume and JD with AI service');
  }
};

/**
 * Generate learning roadmap using AI service
 */
export const generateRoadmap = async (targetRole, timeframeMonths, currentSkills) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/ai/generate-roadmap`, {
      target_role: targetRole,
      timeframe_months: timeframeMonths,
      current_skills: currentSkills,
    });
    return response.data;
  } catch (error) {
    console.error('AI Service Error (generate-roadmap):', error.message);
    throw new Error('Failed to generate roadmap with AI service');
  }
};
