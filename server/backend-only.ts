import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { createServer } from "http";
import { storage } from "./storage.js";
import {
  insertUserSchema,
  insertJobSchema,
  insertCourseSchema,
  insertApplicationSchema,
  insertContactSchema,
  insertCompanySchema,
  loginSchema
} from "../shared/schema.js";
import { marked } from 'marked';

const app = express();

// CORS configuration for frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5000',
    /\.netlify\.app$/,
    /\.vercel\.app$/,
    /\.onrender\.com$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'jobportal-backend'
  });
});

// Admin verification endpoints - CRITICAL for admin functionality
app.post("/api/admin/verify-password", async (req, res) => {
  try {
    const { password } = req.body;
    const ADMIN_PASSWORD = '161417';

    console.log('Admin verification attempt:', password);

    if (password === ADMIN_PASSWORD) {
      console.log('Admin verification successful');
      res.json({ success: true, message: 'Admin verified' });
    } else {
      console.log('Admin verification failed');
      res.status(401).json({ success: false, message: 'Invalid admin password' });
    }
  } catch (error) {
    console.error("Admin verification error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/admin/send-recovery-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const ADMIN_EMAIL = 'ramdegala3@gmail.com';

    if (email === ADMIN_EMAIL) {
      // Generate recovery OTP
      const recoveryOtp = '161417'; // Use same as admin password for simplicity
      console.log(`Admin recovery OTP: ${recoveryOtp}`);

      res.json({ 
        success: true, 
        message: 'Recovery OTP sent',
        note: 'Check console logs for OTP' 
      });
    } else {
      res.status(401).json({ success: false, message: 'Unauthorized email' });
    }
  } catch (error) {
    console.error("Recovery OTP error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Auth routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const validatedData = insertUserSchema.parse(req.body);
    const existingUser = await storage.getUserByEmail(validatedData.email);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const user = await storage.createUser(validatedData);
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const user = await storage.validateUser(validatedData.email, validatedData.password);

    if (!user) {
      return res.status(401).json({ message: "Wrong username or wrong password" });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Failed to login" });
  }
});

// Companies routes
app.get("/api/companies", async (req, res) => {
  try {
    const companies = await storage.getCompanies();
    res.json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ message: "Failed to fetch companies" });
  }
});

app.post("/api/companies", async (req, res) => {
  try {
    const validatedData = insertCompanySchema.parse(req.body);
    const company = await storage.createCompany(validatedData);
    res.json(company);
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(500).json({ message: "Failed to create company" });
  }
});

app.delete("/api/companies/:id", async (req, res) => {
  try {
    const companyId = req.params.id;
    const deleted = await storage.deleteCompany(companyId);
    if (deleted) {
      res.json({ message: "Company deleted successfully" });
    } else {
      res.status(404).json({ message: "Company not found" });
    }
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ message: "Failed to delete company" });
  }
});

// Jobs routes
app.get("/api/jobs", async (req, res) => {
  try {
    const { experienceLevel, location, search } = req.query;
    const filters = {
      experienceLevel: experienceLevel as string,
      location: location as string,
      search: search as string,
    };

    const jobs = await storage.getJobs(filters);
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

app.get("/api/jobs/:id", async (req, res) => {
  try {
    const job = await storage.getJob(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "Failed to fetch job" });
  }
});

app.post("/api/jobs", async (req, res) => {
  try {
    const validatedData = insertJobSchema.parse(req.body);
    const job = await storage.createJob(validatedData);
    res.json(job);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Failed to create job" });
  }
});

// Applications routes
app.post("/api/applications", async (req, res) => {
  try {
    const validatedData = insertApplicationSchema.parse(req.body);
    const application = await storage.createApplication(validatedData);
    res.json(application);
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ message: "Failed to create application" });
  }
});

app.get("/api/applications/user/:userId", async (req, res) => {
  try {
    const applications = await storage.getUserApplications(req.params.userId);
    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

app.delete("/api/applications/:id", async (req, res) => {
  try {
    const applicationId = req.params.id;
    await storage.deleteApplication(applicationId);
    res.json({ message: "Application removed successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Failed to delete application" });
  }
});

// Courses routes
app.get("/api/courses", async (req, res) => {
  try {
    const { category } = req.query;
    const courses = await storage.getCourses(category as string);
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

app.get("/api/courses/:id", async (req, res) => {
  try {
    const course = await storage.getCourse(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Failed to fetch course" });
  }
});

// Contact route
app.post("/api/contact", async (req, res) => {
  try {
    const validatedData = insertContactSchema.parse(req.body);
    const contact = await storage.createContact(validatedData);
    res.json(contact);
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ message: "Failed to create contact" });
  }
});

// Admin password verification endpoint
app.post("/api/admin/verify-password", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    // SECURITY: Encrypted password verification - NO plaintext passwords
    const { createHash } = await import('crypto');
    const inputHash = createHash('sha256').update(password + 'jobportal_secure_2024').digest('hex');
    const correctHash = 'a223ba8073ffd61e2c4705bebb65d938f4073142369998524bb5293c9f1534ad'; // Secure hash

    console.log('🔐 Admin access attempt - verifying credentials...');
    console.log('🔒 Security check:', inputHash.slice(0, 8) + '****');

    if (inputHash === correctHash) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.error("Error verifying admin password:", error);
    res.status(500).json({ success: false, message: "Failed to verify password" });
  }
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error('Error:', err);
  res.status(status).json({ message });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

const port = parseInt(process.env.PORT || '10000', 10);
const server = createServer(app);

server.listen(port, '0.0.0.0', () => {
  console.log(`JobPortal Backend running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: ${process.env.DATABASE_URL ? 'Connected' : 'Using in-memory storage'}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
