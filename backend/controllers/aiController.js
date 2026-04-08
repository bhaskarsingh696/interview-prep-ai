const { generateQuestions, evaluateAnswer } = require('../utils/groqHelper');
const Interview = require('../models/Interview');

// Generate interview questions
const getInterviewQuestions = async (req, res) => {
  try {
    const { topic, difficulty, count } = req.body;
    if (!topic || !difficulty) {
      return res.status(400).json({ message: 'Topic and difficulty are required' });
    }
    const questions = await generateQuestions(topic, difficulty, count || 5);
    res.status(200).json({ questions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate questions', error: error.message });
  }
};

// Evaluate a single answer
const evaluateUserAnswer = async (req, res) => {
  try {
    const { question, userAnswer, topic } = req.body;
    if (!question || !userAnswer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }
    const evaluation = await evaluateAnswer(question, userAnswer, topic);
    res.status(200).json(evaluation);
  } catch (error) {
    res.status(500).json({ message: 'Failed to evaluate answer', error: error.message });
  }
};

// Save interview session
const saveInterview = async (req, res) => {
  try {
    const { topic, difficulty, evaluations } = req.body;
    const totalScore = evaluations.reduce((sum, e) => sum + (e.score || 0), 0);
    const maxScore = evaluations.reduce((sum, e) => sum + (e.maxScore || 10), 0);
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    const interview = await Interview.create({
      user: req.user.id,
      topic,
      difficulty,
      totalScore,
      maxScore,
      percentage,
      totalQuestions: evaluations.length,
      evaluations
    });

    res.status(201).json({ message: 'Interview saved!', interview });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save interview', error: error.message });
  }
};

// Get my interview history
const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select('topic difficulty totalScore maxScore percentage totalQuestions createdAt');
    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getInterviewQuestions, evaluateUserAnswer, saveInterview, getMyInterviews };