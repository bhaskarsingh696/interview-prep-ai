const express = require('express');
const router = express.Router();
const {
  getProblems,
  getProblemById,
  createProblem,
  runCode,
  submitCode,
  getMySubmissions
} = require('../controllers/codeController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/problems', getProblems);
router.get('/problems/:id', getProblemById);

// Protected routes
router.post('/problems', protect, createProblem);
router.post('/run', protect, runCode);
router.post('/submit', protect, submitCode);
router.get('/submissions/me', protect, getMySubmissions);

module.exports = router;