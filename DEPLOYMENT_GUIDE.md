# Deployment Guide: Vercel + Render

## Overview
- **Frontend**: Vercel (React + Vite)
- **Backend**: Render (Node.js + Express)
- **Database**: MongoDB Atlas (Cloud)

---

## Phase 1: Prepare MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up and create a free cluster
3. Create a database user with credentials
4. Whitelist IP: Allow all IPs (0.0.0.0/0) or specific Render IPs

### 1.2 Get Connection String
- Copy the connection string from MongoDB Atlas
- Format: `mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority`
- Save this for backend environment variables

---

## Phase 2: Deploy Backend on Render

### 2.1 Prepare Backend Repository
```bash
# Ensure these files exist in server/ root:
- package.json (with "start": "node server.js")
- server.js (entry point)
- .env (local, won't be committed)
```

### 2.2 Add to Git
```bash
cd substation-dashboard
git add .
git commit -m "Prepare for deployment"
git push origin main  # or your branch
```

### 2.3 Deploy on Render
1. Go to https://render.com
2. Sign up with GitHub
3. Create new **Web Service**
4. Connect GitHub repository (research-project-ii)
5. Configure:
   - **Name**: `substation-dashboard-api`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: `.` (root of repo)

### 2.4 Set Environment Variables on Render
In Render dashboard → Environment:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/substation-dashboard?retryWrites=true&w=majority
NODE_ENV=production
PORT=5000
```

### 2.5 Configure CORS on Backend
Update `server/server.js`:
```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',           // Local dev
  'https://your-vercel-app.vercel.app'  // Your Vercel domain (update after deployment)
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

### 2.6 Deploy
- Click "Deploy" on Render
- Wait for build to complete (~2-3 minutes)
- Note your backend URL: `https://substation-dashboard-api.onrender.com`

---

## Phase 3: Deploy Frontend on Vercel

### 3.1 Update API Endpoint
Update `client/vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://substation-dashboard-api.onrender.com',  // Your Render backend URL
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
});
```

Also update any hardcoded API calls in your components to use relative paths or environment variables.

### 3.2 Create `.env.production`
```
VITE_API_BASE_URL=https://substation-dashboard-api.onrender.com
```

### 3.3 Update API Calls
In components using Axios:
```javascript
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

axios.get(`${API_BASE}/api/shiftlogs`)
```

### 3.4 Deploy on Vercel
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import Project
4. Select repository: `research-project-ii`
5. Configure:
   - **Framework**: `Vite`
   - **Root Directory**: `substation-dashboard/client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.5 Set Environment Variables on Vercel
In Vercel dashboard → Settings → Environment Variables:
```
VITE_API_BASE_URL=https://substation-dashboard-api.onrender.com
```

### 3.6 Deploy
- Click "Deploy"
- Wait for build (~1-2 minutes)
- Your app will be live at: `https://your-project.vercel.app`

---

## Phase 4: Post-Deployment Configuration

### 4.1 Update Backend CORS
Now that you have your Vercel URL, update `server/server.js`:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-project.vercel.app'  // Add your actual Vercel domain
];
```
Push this change to update Render.

### 4.2 Test API Connection
From Vercel frontend, make a test API call:
```javascript
fetch('https://substation-dashboard-api.onrender.com/api/equipment')
  .then(res => res.json())
  .then(data => console.log(data))
```

### 4.3 Seed Production Database
Run seeding on Render backend:
```bash
# Via Render Shell or SSH
cd server && node seed/seedDatabase.js
```

Alternatively, create an API endpoint:
```javascript
// server/routes/admin.js
app.post('/api/admin/seed', async (req, res) => {
  // Run seed script
  res.json({ message: 'Database seeded' });
});
```

---

## Phase 5: Database Backups & Monitoring

### 5.1 MongoDB Atlas Monitoring
- Check Atlas dashboard for connection logs
- Monitor performance metrics
- Set up alerts for high connections/errors

### 5.2 Render Logs
- View logs in Render dashboard
- Check for errors/warnings
- Monitor memory/CPU usage

### 5.3 Vercel Analytics
- Check build logs for any warnings
- Monitor frontend performance
- Set up error tracking (optional: Sentry)

---

## Useful Commands

### Local Testing Before Deployment
```bash
# Terminal 1: Backend
cd server
npm install
npm start

# Terminal 2: Frontend  
cd client
npm install
npm run dev
```

### Deployment Checklist
- [ ] MongoDB Atlas cluster created and user credentials set
- [ ] Backend pushed to GitHub
- [ ] Render service created and deployed
- [ ] Backend environment variables set on Render
- [ ] Frontend API endpoint updated to Render URL
- [ ] Frontend environment variables set on Vercel
- [ ] Vercel deployment successful
- [ ] CORS origins updated to include Vercel domain
- [ ] API endpoints tested from production frontend
- [ ] Database seeded in production
- [ ] All features tested end-to-end

---

## Troubleshooting

### CORS Errors
**Problem**: Frontend can't reach backend
**Solution**: Check CORS origins in `server.js` include Vercel domain

### 503 Service Unavailable on Render
**Problem**: Render app is asleep (free tier)
**Solution**: Upgrade to paid plan or add uptime monitor to keep app awake

### Database Connection Fails
**Problem**: MongoDB connection times out
**Solution**: 
1. Check Render environment variables
2. Verify IP whitelist on MongoDB Atlas
3. Check connection string format

### Images/Assets Not Loading
**Problem**: SVG or PNG not found
**Solution**: Ensure assets are in `client/public/` and Vite is serving them correctly

---

## Cost Estimates (Approximate)

| Service | Free Tier | Cost |
|---------|-----------|------|
| **Vercel** | 100GB bandwidth/month | $20/month (pro) |
| **Render** | 750 hours/month (free) | $7+/month (paid) |
| **MongoDB Atlas** | 512MB storage (free) | $57+/month (M10 cluster) |

**Recommendation**: Start with free tiers, upgrade as needed.

---

## Next Steps

1. **Immediately**: Set up MongoDB Atlas cluster
2. **Then**: Push backend to GitHub & deploy to Render
3. **Then**: Update frontend API endpoints & deploy to Vercel
4. **Finally**: Test all features and enable CORS
