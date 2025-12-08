import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import LoadingSpinner from '../components/LoadingSpinner';
import { resumeApi } from '../api/resumeApi';

const ResumeAnalysis = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [resumeId, setResumeId] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const response = await resumeApi.upload(file);
      setResumeId(response.resume.id);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeId) {
      setError('Please upload a resume first');
      return;
    }

    setAnalyzing(true);
    setError('');

    try {
      const response = await resumeApi.analyze(resumeId);
      setAnalysis(response.analysis);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-white mb-8">Resume Analysis</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <FileUpload onFileSelect={handleFileSelect} />

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleUpload}
            disabled={!file || uploading || !!resumeId}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {uploading ? 'Uploading...' : resumeId ? 'Uploaded ✓' : 'Upload Resume'}
          </button>

          <button
            onClick={handleAnalyze}
            disabled={!resumeId || analyzing}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition"
          >
            {analyzing ? 'Analyzing...' : 'Analyze with AI'}
          </button>
        </div>
      </div>

      {analyzing && <LoadingSpinner />}

      {analysis && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Summary</h2>
            <p className="text-gray-700">{analysis.summary}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Technical Skills</h2>
            <div className="flex flex-wrap gap-2">
              {analysis.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Soft Skills</h2>
            <div className="flex flex-wrap gap-2">
              {analysis.softSkills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Projects</h2>
            <ul className="space-y-2">
              {analysis.projects.map((project, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">{project}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalysis;
