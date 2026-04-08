const express = require('express');
const router = express.Router();
const {
  getInterviewQuestions,
  evaluateUserAnswer,
  saveInterview,
  getMyInterviews
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate-questions', protect, getInterviewQuestions);
router.post('/evaluate-answer', protect, evaluateUserAnswer);
router.post('/save-interview', protect, saveInterview);
router.get('/my-interviews', protect, getMyInterviews);

module.exports = router;
