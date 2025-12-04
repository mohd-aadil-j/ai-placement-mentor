import React, { useState } from 'react';
import { roadmapApi } from '../api/roadmapApi';
import LoadingSpinner from '../components/LoadingSpinner';

const Roadmap = () => {
  const [targetRole, setTargetRole] = useState('');
  const [timeframeMonths, setTimeframeMonths] = useState(6);
  const [currentSkills, setCurrentSkills] = useState('');
  const [generating, setGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!targetRole) {
      setError('Please enter a target role');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const skillsArray = currentSkills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const response = await roadmapApi.generate({
        targetRole,
        timeframeMonths,
        currentSkills: skillsArray,
      });

      setRoadmap(response.roadmap);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate roadmap');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Learning Roadmap</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Role *
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Full Stack Developer, Data Scientist"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeframe (Months): {timeframeMonths}
            </label>
            <input
              type="range"
              min="1"
              max="24"
              value={timeframeMonths}
              onChange={(e) => setTimeframeMonths(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1 month</span>
              <span>24 months</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Skills (comma-separated, optional)
            </label>
            <input
              type="text"
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              placeholder="e.g., JavaScript, React, Node.js"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 disabled:bg-gray-400 transition"
          >
            {generating ? 'Generating Roadmap...' : 'Generate AI Roadmap'}
          </button>
        </div>
      </div>

      {generating && <LoadingSpinner />}

      {roadmap && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-3xl font-bold mb-2">
              Your Personalized Roadmap for {roadmap.targetRole || targetRole}
            </h2>
            <p className="text-purple-100">
              Timeframe: {roadmap.timeframeMonths || timeframeMonths} months • Created: {new Date(roadmap.createdAt).toLocaleDateString()}
            </p>
          </div>

          {roadmap.roadmap && roadmap.roadmap.weeks && roadmap.roadmap.weeks.map((week) => (
            <div key={week.weekNumber} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mr-4">
                  {week.weekNumber}
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{week.focus}</h3>
              </div>

              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Topics to Cover:</h4>
                <ul className="space-y-1">
                  {week.topics && week.topics.map((topic, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Tasks:</h4>
                <ul className="space-y-1">
                  {week.tasks && week.tasks.map((task, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Roadmap;
