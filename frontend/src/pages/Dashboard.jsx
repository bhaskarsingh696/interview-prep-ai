import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import { getMyAnalytics } from '../services/analyticsService';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    problemsSolved: 0,
    mockInterviews: 0,
    accuracyRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    window.addEventListener('focus', fetchStats);
    return () => window.removeEventListener('focus', fetchStats);
  }, []);

  const fetchStats = async () => {
    try {
      const analyticsData = await getMyAnalytics();
      setStats({
        problemsSolved: analyticsData.acceptedSubmissions || 0,
        mockInterviews: analyticsData.totalMockInterviews || 0,
        accuracyRate: analyticsData.accuracy || 0,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      icon: '◈',
      title: 'Practice Problems',
      desc: 'Solve DSA, OS, DBMS & CN questions',
      path: '/practice',
      color: '#00ff88',
      bgGradient: 'from-green-500/10 to-green-600/5',
      borderColor: 'border-green-500/20',
    },
    {
      icon: '◉',
      title: 'AI Mock Interview',
      desc: 'Practice with AI-powered interviewer',
      path: '/mock-interview',
      color: '#4f9cf9',
      bgGradient: 'from-blue-500/10 to-blue-600/5',
      borderColor: 'border-blue-500/20',
    },
    {
      icon: '◎',
      title: 'Resume Analyzer',
      desc: 'Get AI feedback on your resume',
      path: '/resume',
      color: '#a855f7',
      bgGradient: 'from-purple-500/10 to-purple-600/5',
      borderColor: 'border-purple-500/20',
    },
    {
      icon: '▤',
      title: 'My Analytics',
      desc: 'Track your progress and weak topics',
      path: '/analytics',
      color: '#f59e0b',
      bgGradient: 'from-amber-500/10 to-amber-600/5',
      borderColor: 'border-amber-500/20',
    },
    {
      icon: '◬',
      title: 'Live Interview',
      desc: 'Real-time video interview sessions',
      path: '/live-interview',
      color: '#ef4444',
      bgGradient: 'from-red-500/10 to-red-600/5',
      borderColor: 'border-red-500/20',
    },
    {
      icon: '⊕',
      title: 'Peer Interview',
      desc: 'Practice with other students',
      path: '/peer-interview',
      color: '#00ff88',
      bgGradient: 'from-green-500/10 to-green-600/5',
      borderColor: 'border-green-500/20',
    },
  ];

  // Skeleton loader for stats
  const StatSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-slate-700 rounded w-12 mb-2"></div>
      <div className="h-4 bg-slate-700 rounded w-24"></div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <div className="flex-1 md:ml-64 transition-all duration-300">
        <div className="p-4 md:p-6 lg:p-8 min-h-screen">
          {/* Header Section */}
          <div className="mb-8 md:mb-12 animate-fade-in">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-2">Welcome back 👋</p>
                <h1 className="font-syne font-bold text-3xl md:text-4xl lg:text-5xl text-white mb-3">
                  {user?.name || 'Student'}
                  <span className="text-green-400 ml-2 inline-block">●</span>
                </h1>
                <p className="text-slate-400 text-sm md:text-base max-w-2xl">
                  You're making great progress! Keep solving problems and preparing for interviews.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mb-10 md:mb-12">
            <h2 className="text-lg md:text-xl font-syne font-bold text-white mb-4">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Problems Solved', value: stats.problemsSolved, icon: '◈', color: '#00ff88', bgColor: 'rgba(0,255,136,0.1)' },
                { label: 'Mock Interviews', value: stats.mockInterviews, icon: '◉', color: '#4f9cf9', bgColor: 'rgba(79,156,249,0.1)' },
                { label: 'Accuracy Rate', value: `${stats.accuracyRate}%`, icon: '▤', color: '#fbbf24', bgColor: 'rgba(251,191,36,0.1)' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
                  style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    boxShadow: '0 0 0 1px rgba(148, 163, 184, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold"
                      style={{ backgroundColor: stat.bgColor, color: stat.color }}
                    >
                      {stat.icon}
                    </div>
                    {stats.problemsSolved > 0 && i === 0 && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-500/10 text-green-400">
                        +1 today
                      </span>
                    )}
                  </div>
                  <div className="mb-2">
                    <div className="text-3xl md:text-4xl font-bold text-white">
                      {loading ? <StatSkeleton /> : stat.value}
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-10 md:mb-12">
            <h2 className="text-lg md:text-xl font-syne font-bold text-white mb-4">Quick Start</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <button
                onClick={() => navigate('/practice')}
                className="p-4 rounded-lg border border-slate-700 hover:border-green-500/50 transition-all duration-300 text-left group"
                style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">◈</span>
                  <span className="text-sm font-semibold text-slate-400 group-hover:text-slate-200">Continue Practicing</span>
                </div>
                <p className="text-xs text-slate-500">Pick up where you left off</p>
              </button>

              <button
                onClick={() => navigate('/mock-interview')}
                className="p-4 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-all duration-300 text-left group"
                style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">◉</span>
                  <span className="text-sm font-semibold text-slate-400 group-hover:text-slate-200">Take Mock Interview</span>
                </div>
                <p className="text-xs text-slate-500">Practice with AI interviewer</p>
              </button>

              <button
                onClick={() => navigate('/analytics')}
                className="p-4 rounded-lg border border-slate-700 hover:border-amber-500/50 transition-all duration-300 text-left group"
                style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">▤</span>
                  <span className="text-sm font-semibold text-slate-400 group-hover:text-slate-200">View Analytics</span>
                </div>
                <p className="text-xs text-slate-500">See your detailed progress</p>
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div>
            <h2 className="text-lg md:text-xl font-syne font-bold text-white mb-4">All Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((card, i) => (
                <button
                  key={i}
                  onClick={() => navigate(card.path)}
                  className={`group p-6 rounded-xl border transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-left ${card.borderColor}`}
                  style={{
                    background: `linear-gradient(135deg, ${card.bgGradient})`
                  }}
                >
                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-110 transition-transform"
                      style={{ color: card.color, background: `${card.color}15` }}
                    >
                      {card.icon}
                    </div>
                    <h3 className="font-syne font-bold text-white text-base md:text-lg mb-2 group-hover:text-green-400 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-slate-400 text-sm">{card.desc}</p>
                  </div>
                  <div className="flex items-center justify-end mt-4 pt-4 border-t border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-semibold text-slate-500">Get started →</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-12 md:mt-16 p-6 md:p-8 rounded-xl border border-slate-700" style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.05), rgba(79,156,249,0.05))' }}>
            <h3 className="font-syne font-bold text-lg md:text-xl text-white mb-2">Ready to level up?</h3>
            <p className="text-slate-400 text-sm mb-4">Start with easy problems and build your way up to hard ones.</p>
            <button
              onClick={() => navigate('/practice')}
              className="px-6 py-2 rounded-lg font-semibold transition-all"
              style={{ backgroundColor: '#00ff88', color: '#0a0e1a' }}
            >
              Start Practicing →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;