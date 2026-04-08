const express = require('express');
const router = express.Router();
const {
  createPeerRoom,
  getAvailableRooms,
  joinPeerRoom,
  completePeerInterview,
  getMyPeerInterviews
} = require('../controllers/peerController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createPeerRoom);
router.get('/available', protect, getAvailableRooms);
router.post('/join/:roomId', protect, joinPeerRoom);
router.post('/complete/:roomId', protect, completePeerInterview);
router.get('/my-interviews', protect, getMyPeerInterviews);

module.exports = router;