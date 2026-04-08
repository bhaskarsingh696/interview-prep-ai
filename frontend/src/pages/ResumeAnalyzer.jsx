import React, { useState, useEffect } from 'react';
import { uploadResume, getMyResumes } from '../services/resumeService';
import Sidebar from '../components/Sidebar';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const data = await getMyResumes();
      setResumes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a PDF file!');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please drop a PDF file!');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const data = await uploadResume(file);
      setResult(data.resume);
      setFile(null);
      fetchResumes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0a0e1a' }}>
      <Sidebar />
      <div className="page-wrapper flex-1">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-syne font-bold text-3xl text-white mb-2">
            📄 Resume Analyzer
          </h1>
          <p style={{ color: '#8892a4' }}>
            Upload your resume and get AI-powered career guidance
          </p>
        </div>

        {/* Upload Section */}
        {!result && (
          <div className="max-w-2xl mx-auto">
            <div className="card mb-6">
              <h2 className="font-syne font-bold text-xl text-white mb-6">
                Upload Your Resume
              </h2>

              {/* Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('resumeInput').click()}
                className="rounded-xl p-10 text-center cursor-pointer transition-all duration-200 mb-4"
                style={{
                  border: `2px dashed ${dragOver || file ? '#00ff88' : '#1e2d45'}`,
                  backgroundColor: dragOver ? 'rgba(0,255,136,0.05)' : '#111827'
                }}
              >
                <div className="text-4xl mb-3">📁</div>
                {file ? (
                  <div>
                    <p className="text-white font-semibold">{file.name}</p>
                    <p className="text-sm mt-1" style={{ color: '#00ff88' }}>
                      ✅ Ready to analyze!
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-white font-semibold mb-1">
                      Drop your PDF here or click to browse
                    </p>
                    <p className="text-sm" style={{ color: '#8892a4' }}>
                      PDF files only, max 5MB
                    </p>
                  </div>
                )}
                <input
                  id="resumeInput"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {error && (
                <div className="rounded-lg px-4 py-3 mb-4 text-sm"
                  style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="btn-primary w-full py-3 text-base font-bold"
              >
                {uploading ? '⏳ AI is analyzing your resume...' : '🚀 Analyze Resume'}
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-syne font-bold text-2xl text-white">
                ✅ Analysis Results
              </h2>
              <button
                onClick={() => setResult(null)}
                className="btn-secondary text-sm py-2"
              >
                ← Analyze Another
              </button>
            </div>

            {/* Overall Feedback */}
            <div className="card mb-4"
              style={{ borderColor: 'rgba(0,255,136,0.3)', backgroundColor: 'rgba(0,255,136,0.05)' }}>
              <h3 className="font-syne font-bold text-white mb-2">💬 Overall Feedback</h3>
              <p style={{ color: '#cbd5e1' }} className="text-sm leading-relaxed">
                {result.overallFeedback}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Skills */}
              <div className="card">
                <h3 className="font-syne font-bold text-white mb-3">🛠️ Detected Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {result.skills?.map((skill, i) => (
                    <span key={i} className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ backgroundColor: 'rgba(0,255,136,0.1)', color: '#00ff88' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="card">
                <h3 className="font-syne font-bold text-white mb-3">⚠️ Missing Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills?.map((skill, i) => (
                    <span key={i} className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Job Roles */}
              <div className="card">
                <h3 className="font-syne font-bold text-white mb-3">💼 Suitable Job Roles</h3>
                <div className="flex flex-col gap-2">
                  {result.jobRoles?.map((role, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span style={{ color: '#00ff88' }}>▸</span>
                      <span className="text-sm" style={{ color: '#cbd5e1' }}>{role}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="card">
                <h3 className="font-syne font-bold text-white mb-3">🚀 Projects Found</h3>
                <div className="flex flex-col gap-2">
                  {result.projects?.map((project, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span style={{ color: '#4f9cf9' }}>▸</span>
                      <span className="text-sm" style={{ color: '#cbd5e1' }}>{project}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Learning Roadmap */}
            <div className="card">
              <h3 className="font-syne font-bold text-white mb-4">🗺️ Learning Roadmap</h3>
              <div className="flex flex-col gap-3">
                {result.learningRoadmap?.map((step, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: 'rgba(0,255,136,0.15)', color: '#00ff88' }}>
                      {i + 1}
                    </div>
                    <div className="flex-1 rounded-lg px-4 py-2.5 text-sm"
                      style={{ backgroundColor: '#111827', color: '#cbd5e1' }}>
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Previous Resumes */}
        {!result && resumes.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="card">
              <h2 className="font-syne font-bold text-lg text-white mb-4">
                📋 Previous Analyses
              </h2>
              <div className="flex flex-col gap-3">
                {resumes.map((resume, i) => (
                  <div key={i}
                    className="flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all"
                    style={{ backgroundColor: '#111827', border: '1px solid #1e2d45' }}
                    onClick={() => setResult(resume)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📄</span>
                      <div>
                        <p className="text-white font-semibold text-sm">{resume.fileName}</p>
                        <p className="text-xs" style={{ color: '#8892a4' }}>
                          {new Date(resume.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ backgroundColor: 'rgba(0,255,136,0.1)', color: '#00ff88' }}>
                      View →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;