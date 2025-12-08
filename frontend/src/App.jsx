import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import ProfessionalBackground from './components/ProfessionalBackground';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeAnalysis from './pages/ResumeAnalysis';
import JDMatch from './pages/JDMatch';
import Roadmap from './pages/Roadmap';
import Chat from './pages/Chat';
import InterviewPrep from './pages/InterviewPrep';
import Classroom from './pages/Classroom';
import ClassroomAssistant from './pages/ClassroomAssistant';
import Profile from './pages/Profile';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="relative min-h-screen overflow-hidden">
          <ProfessionalBackground />
          <div className="relative z-10 flex">
            <Sidebar />
            <main className="flex-1 pt-16 md:pt-0">
            <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume-analysis"
              element={
                <ProtectedRoute>
                  <ResumeAnalysis />
                </ProtectedRoute>
              }
            />
            <Route
              path="/jd-match"
              element={
                <ProtectedRoute>
                  <JDMatch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roadmap"
              element={
                <ProtectedRoute>
                  <Roadmap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview-prep"
              element={
                <ProtectedRoute>
                  <InterviewPrep />
                </ProtectedRoute>
              }
            />
            <Route
              path="/classroom"
              element={
                <ProtectedRoute>
                  <Classroom />
                </ProtectedRoute>
              }
            />
            <Route
              path="/classroom/:assistantType"
              element={
                <ProtectedRoute>
                  <ClassroomAssistant />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
