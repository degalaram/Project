
import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from 'path';

const app = express();

// Trust proxy for production deployments
app.set('trust proxy', 1);

// Enhanced CORS configuration for production
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5000',
      process.env.FRONTEND_URL,
      /\.netlify\.app$/,
      /\.vercel\.app$/,
      /\.onrender\.com$/,
      /localhost:\d+$/,
      /127\.0\.0\.1:\d+$/,
      /\.replit\.dev$/,
      /\.repl\.co$/,
      /\.replit\.app$/
    ].filter(Boolean);

    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      }
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      // In development, allow all origins temporarily
      if (process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(null, false);
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Health check endpoint (must be before other routes)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    uptime: process.uptime()
  });
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    console.error('Global error handler:', err);
    res.status(status).json({ message });
  });

  // Setup based on environment
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // Production static file serving
    const clientDistPath = path.join(__dirname, '../client/dist');
    
    // Serve static files with proper caching
    app.use(express.static(clientDistPath, {
      maxAge: '1d',
      etag: true,
      lastModified: true,
      setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        }
      }
    }));

    // Catch-all handler for SPA routing
    app.get('*', (req, res, next) => {
      // Skip API routes, health checks, and static assets
      if (req.path.startsWith('/api') || 
          req.path.startsWith('/health') ||
          req.path.startsWith('/assets') || 
          req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
        return next();
      }
      
      // Serve index.html for all other routes
      const indexPath = path.join(clientDistPath, 'index.html');
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error('Error serving index.html:', err);
          res.status(500).send('Internal Server Error');
        }
      });
    });
  }

  const port = parseInt(process.env.PORT || '5000', 10);

  console.log('🔧 Environment:', process.env.NODE_ENV);
  console.log('🌐 CORS origins:', process.env.FRONTEND_URL || 'localhost origins');

  if (process.env.DATABASE_URL) {
    console.log('✅ Database URL configured');
  } else {
    console.log('❌ DATABASE_URL not found');
  }

  if (process.env.NODE_ENV === 'production') {
    console.log('🚀 Production mode enabled');
    console.log('📁 Static files path:', path.join(__dirname, '../client/dist'));
  } else {
    console.log('🛠️ Development mode enabled');
  }

  server.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`🔗 Server accessible at http://0.0.0.0:${port}`);
  });
})().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
