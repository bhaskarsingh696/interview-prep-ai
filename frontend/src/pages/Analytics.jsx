import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getMyAnalytics } from '../services/analyticsService';
import { getMyInterviews } from '../services/aiService';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#00ff88', '#4f9cf9', '#a855f7', '#fbbf24', '#f87171'];

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
    window.addEventListener('focus', fetchData);
    return () => window.removeEventListener('focus', fetchData);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsData, interviewsData] = await Promise.all([
        getMyAnalytics(),
        getMyInterviews()
      ]);
      setAnalytics(analyticsData);
      setInterviews(interviewsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Accepted') return '#4ade80';
    if (status === 'Wrong Answer') return '#f87171';
    return '#fbbf24';
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#4ade80';
    if (percentage >= 60) return '#fbbf24';
    return '#f87171';
  };

  // Skeleton loader component
  const ChartSkeleton = ({ height = 300 }) => (
    <div className="animate-pulse space-y-3 p-4">
      <div className="h-12 bg-slate-700 rounded"></div>
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-6 bg-slate-700 rounded w-full"></div>
        ))}
      </div>
    </div>
  );

  // Tab button component
  const TabButton = ({ id, label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
        active
          ? 'bg-green-500/20 text-green-400 border border-green-500/50'
          : 'text-slate-400 border border-slate-700 hover:border-slate-600'
      }`}
    >
      {label}
    </button>
  );

  if (loading && !analytics) return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">●</div>
          <p className="text-slate-400">Loading your analytics...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <div className="flex-1 md:ml-64 transition-all duration-300">
        <div className="p-4 md:p-6 lg:p-8 min-h-screen">
          {/* Header Section */}
          <div className="mb-8 md:mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-2">Performance Insights</p>
                <h1 className="font-syne font-bold text-3xl md:text-4xl text-white">Your Analytics</h1>
              </div>
              <button
                onClick={fetchData}
                disabled={loading}
                className="px-4 py-2 rounded-lg border border-slate-700 hover:border-green-500/50 text-slate-300 hover:text-green-400 transition-all duration-300 disabled:opacity-50 self-start md:self-auto"
              >
                {loading ? '⟳ Refreshing...' : '↻ Refresh'}
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 flex-wrap">
              <TabButton
                id="overview"
                label="Overview"
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
              />
              <TabButton
                id="topics"
                label="By Topic"
                active={activeTab === 'topics'}
                onClick={() => setActiveTab('topics')}
              />
              <TabButton
                id="difficulty"
                label="By Difficulty"
                active={activeTab === 'difficulty'}
                onClick={() => setActiveTab('difficulty')}
              />
              <TabButton
                id="interviews"
                label="Interviews"
                active={activeTab === 'interviews'}
                onClick={() => setActiveTab('interviews')}
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { 
                label: 'Total Submissions', 
                value: analytics?.totalSubmissions || 0, 
                icon: '◉', 
                color: '#4f9cf9', 
                bgColor: 'rgba(79,156,249,0.1)',
                trend: 'Active'
              },
              { 
                label: 'Problems Accepted', 
                value: analytics?.acceptedSubmissions || 0, 
                icon: '◈', 
                color: '#4ade80', 
                bgColor: 'rgba(74,222,128,0.1)',
                trend: '+2 this week'
              },
              { 
                label: 'Accuracy Rate', 
                value: `${analytics?.accuracy || 0}%`, 
                icon: '▤', 
                color: '#00ff88', 
                bgColor: 'rgba(0,255,136,0.1)',
                trend: analytics?.accuracy > 70 ? '🔥 Great!' : 'Improving'
              },
              { 
                label: 'Mock Interviews', 
                value: analytics?.totalMockInterviews || 0, 
                icon: '◬', 
                color: '#a855f7', 
                bgColor: 'rgba(168,85,247,0.1)',
                trend: 'Practice more'
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-slate-700 hover:border-slate-600 transition-all duration-300 group"
                style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  boxShadow: '0 0 0 1px rgba(148, 163, 184, 0.1), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: stat.bgColor, color: stat.color }}
                  >
                    {stat.icon}
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-700/50 text-slate-400">
                    {stat.trend}
                  </span>
                </div>
                <div className="mb-2">
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    {loading ? '—' : stat.value}
                  </div>
                </div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg md:text-xl font-syne font-bold text-white mb-4">Daily Activity (Last 7 Days)</h2>
                <div className="p-6 rounded-xl border border-slate-700" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
                  {loading ? (
                    <ChartSkeleton />
                  ) : analytics?.last7Days && analytics?.last7Days.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.last7Days}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="day" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                          labelStyle={{ color: '#e2e8f0' }}
                        />
                        <Bar dataKey="submissions" fill="#00ff88" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-64 flex items-center justify-center text-slate-400">
                      No data available yet. Keep practicing!
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg md:text-xl font-syne font-bold text-white mb-4">Topic Distribution</h2>
                  <div className="p-6 rounded-xl border border-slate-700" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
                    {loading ? (
                      <ChartSkeleton />
                    ) : analytics?.topicDistribution && analytics?.topicDistribution.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={analytics.topicDistribution}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {analytics.topicDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                            labelStyle={{ color: '#e2e8f0' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-slate-400">
                        No data available yet
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg md:text-xl font-syne font-bold text-white mb-4">Problems by Difficulty</h2>
                  <div className="p-6 rounded-xl border border-slate-700" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
                    {loading ? (
                      <ChartSkeleton />
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[
                          { name: 'Easy', solved: analytics?.easySolved || 0, fill: '#4ade80' },
                          { name: 'Medium', solved: analytics?.mediumSolved || 0, fill: '#fbbf24' },
                          { name: 'Hard', solved: analytics?.hardSolved || 0, fill: '#f87171' }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="name" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                            labelStyle={{ color: '#e2e8f0' }}
                          />
                          <Bar dataKey="solved" radius={[8, 8, 0, 0]}>
                            {[
                              { fill: '#4ade80' },
                              { fill: '#fbbf24' },
                              { fill: '#f87171' }
                            ].map((entry, index) => (
                              <Cell key={index} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Weak Topics Section */}
          {activeTab === 'topics' && (
            <div>
              <h2 className="text-lg md:text-xl font-syne font-bold text-white mb-4">Topic Performance</h2>
              <div className="space-y-3">
                {analytics?.weakTopics && analytics?.weakTopics.length > 0 ? (
                  analytics?.weakTopics?.map((topic, i) => (
                    <div key={i} className="p-4 rounded-lg border border-slate-700" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-white capitalize">{topic.topic}</span>
                        <span className="text-lg font-bold" style={{ color: topic.accuracy >= 70 ? '#4ade80' : topic.accuracy >= 50 ? '#fbbf24' : '#f87171' }}>
                          {topic.accuracy}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${topic.accuracy}%`,
                            backgroundColor: topic.accuracy >= 70 ? '#4ade80' : topic.accuracy >= 50 ? '#fbbf24' : '#f87171',
                          }}
                        ></div>
                      </div>
                      {topic.accuracy < 60 && (
                        <p className="text-xs text-slate-400 mt-2">⚠️ Needs improvement - try solving more problems in this topic</p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center rounded-lg border border-slate-700" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
                    <p className="text-slate-400">No weak topics yet! Keep practicing 💪</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Difficulty Tab */}
          {activeTab === 'difficulty' && (
            <div>
              <h2 className="text-lg md:text-xl font-syne font-bold text-white mb-4">Difficulty Breakdown</h2>
              <div className="p-6 rounded-xl border border-slate-700" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
                {loading ? (
                  <ChartSkeleton height={400} />
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={[
                      { name: 'Easy', solved: analytics?.easySolved || 0, fill: '#4ade80' },
                      { name: 'Medium', solved: analytics?.mediumSolved || 0, fill: '#fbbf24' },
                      { name: 'Hard', solved: analytics?.hardSolved || 0, fill: '#f87171' }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                        labelStyle={{ color: '#e2e8f0' }}
                      />
                      <Bar dataKey="solved" radius={[8, 8, 0, 0]}>
                        {[
                          { fill: '#4ade80' },
                          { fill: '#fbbf24' },
                          { fill: '#f87171' }
                        ].map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          )}

          {/* Mock Interviews Tab */}
          {activeTab === 'interviews' && (
            <div>
              <h2 className="text-lg md:text-xl font-syne font-bold text-white mb-6">Mock Interview History</h2>
              {analytics?.mockInterviewTrend && analytics?.mockInterviewTrend.length > 0 ? (
                <div className="mb-8">
                  <h3 className="text-md font-semibold text-white mb-4">Score Trend</h3>
                  <div className="p-6 rounded-xl border border-slate-700" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={analytics.mockInterviewTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" domain={[0, 100]} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                          labelStyle={{ color: '#e2e8f0' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#4f9cf9"
                          strokeWidth={3}
                          dot={{ fill: '#4f9cf9', r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : null}

              {interviews.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ backgroundColor: 'rgba(0,255,136,0.05)' }} className="border-b border-slate-700">
                        <th className="px-4 py-3 text-left font-semibold text-slate-300">Topic</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-300">Difficulty</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-300">Score</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-300">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {interviews.map((interview, i) => (
                        <tr key={i} className="border-b border-slate-700 hover:bg-slate-900/50 transition-colors">
                          <td className="px-4 py-3 text-white">{interview.topic}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${interview.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' : interview.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                              {interview.difficulty}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold" style={{ color: getScoreColor(interview.percentage) }}>
                              {interview.percentage}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-400">{new Date(interview.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center rounded-lg border border-slate-700" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
                  <p className="text-slate-400 mb-4">No mock interviews yet!</p>
                  <button className="px-4 py-2 rounded-lg bg-green-500 text-slate-950 font-semibold hover:bg-green-400 transition-colors">
                    Start Mock Interview
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tips Section */}
          <div className="mt-12 p-6 md:p-8 rounded-xl border border-slate-700" style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.05), rgba(79,156,249,0.05))' }}>
            <h3 className="font-syne font-bold text-lg md:text-xl text-white mb-4">💡 Pro Tips for Better Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <span className="text-green-400 text-lg">✓</span>
                <div>
                  <p className="font-semibold text-white text-sm mb-1">Focus on Weak Topics</p>
                  <p className="text-slate-400 text-xs">Identify topics with low accuracy and practice more problems there</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-green-400 text-lg">✓</span>
                <div>
                  <p className="font-semibold text-white text-sm mb-1">Progressive Difficulty</p>
                  <p className="text-slate-400 text-xs">Master easy problems before attempting hard ones</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-green-400 text-lg">✓</span>
                <div>
                  <p className="font-semibold text-white text-sm mb-1">Regular Practice</p>
                  <p className="text-slate-400 text-xs">Solve at least 1-2 problems daily to maintain momentum</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-green-400 text-lg">✓</span>
                <div>
                  <p className="font-semibold text-white text-sm mb-1">Mock Interviews</p>
                  <p className="text-slate-400 text-xs">Take regular mock interviews to prepare for real ones</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
