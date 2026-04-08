const Submission = require('../models/Submission');
const { calculateSimilarity, getPlagiarismLevel } = require('../utils/plagiarismHelper');

// Check plagiarism for a submission
const checkPlagiarism = async (req, res) => {
  try {
    const { submissionId } = req.params;

    // Get the submission to check
    const submission = await Submission.findById(submissionId)
      .populate('problem', 'title topic difficulty');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Get all other submissions for same problem
    const otherSubmissions = await Submission.find({
      problem: submission.problem._id,
      _id: { $ne: submissionId },
      language: submission.language
    }).populate('user', 'name');

    if (otherSubmissions.length === 0) {
      return res.status(200).json({
        message: 'No other submissions to compare',
        results: [],
        overallRisk: 'Low'
      });
    }

    // Compare with each submission
    const results = otherSubmissions.map(other => {
      const similarity = calculateSimilarity(submission.code, other.code);
      const { level, color } = getPlagiarismLevel(similarity);
      return {
        comparedWith: other.user?.name || 'Unknown',
        similarity,
        level,
        color,
        submissionId: other._id
      };
    });

    // Sort by similarity descending
    results.sort((a, b) => b.similarity - a.similarity);

    // Overall risk
    const maxSimilarity = results[0]?.similarity || 0;
    const { level: overallRisk } = getPlagiarismLevel(maxSimilarity);

    res.status(200).json({
      submission: {
        id: submission._id,
        problem: submission.problem?.title,
        language: submission.language,
        status: submission.status
      },
      results: results.slice(0, 5), // top 5 most similar
      overallRisk,
      maxSimilarity
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get plagiarism report for all my submissions
const getMyPlagiarismReport = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get my recent submissions
    const mySubmissions = await Submission.find({ user: userId })
      .populate('problem', 'title topic difficulty')
      .sort({ createdAt: -1 })
      .limit(10);

    const report = [];

    for (const submission of mySubmissions) {
      // Get other submissions for same problem
      const otherSubmissions = await Submission.find({
        problem: submission.problem?._id,
        _id: { $ne: submission._id },
        language: submission.language
      }).limit(10);

      if (otherSubmissions.length === 0) {
        report.push({
          submissionId: submission._id,
          problem: submission.problem?.title,
          topic: submission.problem?.topic,
          language: submission.language,
          maxSimilarity: 0,
          risk: 'Low',
          color: 'green'
        });
        continue;
      }

      // Find max similarity
      let maxSimilarity = 0;
      for (const other of otherSubmissions) {
        const similarity = calculateSimilarity(submission.code, other.code);
        maxSimilarity = Math.max(maxSimilarity, similarity);
      }

      const { level, color } = getPlagiarismLevel(maxSimilarity);
      report.push({
        submissionId: submission._id,
        problem: submission.problem?.title,
        topic: submission.problem?.topic,
        language: submission.language,
        maxSimilarity,
        risk: level,
        color
      });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { checkPlagiarism, getMyPlagiarismReport };