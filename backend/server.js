const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middlewares
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const codeRoutes = require('./routes/codeRoutes');
const aiRoutes = require('./routes/aiRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const peerRoutes = require('./routes/peerRoutes');
const plagiarismRoutes = require('./routes/plagiarismRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/code', codeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/peer', peerRoutes);
app.use('/api/plagiarism', plagiarismRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🚀 Smart Interview Platform API is running!' });
});

// Socket.io — Live Interview Events
const rooms = {};

io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on('join-room', ({ roomId, userName, role }) => {
    if (!rooms[roomId]) rooms[roomId] = [];
    rooms[roomId].push({ id: socket.id, userName, role });
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', { userId: socket.id, userName, role });
    const otherUsers = rooms[roomId].filter(u => u.id !== socket.id);
    socket.emit('existing-users', otherUsers);
    console.log(`👥 ${userName} joined room: ${roomId}`);
  });

  socket.on('send-signal', ({ to, signal, from, userName }) => {
    io.to(to).emit('receive-signal', { signal, from, userName });
  });

  socket.on('return-signal', ({ to, signal }) => {
    io.to(to).emit('signal-returned', { signal, from: socket.id });
  });

  socket.on('code-change', ({ roomId, code, language }) => {
    socket.to(roomId).emit('code-update', { code, language });
  });

  socket.on('send-message', ({ roomId, message, userName }) => {
    io.to(roomId).emit('receive-message', {
      message,
      userName,
      time: new Date().toLocaleTimeString()
    });
  });

  socket.on('leave-room', ({ roomId }) => {
    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter(u => u.id !== socket.id);
      if (rooms[roomId].length === 0) delete rooms[roomId];
    }
    socket.to(roomId).emit('user-left', { userId: socket.id });
  });

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
    for (const roomId in rooms) {
      const user = rooms[roomId].find(u => u.id === socket.id);
      if (user) {
        rooms[roomId] = rooms[roomId].filter(u => u.id !== socket.id);
        if (rooms[roomId].length === 0) delete rooms[roomId];
        io.to(roomId).emit('user-left', { userId: socket.id });
      }
    }
  });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    server.listen(process.env.PORT || 5000, () => {
      console.log(`✅ Server running on http://localhost:${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });