const mongoose = require('mongoose');

const peerInterviewSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  topic: { type: String, required: true },
  difficulty: { type: String, required: true },
  status: {
    type: String,
    enum: ['waiting', 'active', 'completed'],
    default: 'waiting'
  },
  initiatorRole: {
    type: String,
    enum: ['interviewer', 'candidate'],
    default: 'interviewer'
  },
  feedback: {
    fromInitiator: {
      rating: { type: Number, min: 1, max: 5, default: null },
      comment: { type: String, default: '' }
    },
    fromParticipant: {
      rating: { type: Number, min: 1, max: 5, default: null },
      comment: { type: String, default: '' }
    }
  },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }
});

module.exports = mongoose.model('PeerInterview', peerInterviewSchema);