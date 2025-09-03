// Simple Node.js production server for Render deployment
// No build step required - runs directly with node
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import bcryptjs from 'bcryptjs';
import { nanoid } from 'nanoid';
import { marked } from 'marked';

const app = express();

// CORS configuration for frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://your-vercel-app.vercel.app'
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

// In-memory storage for demo
const storage = {
  users: new Map(),
  companies: new Map(),
  jobs: new Map(),
  courses: new Map(),
  applications: new Map(),
  contacts: new Map(),
  passwordResetOtps: new Map()
};

// Initialize with sample data
const initializeData = () => {
  // Sample companies
  const companies = [
    {
      id: "accenture-id",
      name: "Accenture",
      description: "A leading global professional services company",
      website: "https://accenture.com",
      linkedinUrl: "https://linkedin.com/company/accenture",
      logo: "https://logoeps.com/wp-content/uploads/2014/05/36208-accenture-vector-logo.png",
      location: "Bengaluru, India"
    },
    {
      id: "tcs-id", 
      name: "Tata Consultancy Services",
      description: "An Indian multinational IT services and consulting company",
      website: "https://tcs.com",
      linkedinUrl: "https://linkedin.com/company/tcs",
      logo: "/images/tcs-logo.png",
      location: "Mumbai, India"
    }
  ];
  
  companies.forEach(company => storage.companies.set(company.id, company));

  // Sample jobs
  const jobs = [
    {
      id: "job-1",
      companyId: "accenture-id",
      title: "Software Developer - Fresh Graduate",
      description: "Join our team as a Software Developer. Work on exciting projects with cutting-edge technologies.",
      requirements: "Programming skills, Problem-solving abilities, Team collaboration",
      qualifications: "Bachelor's degree in Computer Science or related field",
      skills: "JavaScript, React, Node.js, Python, SQL",
      experienceLevel: "fresher",
      experienceMin: 0,
      experienceMax: 2,
      location: "Bengaluru, India",
      jobType: "full-time",
      salary: "₹4-6 LPA",
      closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      batchEligible: "2024",
      isActive: true
    }
  ];
  
  jobs.forEach(job => storage.jobs.set(job.id, job));

  // Sample courses
  const courses = [
    {
      id: "course-1",
      title: "Full Stack Web Development",
      description: "Learn to build complete web applications from scratch",
      instructor: "John Doe",
      duration: "12 weeks",
      level: "beginner",
      category: "web-development",
      imageUrl: "/images/react-course.jpg",
      price: "Free"
    }
  ];
  
  courses.forEach(course => storage.courses.set(course.id, course));
};

initializeData();

// Auth routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, fullName, phone } = req.body;
    
    if (storage.users.has(email)) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);
    const user = {
      id: nanoid(),
      email,
      password: hashedPassword,
      fullName,
      phone,
      createdAt: new Date()
    };
    
    storage.users.set(email, user);
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = storage.users.get(email);

    if (!user) {
      return res.status(401).json({ message: "Wrong username or wrong password" });
    }

    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Wrong username or wrong password" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Failed to login" });
  }
});

// Jobs routes
app.get("/api/jobs", (req, res) => {
  try {
    const jobs = Array.from(storage.jobs.values()).map(job => {
      const company = storage.companies.get(job.companyId);
      return { ...job, company };
    });
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
});

app.get("/api/jobs/:id", (req, res) => {
  try {
    const job = storage.jobs.get(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    const company = storage.companies.get(job.companyId);
    res.json({ ...job, company });
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "Failed to fetch job" });
  }
});

// Companies routes
app.get("/api/companies", (req, res) => {
  try {
    const companies = Array.from(storage.companies.values());
    res.json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    res.status(500).json({ message: "Failed to fetch companies" });
  }
});

// Courses routes
app.get("/api/courses", (req, res) => {
  try {
    const courses = Array.from(storage.courses.values());
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

app.get("/api/courses/:id", (req, res) => {
  try {
    const course = storage.courses.get(req.params.id);
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
app.post("/api/contact", (req, res) => {
  try {
    const contact = { 
      id: nanoid(), 
      ...req.body,
      submittedAt: new Date()
    };
    storage.contacts.set(contact.id, contact);
    res.json(contact);
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ message: "Failed to create contact" });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error('Error:', err);
  res.status(status).json({ message });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// FIXED: Use proper port for Render
const port = parseInt(process.env.PORT || '5000', 10);
const server = createServer(app);

server.listen(port, '0.0.0.0', () => {
  console.log(`JobPortal Backend running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: Using in-memory storage`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
