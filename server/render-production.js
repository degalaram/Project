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
  otps: new Map()
};

// Initialize sample data
const initData = () => {
  // Sample companies
  const companies = [
    { id: 'accenture', name: 'Accenture', description: 'Global professional services company', website: 'https://accenture.com', logo: '/images/accenture-logo.png' },
    { id: 'tcs', name: 'Tata Consultancy Services', description: 'Leading IT services company', website: 'https://tcs.com', logo: '/images/tcs-logo.png' },
    { id: 'infosys', name: 'Infosys', description: 'Global leader in consulting and technology services', website: 'https://infosys.com', logo: '/images/infosys-logo.png' }
  ];
  
  companies.forEach(company => storage.companies.set(company.id, company));
  
  // Sample jobs
  const jobs = [
    {
      id: nanoid(),
      title: 'Frontend Developer',
      description: 'Build modern web applications using React and TypeScript',
      requirements: 'React, TypeScript, HTML, CSS, JavaScript',
      qualifications: 'Bachelor\'s degree in Computer Science',
      skills: 'React, TypeScript, JavaScript, HTML, CSS',
      experienceLevel: 'fresher',
      experienceMin: 0,
      experienceMax: 2,
      location: 'Bengaluru, India',
      jobType: 'full-time',
      salary: '₹4-6 LPA',
      closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      batchEligible: '2024',
      isActive: true,
      companyId: 'accenture'
    },
    {
      id: nanoid(),
      title: 'Full Stack Developer',
      description: 'Work on both frontend and backend technologies',
      requirements: 'MERN Stack, Node.js, React, MongoDB',
      qualifications: 'Bachelor\'s degree in IT/CS',
      skills: 'React, Node.js, MongoDB, Express.js',
      experienceLevel: 'entry',
      experienceMin: 1,
      experienceMax: 3,
      location: 'Mumbai, India',
      jobType: 'full-time',
      salary: '₹6-8 LPA',
      closingDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      batchEligible: '2023,2024',
      isActive: true,
      companyId: 'tcs'
    }
  ];
  
  jobs.forEach(job => storage.jobs.set(job.id, job));
  
  // Sample courses
  const courses = [
    {
      id: nanoid(),
      title: 'Complete Web Development',
      description: 'Learn HTML, CSS, JavaScript and React',
      instructor: 'John Doe',
      duration: '12 weeks',
      category: 'web-development',
      price: 4999,
      image: '/images/html-course.jpg',
      isActive: true
    },
    {
      id: nanoid(),
      title: 'Python Programming',
      description: 'Master Python from basics to advanced',
      instructor: 'Jane Smith',
      duration: '10 weeks',
      category: 'programming',
      price: 5999,
      image: '/images/python-course.jpg',
      isActive: true
    }
  ];
  
  courses.forEach(course => storage.courses.set(course.id, course));
};

initData();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'jobportal-backend'
  });
});

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

    if (!user || !await bcryptjs.compare(password, user.password)) {
      return res.status(401).json({ message: "Wrong username or wrong password" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Failed to login" });
  }
});

// Companies routes
app.get("/api/companies", (req, res) => {
  const companies = Array.from(storage.companies.values());
  res.json(companies);
});

app.post("/api/companies", (req, res) => {
  try {
    const company = { id: nanoid(), ...req.body };
    storage.companies.set(company.id, company);
    res.json(company);
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(500).json({ message: "Failed to create company" });
  }
});

// Jobs routes
app.get("/api/jobs", (req, res) => {
  try {
    const { experienceLevel, location, search } = req.query;
    let jobs = Array.from(storage.jobs.values());
    
    if (experienceLevel) {
      jobs = jobs.filter(job => job.experienceLevel === experienceLevel);
    }
    
    if (location) {
      jobs = jobs.filter(job => job.location.toLowerCase().includes(location.toLowerCase()));
    }
    
    if (search) {
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
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
    res.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "Failed to fetch job" });
  }
});

app.post("/api/jobs", (req, res) => {
  try {
    const job = { 
      id: nanoid(), 
      ...req.body,
      closingDate: new Date(req.body.closingDate),
      createdAt: new Date()
    };
    storage.jobs.set(job.id, job);
    res.json(job);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Failed to create job" });
  }
});

// Applications routes
app.post("/api/applications", (req, res) => {
  try {
    const application = { 
      id: nanoid(), 
      ...req.body,
      appliedAt: new Date(),
      status: 'pending'
    };
    storage.applications.set(application.id, application);
    res.json(application);
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ message: "Failed to create application" });
  }
});

app.get("/api/applications/user/:userId", (req, res) => {
  try {
    const applications = Array.from(storage.applications.values())
      .filter(app => app.userId === req.params.userId);
    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

// Courses routes
app.get("/api/courses", (req, res) => {
  try {
    const { category } = req.query;
    let courses = Array.from(storage.courses.values());
    
    if (category) {
      courses = courses.filter(course => course.category === category);
    }
    
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

const port = parseInt(process.env.PORT || '10000', 10);
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
