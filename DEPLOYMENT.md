# JobPortal Backend Deployment Guide

## Render Deployment Steps

### 1. Database Setup
First, set up a PostgreSQL database (recommended: Neon Database):
- Go to [Neon Console](https://console.neon.tech/)
- Create a new project
- Copy the connection string

### 2. Deploy to Render

#### Option A: Using Render Dashboard
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `jobportal-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for better performance)

#### Option B: Using render.yaml (Infrastructure as Code)
1. The `render.yaml` file is already configured in this repository
2. Push to GitHub and Render will auto-deploy

### 3. Environment Variables
Set these in Render Dashboard → Service → Environment:

```env
NODE_ENV=production
DATABASE_URL=your_neon_database_connection_string
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### 4. Database Migration
After deployment, run the database migration:
```bash
npm run db:push
```

## Frontend Configuration (Vercel)

Update your frontend API base URL to point to your Render backend:
```javascript
const API_BASE_URL = 'https://your-render-app.onrender.com'
```

## Testing the Deployment

1. Check if backend is running: `https://your-render-app.onrender.com/api/jobs`
2. Verify CORS is working by testing from your frontend
3. Check database connectivity by creating a test user

## Common Issues & Solutions

### Build Errors
- Ensure all dependencies are in `dependencies`, not `devDependencies`
- Check that TypeScript compiles without errors: `npm run check`

### Database Connection Issues  
- Verify `DATABASE_URL` is correctly set in Render environment
- Ensure database is accessible from external connections

### CORS Issues
- Update `FRONTEND_URL` environment variable with your exact Vercel URL
- Check that the CORS origin matches your frontend domain exactly

### Memory Issues (Free Plan)
- Free Render services have limited memory
- Consider upgrading to a paid plan for better performance