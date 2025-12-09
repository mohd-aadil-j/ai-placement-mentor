import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">🎓 AI Placement Mentor</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-95">
            Your AI-powered career advancement partner. Get personalized guidance, interview prep, resume analysis, and more!
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-purple-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 hover:shadow-lg transform hover:-translate-y-1 transition-all"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Powerful Features to Boost Your Career</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-2 transition-all">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-bold text-purple-600 mb-3">Resume Analysis</h3>
              <p className="text-gray-600">
                Upload your resume and get AI-powered analysis of your skills, experience, and areas for improvement.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-2 transition-all">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-purple-600 mb-3">JD Matching</h3>
              <p className="text-gray-600">
                Compare your resume with job descriptions. Get ATS scores, skill gap analysis, and recommendations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-2 transition-all">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-purple-600 mb-3">Learning Roadmap</h3>
              <p className="text-gray-600">
                Generate personalized learning paths with week-by-week plans and milestones for your target role.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-2 transition-all">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-purple-600 mb-3">AI Mentor Chat</h3>
              <p className="text-gray-600">
                Chat with your AI mentor anytime. Get career advice, coding help, and interview tips.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-2 transition-all">
              <div className="text-4xl mb-4">🎤</div>
              <h3 className="text-xl font-bold text-purple-600 mb-3">Interview Preparation</h3>
              <p className="text-gray-600">
                Schedule interviews and get personalized preparation plans with daily study guides and mock questions.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-2 transition-all">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-purple-600 mb-3">Classroom Assistant</h3>
              <p className="text-gray-600">
                Get help with coding, aptitude, and technical subjects with interactive problem-solving.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-2 transition-all">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-purple-600 mb-3">Profile & Achievements</h3>
              <p className="text-gray-600">
                Track progress with LeetCode and GitHub integration. Showcase your skills and achievements.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="bg-white p-8 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-2 transition-all">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-purple-600 mb-3">Dashboard & Analytics</h3>
              <p className="text-gray-600">
                Monitor your skill development and overall career progression with comprehensive statistics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 text-white rounded-full text-2xl font-bold mb-4">
                1
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Sign Up</h4>
              <p className="text-gray-600">
                Create your account and set your target role to get started.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 text-white rounded-full text-2xl font-bold mb-4">
                2
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Analyze & Plan</h4>
              <p className="text-gray-600">
                Upload your resume and generate a personalized learning roadmap.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 text-white rounded-full text-2xl font-bold mb-4">
                3
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Learn & Practice</h4>
              <p className="text-gray-600">
                Follow your roadmap and practice with coding challenges and AI guidance.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 text-white rounded-full text-2xl font-bold mb-4">
                4
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Prepare & Succeed</h4>
              <p className="text-gray-600">
                Schedule interviews and land your dream job with confidence!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose AI Placement Mentor?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <span className="text-2xl text-green-400 flex-shrink-0">✓</span>
              <div>
                <p className="text-lg"><strong>24/7 AI Support</strong></p>
                <p className="opacity-90">Always available mentor ready to help anytime, anywhere</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl text-green-400 flex-shrink-0">✓</span>
              <div>
                <p className="text-lg"><strong>Personalized Guidance</strong></p>
                <p className="opacity-90">Tailored plans based on your goals and current skills</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl text-green-400 flex-shrink-0">✓</span>
              <div>
                <p className="text-lg"><strong>Comprehensive Tools</strong></p>
                <p className="opacity-90">Everything you need in one platform</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl text-green-400 flex-shrink-0">✓</span>
              <div>
                <p className="text-lg"><strong>Real-time Feedback</strong></p>
                <p className="opacity-90">Get instant feedback and suggestions for improvement</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl text-green-400 flex-shrink-0">✓</span>
              <div>
                <p className="text-lg"><strong>Track Progress</strong></p>
                <p className="opacity-90">Monitor your development with detailed analytics</p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="text-2xl text-green-400 flex-shrink-0">✓</span>
              <div>
                <p className="text-lg"><strong>Interview Ready</strong></p>
                <p className="opacity-90">Comprehensive prep to boost your confidence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">Ready to Transform Your Career?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of students who are already using AI Placement Mentor to land their dream jobs.
          </p>
          <Link
            to="/register"
            className="inline-block bg-gradient-to-r from-purple-600 to-purple-800 text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all"
          >
            Get Started Today - It's Free!
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-8 px-4">
        <p>&copy; 2025 AI Placement Mentor. All rights reserved. | Your partner in career success</p>
      </footer>
    </div>
  );
};

export default Home;
