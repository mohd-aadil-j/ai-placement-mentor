import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserAvatar } from '../utils/identicon';

const Sidebar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'DASHBOARD' },
    { to: '/resume-analysis', label: 'RESUME' },
    { to: '/jd-match', label: 'JD MATCH' },
    { to: '/roadmap', label: 'ROADMAP' },
    { to: '/chat', label: 'CHAT' },
    { to: '/interview-prep', label: 'INTERVIEW' },
    { to: '/classroom', label: 'CLASSROOM' },
  ];

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-slate-700/90 text-white p-2 rounded-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-slate-800/95 backdrop-blur-sm border-r border-slate-700 z-40 transform transition-transform duration-300 md:translate-x-0 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-white hover:text-blue-400 transition"
            onClick={handleNavClick}
          >
            <span className="text-2xl">🎓</span>
            <span>MENTOR</span>
          </Link>
        </div>

        {/* Navigation Items */}
        {isAuthenticated && (
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={handleNavClick}
                className="block px-4 py-3 rounded-lg text-slate-200 hover:bg-slate-700 hover:text-white transition font-medium text-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* User Section */}
        {isAuthenticated && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-900/50">
            <Link
              to="/profile"
              onClick={handleNavClick}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-700 transition mb-3"
            >
              <img
                src={getUserAvatar(user)}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-600"
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{user?.name}</p>
                <p className="text-slate-400 text-xs">PROFILE</p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm"
            >
              LOGOUT
            </button>
          </div>
        )}

        {/* Auth Links */}
        {!isAuthenticated && (
          <div className="p-4 space-y-2 absolute bottom-0 left-0 right-0">
            <Link
              to="/login"
              onClick={handleNavClick}
              className="block px-4 py-2 text-center rounded-lg text-slate-200 hover:bg-slate-700 transition font-medium"
            >
              LOGIN
            </Link>
            <Link
              to="/register"
              onClick={handleNavClick}
              className="block px-4 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              REGISTER
            </Link>
          </div>
        )}
      </aside>

      {/* Main Content Offset (Desktop) */}
      <div className="hidden md:block w-64" />
    </>
  );
};

export default Sidebar;
