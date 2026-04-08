const express = require('express');
const router = express.Router();
const {
  checkPlagiarism,
  getMyPlagiarismReport
} = require('../controllers/plagiarismController');
const { protect } = require('../middleware/authMiddleware');

router.get('/check/:submissionId', protect, checkPlagiarism);
router.get('/my-report', protect, getMyPlagiarismReport);

module.exports = router;