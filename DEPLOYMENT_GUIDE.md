# 🚀 Deployment & Production Checklist

## ✅ Pre-Deployment Checklist

- [ ] All code reviewed (see CODE_REVIEW.md)
- [ ] Critical security fixes applied (QUICK_FIX_GUIDE.md)
- [ ] Environment variables configured
- [ ] Database backups tested
- [ ] API rate limiting active
- [ ] Error handling middleware in place
- [ ] Logging configured
- [ ] Frontend error boundaries added
- [ ] Tests passing (if applicable)

---

## 🔐 Security Pre-Flight

### Backend

- [ ] JWT_SECRET is strong (32+ chars random)
- [ ] MongoDB connection uses encryption
- [ ] `.env` NOT committed to Git
- [ ] `.gitignore` updated
- [ ] CORS restricted to frontend domain
- [ ] Rate limiting enabled
- [ ] Input validation active
- [ ] No console logs with sensitive data
- [ ] HTTPS enforced (in production)

### Frontend

- [ ] API_URL points to production backend
- [ ] No hardcoded credentials
- [ ] Error boundary component added
- [ ] Sensitive data not in localStorage
- [ ] CORS errors handled

---

## 📦 Build Optimization

### Frontend Build

```bash
cd frontend
npm run build

# Check bundle size
npm install -g serve
serve -s build
# Visit http://localhost:3000 to test production build
```

### Backend Production

```bash
cd backend
npm ci --only=production  # Lock dependencies
NODE_ENV=production npm start
```

---

## 🌐 Deployment Options

### Option 1️⃣: **Vercel (Frontend) + Render (Backend)**

#### Frontend to Vercel

1. **Connect GitHub**
   - Go to https://vercel.com/new
   - Select your repository
   - Click "Import"

2. **Configure Environment**
   - Add environment variables:

   ```
   REACT_APP_API_URL=https://your-api.render.com/api
   REACT_APP_ENV=production
   ```

   - Click "Deploy"

3. **Custom Domain**
   - Go to Settings → Domains
   - Add your custom domain
   - Follow DNS setup

#### Backend to Render

1. **Create New Web Service**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Select the `backend` directory

2. **Configure**

   ```
   Name: smart-interview-api
   Environment: Node
   Build Command: npm ci
   Start Command: npm start
   ```

3. **Add Environment Variables**
   - Go to "Environment"
   - Add all from `.env`:

   ```
   PORT=5000
   NODE_ENV=production
   MONGO_URI=[your_production_mongo]
   JWT_SECRET=[strong_random_key]
   GROQ_API_KEY=[your_key]
   PISTON_API_URL=https://emkc.org/api/v2/piston
   FRONTEND_URL=https://yourdomain.com
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete
   - You'll get a URL like: `https://smart-interview-api.render.com`

5. **Update Frontend**
   - Go to Vercel Settings → Environment Variables
   - Update `REACT_APP_API_URL` to your Render URL
   - Redeploy

---

### Option 2️⃣: **Railway (Full Stack)**

1. **Login to Railway**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "Create New Project"
   - Select "Deploy from GitHub"
   - Select your repository

3. **Configure Services**

   **For Backend:**

   ```bash
   # Add railway.json in backend/
   {
     "build": {
       "builder": "nixpacks",
       "buildCommand": "npm install"
     },
     "deploy": {
       "startCommand": "npm start"
     }
   }
   ```

   **Environment Variables:**
   - Same as Render above

4. **For Frontend:**
   ```bash
   # In frontend/ directory
   npm run build
   # Deploy to Railway's static hosting
   ```

---

### Option 3️⃣: **Docker Deployment (AWS/DigitalOcean)**

**Step 1: Create docker-compose.yml**

```yaml
version: "3.8"

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
      - GROQ_API_KEY=${GROQ_API_KEY}
    depends_on:
      - mongodb
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    environment:
      - REACT_APP_API_URL=http://localhost:5000/api
    restart: unless-stopped

  mongodb:
    image: mongo:6
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USER}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
    restart: unless-stopped

volumes:
  mongodb_data:
```

**Step 2: Deploy to DigitalOcean App Platform**

1. Push code to GitHub
2. Go to DigitalOcean App Platform
3. Create new app from GitHub repository
4. Add environment variables
5. Deploy

---

## 🔍 Post-Deployment Verification

```bash
# Test Backend Health
curl https://your-api.render.com/

# Test Frontend
curl https://yourdomain.com

# Check API connectivity
curl https://your-api.render.com/api/code/problems

# Check Database
# Login to MongoDB Atlas dashboard
# Verify data is accessible
```

---

## 📊 Monitoring & Logging

### Backend Logging (Winston)

```javascript
// backend/config/logger.js
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

module.exports = logger;
```

### Error Tracking (Optional: Sentry)

```bash
npm install @sentry/node
```

```javascript
// backend/server.js
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
// ... routes ...
app.use(Sentry.Handlers.errorHandler());
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install backend dependencies
        run: cd backend && npm ci

      - name: Lint backend
        run: cd backend && npm run lint || true

      - name: Install frontend dependencies
        run: cd frontend && npm ci

      - name: Build frontend
        run: cd frontend && npm run build

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl -X POST https://api.render.com/deploy/srv-${{ secrets.RENDER_SERVICE_ID }}?key=${{ secrets.RENDER_API_KEY }}

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: BeyondTheClouds/vercel-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 🆘 Troubleshooting

### Issue: "Connection refused" on backend

**Solution:** Check if backend is running and FRONTEND_URL env var is correct

### Issue: CORS errors in frontend

**Solution:** Update CORS in backend to match frontend domain

```javascript
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
```

### Issue: MongoDB connection timeout

**Solution:** Check MongoDB URI and network access in Atlas

### Issue: Code execution timing out

**Solution:** Piston API might be slow. Check rate limiting.

### Issue: "Insufficient quota" on Groq API

**Solution:** Check API key and usage limits at console.groq.com

---

## 📈 Performance Optimization

### Frontend

- Enable gzip compression ✓ (Vercel default)
- Minify bundles ✓ (build process)
- Code splitting (implement lazy routes)
- Image optimization (use next/image or lazy load)

### Backend

- Enable compression middleware

```javascript
const compression = require("compression");
app.use(compression());
```

- Cache responses

```javascript
app.use((req, res, next) => {
  res.set("Cache-Control", "public, max-age=3600");
  next();
});
```

- Add database indexes

```javascript
submissionSchema.index({ user: 1, createdAt: -1 });
problemSchema.index({ difficulty: 1, topic: 1 });
```

---

## 🔐 SSL/TLS Certificates

- **Vercel:** Automatic SSL ✓
- **Render:** Automatic SSL ✓
- **Custom Domain:** Use Let's Encrypt (free)

---

## 💰 Cost Estimation

| Service                | Free Tier       | Estimated Cost    |
| ---------------------- | --------------- | ----------------- |
| **Vercel**             | 100GB bandwidth | $20-50/month      |
| **Render**             | 750 hours/month | $7-25/month       |
| **MongoDB Atlas**      | 512MB storage   | Free (up to 3GB)  |
| **Groq API**           | 8K RPM          | Free              |
| **Total (Production)** | -               | **~$15-30/month** |

---

## ✨ Launch Checklist

**2 Hours Before Launch:**

- [ ] All fixes applied
- [ ] Environment variables set
- [ ] Database backed up
- [ ] Team notified

**1 Hour Before:**

- [ ] Final testing on production URLs
- [ ] Check monitoring dashboards
- [ ] Have support team ready

**Go Live:**

- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Update DNS records
- [ ] Monitor for errors

**Post-Launch:**

- [ ] Monitor error rates (< 1%)
- [ ] Check user feedback
- [ ] Monitor performance metrics
- [ ] Be ready to rollback

---

## 📞 Support During Launch

- Monitor: https://dashboard.render.com/deploys
- Logs: Backend → "Logs" tab
- Frontend errors: Browser console
- Database: MongoDB Atlas dashboard

---

**Status:** Ready to Deploy  
**Estimated Deployment Time:** 30 minutes  
**Estimated Time to Production:** 2-4 hours
