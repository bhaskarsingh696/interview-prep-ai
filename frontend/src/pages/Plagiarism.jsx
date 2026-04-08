import React, { useState, useEffect } from 'react';
import { getMyPlagiarismReport, checkPlagiarism } from '../services/plagiarismService';
import Sidebar from '../components/Sidebar';

const Plagiarism = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await getMyPlagiarismReport();
      setReport(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = async (submissionId) => {
    setChecking(true);
    try {
      const result = await checkPlagiarism(submissionId);
      setSelectedResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setChecking(false);
    }
  };

  const getRiskColor = (risk) => {
    if (risk === 'High') return '#f87171';
    if (risk === 'Medium') return '#fbbf24';
    return '#4ade80';
  };

  const getRiskBg = (risk) => {
    if (risk === 'High') return 'rgba(248,113,113,0.1)';
    if (risk === 'Medium') return 'rgba(251,191,36,0.1)';
    return 'rgba(74,222,128,0.1)';
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0a0e1a' }}>
      <Sidebar />
      <div className="page-wrapper flex-1">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-syne font-bold text-3xl text-white mb-2">
            🔍 Plagiarism Detection
          </h1>
          <p style={{ color: '#8892a4' }}>
            Check your code submissions for similarity with others
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">

          {/* Left: My Report */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-syne font-bold text-xl text-white">
                📋 My Submissions Report
              </h2>
              <button onClick={fetchReport} className="btn-secondary text-sm py-2">
                🔄 Refresh
              </button>
            </div>

            {loading ? (
              <p style={{ color: '#8892a4' }}>Loading report...</p>
            ) : report.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-white font-semibold mb-2">No submissions yet</p>
                <p style={{ color: '#8892a4' }} className="text-sm">
                  Submit some code to see plagiarism report!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {report.map((item, i) => (
                  <div
                    key={i}
                    className="card cursor-pointer transition-all duration-200"
                    style={{
                      borderColor: item.risk === 'High' ? 'rgba(248,113,113,0.3)' :
                        item.risk === 'Medium' ? 'rgba(251,191,36,0.3)' : '#1e2d45'
                    }}
                    onClick={() => handleCheck(item.submissionId)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white text-sm">
                        {item.problem || 'N/A'}
                      </span>
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: getRiskBg(item.risk),
                          color: getRiskColor(item.risk)
                        }}
                      >
                        {item.risk} Risk
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <span className="topic-badge">{item.topic}</span>
                      <span className="text-xs" style={{ color: '#8892a4' }}>
                        {item.language}
                      </span>
                    </div>

                    {/* Similarity bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 rounded-full overflow-hidden"
                        style={{ height: '6px', backgroundColor: '#1e2d45' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${item.maxSimilarity}%`,
                            backgroundColor: getRiskColor(item.risk)
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold"
                        style={{ color: getRiskColor(item.risk) }}>
                        {item.maxSimilarity}%
                      </span>
                    </div>

                    <p className="text-xs mt-2" style={{ color: '#8892a4' }}>
                      Click to see detailed report →
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Detailed Result */}
          <div>
            <h2 className="font-syne font-bold text-xl text-white mb-4">
              📊 Detailed Analysis
            </h2>

            {!selectedResult ? (
              <div className="card text-center py-12">
                <p className="text-4xl mb-3">👆</p>
                <p className="text-white font-semibold mb-2">
                  Select a submission
                </p>
                <p style={{ color: '#8892a4' }} className="text-sm">
                  Click on any submission to see detailed plagiarism analysis
                </p>
              </div>
            ) : checking ? (
              <div className="card text-center py-12">
                <p style={{ color: '#8892a4' }}>Analyzing...</p>
              </div>
            ) : (
              <div>
                {/* Overall Risk */}
                <div
                  className="card mb-4 text-center"
                  style={{
                    borderColor: `${getRiskColor(selectedResult.overallRisk)}30`,
                    backgroundColor: getRiskBg(selectedResult.overallRisk)
                  }}
                >
                  <div
                    className="font-syne font-bold text-5xl mb-2"
                    style={{ color: getRiskColor(selectedResult.overallRisk) }}
                  >
                    {selectedResult.maxSimilarity}%
                  </div>
                  <div className="text-white font-semibold">
                    {selectedResult.overallRisk} Plagiarism Risk
                  </div>
                  <div className="text-sm mt-1" style={{ color: '#8892a4' }}>
                    {selectedResult.submission?.problem}
                  </div>
                </div>

                {/* Comparison Results */}
                {selectedResult.results?.length === 0 ? (
                  <div className="card text-center py-6">
                    <p style={{ color: '#4ade80' }} className="font-semibold">
                      ✅ No similar submissions found!
                    </p>
                    <p style={{ color: '#8892a4' }} className="text-sm mt-1">
                      Your code appears to be original
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {selectedResult.results?.map((result, i) => (
                      <div key={i} className="card">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-semibold text-sm">
                            {result.comparedWith}
                          </span>
                          <span
                            className="text-xs font-bold px-3 py-1 rounded-full"
                            style={{
                              backgroundColor: getRiskBg(result.level),
                              color: getRiskColor(result.level)
                            }}
                          >
                            {result.level}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 rounded-full overflow-hidden"
                            style={{ height: '6px', backgroundColor: '#1e2d45' }}>
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${result.similarity}%`,
                                backgroundColor: getRiskColor(result.level)
                              }}
                            />
                          </div>
                          <span
                            className="text-sm font-bold"
                            style={{ color: getRiskColor(result.level) }}
                          >
                            {result.similarity}% similar
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plagiarism;