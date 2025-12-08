import React, { useState, useEffect } from 'react';
import { resumeApi } from '../api/resumeApi';
import { jdApi } from '../api/jdApi';
import { analysisApi } from '../api/analysisApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ScoreCard from '../components/ScoreCard';
import SkillGapList from '../components/SkillGapList';

const JDMatch = () => {
  const [resumes, setResumes] = useState([]);
  const [jobProfiles, setJobProfiles] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [selectedJdId, setSelectedJdId] = useState('');
  const [showJdForm, setShowJdForm] = useState(false);
  const [newJd, setNewJd] = useState({ title: '', company: '', jdText: '' });
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resumesData, jdData] = await Promise.all([
        resumeApi.getUserResumes(),
        jdApi.getUserJobProfiles(),
      ]);
      setResumes(resumesData.resumes);
      setJobProfiles(jdData.jobProfiles);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJd = async () => {
    if (!newJd.title || !newJd.company || !newJd.jdText) {
      setError('All fields are required');
      return;
    }

    try {
      await jdApi.create(newJd);
      setNewJd({ title: '', company: '', jdText: '' });
      setShowJdForm(false);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create job profile');
    }
  };

  const handleCompare = async () => {
    if (!selectedResumeId || !selectedJdId) {
      setError('Please select both resume and job description');
      return;
    }

    setComparing(true);
    setError('');

    try {
      const response = await analysisApi.compare({
        resumeId: selectedResumeId,
        jobProfileId: selectedJdId,
      });
      setAnalysis(response.analysis);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to compare resume and JD');
    } finally {
      setComparing(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold text-white mb-8">Job Description Match</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Resume
            </label>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a resume --</option>
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  Resume from {new Date(resume.createdAt).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Job Description
            </label>
            <select
              value={selectedJdId}
              onChange={(e) => setSelectedJdId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a job description --</option>
              {jobProfiles.map((jd) => (
                <option key={jd.id} value={jd.id}>
                  {jd.title} - {jd.company}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleCompare}
            disabled={!selectedResumeId || !selectedJdId || comparing}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {comparing ? 'Comparing...' : 'Compare with AI'}
          </button>

          <button
            onClick={() => setShowJdForm(!showJdForm)}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
          >
            {showJdForm ? 'Cancel' : 'Add New JD'}
          </button>
        </div>
      </div>

      {showJdForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Add New Job Description</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <input
                type="text"
                value={newJd.title}
                onChange={(e) => setNewJd({ ...newJd, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                value={newJd.company}
                onChange={(e) => setNewJd({ ...newJd, company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description
              </label>
              <textarea
                value={newJd.jdText}
                onChange={(e) => setNewJd({ ...newJd, jdText: e.target.value })}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleCreateJd}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Save Job Description
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Resumes</h2>
          {resumes.length === 0 ? (
            <p className="text-gray-600">No resumes uploaded yet.</p>
          ) : (
            <ul className="space-y-3">
              {resumes.map((resume) => (
                <li 
                  key={resume.id} 
                  className={`border-l-4 ${selectedResumeId === resume.id ? 'border-blue-600 bg-blue-50' : 'border-blue-300'} pl-4 py-2 cursor-pointer hover:bg-blue-50 transition`}
                  onClick={() => setSelectedResumeId(resume.id)}
                >
                  <p className="font-semibold text-gray-800">{resume.name || 'Resume'}</p>
                  <p className="text-sm text-gray-600">
                    Uploaded: {new Date(resume.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Job Profiles</h2>
          {jobProfiles.length === 0 ? (
            <p className="text-gray-600">No job profiles added yet.</p>
          ) : (
            <ul className="space-y-3">
              {jobProfiles.map((jd) => (
                <li 
                  key={jd.id} 
                  className={`border-l-4 ${selectedJdId === jd.id ? 'border-green-600 bg-green-50' : 'border-green-300'} pl-4 py-2 cursor-pointer hover:bg-green-50 transition`}
                  onClick={() => setSelectedJdId(jd.id)}
                >
                  <p className="font-semibold text-gray-800">{jd.title}</p>
                  <p className="text-sm text-gray-600">{jd.company}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Added: {new Date(jd.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {comparing && <LoadingSpinner />}

      {analysis && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <ScoreCard title="ATS Score" score={analysis.atsScore} color="blue" />
            <ScoreCard title="Match Score" score={analysis.matchScore} color="green" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <SkillGapList title="Strengths" items={analysis.strengths} type="skills" />
            <SkillGapList title="Weaknesses" items={analysis.weaknesses} type="skills" />
          </div>

          <SkillGapList
            title="Missing Skills"
            items={analysis.missingSkills}
            type="skills"
          />
          <SkillGapList
            title="Project Suggestions"
            items={analysis.projectSuggestions}
            type="projects"
          />
          <SkillGapList
            title="Learning Suggestions"
            items={analysis.learningSuggestions}
            type="suggestions"
          />
        </div>
      )}
    </div>
  );
};

export default JDMatch;
