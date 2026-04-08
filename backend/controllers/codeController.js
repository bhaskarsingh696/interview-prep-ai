const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const { executeCode } = require('../utils/pistonHelper');

// Get all problems
const getProblems = async (req, res) => {
  try {
    const { topic, difficulty } = req.query;
    let filter = {};
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;
    const problems = await Problem.find(filter).select(
      'title difficulty topic tags'
    );
    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single problem by ID
const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.status(200).json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new problem
const createProblem = async (req, res) => {
  try {
    const problem = await Problem.create(req.body);
    res.status(201).json({ message: 'Problem created!', problem });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ NEW: Run code using Piston API
const runCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code || !language) {
      return res.status(400).json({ message: 'Code and language are required' });
    }
    const result = await executeCode(code, language);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit code
const submitCode = async (req, res) => {
  try {
    const { problemId, code, language, status, timeTaken } = req.body;
    const submission = await Submission.create({
      user: req.user.id,
      problem: problemId,
      code,
      language,
      status,
      timeTaken
    });
    res.status(201).json({ message: 'Submission saved!', submission });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get my submissions
const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user.id })
      .populate('problem', 'title difficulty topic')
      .sort({ createdAt: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getProblems,
  getProblemById,
  createProblem,
  runCode,
  submitCode,
  getMySubmissions
};