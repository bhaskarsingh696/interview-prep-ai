import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const cards = [
    {
      icon: '◈',
      title: 'Practice Problems',
      desc: 'Solve DSA, OS, DBMS & CN questions',
      path: '/practice',
      color: '#00ff88',
      bg: 'rgba(0,255,136,0.05)'
    },
    {
      icon: '◉',
      title: 'AI Mock Interview',
      desc: 'Practice with AI-powered interviewer',
      path: '/mock-interview',
      color: '#4f9cf9',
      bg: 'rgba(79,156,249,0.05)'
    },
    {
      icon: '◎',
      title: 'Resume Analyzer',
      desc: 'Get AI feedback on your resume',
      path: '/resume',
      color: '#a855f7',
      bg: 'rgba(168,85,247,0.05)'
    },
    {
      icon: '▤',
      title: 'My Analytics',
      desc: 'Track your progress and weak topics',
      path: '/analytics',
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.05)'
    },
    {
      icon: '◬',
      title: 'Live Interview',
      desc: 'Real-time video interview sessions',
      path: '/live-interview',
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.05)'
    },
    {
      icon: '⊕',
      title: 'Peer Interview',
      desc: 'Practice with other students',
      path: '/peer-interview',
      color: '#00ff88',
      bg: 'rgba(0,255,136,0.05)'
    },
  ];

  return (
    <div className="flex min-h-screen bg-primary">
      <Sidebar />

      <div className="page-wrapper flex-1">
        {/* Header */}
        <div className="mb-10">
          <p className="text-gray-400 text-sm mb-1">Welcome back 👋</p>
          <h1 className="font-syne font-bold text-3xl text-white">
            {user?.name}
            <span className="ml-3" style={{ color: '#00ff88' }}>.</span>
          </h1>
          <p className="text-gray-400 mt-2">
            You are logged in as{' '}
            <span className="font-semibold" style={{ color: '#00ff88' }}>{user?.role}</span>
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Problems Solved', value: '—', icon: '◈' },
            { label: 'Mock Interviews', value: '—', icon: '◉' },
            { label: 'Accuracy Rate', value: '—', icon: '▤' },
          ].map((stat, i) => (
            <div key={i} className="card flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                style={{ backgroundColor: 'rgba(0,255,136,0.1)', color: '#00ff88' }}>
                {stat.icon}
              </div>
              <div>
                <div className="font-syne font-bold text-2xl text-white">{stat.value}</div>
                <div className="text-gray-400 text-xs">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <h2 className="font-syne font-bold text-xl text-white mb-4">Quick Access</h2>
        <div className="grid grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <button
              key={i}
              onClick={() => navigate(card.path)}
              className="card text-left hover:border-opacity-50 transition-all duration-300 group cursor-pointer w-full"
              style={{ borderColor: card.color, borderOpacity: 0.2 }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-4"
                style={{ backgroundColor: card.bg, color: card.color }}>
                {card.icon}
              </div>
              <h3 className="font-syne font-bold text-white text-base mb-1 group-hover:text-accent transition-colors">
                {card.title}
              </h3>
              <p className="text-gray-400 text-sm">{card.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;