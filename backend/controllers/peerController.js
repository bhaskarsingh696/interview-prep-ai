const PeerInterview = require('../models/PeerInterview');

// Create a peer interview room
const createPeerRoom = async (req, res) => {
  try {
    const { topic, difficulty, initiatorRole } = req.body;
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();

    const peerInterview = await PeerInterview.create({
      roomId,
      initiator: req.user.id,
      topic,
      difficulty,
      initiatorRole: initiatorRole || 'interviewer'
    });

    res.status(201).json({ message: 'Room created!', peerInterview });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get available rooms to join
const getAvailableRooms = async (req, res) => {
  try {
    const rooms = await PeerInterview.find({
      status: 'waiting',
      initiator: { $ne: req.user.id }
    })
      .populate('initiator', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Join a peer interview room
const joinPeerRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await PeerInterview.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    if (room.status !== 'waiting') {
      return res.status(400).json({ message: 'Room is no longer available' });
    }
    if (room.initiator.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot join your own room' });
    }

    room.participant = req.user.id;
    room.status = 'active';
    await room.save();

    res.status(200).json({ message: 'Joined room!', room });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Complete a peer interview and submit feedback
const completePeerInterview = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { rating, comment } = req.body;

    const room = await PeerInterview.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Determine if user is initiator or participant
    if (room.initiator.toString() === req.user.id) {
      room.feedback.fromInitiator = { rating, comment };
    } else if (room.participant?.toString() === req.user.id) {
      room.feedback.fromParticipant = { rating, comment };
    }

    // Mark as completed if both gave feedback
    if (room.feedback.fromInitiator.rating && room.feedback.fromParticipant.rating) {
      room.status = 'completed';
      room.completedAt = new Date();
    }

    await room.save();
    res.status(200).json({ message: 'Feedback submitted!', room });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get my peer interview history
const getMyPeerInterviews = async (req, res) => {
  try {
    const interviews = await PeerInterview.find({
      $or: [{ initiator: req.user.id }, { participant: req.user.id }]
    })
      .populate('initiator', 'name')
      .populate('participant', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createPeerRoom,
  getAvailableRooms,
  joinPeerRoom,
  completePeerInterview,
  getMyPeerInterviews
};