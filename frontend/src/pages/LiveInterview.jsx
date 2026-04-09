import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Editor from '@monaco-editor/react';
import Peer from 'simple-peer';
import useAuth from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';

const LiveInterview = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState('setup'); // setup, interview
  const [roomId, setRoomId] = useState('');
  const [inputRoomId, setInputRoomId] = useState('');
  const [peers, setPeers] = useState([]);
  const [code, setCode] = useState('// Start coding here...');
  const [language, setLanguage] = useState('javascript');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [error, setError] = useState('');

  const socketRef = useRef();
  const localVideoRef = useRef();
  const streamRef = useRef();
  const peersRef = useRef([]);

  const generateRoomId = () => {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(id);
    setInputRoomId(id);
  };

  const joinRoom = useCallback(async (roomToJoin) => {
    const createPeer = (to, from, stream) => {
      const peer = new Peer({ initiator: true, trickle: false, stream });
      peer.on('signal', (signal) => {
        socketRef.current.emit('send-signal', {
          to, signal, from, userName: user?.name
        });
      });
      return peer;
    };

    const addPeer = (from, stream) => {
      const peer = new Peer({ initiator: false, trickle: false, stream });
      peer.on('signal', (signal) => {
        socketRef.current.emit('return-signal', { to: from, signal });
      });
      return peer;
    };

    try {
      // Get camera and mic
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      streamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Connect socket
      socketRef.current = io('http://localhost:5000');

      socketRef.current.emit('join-room', {
        roomId: roomToJoin,
        userName: user?.name,
        role: user?.role
      });

      // Handle existing users
      socketRef.current.on('existing-users', (users) => {
        const newPeers = users.map((u) => {
          const peer = createPeer(u.id, socketRef.current.id, stream);
          peersRef.current.push({ peerId: u.id, peer });
          return { peerId: u.id, peer, userName: u.userName };
        });
        setPeers(newPeers);
      });

      // Handle new user joining
      socketRef.current.on('user-joined', ({ userId, userName }) => {
        const peer = addPeer(userId, stream);
        peersRef.current.push({ peerId: userId, peer });
        setPeers(prev => [...prev, { peerId: userId, peer, userName }]);
      });

      // Handle signals
      socketRef.current.on('receive-signal', ({ signal, from, userName }) => {
        const item = peersRef.current.find(p => p.peerId === from);
        if (item) {
          item.peer.signal(signal);
        } else {
          const peer = addPeer(from, stream);
          peer.signal(signal);
          peersRef.current.push({ peerId: from, peer });
          setPeers(prev => [...prev, { peerId: from, peer, userName }]);
        }
      });

      socketRef.current.on('signal-returned', ({ signal, from }) => {
        const item = peersRef.current.find(p => p.peerId === from);
        if (item) item.peer.signal(signal);
      });

      // Code sync
      socketRef.current.on('code-update', ({ code: newCode, language: newLang }) => {
        setCode(newCode);
        setLanguage(newLang);
      });

      // Chat
      socketRef.current.on('receive-message', (msg) => {
        setMessages(prev => [...prev, msg]);
      });

      // User left
      socketRef.current.on('user-left', ({ userId }) => {
        const peerObj = peersRef.current.find(p => p.peerId === userId);
        if (peerObj) peerObj.peer.destroy();
        peersRef.current = peersRef.current.filter(p => p.peerId !== userId);
        setPeers(prev => prev.filter(p => p.peerId !== userId));
      });

      setStep('interview');
    } catch (err) {
      setError('Could not access camera/microphone. Please allow permissions!');
      console.error(err);
    }
  }, [user]);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (socketRef.current && roomId) {
      socketRef.current.emit('code-change', { roomId, code: newCode, language });
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    socketRef.current.emit('send-message', {
      roomId,
      message: newMessage,
      userName: user?.name
    });
    setNewMessage('');
  };

  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const leaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit('leave-room', { roomId });
      socketRef.current.disconnect();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    peersRef.current.forEach(p => p.peer.destroy());
    setPeers([]);
    setStep('setup');
  };

  useEffect(() => {
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  // Video component for peers
  const PeerVideo = ({ peer }) => {
    const ref = useRef();
    useEffect(() => {
      peer.on('stream', (stream) => {
        if (ref.current) ref.current.srcObject = stream;
      });
    }, [peer]);
    return (
      <video
        ref={ref}
        autoPlay
        playsInline
        className="w-full h-full object-cover rounded-xl"
      />
    );
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0a0e1a' }}>
      <Sidebar />
      <div className="page-wrapper flex-1">

        {/* SETUP STEP */}
        {step === 'setup' && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="font-syne font-bold text-3xl text-white mb-2">
                🎥 Live Interview
              </h1>
              <p style={{ color: '#8892a4' }}>
                Start or join a real-time video interview session
              </p>
            </div>

            {error && (
              <div className="rounded-lg px-4 py-3 mb-4 text-sm"
                style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              {/* Create Room */}
              <div className="card">
                <h2 className="font-syne font-bold text-xl text-white mb-2">
                  🆕 Create Room
                </h2>
                <p className="text-sm mb-6" style={{ color: '#8892a4' }}>
                  Start a new interview session and share the room ID
                </p>
                <button
                  onClick={generateRoomId}
                  className="btn-secondary w-full mb-4"
                >
                  Generate Room ID
                </button>
                {roomId && (
                  <div>
                    <div className="rounded-lg p-3 mb-4 text-center font-mono font-bold text-xl"
                      style={{ backgroundColor: 'rgba(0,255,136,0.1)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.3)' }}>
                      {roomId}
                    </div>
                    <p className="text-xs text-center mb-4" style={{ color: '#8892a4' }}>
                      Share this ID with your interviewer/candidate
                    </p>
                    <button
                      onClick={() => joinRoom(roomId)}
                      className="btn-primary w-full"
                    >
                      🚀 Start Session
                    </button>
                  </div>
                )}
              </div>

              {/* Join Room */}
              <div className="card">
                <h2 className="font-syne font-bold text-xl text-white mb-2">
                  🔗 Join Room
                </h2>
                <p className="text-sm mb-6" style={{ color: '#8892a4' }}>
                  Enter the room ID shared by your interviewer
                </p>
                <input
                  type="text"
                  placeholder="Enter Room ID..."
                  value={inputRoomId}
                  onChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
                  className="input-field mb-4 font-mono font-bold text-center text-lg"
                  maxLength={6}
                />
                <button
                  onClick={() => {
                    if (inputRoomId.trim().length < 4) {
                      setError('Please enter a valid Room ID!');
                      return;
                    }
                    setRoomId(inputRoomId);
                    joinRoom(inputRoomId);
                  }}
                  className="btn-primary w-full"
                  disabled={!inputRoomId.trim()}
                >
                  🔗 Join Session
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="card mt-6"
              style={{ borderColor: 'rgba(79,156,249,0.3)', backgroundColor: 'rgba(79,156,249,0.05)' }}>
              <h3 className="font-syne font-bold text-white mb-3">📋 How it works</h3>
              <div className="flex flex-col gap-2 text-sm" style={{ color: '#8892a4' }}>
                <p>1. Interviewer creates a room and shares the Room ID</p>
                <p>2. Candidate joins using the Room ID</p>
                <p>3. Both can see each other via video</p>
                <p>4. Shared code editor for live coding</p>
                <p>5. Real-time chat for communication</p>
              </div>
            </div>
          </div>
        )}

        {/* INTERVIEW STEP */}
        {step === 'interview' && (
          <div className="h-screen flex flex-col" style={{ marginLeft: '-2rem', marginTop: '-2rem' }}>

            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b"
              style={{ backgroundColor: '#0d1220', borderColor: '#1e2d45' }}>
              <div className="flex items-center gap-3">
                <span className="font-syne font-bold text-white">🎥 Live Interview</span>
                <span className="text-xs font-mono px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(0,255,136,0.1)', color: '#00ff88' }}>
                  Room: {roomId}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={toggleMute}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold border-none"
                  style={{ backgroundColor: isMuted ? 'rgba(239,68,68,0.2)' : '#1e2d45', color: isMuted ? '#f87171' : '#fff' }}>
                  {isMuted ? '🔇 Unmute' : '🎤 Mute'}
                </button>
                <button onClick={toggleVideo}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold border-none"
                  style={{ backgroundColor: isVideoOff ? 'rgba(239,68,68,0.2)' : '#1e2d45', color: isVideoOff ? '#f87171' : '#fff' }}>
                  {isVideoOff ? '📷 Show' : '📹 Hide'}
                </button>
                <button onClick={leaveRoom}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold border-none"
                  style={{ backgroundColor: '#ef4444', color: '#fff' }}>
                  📴 Leave
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">

              {/* Left: Code Editor */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-3 px-4 py-2 border-b"
                  style={{ backgroundColor: '#0d1220', borderColor: '#1e2d45' }}>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="text-sm px-3 py-1 rounded-lg border-none outline-none"
                    style={{ backgroundColor: '#1e2d45', color: '#e8eaf0' }}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                  </select>
                  <span className="text-xs" style={{ color: '#8892a4' }}>
                    Shared Editor — changes sync in real-time
                  </span>
                </div>
                <div className="flex-1">
                  <Editor
                    height="100%"
                    language={language}
                    value={code}
                    onChange={handleCodeChange}
                    theme="vs-dark"
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      automaticLayout: true,
                      fontFamily: 'JetBrains Mono, monospace',
                      padding: { top: 16 }
                    }}
                  />
                </div>
              </div>

              {/* Right: Video + Chat */}
              <div className="flex flex-col border-l"
                style={{ width: '320px', borderColor: '#1e2d45', backgroundColor: '#0d1220' }}>

                {/* Videos */}
                <div className="p-3 flex flex-col gap-2">
                  {/* Local Video */}
                  <div className="relative rounded-xl overflow-hidden"
                    style={{ height: '140px', backgroundColor: '#141b2d' }}>
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded"
                      style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#00ff88' }}>
                      You ({user?.name})
                    </div>
                  </div>

                  {/* Remote Videos */}
                  {peers.map((peer) => (
                    <div key={peer.peerId} className="relative rounded-xl overflow-hidden"
                      style={{ height: '140px', backgroundColor: '#141b2d' }}>
                      <PeerVideo peer={peer.peer} />
                      <div className="absolute bottom-2 left-2 text-xs px-2 py-0.5 rounded"
                        style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#4f9cf9' }}>
                        {peer.userName || 'Participant'}
                      </div>
                    </div>
                  ))}

                  {peers.length === 0 && (
                    <div className="rounded-xl p-4 text-center text-sm"
                      style={{ backgroundColor: '#141b2d', color: '#8892a4' }}>
                      Waiting for others to join...
                    </div>
                  )}
                </div>

                {/* Chat */}
                <div className="flex-1 flex flex-col border-t" style={{ borderColor: '#1e2d45' }}>
                  <div className="px-3 py-2 text-xs font-semibold" style={{ color: '#8892a4' }}>
                    CHAT
                  </div>
                  <div className="flex-1 overflow-y-auto px-3 flex flex-col gap-2"
                    style={{ maxHeight: '200px' }}>
                    {messages.map((msg, i) => (
                      <div key={i} className="text-xs">
                        <span className="font-semibold" style={{ color: '#00ff88' }}>
                          {msg.userName}:
                        </span>
                        <span className="ml-1" style={{ color: '#cbd5e1' }}>{msg.message}</span>
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <p className="text-xs" style={{ color: '#4b5563' }}>No messages yet...</p>
                    )}
                  </div>
                  <div className="flex gap-2 p-3 border-t" style={{ borderColor: '#1e2d45' }}>
                    <input
                      type="text"
                      placeholder="Type message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="input-field text-xs py-1.5 flex-1"
                    />
                    <button
                      onClick={sendMessage}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border-none"
                      style={{ backgroundColor: '#00ff88', color: '#0a0e1a' }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveInterview;