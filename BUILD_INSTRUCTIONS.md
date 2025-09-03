# Production Deployment Instructions

## Step 1: Replace package.json for production
```bash
cp package.production.json package.json
```

## Step 2: Install only production dependencies
```bash
npm install
```

## Step 3: Build the application
```bash
npm run build
```

## Step 4: Set environment variables in Render
```env
NODE_ENV=production
DATABASE_URL=your_neon_database_url_here
FRONTEND_URL=https://your-vercel-app.vercel.app
```

## Step 5: Deploy to Render
- Build Command: `cp package.production.json package.json && npm install && npm run build`
- Start Command: `npm start`

## What this setup does:
- Uses ONLY backend dependencies (38.2kb bundle)
- Removes all React/Vite/frontend dependencies
- Creates a single optimized server file
- Includes proper CORS for Vercel frontend
- Handles all API routes and database operations
- Memory efficient for Render free tier

## Environment Variables Required:
- `DATABASE_URL`: Your Neon/PostgreSQL connection string
- `FRONTEND_URL`: Your Vercel frontend URL (for CORS)
- `NODE_ENV`: Set to "production"

## Testing locally:
```bash
# Test the production build
cp package.production.json package.json
npm install
npm run build
npm start
```

Server will run on port 10000 (or PORT env var)