import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    { icon: '💻', title: 'DSA Practice', desc: 'Solve problems with real code execution in C++, Python & JavaScript' },
    { icon: '🤖', title: 'AI Mock Interview', desc: 'Practice with AI-generated questions and get instant feedback' },
    { icon: '📄', title: 'Resume Analyzer', desc: 'Upload your resume and get AI-powered career guidance' },
    { icon: '🎥', title: 'Live Interview', desc: 'Real-time video interviews with shared code editor' },
    { icon: '👥', title: 'Peer Interview', desc: 'Practice with other students and give feedback' },
    { icon: '📊', title: 'Analytics', desc: 'Track your progress with detailed charts and insights' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0e1a' }}>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b"
        style={{ borderColor: '#1e2d45' }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl" style={{ color: '#00ff88', filter: 'drop-shadow(0 0 8px rgba(0,255,136,0.5))' }}>⬡</span>
          <span className="font-syne font-bold text-xl text-white">InterviewAI</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="btn-secondary text-sm py-2 px-5"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="btn-primary text-sm py-2 px-5"
          >
            Get Started →
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-8 py-24 relative">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ backgroundColor: '#00ff88' }} />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
          style={{ backgroundColor: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', color: '#00ff88' }}>
          🚀 AI-Powered Interview Preparation Platform
        </div>

        <h1 className="font-syne font-bold text-6xl text-white mb-6 leading-tight">
          Ace Your Next
          <br />
          <span style={{ color: '#00ff88' }}>Technical Interview</span>
        </h1>

        <p className="text-lg mb-10 max-w-2xl leading-relaxed" style={{ color: '#8892a4' }}>
          Practice DSA, experience AI mock interviews, analyze your resume,
          and conduct live video interviews — all in one platform.
        </p>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="btn-primary text-base py-3 px-8 font-bold"
          >
            🚀 Start for Free
          </button>
          <button
            onClick={() => navigate('/login')}
            className="btn-secondary text-base py-3 px-8"
          >
            Login →
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-12 mt-20">
          {[
            { value: '500+', label: 'Practice Problems' },
            { value: 'AI', label: 'Powered Feedback' },
            { value: '100%', label: 'Free to Use' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-syne font-bold text-4xl mb-1" style={{ color: '#00ff88' }}>
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: '#8892a4' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="px-8 py-20" style={{ backgroundColor: '#0d1220' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="font-syne font-bold text-4xl text-white text-center mb-4">
            Everything You Need
          </h2>
          <p className="text-center mb-12" style={{ color: '#8892a4' }}>
            A complete ecosystem for interview preparation
          </p>

          <div className="grid grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="card hover:border-opacity-50 transition-all duration-300 group"
                style={{ borderColor: '#1e2d45' }}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-syne font-bold text-white text-lg mb-2 group-hover:text-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#8892a4' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-8 py-20 text-center">
        <h2 className="font-syne font-bold text-4xl text-white mb-4">
          Ready to Get Started?
        </h2>
        <p className="mb-8" style={{ color: '#8892a4' }}>
          Join thousands of students preparing for their dream jobs
        </p>
        <button
          onClick={() => navigate('/register')}
          className="btn-primary text-lg py-4 px-12 font-bold"
        >
          🚀 Create Free Account
        </button>
      </div>

      {/* Footer */}
      <div className="border-t px-8 py-6 text-center"
        style={{ borderColor: '#1e2d45' }}>
        <p className="text-sm" style={{ color: '#8892a4' }}>
          Built with ❤️ using React, Node.js, MongoDB & AI
        </p>
      </div>
    </div>
  );
};

export default Landing;