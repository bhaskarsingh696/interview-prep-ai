import React, { useState, useEffect } from 'react';
import { getMyAnalytics } from '../services/analyticsService';
import { getMyInterviews } from '../services/aiService';
import Sidebar from '../components/Sidebar';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const COLORS = ['#00ff88', '#4f9cf9', '#a855f7', '#fbbf24', '#f87171'];

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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

  if (loading) return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0a0e1a' }}>
      <Sidebar />
      <div className="page-wrapper flex-1 flex items-center justify-center">
        <p style={{ color: '#8892a4' }}>Loading analytics...</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0a0e1a' }}>
      <Sidebar />
      <div className="page-wrapper flex-1">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-syne font-bold text-3xl text-white mb-2">My Analytics</h1>
          <p style={{ color: '#8892a4' }}>Track your progress and performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Submissions', value: analytics?.totalSubmissions || 0, color: '#4f9cf9' },
            { label: 'Problems Accepted', value: analytics?.acceptedSubmissions || 0, color: '#4ade80' },
            { label: 'Accuracy Rate', value: `${analytics?.accuracy || 0}%`, color: '#00ff88' },
            { label: 'Mock Interviews', value: analytics?.totalMockInterviews || 0, color: '#a855f7' },
          ].map((stat, i) => (
            <div key={i} className="card text-center">
              <div className="font-syne font-bold text-3xl mb-2" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div style={{ color: '#8892a4' }} className="text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-2 gap-4 mb-6">

          {/* Daily Activity Bar Chart */}
          <div className="card">
            <h2 className="font-syne font-bold text-lg text-white mb-4">
              📅 Daily Activity (Last 7 Days)
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics?.last7Days || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                <XAxis dataKey="day" stroke="#8892a4" fontSize={12} />
                <YAxis stroke="#8892a4" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141b2d', border: '1px solid #1e2d45', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="submissions" fill="#00ff88" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Topic Distribution Pie Chart */}
          <div className="card">
            <h2 className="font-syne font-bold text-lg text-white mb-4">
              🎯 Topic Distribution
            </h2>
            {analytics?.topicDistribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={analytics.topicDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#8892a4' }}
                  >
                    {analytics.topicDistribution.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#141b2d', border: '1px solid #1e2d45', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48">
                <p style={{ color: '#8892a4' }} className="text-sm">No data yet! Start practicing 🚀</p>
              </div>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-2 gap-4 mb-6">

          {/* Mock Interview Trend */}
          <div className="card">
            <h2 className="font-syne font-bold text-lg text-white mb-4">
              🤖 Mock Interview Score Trend
            </h2>
            {analytics?.mockInterviewTrend?.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={analytics.mockInterviewTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                  <XAxis dataKey="name" stroke="#8892a4" fontSize={12} />
                  <YAxis stroke="#8892a4" fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#141b2d', border: '1px solid #1e2d45', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#4f9cf9"
                    strokeWidth={2}
                    dot={{ fill: '#4f9cf9', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48">
                <p style={{ color: '#8892a4' }} className="text-sm">No interviews yet! Try AI Mock Interview 🤖</p>
              </div>
            )}
          </div>

          {/* Difficulty Breakdown */}
          <div className="card">
            <h2 className="font-syne font-bold text-lg text-white mb-4">
              🎯 Problems by Difficulty
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { name: 'Easy', solved: analytics?.easySolved || 0, fill: '#4ade80' },
                { name: 'Medium', solved: analytics?.mediumSolved || 0, fill: '#fbbf24' },
                { name: 'Hard', solved: analytics?.hardSolved || 0, fill: '#f87171' }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" />
                <XAxis dataKey="name" stroke="#8892a4" fontSize={12} />
                <YAxis stroke="#8892a4" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#141b2d', border: '1px solid #1e2d45', borderRadius: '8px' }}
                />
                <Bar dataKey="solved" radius={[4, 4, 0, 0]}>
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
          </div>
        </div>

        {/* Suggestions */}
        <div className="card mb-6"
          style={{ borderColor: 'rgba(0,255,136,0.2)', backgroundColor: 'rgba(0,255,136,0.03)' }}>
          <h2 className="font-syne font-bold text-lg text-white mb-4">
            💡 Personalized Suggestions
          </h2>
          <div className="flex flex-col gap-2">
            {analytics?.suggestions?.map((suggestion, i) => (
              <div key={i} className="flex items-start gap-3">
                <span style={{ color: '#00ff88' }}>▸</span>
                <p className="text-sm" style={{ color: '#cbd5e1' }}>{suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Topics */}
        <div className="card mb-6">
          <h2 className="font-syne font-bold text-lg text-white mb-4">⚠️ Weak Topics</h2>
          {analytics?.weakTopics?.length === 0 ? (
            <p style={{ color: '#8892a4' }} className="text-center py-4">No weak topics yet! 💪</p>
          ) : (
            analytics?.weakTopics?.map((topic, i) => (
              <div key={i} className="flex items-center gap-4 mb-3">
                <span className="text-sm font-semibold text-white w-16">{topic.topic}</span>
                <div className="flex-1 rounded-full overflow-hidden" style={{ height: '8px', backgroundColor: '#1e2d45' }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${topic.accuracy}%`, backgroundColor: topic.accuracy < 50 ? '#ef4444' : '#f59e0b' }} />
                </div>
                <span className="text-sm font-semibold text-white w-10 text-right">{topic.accuracy}%</span>
              </div>
            ))
          )}
        </div>

        {/* Mock Interview History */}
        <div className="card mb-6 p-0 overflow-hidden">
          <div className="p-6 pb-0">
            <h2 className="font-syne font-bold text-lg text-white mb-4">🤖 Mock Interview History</h2>
          </div>
          {interviews.length === 0 ? (
            <p style={{ color: '#8892a4' }} className="text-center py-8">No interviews yet! 🚀</p>
          ) : (
            <table className="w-full mt-2">
              <thead>
                <tr style={{ backgroundColor: '#0d1220' }}>
                  <th className="table-header">Topic</th>
                  <th className="table-header">Difficulty</th>
                  <th className="table-header">Score</th>
                  <th className="table-header">Percentage</th>
                  <th className="table-header">Date</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((interview, i) => (
                  <tr key={i} className="table-row">
                    <td className="table-cell font-medium text-white">{interview.topic}</td>
                    <td className="table-cell"><span className="topic-badge">{interview.difficulty}</span></td>
                    <td className="table-cell">{interview.totalScore}/{interview.maxScore}</td>
                    <td className="table-cell">
                      <span className="font-bold" style={{ color: getScoreColor(interview.percentage) }}>
                        {interview.percentage}%
                      </span>
                    </td>
                    <td className="table-cell">{new Date(interview.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Submissions */}
        <div className="card p-0 overflow-hidden">
          <div className="p-6 pb-0">
            <h2 className="font-syne font-bold text-lg text-white mb-4">📋 Recent Submissions</h2>
          </div>
          {analytics?.recentSubmissions?.length === 0 ? (
            <p style={{ color: '#8892a4' }} className="text-center py-8">No submissions yet! 🚀</p>
          ) : (
            <table className="w-full mt-2">
              <thead>
                <tr style={{ backgroundColor: '#0d1220' }}>
                  <th className="table-header">Problem</th>
                  <th className="table-header">Topic</th>
                  <th className="table-header">Language</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Time</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.recentSubmissions?.map((sub, i) => (
                  <tr key={i} className="table-row">
                    <td className="table-cell font-medium text-white">{sub.problem?.title || 'N/A'}</td>
                    <td className="table-cell"><span className="topic-badge">{sub.problem?.topic}</span></td>
                    <td className="table-cell">{sub.language}</td>
                    <td className="table-cell">
                      <span className="font-bold text-sm" style={{ color: getStatusColor(sub.status) }}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="table-cell">{sub.timeTaken}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;