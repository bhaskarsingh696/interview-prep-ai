import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createPeerRoom,
  getAvailableRooms,
  joinPeerRoom,
  completePeerInterview,
  getMyPeerInterviews
} from '../services/peerService';
import useAuth from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';

const PeerInterview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState('available'); // available, create, history
  const [availableRooms, setAvailableRooms] = useState([]);
  const [myInterviews, setMyInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState('DSA');
  const [difficulty, setDifficulty] = useState('Medium');
  const [initiatorRole, setInitiatorRole] = useState('interviewer');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Feedback state
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRoomId, setFeedbackRoomId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [rooms, interviews] = await Promise.all([
        getAvailableRooms(),
        getMyPeerInterviews()
      ]);
      setAvailableRooms(rooms);
      setMyInterviews(interviews);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    setCreating(true);
    setError('');
    try {
      const data = await createPeerRoom(topic, difficulty, initiatorRole);
      setSuccess(`Room created! ID: ${data.peerInterview.roomId}`);
      fetchData();
      setTab('available');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create room');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinRoom = async (roomId) => {
    setJoining(true);
    setError('');
    try {
      await joinPeerRoom(roomId);
      navigate(`/live-interview?roomId=${roomId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join room');
    } finally {
      setJoining(false);
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      await completePeerInterview(feedbackRoomId, rating, comment);
      setShowFeedback(false);
      setSuccess('Feedback submitted successfully!');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    }
  };

  const getStatusColor = (status) => {
    if (status === 'waiting') return '#fbbf24';
    if (status === 'active') return '#4ade80';
    return '#8892a4';
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0a0e1a' }}>
      <Sidebar />
      <div className="page-wrapper flex-1">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-syne font-bold text-3xl text-white mb-2">
            👥 Peer Interview
          </h1>
          <p style={{ color: '#8892a4' }}>
            Practice interviews with other students
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="rounded-lg px-4 py-3 mb-4 text-sm"
            style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg px-4 py-3 mb-4 text-sm"
            style={{ backgroundColor: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', color: '#00ff88' }}>
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'available', label: '🔍 Available Rooms' },
            { id: 'create', label: '🆕 Create Room' },
            { id: 'history', label: '📋 My History' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-none"
              style={{
                backgroundColor: tab === t.id ? '#00ff88' : '#141b2d',
                color: tab === t.id ? '#0a0e1a' : '#8892a4'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Available Rooms Tab */}
        {tab === 'available' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-syne font-bold text-xl text-white">
                Available Rooms
              </h2>
              <button onClick={fetchData} className="btn-secondary text-sm py-2">
                🔄 Refresh
              </button>
            </div>

            {loading ? (
              <p style={{ color: '#8892a4' }}>Loading rooms...</p>
            ) : availableRooms.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-white font-semibold mb-2">No rooms available</p>
                <p style={{ color: '#8892a4' }} className="text-sm mb-4">
                  Be the first to create a room!
                </p>
                <button onClick={() => setTab('create')} className="btn-primary">
                  Create Room
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {availableRooms.map((room) => (
                  <div key={room._id} className="card">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono font-bold text-white">{room.roomId}</span>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full"
                        style={{ backgroundColor: `${getStatusColor(room.status)}20`, color: getStatusColor(room.status) }}>
                        {room.status}
                      </span>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <span className="topic-badge">{room.topic}</span>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full"
                        style={{ backgroundColor: 'rgba(168,85,247,0.1)', color: '#a855f7' }}>
                        {room.difficulty}
                      </span>
                    </div>
                    <p className="text-sm mb-1" style={{ color: '#8892a4' }}>
                      Host: <span className="text-white">{room.initiator?.name}</span>
                    </p>
                    <p className="text-sm mb-4" style={{ color: '#8892a4' }}>
                      Your role: <span className="text-white font-semibold">
                        {room.initiatorRole === 'interviewer' ? 'Candidate' : 'Interviewer'}
                      </span>
                    </p>
                    <button
                      onClick={() => handleJoinRoom(room.roomId)}
                      disabled={joining}
                      className="btn-primary w-full text-sm py-2"
                    >
                      {joining ? 'Joining...' : '🔗 Join Room'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Room Tab */}
        {tab === 'create' && (
          <div className="max-w-xl">
            <h2 className="font-syne font-bold text-xl text-white mb-6">
              Create Interview Room
            </h2>

            <div className="card">
              <div className="mb-5">
                <label className="block text-sm font-medium mb-2" style={{ color: '#8892a4' }}>
                  Topic
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['DSA', 'OS', 'DBMS', 'CN', 'HR', 'System Design'].map((t) => (
                    <button key={t} onClick={() => setTopic(t)}
                      className="py-2 px-3 rounded-lg text-sm font-semibold transition-all border"
                      style={{
                        backgroundColor: topic === t ? 'rgba(0,255,136,0.1)' : '#111827',
                        borderColor: topic === t ? '#00ff88' : '#1e2d45',
                        color: topic === t ? '#00ff88' : '#8892a4'
                      }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium mb-2" style={{ color: '#8892a4' }}>
                  Difficulty
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Easy', color: '#4ade80' },
                    { label: 'Medium', color: '#fbbf24' },
                    { label: 'Hard', color: '#f87171' }
                  ].map((d) => (
                    <button key={d.label} onClick={() => setDifficulty(d.label)}
                      className="py-2 px-3 rounded-lg text-sm font-semibold transition-all border"
                      style={{
                        backgroundColor: difficulty === d.label ? `${d.color}15` : '#111827',
                        borderColor: difficulty === d.label ? d.color : '#1e2d45',
                        color: difficulty === d.label ? d.color : '#8892a4'
                      }}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: '#8892a4' }}>
                  Your Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '🎤 Interviewer', value: 'interviewer' },
                    { label: '👨‍💻 Candidate', value: 'candidate' }
                  ].map((r) => (
                    <button key={r.value} onClick={() => setInitiatorRole(r.value)}
                      className="py-2.5 px-3 rounded-lg text-sm font-semibold transition-all border"
                      style={{
                        backgroundColor: initiatorRole === r.value ? 'rgba(79,156,249,0.1)' : '#111827',
                        borderColor: initiatorRole === r.value ? '#4f9cf9' : '#1e2d45',
                        color: initiatorRole === r.value ? '#4f9cf9' : '#8892a4'
                      }}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreateRoom}
                disabled={creating}
                className="btn-primary w-full py-3 font-bold"
              >
                {creating ? '⏳ Creating...' : '🚀 Create Room'}
              </button>
            </div>
          </div>
        )}

        {/* History Tab */}
        {tab === 'history' && (
          <div>
            <h2 className="font-syne font-bold text-xl text-white mb-6">
              My Peer Interview History
            </h2>

            {myInterviews.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-4xl mb-3">📋</p>
                <p className="text-white font-semibold mb-2">No peer interviews yet</p>
                <p style={{ color: '#8892a4' }} className="text-sm">
                  Join or create a room to start!
                </p>
              </div>
            ) : (
              <div className="card p-0 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: '#0d1220' }}>
                      <th className="table-header">Room ID</th>
                      <th className="table-header">Topic</th>
                      <th className="table-header">Difficulty</th>
                      <th className="table-header">With</th>
                      <th className="table-header">Status</th>
                      <th className="table-header">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myInterviews.map((interview, i) => {
                      const isInitiator = interview.initiator?._id === user?.id;
                      const partner = isInitiator ? interview.participant : interview.initiator;
                      const hasFeedback = isInitiator
                        ? interview.feedback?.fromInitiator?.rating
                        : interview.feedback?.fromParticipant?.rating;

                      return (
                        <tr key={i} className="table-row">
                          <td className="table-cell font-mono font-bold text-white">
                            {interview.roomId}
                          </td>
                          <td className="table-cell">
                            <span className="topic-badge">{interview.topic}</span>
                          </td>
                          <td className="table-cell">{interview.difficulty}</td>
                          <td className="table-cell text-white">
                            {partner?.name || 'Waiting...'}
                          </td>
                          <td className="table-cell">
                            <span className="font-semibold text-sm"
                              style={{ color: getStatusColor(interview.status) }}>
                              {interview.status}
                            </span>
                          </td>
                          <td className="table-cell">
                            {interview.status === 'active' && !hasFeedback && (
                              <button
                                onClick={() => {
                                  setFeedbackRoomId(interview.roomId);
                                  setShowFeedback(true);
                                }}
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg border-none"
                                style={{ backgroundColor: '#4f9cf9', color: '#fff' }}
                              >
                                ⭐ Rate
                              </button>
                            )}
                            {hasFeedback && (
                              <span className="text-xs" style={{ color: '#4ade80' }}>
                                ✅ Rated
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedback && (
          <div className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
            <div className="card w-full max-w-md">
              <h2 className="font-syne font-bold text-xl text-white mb-6">
                ⭐ Rate Your Experience
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-3" style={{ color: '#8892a4' }}>
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="text-3xl border-none bg-transparent cursor-pointer transition-all"
                      style={{ opacity: star <= rating ? 1 : 0.3 }}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: '#8892a4' }}>
                  Comment (optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How was your experience?"
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowFeedback(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  className="btn-primary flex-1"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeerInterview;