import React from 'react';
import { Link } from 'react-router-dom';

const Classroom = () => {
  const assistants = [
    {
      type: 'technical',
      name: 'Technical Interview Trainer',
      icon: '🎓',
      description: 'Master Data Structures, Algorithms, System Design, OOP, and core CS concepts',
      topics: ['DSA', 'System Design', 'OOP', 'OS', 'Networks', 'DBMS'],
      gradient: 'from-blue-600 to-indigo-600',
      benefits: [
        'Deep dive into DS & Algorithms',
        'System Design patterns',
        'Problem-solving strategies',
        'Company-specific preparation'
      ]
    },
    {
      type: 'coding',
      name: 'Coding Practice Coach',
      icon: '💻',
      description: 'Practice live coding, debugging, optimization, and competitive programming',
      topics: ['Live Coding', 'Debugging', 'Code Review', 'LeetCode', 'Optimization'],
      gradient: 'from-green-600 to-emerald-600',
      benefits: [
        'Real-time code debugging',
        'Multiple solution approaches',
        'Time complexity analysis',
        'Clean code practices'
      ]
    },
    {
      type: 'aptitude',
      name: 'Aptitude & Reasoning Expert',
      icon: '🧮',
      description: 'Excel in quantitative, logical, and verbal reasoning for aptitude tests',
      topics: ['Quant', 'Logical Reasoning', 'Verbal', 'Data Interpretation', 'Puzzles'],
      gradient: 'from-purple-600 to-pink-600',
      benefits: [
        'Shortcut methods & tricks',
        'Mental math techniques',
        'Pattern recognition',
        'Time management strategies'
      ]
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">🎯 Training Classroom</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Train with AI-powered expert trainers specialized in different placement rounds. 
          Get personalized guidance, practice problems, and instant feedback.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {assistants.map((assistant) => (
          <Link
            key={assistant.type}
            to={`/classroom/${assistant.type}`}
            className="block group"
          >
            <div className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 h-full">
              <div className={`bg-gradient-to-r ${assistant.gradient} text-white p-6 rounded-t-lg`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-5xl">{assistant.icon}</span>
                  <h2 className="text-2xl font-bold">{assistant.name}</h2>
                </div>
                <p className="text-sm opacity-90">{assistant.description}</p>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-3">What you'll learn:</h3>
                <ul className="space-y-2 mb-4">
                  {assistant.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 mb-4">
                  {assistant.topics.map((topic, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <button className="w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition font-medium">
                  Start Training →
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div>
            <div className="bg-white rounded-lg p-4 shadow">
              <span className="text-3xl mb-2 block">1️⃣</span>
              <h3 className="font-bold text-gray-800 mb-2">Choose Your Trainer</h3>
              <p className="text-sm text-gray-600">Select the area you want to focus on</p>
            </div>
          </div>
          <div>
            <div className="bg-white rounded-lg p-4 shadow">
              <span className="text-3xl mb-2 block">2️⃣</span>
              <h3 className="font-bold text-gray-800 mb-2">Ask & Learn</h3>
              <p className="text-sm text-gray-600">Get instant explanations and practice problems</p>
            </div>
          </div>
          <div>
            <div className="bg-white rounded-lg p-4 shadow">
              <span className="text-3xl mb-2 block">3️⃣</span>
              <h3 className="font-bold text-gray-800 mb-2">Practice & Improve</h3>
              <p className="text-sm text-gray-600">Receive feedback and track your progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;
