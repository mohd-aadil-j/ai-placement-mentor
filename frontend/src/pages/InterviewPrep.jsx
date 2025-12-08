import React, { useState, useEffect } from 'react';
import { interviewApi } from '../api/interviewApi';
import { resumeApi } from '../api/resumeApi';
import LoadingSpinner from '../components/LoadingSpinner';

const InterviewPrep = () => {
  const [interviews, setInterviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    interviewDate: '',
    rounds: [{ roundName: '', roundType: 'technical', description: '' }],
    additionalNotes: '',
  });

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await interviewApi.getUserInterviews();
      setInterviews(response.interviews);
      
      // Auto-fetch user skills for form
      try {
        const resumesData = await resumeApi.getUserResumes();
        if (resumesData.resumes.length > 0) {
          const latestResume = resumesData.resumes[0];
          // Skills will be used when submitting
        }
      } catch (err) {
        console.log('Could not fetch resume data');
      }
    } catch (err) {
      console.error('Error fetching interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const addRound = () => {
    setFormData({
      ...formData,
      rounds: [...formData.rounds, { roundName: '', roundType: 'technical', description: '' }],
    });
  };

  const removeRound = (index) => {
    const newRounds = formData.rounds.filter((_, i) => i !== index);
    setFormData({ ...formData, rounds: newRounds });
  };

  const updateRound = (index, field, value) => {
    const newRounds = [...formData.rounds];
    newRounds[index][field] = value;
    setFormData({ ...formData, rounds: newRounds });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.company || !formData.position || !formData.interviewDate) {
      setError('Company, position, and interview date are required');
      return;
    }

    if (formData.rounds.some(r => !r.roundName || !r.roundType)) {
      setError('All rounds must have a name and type');
      return;
    }

    setSubmitting(true);

    try {
      // Get user skills from latest resume
      let userSkills = [];
      try {
        const resumesData = await resumeApi.getUserResumes();
        if (resumesData.resumes.length > 0) {
          userSkills = resumesData.resumes[0].skills || [];
        }
      } catch (err) {
        console.log('Using without resume skills');
      }

      await interviewApi.create({
        ...formData,
        userSkills,
      });

      setShowForm(false);
      setFormData({
        company: '',
        position: '',
        interviewDate: '',
        rounds: [{ roundName: '', roundType: 'technical', description: '' }],
        additionalNotes: '',
      });
      await fetchInterviews();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create interview schedule');
    } finally {
      setSubmitting(false);
    }
  };

  const getDaysUntil = (dateString) => {
    const interviewDate = new Date(dateString);
    const today = new Date();
    const diffTime = interviewDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-bold text-white mb-8">Interview Preparation Planner</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          {showForm ? 'Cancel' : '+ Schedule New Interview'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Schedule Interview & Get Prep Plan</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position *
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interview Date *
              </label>
              <input
                type="datetime-local"
                value={formData.interviewDate}
                onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interview Rounds *
              </label>
              {formData.rounds.map((round, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3">
                  <div className="grid md:grid-cols-3 gap-4 mb-3">
                    <input
                      type="text"
                      placeholder="Round Name (e.g., Round 1)"
                      value={round.roundName}
                      onChange={(e) => updateRound(index, 'roundName', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <select
                      value={round.roundType}
                      onChange={(e) => updateRound(index, 'roundType', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="technical">Technical</option>
                      <option value="coding">Coding</option>
                      <option value="system-design">System Design</option>
                      <option value="hr">HR</option>
                      <option value="behavioral">Behavioral</option>
                      <option value="group-discussion">Group Discussion</option>
                      <option value="case-study">Case Study</option>
                      <option value="other">Other</option>
                    </select>
                    {formData.rounds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRound(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <textarea
                    placeholder="Description (optional)"
                    value={round.description}
                    onChange={(e) => updateRound(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addRound}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add Another Round
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any specific areas you want to focus on..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
            >
              {submitting ? 'Generating Prep Plan...' : 'Generate Preparation Plan'}
            </button>
          </form>
        </div>
      )}

      {submitting && <LoadingSpinner />}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Your Scheduled Interviews</h2>
        {interviews.length === 0 ? (
          <p className="text-white-600">No interviews scheduled yet.</p>
        ) : (
          interviews.map((interview) => {
            const daysUntil = getDaysUntil(interview.interviewDate);
            return (
              <div key={interview.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{interview.position}</h3>
                    <p className="text-lg text-gray-600">{interview.company}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(interview.interviewDate).toLocaleString()} 
                      {daysUntil >= 0 && (
                        <span className={`ml-2 font-semibold ${daysUntil <= 3 ? 'text-red-600' : 'text-blue-600'}`}>
                          ({daysUntil} days away)
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedInterview(selectedInterview?.id === interview.id ? null : interview)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {selectedInterview?.id === interview.id ? 'Hide Plan' : 'View Plan'}
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm('Delete this interview schedule?')) return;
                        try {
                          await interviewApi.delete(interview.id);
                          await fetchInterviews();
                        } catch (err) {
                          alert('Failed to delete interview');
                        }
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Interview Rounds:</h4>
                  <div className="flex flex-wrap gap-2">
                    {interview.rounds.map((round, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {round.roundName} ({round.roundType})
                      </span>
                    ))}
                  </div>
                </div>

                {selectedInterview?.id === interview.id && interview.preparationPlan && (
                  <div className="mt-6 border-t pt-6">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">📚 Your Preparation Plan</h4>
                    
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      <h5 className="font-semibold text-blue-900 mb-2">Overall Strategy:</h5>
                      <p className="text-blue-800">{interview.preparationPlan.overallStrategy}</p>
                    </div>

                    <div className="space-y-4 mb-6">
                      <h5 className="text-lg font-bold text-gray-800">Day-by-Day Plan:</h5>
                      {interview.preparationPlan.dailyPlan?.map((day, idx) => (
                        <div key={idx} className="bg-gray-50 p-5 rounded-lg border-l-4 border-blue-500">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                              {day.day}
                            </div>
                            <div>
                              <h6 className="font-bold text-gray-800">{day.focusArea}</h6>
                              <p className="text-sm text-gray-600">{day.date} • Focus: {day.focusRound}</p>
                            </div>
                          </div>

                          {day.topics && day.topics.length > 0 && (
                            <div className="mb-3">
                              <p className="font-semibold text-gray-700 text-sm mb-1">Topics:</p>
                              <ul className="list-disc list-inside text-sm text-gray-600">
                                {day.topics.map((topic, i) => <li key={i}>{topic}</li>)}
                              </ul>
                            </div>
                          )}

                          {day.tasks && day.tasks.length > 0 && (
                            <div className="mb-3">
                              <p className="font-semibold text-gray-700 text-sm mb-1">Tasks:</p>
                              {day.tasks.map((task, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm mb-1">
                                  <span className={`px-2 py-0.5 rounded text-xs ${
                                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-green-100 text-green-700'
                                  }`}>{task.priority}</span>
                                  <span className="text-gray-700">{task.task} ({task.timeAllocation})</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {day.tips && (
                            <p className="text-sm text-blue-700 italic mt-2">💡 {day.tips}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {interview.preparationPlan.finalDayChecklist && (
                      <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                        <h5 className="font-semibold text-yellow-900 mb-2">✓ Final Day Checklist:</h5>
                        <ul className="list-disc list-inside text-yellow-800 text-sm">
                          {interview.preparationPlan.finalDayChecklist.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {interview.preparationPlan.confidenceTips && (
                      <div className="bg-green-50 p-4 rounded-lg mb-4">
                        <h5 className="font-semibold text-green-900 mb-2">💪 Confidence Tips:</h5>
                        <ul className="list-disc list-inside text-green-800 text-sm">
                          {interview.preparationPlan.confidenceTips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {interview.preparationPlan.companyResearch && (
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-purple-900 mb-2">🔍 Company Research:</h5>
                        <div className="text-sm text-purple-800">
                          <p className="font-medium mb-1">Key Areas:</p>
                          <ul className="list-disc list-inside mb-3">
                            {interview.preparationPlan.companyResearch.keyAreas?.map((area, i) => (
                              <li key={i}>{area}</li>
                            ))}
                          </ul>
                          <p className="font-medium mb-1">Questions to Ask:</p>
                          <ul className="list-disc list-inside">
                            {interview.preparationPlan.companyResearch.questionsToAsk?.map((q, i) => (
                              <li key={i}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default InterviewPrep;
