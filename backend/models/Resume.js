const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: { type: String, required: true },
  extractedText: { type: String, default: '' },
  skills: [String],
  projects: [String],
  experience: [String],
  education: [String],
  jobRoles: [String],
  missingSkills: [String],
  learningRoadmap: [String],
  overallFeedback: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);