const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: { type: String, required: true },
  difficulty: { type: String, required: true },
  totalScore: { type: Number, default: 0 },
  maxScore: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  evaluations: [{
    question: String,
    userAnswer: String,
    score: Number,
    maxScore: Number,
    feedback: String,
    strengths: [String],
    improvements: [String],
    modelAnswer: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interview', interviewSchema);