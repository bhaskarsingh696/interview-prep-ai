import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const menuItems = [
  { icon: '▦', label: 'Dashboard', path: '/dashboard' },
  { icon: '◈', label: 'Practice', path: '/practice' },
  { icon: '◉', label: 'Mock Interview', path: '/mock-interview' },
  { icon: '◎', label: 'Resume AI', path: '/resume' },
  { icon: '▤', label: 'Analytics', path: '/analytics' },
  { icon: '◬', label: 'Live Interview', path: '/live-interview' },
  { icon: '⊕', label: 'Peer Interview', path: '/peer-interview' },
  { icon: '⊘', label: 'Plagiarism', path: '/plagiarism' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-60 bg-[#0d1220] border-r border-border flex flex-col py-6 z-50">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 mb-8">
        <span className="text-2xl" style={{ color: '#00ff88', filter: 'drop-shadow(0 0 8px rgba(0,255,136,0.5))' }}>⬡</span>
        <span className="font-syne font-bold text-lg text-white tracking-wide">InterviewAI</span>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 px-6 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-syne font-bold text-primary text-base flex-shrink-0"
          style={{ backgroundColor: '#00ff88' }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-sm font-semibold text-white truncate max-w-[130px]">{user?.name}</div>
          <div className="text-xs font-medium uppercase tracking-widest" style={{ color: '#00ff88' }}>{user?.role}</div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border mx-6 mb-4" />

      {/* Nav Items */}
      <nav className="flex flex-col gap-1 px-3 flex-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: '#00ff88', boxShadow: '0 0 8px rgba(0,255,136,0.8)' }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 mt-4">
        <div className="h-px bg-border mb-4" />
        <button
          onClick={handleLogout}
          className="sidebar-item text-red-400 hover:text-red-300"
        >
          <span className="text-base">⊗</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;