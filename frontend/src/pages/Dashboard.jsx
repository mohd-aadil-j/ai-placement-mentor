import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resumeApi } from '../api/resumeApi';
import { jdApi } from '../api/jdApi';
import { roadmapApi } from '../api/roadmapApi';
import { profileApi } from '../api/profileApi';
import LoadingSpinner from '../components/LoadingSpinner';
import FlipCard from '../components/FlipCard';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [jobProfiles, setJobProfiles] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [selectedJobProfile, setSelectedJobProfile] = useState(null);
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [githubData, setGithubData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumesData, jdData, roadmapsData, profileData] = await Promise.all([
          resumeApi.getUserResumes(),
          jdApi.getUserJobProfiles(),
          roadmapApi.getUserRoadmaps(),
          profileApi.getProfile(),
        ]);
        setResumes(resumesData.resumes);
        setJobProfiles(jdData.jobProfiles);
        setRoadmaps(roadmapsData.roadmaps);
        if (profileData.leetcodeData && Object.keys(profileData.leetcodeData).length > 0) {
          setLeetcodeData(profileData.leetcodeData);
        }
        if (profileData.githubData && Object.keys(profileData.githubData).length > 0) {
          setGithubData(profileData.githubData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Welcome, {user?.name}! 👋
          </h1>
          {user?.targetRole && (
            <p className="text-lg text-white/90 drop-shadow">Target Role: {user.targetRole}</p>
          )}
        </div>

      {/* Coding Stats Section */}
      {(leetcodeData || githubData) && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {leetcodeData && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <span>🏆</span> LeetCode Progress
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Easy', value: leetcodeData.easyCount || 0, color: '#10B981' },
                      { name: 'Medium', value: leetcodeData.mediumCount || 0, color: '#F59E0B' },
                      { name: 'Hard', value: leetcodeData.hardCount || 0, color: '#EF4444' },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'Easy', value: leetcodeData.easyCount || 0, color: '#10B981' },
                      { name: 'Medium', value: leetcodeData.mediumCount || 0, color: '#F59E0B' },
                      { name: 'Hard', value: leetcodeData.hardCount || 0, color: '#EF4444' },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center">
                <p className="text-gray-600 text-sm">
                  Total Solved: <span className="font-bold text-lg">{(leetcodeData.easyCount || 0) + (leetcodeData.mediumCount || 0) + (leetcodeData.hardCount || 0)}</span>
                </p>
                {leetcodeData.ranking && (
                  <p className="text-gray-500 text-xs mt-1">Global Ranking: {leetcodeData.ranking.toLocaleString()}</p>
                )}
              </div>
            </div>
          )}

          {githubData && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <span>🐙</span> GitHub Stats
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-700 font-medium">📦 Public Repos</span>
                  <span className="text-2xl font-bold text-blue-600">{githubData.repos || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-700 font-medium">⭐ Total Stars</span>
                  <span className="text-2xl font-bold text-yellow-500">{githubData.stars || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-700 font-medium">👥 Followers</span>
                  <span className="text-2xl font-bold text-purple-600">{githubData.followers || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-gray-700 font-medium">🔗 Following</span>
                  <span className="text-2xl font-bold text-green-600">{githubData.following || 0}</span>
                </div>
              </div>
              {githubData.username && (
                <div className="mt-4 text-center">
                  <a
                    href={`https://github.com/${githubData.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Profile →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="h-[200px]">
          <FlipCard
            frontContent={
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg h-full flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-2">📄 Resume Analysis</h2>
                <p className="text-blue-100">Upload and analyze your resume with AI</p>
              </div>
            }
            backContent={
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-lg h-full flex flex-col justify-center items-center">
                <h3 className="text-xl font-bold mb-4">Resume Analysis</h3>
                <p className="text-sm text-blue-100 mb-4 text-center">Get AI-powered insights on your resume</p>
                <Link to="/resume-analysis" className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
                  Get Started →
                </Link>
              </div>
            }
          />
        </div>

        <div className="h-[200px]">
          <FlipCard
            frontContent={
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg h-full flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-2">🎯 JD Match</h2>
                <p className="text-green-100">Compare resume with job descriptions</p>
              </div>
            }
            backContent={
              <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6 rounded-lg shadow-lg h-full flex flex-col justify-center items-center">
                <h3 className="text-xl font-bold mb-4">JD Match</h3>
                <p className="text-sm text-green-100 mb-4 text-center">Find perfect job matches for your profile</p>
                <Link to="/jd-match" className="px-6 py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition">
                  Match Now →
                </Link>
              </div>
            }
          />
        </div>

        <div className="h-[200px]">
          <FlipCard
            frontContent={
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg h-full flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-2">🗺️ Learning Roadmap</h2>
                <p className="text-purple-100">Generate personalized career roadmap</p>
              </div>
            }
            backContent={
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-6 rounded-lg shadow-lg h-full flex flex-col justify-center items-center">
                <h3 className="text-xl font-bold mb-4">Learning Roadmap</h3>
                <p className="text-sm text-purple-100 mb-4 text-center">Build your personalized learning path</p>
                <Link to="/roadmap" className="px-6 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition">
                  Create Roadmap →
                </Link>
              </div>
            }
          />
        </div>

        <div className="h-[200px]">
          <FlipCard
            frontContent={
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg h-full flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-2">💬 Chat Mentor</h2>
                <p className="text-indigo-100">Get personalized placement guidance</p>
              </div>
            }
            backContent={
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 rounded-lg shadow-lg h-full flex flex-col justify-center items-center">
                <h3 className="text-xl font-bold mb-4">Chat Mentor</h3>
                <p className="text-sm text-indigo-100 mb-4 text-center">24/7 AI mentor for placement guidance</p>
                <Link to="/chat" className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition">
                  Start Chat →
                </Link>
              </div>
            }
          />
        </div>

        <div className="h-[200px]">
          <FlipCard
            frontContent={
              <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-lg shadow-lg h-full flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-2">📅 Interview Prep</h2>
                <p className="text-orange-100">Schedule & get customized prep plans</p>
              </div>
            }
            backContent={
              <div className="bg-gradient-to-br from-orange-600 to-red-700 text-white p-6 rounded-lg shadow-lg h-full flex flex-col justify-center items-center">
                <h3 className="text-xl font-bold mb-4">Interview Prep</h3>
                <p className="text-sm text-orange-100 mb-4 text-center">Prepare with personalized interview plans</p>
                <Link to="/interview-prep" className="px-6 py-2 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition">
                  Prepare Now →
                </Link>
              </div>
            }
          />
        </div>

        <div className="h-[200px]">
          <FlipCard
            frontContent={
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-6 rounded-lg shadow-lg h-full flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-2">🎓 Classroom</h2>
                <p className="text-yellow-100">Train with expert AI assistants</p>
              </div>
            }
            backContent={
              <div className="bg-gradient-to-br from-yellow-600 to-orange-600 text-white p-6 rounded-lg shadow-lg h-full flex flex-col justify-center items-center">
                <h3 className="text-xl font-bold mb-4">Classroom</h3>
                <p className="text-sm text-yellow-100 mb-4 text-center">Learn with specialized AI trainers</p>
                <Link to="/classroom" className="px-6 py-2 bg-white text-yellow-600 rounded-lg font-semibold hover:bg-yellow-50 transition">
                  Enter Classroom →
                </Link>
              </div>
            }
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Resumes</h2>
          {resumes.length === 0 ? (
            <p className="text-gray-600">No resumes uploaded yet.</p>
          ) : (
            <ul className="space-y-3">
              {resumes.slice(0, 5).map((resume) => (
                <li key={resume.id} className="border-l-4 border-blue-500 pl-4 py-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-800">{resume.name || 'Resume'}</p>
                    <p className="text-sm text-gray-600">
                      Uploaded: {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        try {
                          const res = await resumeApi.download(resume.id);
                          const blob = res.data;
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = (resume.name || 'resume.pdf');
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                          window.URL.revokeObjectURL(url);
                        } catch (err) {
                          console.error('Failed to download resume', err);
                          alert('Failed to download resume');
                        }
                      }}
                      className="text-sm px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Download
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm('Delete this resume permanently?')) return;
                        try {
                          await resumeApi.delete(resume.id);
                          setResumes((prev) => prev.filter((r) => r.id !== resume.id));
                        } catch (err) {
                          console.error('Failed to delete resume', err);
                          alert('Failed to delete resume');
                        }
                      }}
                      className="text-sm px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  </div>
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
              {jobProfiles.slice(0, 5).map((jd) => (
                <li key={jd.id} className="border-l-4 border-green-500 pl-4 py-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-800">{jd.title}</p>
                    <p className="text-sm text-gray-600">{jd.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedJobProfile(jd)}
                      className="text-sm px-3 py-1 rounded bg-green-500 hover:bg-green-600 text-white"
                    >
                      View
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm('Delete this job profile permanently?')) return;
                        try {
                          await jdApi.delete(jd.id);
                          setJobProfiles((prev) => prev.filter((j) => j.id !== jd.id));
                        } catch (err) {
                          console.error('Failed to delete job profile', err);
                          alert('Failed to delete job profile');
                        }
                      }}
                      className="text-sm px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Learning Roadmaps</h2>
        {roadmaps.length === 0 ? (
          <p className="text-gray-600">No roadmaps created yet.</p>
        ) : (
          <ul className="space-y-3">
            {roadmaps.map((roadmap) => (
              <li key={roadmap.id} className="border-l-4 border-purple-500 pl-4 py-2 flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-gray-800">{roadmap.targetRole}</p>
                  <p className="text-sm text-gray-600">
                    {roadmap.timeframeMonths} months • Created: {new Date(roadmap.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedRoadmap(roadmap)}
                    className="text-sm px-3 py-1 rounded bg-purple-500 hover:bg-purple-600 text-white"
                  >
                    View
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm('Delete this roadmap permanently?')) return;
                      try {
                        await roadmapApi.delete(roadmap.id);
                        setRoadmaps((prev) => prev.filter((r) => r.id !== roadmap.id));
                      } catch (err) {
                        console.error('Failed to delete roadmap', err);
                        alert('Failed to delete roadmap');
                      }
                    }}
                    className="text-sm px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedJobProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedJobProfile(null)}>
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-lg flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-1">{selectedJobProfile.title}</h2>
                <p className="text-green-100">{selectedJobProfile.company}</p>
              </div>
              <button onClick={() => setSelectedJobProfile(null)} className="text-white hover:text-gray-200 text-3xl leading-none">&times;</button>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Job Description:</h3>
              <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700 text-sm leading-relaxed">
                {selectedJobProfile.jdText}
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Added: {new Date(selectedJobProfile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedRoadmap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedRoadmap(null)}>
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-lg flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-1">{selectedRoadmap.targetRole}</h2>
                <p className="text-purple-100">
                  Timeframe: {selectedRoadmap.timeframeMonths} months • Created: {new Date(selectedRoadmap.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => setSelectedRoadmap(null)} className="text-white hover:text-gray-200 text-3xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              {selectedRoadmap.roadmap && selectedRoadmap.roadmap.weeks && selectedRoadmap.roadmap.weeks.map((week) => (
                <div key={week.weekNumber} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <div className="flex items-center mb-3">
                    <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-3">
                      {week.weekNumber}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{week.focus}</h3>
                  </div>

                  {week.topics && week.topics.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Topics to Cover:</h4>
                      <ul className="space-y-1">
                        {week.topics.map((topic, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            <span className="text-gray-700">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {week.tasks && week.tasks.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Tasks:</h4>
                      <ul className="space-y-1">
                        {week.tasks.map((task, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            <span className="text-gray-700">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
