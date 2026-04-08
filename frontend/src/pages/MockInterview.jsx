import React, { useState } from 'react';
import { generateQuestions, evaluateAnswer, saveInterview } from '../services/aiService';
import Sidebar from '../components/Sidebar';

const MockInterview = () => {
  const [step, setStep] = useState('setup'); // setup, interview, results
  const [topic, setTopic] = useState('DSA');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  const startInterview = async () => {
    setLoading(true);
    try {
      const data = await generateQuestions(topic, difficulty, 5);
      setQuestions(data.questions);
      setStep('interview');
      setCurrentQ(0);
      setEvaluations([]);
    } catch (error) {
      alert('Failed to generate questions. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
  if (!userAnswer.trim()) return;
  setEvaluating(true);
  try {
    const evaluation = await evaluateAnswer(
      questions[currentQ].question,
      userAnswer,
      topic
    );
    const newEvaluations = [...evaluations, {
      question: questions[currentQ].question,
      userAnswer,
      ...evaluation
    }];
    setEvaluations(newEvaluations);
    setUserAnswer('');

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      // Save interview to database
      await saveInterview(topic, difficulty, newEvaluations);
      setStep('results');
    }
  } catch (error) {
    alert('Failed to evaluate answer. Try again!');
  } finally {
    setEvaluating(false);
  }
};

  const totalScore = evaluations.reduce((sum, e) => sum + (e.score || 0), 0);
  const maxScore = evaluations.reduce((sum, e) => sum + (e.maxScore || 10), 0);
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  const getScoreColor = (score, max) => {
    const pct = (score / max) * 100;
    if (pct >= 80) return '#4ade80';
    if (pct >= 60) return '#fbbf24';
    return '#f87171';
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0a0e1a' }}>
      <Sidebar />
      <div className="page-wrapper flex-1">

        {/* SETUP STEP */}
        {step === 'setup' && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="font-syne font-bold text-3xl text-white mb-2">
                🤖 AI Mock Interview
              </h1>
              <p style={{ color: '#8892a4' }}>
                Practice with AI-generated questions and get instant feedback
              </p>
            </div>

            <div className="card">
              <h2 className="font-syne font-bold text-xl text-white mb-6">
                Configure Your Interview
              </h2>

              <div className="mb-5">
                <label className="block text-sm font-medium mb-2" style={{ color: '#8892a4' }}>
                  Select Topic
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['DSA', 'OS', 'DBMS', 'CN', 'HR', 'System Design'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTopic(t)}
                      className="py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 border"
                      style={{
                        backgroundColor: topic === t ? 'rgba(0,255,136,0.1)' : '#111827',
                        borderColor: topic === t ? '#00ff88' : '#1e2d45',
                        color: topic === t ? '#00ff88' : '#8892a4'
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium mb-2" style={{ color: '#8892a4' }}>
                  Select Difficulty
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Easy', color: '#4ade80' },
                    { label: 'Medium', color: '#fbbf24' },
                    { label: 'Hard', color: '#f87171' }
                  ].map((d) => (
                    <button
                      key={d.label}
                      onClick={() => setDifficulty(d.label)}
                      className="py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 border"
                      style={{
                        backgroundColor: difficulty === d.label ? `${d.color}15` : '#111827',
                        borderColor: difficulty === d.label ? d.color : '#1e2d45',
                        color: difficulty === d.label ? d.color : '#8892a4'
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="rounded-xl p-4 mb-6 text-sm"
                style={{ backgroundColor: 'rgba(79,156,249,0.08)', border: '1px solid rgba(79,156,249,0.2)' }}
              >
                <p style={{ color: '#4f9cf9' }}>
                  📋 You will be asked <strong>5 questions</strong> on <strong>{topic}</strong> at <strong>{difficulty}</strong> level.
                  Each answer will be evaluated by AI instantly!
                </p>
              </div>

              <button
                onClick={startInterview}
                disabled={loading}
                className="btn-primary w-full py-3 text-base font-bold"
              >
                {loading ? '⏳ Generating Questions...' : '🚀 Start Interview'}
              </button>
            </div>
          </div>
        )}

        {/* INTERVIEW STEP */}
        {step === 'interview' && questions.length > 0 && (
          <div className="max-w-3xl mx-auto">
            {/* Progress */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-syne font-bold text-2xl text-white">
                🤖 AI Mock Interview
              </h1>
              <span className="text-sm font-semibold px-4 py-1.5 rounded-full"
                style={{ backgroundColor: 'rgba(0,255,136,0.1)', color: '#00ff88' }}>
                Question {currentQ + 1} of {questions.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full rounded-full mb-6 overflow-hidden" style={{ height: '6px', backgroundColor: '#1e2d45' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${((currentQ) / questions.length) * 100}%`, backgroundColor: '#00ff88' }}
              />
            </div>

            {/* Question Card */}
            <div className="card mb-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(79,156,249,0.1)', color: '#4f9cf9' }}>
                  {topic}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(0,255,136,0.1)', color: '#00ff88' }}>
                  {difficulty}
                </span>
              </div>
              <p className="text-white text-lg leading-relaxed font-medium">
                {questions[currentQ]?.question}
              </p>
            </div>

            {/* Answer Input */}
            <div className="card mb-4">
              <label className="block text-sm font-medium mb-3" style={{ color: '#8892a4' }}>
                Your Answer
              </label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer here... Be as detailed as possible!"
                rows={6}
                className="input-field resize-none"
                style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
              />
            </div>

            <button
              onClick={submitAnswer}
              disabled={evaluating || !userAnswer.trim()}
              className="btn-primary w-full py-3 text-base font-bold"
            >
              {evaluating ? '⏳ AI is evaluating...' : currentQ + 1 === questions.length ? '🏁 Submit & Finish' : '➡️ Submit & Next'}
            </button>
          </div>
        )}

        {/* RESULTS STEP */}
        {step === 'results' && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="font-syne font-bold text-3xl text-white mb-2">
                🏆 Interview Results
              </h1>
              <p style={{ color: '#8892a4' }}>Here's how you performed!</p>
            </div>

            {/* Overall Score */}
            <div className="card text-center mb-6">
              <div
                className="font-syne font-bold text-6xl mb-2"
                style={{ color: getScoreColor(totalScore, maxScore) }}
              >
                {percentage}%
              </div>
              <div className="text-white font-semibold text-xl mb-1">
                {totalScore} / {maxScore} points
              </div>
              <div style={{ color: '#8892a4' }} className="text-sm">
                {percentage >= 80 ? '🎉 Excellent! You are ready!' :
                  percentage >= 60 ? '👍 Good job! Keep practicing!' :
                    '💪 Keep going! Practice makes perfect!'}
              </div>
            </div>

            {/* Per Question Results */}
            <div className="flex flex-col gap-4 mb-6">
              {evaluations.map((ev, i) => (
                <div key={i} className="card">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-syne font-bold text-white text-sm">
                      Q{i + 1}. {ev.question}
                    </span>
                    <span
                      className="font-bold text-lg ml-4 flex-shrink-0"
                      style={{ color: getScoreColor(ev.score, ev.maxScore) }}
                    >
                      {ev.score}/{ev.maxScore}
                    </span>
                  </div>

                  <p className="text-sm mb-3" style={{ color: '#cbd5e1' }}>
                    {ev.feedback}
                  </p>

                  {ev.strengths?.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-semibold mb-1" style={{ color: '#4ade80' }}>✅ Strengths</p>
                      {ev.strengths.map((s, j) => (
                        <p key={j} className="text-xs" style={{ color: '#8892a4' }}>• {s}</p>
                      ))}
                    </div>
                  )}

                  {ev.improvements?.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-semibold mb-1" style={{ color: '#fbbf24' }}>⚠️ Improvements</p>
                      {ev.improvements.map((s, j) => (
                        <p key={j} className="text-xs" style={{ color: '#8892a4' }}>• {s}</p>
                      ))}
                    </div>
                  )}

                  <div className="rounded-lg p-3 mt-2" style={{ backgroundColor: '#111827' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#4f9cf9' }}>💡 Model Answer</p>
                    <p className="text-xs" style={{ color: '#8892a4' }}>{ev.modelAnswer}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep('setup')}
              className="btn-primary w-full py-3 text-base font-bold"
            >
              🔄 Start New Interview
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;