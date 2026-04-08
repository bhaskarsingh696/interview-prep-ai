# 🏗️ SYSTEM ARCHITECTURE & TECH STACK REFERENCE

## 🎨+++++++

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  React 19                    Tailwind CSS 3        Monaco Editor │
│  Context API          Socket.io (WebRTC for video)               │
│  React Router 7                                                   │
│                          ▼                                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Frontend (Vercel/Netlify)                               │   │
│  │  - Dashboard, CodeEditor, MockInterview, etc.            │   │
│  │  - Error Boundaries, Loading States                      │   │
│  │  - Auth Context + localStorage                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────┬───────────────────────────────────────────────┘
                   │
                   │ HTTP/REST API Calls + WebSocket
                   │ Authorization: Bearer JWT
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Express 5 Server (Render/Railway)                               │
│  - CORS Protection          - Rate Limiting                      │
│  - Compression              - Error Handler Middleware            │
│  - Security Headers         - JWT Validation                      │
│                                                                   │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐    │
│  │ Auth Routes    │  │ Code Routes    │  │ AI Routes      │    │
│  │ /register      │  │ /problems      │  │ /questions     │    │
│  │ /login         │  │ /run           │  │ /evaluate      │    │
│  │ /logout        │  │ /submit        │  │ /interviews    │    │
│  └────────────────┘  └────────────────┘  └────────────────┘    │
│                                                                   │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐    │
│  │ Resume Routes  │  │ Analytics      │  │ Peer Routes    │    │
│  │ /upload        │  │ /stats         │  │ /create-room   │    │
│  │ /my            │  │ /weak-topics   │  │ /join          │    │
│  └────────────────┘  └────────────────┘  └────────────────┘    │
└──────────────────┬───────────────────────────────────────────────┘
                   │
         ┌─────────┴──────────┐
         │                    │
    Database                APIs
         │                    │
         ▼                    ▼
┌─────────────────┐   ┌──────────────────┐
│  MongoDB        │   │  External APIs   │
│  Atlas          │   │                  │
│  (Production)   │   │ ✓ Piston API     │
│                 │   │   (Code Exec)    │
│ Schemas:        │   │                  │
│ - Users         │   │ ✓ Groq API       │
│ - Problems      │   │   (LLM AI)       │
│ - Submissions   │   │                  │
│ - Interviews    │   │ ✓ Socket.io      │
│ - PeerIntvw     │   │   (Real-time)    │
│ - Resumes       │   │                  │
│ - Analytics     │   └──────────────────┘
└─────────────────┘
```

---

## 📊 Data Flow Diagram

### 1️⃣ Authentication Flow

```
User Input (Email/Password)
         ↓
Frontend: /register or /login
         ↓
Backend: Input Validation (Joi)
         ↓
Database: Check if user exists
         ↓
Hash Password (bcryptjs)
         ↓
Create JWT Token
         ↓
Return Token + User Data
         ↓
Frontend: Store in localStorage + AuthContext
         ↓
Protected Routes: Verify token via middleware
```

### 2️⃣ Code Execution Flow

```
User writes code in Monaco Editor
         ↓
Frontend: POST /api/code/run
         ↓
Backend: Validate code (length, language)
         ↓
Rate Limiter: Check request count
         ↓
Call Piston API with code
         ↓
Return output/error
         ↓
Frontend: Display in console
         ↓
User: POST /api/code/submit
         ↓
Backend: Save submission to MongoDB
         ↓
Calculate status (Accepted/Wrong/Error/TLE)
         ↓
Update user analytics
```

### 3️⃣ AI Interview Flow

```
User selects topic + difficulty
         ↓
Frontend: POST /api/ai/questions
         ↓
Backend: Validate input
         ↓
Call Groq API with prompt
         ↓
Stream/Parse AI response
         ↓
Frontend: Display questions
         ↓
User answers question
         ↓
Frontend: POST /api/ai/evaluate
         ↓
Backend: Send question + answer to Groq
         ↓
Get evaluation score + feedback
         ↓
Frontend: Show score
         ↓
Repeat for each question
         ↓
Save entire session to MongoDB
         ↓
Update analytics dashboard
```

---

## 🛠️ Tech Stack Detailed

### Frontend Stack

| Category           | Technology       | Version  | Purpose             |
| ------------------ | ---------------- | -------- | ------------------- |
| **Framework**      | React            | 19.2.4   | UI library          |
| **Router**         | React Router     | 7.13.1   | Client-side routing |
| **State**          | Context API      | Built-in | Global auth state   |
| **Styling**        | Tailwind CSS     | 3.4.19   | Utility-first CSS   |
| **Editor**         | Monaco Editor    | 4.7.0    | Code editing        |
| **Charts**         | Recharts         | 3.8.1    | Data visualization  |
| **HTTP**           | Axios            | 1.13.6   | API calls           |
| **Auth**           | jwt-decode       | 4.0.0    | Token parsing       |
| **Real-time**      | Socket.io Client | 4.8.3    | WebSocket           |
| **P2P**            | simple-peer      | 9.11.1   | WebRTC              |
| **Build**          | react-scripts    | 5.0.1    | CRA build tool      |
| **CSS Processing** | PostCSS          | 8.5.8    | CSS transformation  |
|                    | Autoprefixer     | 10.4.27  | Browser prefixes    |

### Backend Stack

| Category        | Technology | Version | Purpose          |
| --------------- | ---------- | ------- | ---------------- |
| **Runtime**     | Node.js    | 18+     | JS runtime       |
| **Framework**   | Express    | 5.2.1   | Web framework    |
| **Database**    | MongoDB    | 6.0+    | NoSQL database   |
| **ODM**         | Mongoose   | 9.3.1   | MongoDB ODM      |
| **Auth**        | JWT        | 9.0.3   | Token-based auth |
| **Security**    | bcryptjs   | 3.0.3   | Password hashing |
| **CORS**        | cors       | 2.8.6   | CORS handling    |
| **Real-time**   | Socket.io  | 4.8.3   | WebSocket server |
| **File Upload** | multer     | 2.1.1   | File handling    |
| **PDF Parse**   | pdf-parse  | 1.1.1   | PDF extraction   |
| **Environment** | dotenv     | 17.3.1  | Env variables    |
| **AI SDK**      | groq-sdk   | 1.1.1   | Groq API client  |
| **Dev Tool**    | nodemon    | 3.1.14  | Auto-restart     |

### External Services

| Service           | Purpose          | Type     | Free Tier      |
| ----------------- | ---------------- | -------- | -------------- |
| **Piston API**    | Code Execution   | REST API | Yes            |
| **Groq API**      | AI Generation    | REST API | Yes (8K RPM)   |
| **MongoDB Atlas** | Database         | Cloud DB | Yes (512MB)    |
| **Socket.io**     | Real-time        | Library  | Yes            |
| **Vercel**        | Frontend Hosting | CDN      | Yes (100GB BW) |
| **Render**        | Backend Hosting  | PaaS     | Yes (750hrs)   |

---

## 🔒 Security Architecture

```
┌──────────────────────────────────────────────────────┐
│ FRONTEND (Browser)                                    │
│ - Store JWT in localStorage                          │
│ - Include in every API request                       │
└────────────────┬─────────────────────────────────────┘
                 │
                 │ Authorization: Bearer {token}
                 ▼
┌──────────────────────────────────────────────────────┐
│ BACKEND MIDDLEWARE CHAIN                              │
│                                                        │
│ 1. CORS Middleware                                   │
│    - Check origin (FRONTEND_URL)                     │
│    - Allow credentials                               │
│                                                        │
│ 2. Rate Limiter Middleware                           │
│    - Auth: 5 req/15 min per IP                       │
│    - Code: 10 req/min per IP                         │
│                                                        │
│ 3. Body Parser Middleware                            │
│    - Parse JSON/Form data                            │
│    - Check Content-Type                              │
│                                                        │
│ 4. Custom Routes                                     │
│    - Public routes (no auth)                         │
│    - Protected routes (require token)                │
│                                                        │
│ 5. Auth Middleware (protect function)                │
│    - Extract JWT from Authorization header           │
│    - Verify signature with JWT_SECRET                │
│    - Check if token is blacklisted                   │
│    - Attach user data to req.user                    │
│                                                        │
│ 6. Validation Layer                                  │
│    - Validate input with Joi schemas                 │
│    - Sanitize strings (escape HTML)                  │
│    - Check required fields                           │
│                                                        │
│ 7. Route Handler (Controller)                        │
│    - Business logic                                  │
│    - Database queries                                │
│    - API calls                                       │
│                                                        │
│ 8. Error Handler Middleware                          │
│    - Catch all errors                                │
│    - Log to file/Sentry                              │
│    - Return generic error messages (prod)            │
│                                                        │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│ MONGODB (Database)                                    │
│ - Encrypted connection (SSL/TLS)                     │
│ - User credentials with role-based access           │
│ - Indexed queries for performance                    │
└──────────────────────────────────────────────────────┘
```

---

## 📈 Scalability Architecture

### Current (Single Server)

```
┌─────────────┐
│  Frontend   │
│  (Vercel)   │
└──────┬──────┘
       │
┌──────▼──────┐
│  Backend    │  ← Single instance
│  (Render)   │
└──────┬──────┘
       │
┌──────▼──────┐
│  MongoDB    │  ← Shared
│  (Atlas)    │
└─────────────┘
```

### Future (Scalable)

```
┌──────────────────────┐
│  Frontend CDN        │
│  (Multi-region)      │
└────────┬─────────────┘
         │
┌────────▼──────────────────┐
│  Load Balancer             │
│  (Distribute requests)     │
└────────┬─────────────┬─────┘
         │             │
    ┌────▼─┐      ┌────▼─┐
    │ API1 │      │ API2 │   ← Horizontal scaling
    └────┬─┘      └────┬─┘
         │             │
    ┌────▼─────────────▼─┐
    │  Database           │
    │  (Replicated)       │
    │  - Primary          │
    │  - Secondary 1      │
    │  - Secondary 2      │
    └─────────────────────┘

    Plus:
    - Redis cache layer
    - Message queue (Bull)
    - Worker processes
```

---

## 🔄 Deployment Pipeline

```
Developer Code
    ↓
Git Commit
    ↓
Push to GitHub (main branch)
    ↓
GitHub Actions (CI)
    ├─ Install dependencies
    ├─ Run linter (ESLint)
    ├─ Run tests (if any)
    └─ Build (npm run build)
    ↓
Deploy to Staging
    ├─ Backend → Render staging
    ├─ Frontend → Vercel staging
    └─ Test environment variables
    ↓
Manual Testing
    ├─ Test all features
    ├─ API integration
    └─ UI responsiveness
    ↓
Deploy to Production
    ├─ Backend → Render main
    ├─ Frontend → Vercel main
    └─ Monitor logs/errors
    ↓
Health Checks
    ├─ Check API responding
    ├─ Query database
    └─ Check frontend loads
    ↓
Complete ✓
```

---

## 📋 API Endpoint Structure

```
/api
├── /auth
│   ├── POST   /register
│   ├── POST   /login
│   ├── GET    /me (protected)
│   └── POST   /logout (protected)
│
├── /code
│   ├── GET    /problems (paginated)
│   ├── GET    /problems/:id
│   ├── POST   /problems (protected, admin)
│   ├── POST   /run (protected, rate-limited)
│   ├── POST   /submit (protected, rate-limited)
│   └── GET    /submissions/me (protected)
│
├── /ai
│   ├── POST   /questions (protected)
│   ├── POST   /evaluate (protected)
│   ├── POST   /interview (protected)
│   └── GET    /interviews/me (protected)
│
├── /resume
│   ├── POST   /upload (protected, file upload)
│   ├── GET    /my (protected)
│   └── DELETE /:id (protected)
│
├── /analytics
│   ├── GET    / (protected)
│   ├── GET    /weak-topics (protected)
│   ├── GET    /trends (protected)
│   └── GET    /suggestions (protected)
│
└── /peer
    ├── POST   /create-room (protected)
    ├── GET    /available-rooms (protected)
    ├── POST   /join/:roomId (protected)
    ├── POST   /complete/:roomId (protected)
    └── GET    /history (protected)
```

---

## 🧩 Component Architecture

### Frontend Components

```
App.js
├── ErrorBoundary
│   └── AuthProvider
│       ├── Router
│       │   ├── Landing (public)
│       │   ├── Login (public)
│       │   ├── Register (public)
│       │   └── ProtectedRoute
│       │       ├── Navbar
│       │       ├── Sidebar
│       │       └── Pages
│       │           ├── Dashboard
│       │           ├── Practice
│       │           ├── CodeEditor
│       │           ├── MockInterview
│       │           ├── ResumeAnalyzer
│       │           ├── Analytics
│       │           ├── LiveInterview
│       │           ├── PeerInterview
│       │           └── Plagiarism
│       │
│       └── Loader (global)
│       └── Toast (notifications)
```

### Backend Controllers

```
server.js (Express app)
├── middleware/
│   ├── authMiddleware (JWT verification)
│   ├── errorHandler (catch-all)
│   └── rateLimiter (request limiting)
│
├── routes/
│   ├── authRoutes → authController
│   ├── codeRoutes → codeController
│   ├── aiRoutes → aiController
│   ├── resumeRoutes → resumeController
│   ├── analyticsRoutes → analyticsController
│   └── peerRoutes → peerController
│
├── utils/
│   ├── pistonHelper (code execution)
│   ├── groqHelper (AI generation)
│   └── helpers (misc)
│
└── Socket.io handlers
    ├── join-room
    ├── send-signal
    ├── code-change
    ├── send-message
    └── disconnect
```

---

## 📊 Database Relationships

```
User (1)
  ├──→ (Many) Submission
  ├──→ (Many) Interview
  ├──→ (Many) Resume
  ├──→ (Many) PeerInterview (as initiator)
  └──→ (Many) PeerInterview (as participant)

Problem (1)
  ├──→ (Many) Submission
  └──→ (Many) Interview (via evaluations)

Submission (Many)
  └──→ Problem (1)

Interview (1)
  └──→ (Many) evaluations

PeerInterview (1)
  ├──→ User (initiator)
  └──→ User (participant)
```

---

## ⚡ Performance Optimization Strategy

```
Frontend Optimizations
├── Code Splitting (lazy routes)
├── Image Lazy Loading
├── Bundle Analysis
├── Caching Strategy
│   ├── Browser cache (long-term)
│   ├── IndexedDB (offline data)
│   └── LocalStorage (session data)
└── Compression (gzip)

Backend Optimizations
├── Database
│   ├── Schema indexing
│   ├── Query optimization
│   ├── Connection pooling
│   └── Pagination
├── Caching
│   ├── Redis layer
│   ├── API response cache
│   └── Query cache
├── Rate Limiting
│   └── Prevent abuse
└── Compression (gzip)

Network
├── CDN (Vercel/Cloudflare)
├── HTTP/2
└── Compression headers
```

---

**Architecture Version:** 1.0  
**Last Updated:** April 8, 2026  
**Scale:** 1-10K users  
**Maintenance:** Self-hosted friendly
