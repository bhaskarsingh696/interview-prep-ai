import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProblems } from '../services/codeService';
import Sidebar from '../components/Sidebar';

const Practice = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchProblems();
  }, [topic, difficulty]);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const data = await getProblems(topic, difficulty);
      setProblems(data);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyClass = (difficulty) => {
    if (difficulty === 'Easy') return 'badge-easy';
    if (difficulty === 'Medium') return 'badge-medium';
    return 'badge-hard';
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0a0e1a' }}>
      <Sidebar />

      <div className="page-wrapper flex-1">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-syne font-bold text-3xl text-white mb-2">
            Practice Problems
          </h1>
          <p style={{ color: '#8892a4' }}>
            Sharpen your skills with DSA & Core CS questions
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="input-field"
            style={{ width: '180px' }}
          >
            <option value="">All Topics</option>
            <option value="DSA">DSA</option>
            <option value="OS">Operating Systems</option>
            <option value="DBMS">DBMS</option>
            <option value="CN">Computer Networks</option>
            <option value="HR">HR</option>
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="input-field"
            style={{ width: '180px' }}
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-20" style={{ color: '#8892a4' }}>
            Loading problems...
          </div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#0d1220' }}>
                  <th className="table-header">#</th>
                  <th className="table-header">Title</th>
                  <th className="table-header">Topic</th>
                  <th className="table-header">Difficulty</th>
                  <th className="table-header">Tags</th>
                  <th className="table-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((problem, index) => (
                  <tr key={problem._id} className="table-row">
                    <td className="table-cell" style={{ color: '#8892a4' }}>
                      {index + 1}
                    </td>
                    <td className="table-cell font-medium text-white">
                      {problem.title}
                    </td>
                    <td className="table-cell">
                      <span className="topic-badge">{problem.topic}</span>
                    </td>
                    <td className="table-cell">
                      <span className={getDifficultyClass(problem.difficulty)}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {problem.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.05)',
                              color: '#8892a4'
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => navigate(`/code-editor/${problem._id}`)}
                        className="btn-primary text-sm py-1.5 px-4"
                      >
                        Solve →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice;