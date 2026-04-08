import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Don't show navbar on login/register pages
  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-primary font-bold">SIP</span>
          </div>
          <span className="text-xl font-bold gradient-text hidden sm:inline">Smart Interview</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-white hover:text-accent transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/practice')}
            className="text-sm text-white hover:text-accent transition"
          >
            Practice
          </button>
          <button
            onClick={() => navigate('/mock-interview')}
            className="text-sm text-white hover:text-accent transition"
          >
            Mock Interview
          </button>
          <button
            onClick={() => navigate('/resume')}
            className="text-sm text-white hover:text-accent transition"
          >
            Resume
          </button>
          <button
            onClick={() => navigate('/analytics')}
            className="text-sm text-white hover:text-accent transition"
          >
            Analytics
          </button>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-accent hidden sm:inline">
              {user.username || user.email}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="btn-danger text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2"
          >
            Logout
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-accent text-xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-hover border-t border-border p-4 flex flex-col gap-3">
          <button
            onClick={() => {
              navigate('/dashboard');
              setIsOpen(false);
            }}
            className="text-left text-sm text-white hover:text-accent transition py-2"
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              navigate('/practice');
              setIsOpen(false);
            }}
            className="text-left text-sm text-white hover:text-accent transition py-2"
          >
            Practice
          </button>
          <button
            onClick={() => {
              navigate('/mock-interview');
              setIsOpen(false);
            }}
            className="text-left text-sm text-white hover:text-accent transition py-2"
          >
            Mock Interview
          </button>
          <button
            onClick={() => {
              navigate('/resume');
              setIsOpen(false);
            }}
            className="text-left text-sm text-white hover:text-accent transition py-2"
          >
            Resume
          </button>
          <button
            onClick={() => {
              navigate('/analytics');
              setIsOpen(false);
            }}
            className="text-left text-sm text-white hover:text-accent transition py-2"
          >
            Analytics
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
