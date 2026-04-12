import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { getProblemById, runCode, submitCode } from '../services/codeService';

const CodeEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await getProblemById(id);
        setProblem(data);
        setCode(data.starterCode['javascript']);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
    const interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (problem) setCode(problem.starterCode[language] || '// Start coding here');
  }, [language, problem]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getDifficultyColor = (d) => {
    if (d === 'Easy') return '#4ade80';
    if (d === 'Medium') return '#fbbf24';
    return '#f87171';
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('⏳ Running your code...');
    setSubmitResult('');
    try {
      const result = await runCode(code, language);
      setOutput(result.error ? `❌ Error:\n${result.error}` : result.output || '✅ No output');
    } catch (error) {
      setOutput(`❌ Failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitResult('');
    setOutput('⏳ Submitting...');
    try {
      const result = await runCode(code, language);
      const status = result.error ? 'Wrong Answer' : 'Accepted';
      await submitCode({ problemId: id, code, language, status, timeTaken: timer });
      if (status === 'Accepted') {
        setSubmitResult('accepted');
        setOutput(result.output || '✅ All test cases passed!');
        // ✅ FIX: After successful submission, redirect to dashboard after 2 seconds to see updated stats
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setSubmitResult('wrong');
        setOutput(`❌ Error:\n${result.error}`);
      }
    } catch (error) {
      setSubmitResult('wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#0a0e1a' }}>
      <p style={{ color: '#8892a4' }}>Loading problem...</p>
    </div>
  );

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: '#0a0e1a' }}>

      {/* Top Bar */}
      <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ backgroundColor: '#0d1220', borderColor: '#1e2d45' }}>
        <button
          onClick={() => navigate('/practice')}
          className="text-sm px-3 py-1.5 rounded-lg border transition-all"
          style={{ backgroundColor: '#141b2d', borderColor: '#1e2d45', color: '#8892a4' }}
        >
          ← Back
        </button>

        <span className="font-syne font-bold text-white flex-1">{problem?.title}</span>

        <span className="font-bold text-sm" style={{ color: getDifficultyColor(problem?.difficulty) }}>
          {problem?.difficulty}
        </span>

        <span className="font-mono text-sm px-3 py-1 rounded-lg" style={{ backgroundColor: '#141b2d', color: '#00ff88' }}>
          ⏱ {formatTime(timer)}
        </span>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-lg border outline-none"
          style={{ backgroundColor: '#141b2d', borderColor: '#1e2d45', color: '#e8eaf0' }}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>

        <button
          onClick={handleRun}
          disabled={isRunning}
          className="text-sm font-semibold px-4 py-1.5 rounded-lg border-none transition-all"
          style={{ backgroundColor: '#4ade80', color: '#0a0e1a' }}
        >
          {isRunning ? 'Running...' : '▶ Run'}
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="text-sm font-semibold px-4 py-1.5 rounded-lg border-none transition-all"
          style={{ backgroundColor: '#4f9cf9', color: '#0a0e1a' }}
        >
          {isSubmitting ? 'Submitting...' : '🚀 Submit'}
        </button>
      </div>

      {/* Submit Result Banner */}
      {submitResult && (
        <div
          className="text-center py-2.5 font-bold text-sm"
          style={{
            backgroundColor: submitResult === 'accepted' ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
            color: submitResult === 'accepted' ? '#4ade80' : '#f87171',
            borderBottom: `1px solid ${submitResult === 'accepted' ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`
          }}
        >
          {submitResult === 'accepted' ? '✅ Accepted! Great job!' : '❌ Wrong Answer. Try again!'}
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Panel - Problem */}
        <div
          className="w-5/12 overflow-y-auto p-6 border-r"
          style={{ backgroundColor: '#0d1220', borderColor: '#1e2d45' }}
        >
          <h2 className="font-syne font-bold text-white text-lg mb-3">📋 Problem</h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: '#cbd5e1' }}>
            {problem?.description}
          </p>

          <h3 className="font-syne font-bold text-white text-sm mb-3">📌 Examples</h3>
          {problem?.examples.map((ex, i) => (
            <div
              key={i}
              className="rounded-lg p-4 mb-3 text-sm"
              style={{ backgroundColor: '#141b2d', border: '1px solid #1e2d45' }}
            >
              <p style={{ color: '#8892a4' }}><span className="text-white font-semibold">Input:</span> {ex.input}</p>
              <p style={{ color: '#8892a4' }} className="mt-1"><span className="text-white font-semibold">Output:</span> {ex.output}</p>
              {ex.explanation && (
                <p style={{ color: '#8892a4' }} className="mt-1"><span className="text-white font-semibold">Explanation:</span> {ex.explanation}</p>
              )}
            </div>
          ))}

          <h3 className="font-syne font-bold text-white text-sm mb-2">⚠️ Constraints</h3>
          <p className="text-sm mb-6" style={{ color: '#8892a4' }}>{problem?.constraints}</p>

          <h3 className="font-syne font-bold text-white text-sm mb-2">🖥️ Output</h3>
          <div
            className="rounded-lg p-4 font-mono text-sm min-h-16 whitespace-pre-wrap"
            style={{ backgroundColor: '#141b2d', color: '#00ff88', border: '1px solid #1e2d45' }}
          >
            {output || 'Click "▶ Run" to see output here...'}
          </div>
        </div>

        {/* Right Panel - Editor */}
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontFamily: 'JetBrains Mono, monospace',
              padding: { top: 16 }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;