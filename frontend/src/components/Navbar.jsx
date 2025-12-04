import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserAvatar } from '../utils/identicon';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex flex-wrap sm:justify-start sm:flex-nowrap w-full4 text-sm py-4 shadow-lg border-b border-white/20">
      <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
        <Link
          to="/"
          className="flex-none font-bold text-2xl text-white drop-shadow-lg focus:outline-none focus:opacity-80"
          aria-label="AI Placement Mentor"
        >
          🎓 AI Placement Mentor
        </Link>

        {isAuthenticated ? (
          <div className="flex flex-row items-center gap-5 mt-5 sm:justify-end sm:mt-0 sm:ps-5">
            <Link
              to="/dashboard"
              className="font-medium text-white/90 hover:text-white focus:outline-none focus:text-white drop-shadow transition"
            >
              Dashboard
            </Link>
            <Link
              to="/resume-analysis"
              className="font-medium text-white/90 hover:text-white focus:outline-none focus:text-white drop-shadow transition"
            >
              Resume
            </Link>
            <Link
              to="/jd-match"
              className="font-medium text-white/90 hover:text-white focus:outline-none focus:text-white drop-shadow transition"
            >
              JD Match
            </Link>
            <Link
              to="/roadmap"
              className="font-medium text-white/90 hover:text-white focus:outline-none focus:text-white drop-shadow transition"
            >
              Roadmap
            </Link>
            <Link
              to="/chat"
              className="font-medium text-white/90 hover:text-white focus:outline-none focus:text-white drop-shadow transition"
            >
              Chat
            </Link>
            <Link
              to="/interview-prep"
              className="font-medium text-white/90 hover:text-white focus:outline-none focus:text-white drop-shadow transition"
            >
              Interview
            </Link>
            <Link
              to="/classroom"
              className="font-medium text-white/90 hover:text-white focus:outline-none focus:text-white drop-shadow transition"
            >
              Classroom
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-2 font-medium text-white/90 hover:text-white focus:outline-none focus:text-white drop-shadow transition"
            >
              <img 
                src={getUserAvatar(user)} 
                alt="avatar" 
                className="w-7 h-7 rounded-full object-cover border-2 border-white/50" 
              />
              <span className="hidden md:inline">{user?.name}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-transparent backdrop-blur transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-row items-center gap-4 mt-5 sm:justify-end sm:mt-0 sm:ps-5">
            <Link
              to="/login"
              className="font-medium text-white/90 hover:text-white focus:outline-none focus:text-white drop-shadow transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-purple-500/80 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent backdrop-blur transition"
            >
              Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
