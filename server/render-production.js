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
    'http://localhost:5000',
    /\.netlify\.app$/,
    /\.vercel\.app$/,
    /\.onrender\.com$/,
    /\.pages\.dev$/,
    /\.workers\.dev$/,
    /\.cloudflare\.com$/
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
  // Sample companies (complete list from MemStorage)
  const companies = [
    {
      id: "accenture-id",
      name: "Accenture",
      description: "A leading global professional services company",
      website: "https://accenture.com",
      linkedinUrl: "https://linkedin.com/company/accenture",
      logo: "https://logoeps.com/wp-content/uploads/2014/05/36208-accenture-vector-logo.png",
      location: "Bengaluru, India",
      createdAt: new Date(),
    },
    {
      id: "tcs-id",
      name: "Tata Consultancy Services",
      description: "An Indian multinational IT services and consulting company",
      website: "https://tcs.com",
      linkedinUrl: "https://linkedin.com/company/tcs",
      logo: "/images/tcs-logo.png",
      location: "Mumbai, India",
      createdAt: new Date(),
    },
    {
      id: "infosys-id",
      name: "Infosys",
      description: "A global leader in next-generation digital services and consulting",
      website: "https://infosys.com",
      linkedinUrl: "https://linkedin.com/company/infosys",
      logo: "/images/infosys-logo.png",
      location: "Bengaluru, India",
      createdAt: new Date(),
    },
    {
      id: "hcl-id",
      name: "HCL Technologies",
      description: "An Indian multinational IT services and consulting company",
      website: "https://hcltech.com",
      linkedinUrl: "https://linkedin.com/company/hcl-technologies",
      logo: "https://logoeps.com/wp-content/uploads/2013/03/hcl-vector-logo.png",
      location: "Noida, India",
      createdAt: new Date(),
    },
    {
      id: "wipro-id",
      name: "Wipro",
      description: "A leading global information technology, consulting and business process services company",
      website: "https://wipro.com",
      linkedinUrl: "https://linkedin.com/company/wipro",
      logo: "https://logoeps.com/wp-content/uploads/2013/03/wipro-vector-logo.png",
      location: "Bengaluru, India",
      createdAt: new Date(),
    },
    {
      id: "cognizant-id",
      name: "Cognizant",
      description: "An American multinational information technology services and consulting company",
      website: "https://cognizant.com",
      linkedinUrl: "https://linkedin.com/company/cognizant",
      logo: "https://logoeps.com/wp-content/uploads/2013/03/cognizant-vector-logo.png",
      location: "Chennai, India",
      createdAt: new Date(),
    },
    {
      id: "adp-id",
      name: "ADP",
      description: "Automatic Data Processing - A provider of cloud-based human capital management solutions",
      website: "https://adp.com",
      linkedinUrl: "https://linkedin.com/company/adp",
      logo: "https://logos-world.net/wp-content/uploads/2021/02/ADP-Logo.png",
      location: "Bengaluru, India",
      createdAt: new Date(),
    },
    {
      id: "honeywell-id",
      name: "Honeywell",
      description: "A Fortune 100 technology company that delivers industry-specific solutions",
      website: "https://honeywell.com",
      linkedinUrl: "https://linkedin.com/company/honeywell",
      logo: "https://logos-world.net/wp-content/uploads/2020/09/Honeywell-Logo.png",
      location: "Bengaluru, India",
      createdAt: new Date(),
    }
  ];

  companies.forEach(company => storage.companies.set(company.id, company));

  // Sample jobs (complete list from MemStorage)
  const jobs = [
    {
      id: "job-1",
      companyId: "accenture-id",
      title: "Software Developer - Fresher",
      description: "Join our dynamic team as a Software Developer. Work on cutting-edge projects and grow your career in technology.",
      requirements: "Basic programming knowledge, problem-solving skills, willingness to learn",
      qualifications: "Bachelor's degree in Computer Science, IT, or related field",
      skills: "Java, Python, JavaScript, SQL, Git, Problem-solving",
      experienceLevel: "fresher",
      experienceMin: 0,
      experienceMax: 1,
      location: "Bengaluru, Chennai, Hyderabad",
      jobType: "full-time",
      salary: "₹3.5 - 4.5 LPA",
      applyUrl: "https://accenture.com/careers",
      closingDate: new Date('2025-09-17'),
      batchEligible: "2024",
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: "job-2",
      companyId: "tcs-id",
      title: "Associate Software Engineer",
      description: "Join TCS as an Associate Software Engineer and work on innovative solutions for global clients.",
      requirements: "Programming fundamentals, analytical thinking, good communication skills",
      qualifications: "B.E/B.Tech/M.E/M.Tech/MCA/MSc in relevant field",
      skills: "C, C++, Java, Database concepts, Web technologies, Logical reasoning",
      experienceLevel: "fresher",
      experienceMin: 0,
      experienceMax: 0,
      location: "Pune, Kolkata, Kochi",
      jobType: "full-time",
      salary: "₹3.36 LPA",
      applyUrl: "https://tcs.com/careers",
      closingDate: new Date('2025-09-22'),
      batchEligible: "2024",
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: "job-3",
      companyId: "infosys-id",
      title: "Systems Engineer - Fresher",
      description: "Start your career with Infosys as a Systems Engineer. Work with latest technologies and contribute to digital transformation.",
      requirements: "Strong technical foundation, problem-solving skills, adaptability",
      qualifications: "Engineering graduate from any discipline",
      skills: "Programming concepts, Database fundamentals, Communication skills",
      experienceLevel: "fresher",
      experienceMin: 0,
      experienceMax: 1,
      location: "Bengaluru, Mysore, Pune",
      jobType: "full-time",
      salary: "₹3.6 - 4.2 LPA",
      applyUrl: "https://infosys.com/careers",
      closingDate: new Date('2025-10-15'),
      batchEligible: "2024",
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: "job-4",
      companyId: "hcl-id",
      title: "Graduate Engineer Trainee",
      description: "Join HCL Technologies as a Graduate Engineer Trainee and build enterprise solutions for Fortune 500 companies.",
      requirements: "Technical aptitude, learning mindset, team collaboration",
      qualifications: "B.Tech/B.E/MCA/M.Tech in Computer Science or related",
      skills: "Java, Python, SQL, Web development, Problem solving",
      experienceLevel: "fresher",
      experienceMin: 0,
      experienceMax: 1,
      location: "Chennai, Noida, Bengaluru",
      jobType: "full-time",
      salary: "₹3.2 - 4.8 LPA",
      applyUrl: "https://hcltech.com/careers",
      closingDate: new Date('2025-08-30'),
      batchEligible: "2024",
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: "job-5",
      companyId: "accenture-id",
      title: "Senior Software Engineer",
      description: "Lead development teams and drive technical excellence in enterprise-level applications.",
      requirements: "Proven experience in software development, leadership skills, microservices architecture",
      qualifications: "Bachelor's/Master's degree with 3+ years of experience.",
      skills: "Java, Spring Boot, Microservices, Cloud, Team Leadership",
      experienceLevel: "experienced",
      experienceMin: 3,
      experienceMax: 6,
      location: "Bengaluru, Gurgaon",
      jobType: "full-time",
      salary: "₹12 - 18 LPA",
      applyUrl: "https://accenture.com/careers/apply",
      closingDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      batchEligible: "",
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: "job-6",
      companyId: "tcs-id",
      title: "Technical Lead - Full Stack",
      description: "Lead full-stack development projects and mentor junior developers.",
      requirements: "Full-stack development expertise, team management, client interaction",
      qualifications: "Engineering degree with 4+ years of experience.",
      skills: "React, Node.js, Python, AWS, Team Management",
      experienceLevel: "experienced",
      experienceMin: 4,
      experienceMax: 8,
      location: "Chennai, Mumbai",
      jobType: "full-time",
      salary: "₹15 - 22 LPA",
      applyUrl: "https://tcs.com/careers",
      closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      batchEligible: "",
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: "job-7",
      companyId: "infosys-id",
      title: "Data Scientist - Experienced",
      description: "Contribute to data-driven decision making and build predictive models.",
      requirements: "Strong analytical skills, experience with ML algorithms, Python/R proficiency",
      qualifications: "Master's/Ph.D. in Data Science, Statistics, or related field with 3+ years of experience.",
      skills: "Machine Learning, Python, R, SQL, Data Visualization, Statistical Modeling",
      experienceLevel: "experienced",
      experienceMin: 3,
      experienceMax: 7,
      location: "Bengaluru, Hyderabad",
      jobType: "full-time",
      salary: "₹14 - 20 LPA",
      applyUrl: "https://infosys.com/careers/data-science",
      closingDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      batchEligible: "",
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: "job-8",
      companyId: "wipro-id",
      title: "Cloud Engineer",
      description: "Design, implement, and manage cloud infrastructure and services.",
      requirements: "Experience with cloud platforms (AWS, Azure, GCP), infrastructure as code",
      qualifications: "Bachelor's degree in Computer Science or related field with 2+ years of experience.",
      skills: "AWS, Azure, GCP, Docker, Kubernetes, Terraform, CI/CD",
      experienceLevel: "experienced",
      experienceMin: 2,
      experienceMax: 5,
      location: "Bengaluru, Pune",
      jobType: "full-time",
      salary: "₹10 - 16 LPA",
      applyUrl: "https://wipro.com/careers/cloud-engineer",
      closingDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      batchEligible: "",
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: "job-9",
      companyId: "cognizant-id",
      title: "Java Developer",
      description: "Develop robust and scalable Java applications for enterprise clients.",
      requirements: "Strong Java programming skills, experience with Spring framework",
      qualifications: "Bachelor's degree in Computer Science or related field with 2+ years of experience.",
      skills: "Java, Spring Boot, Hibernate, RESTful APIs, SQL, Git",
      experienceLevel: "experienced",
      experienceMin: 2,
      experienceMax: 5,
      location: "Chennai, Coimbatore",
      jobType: "full-time",
      salary: "₹9 - 15 LPA",
      applyUrl: "https://cognizant.com/careers/java-developer",
      closingDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
      batchEligible: "",
      isActive: true,
      createdAt: new Date(),
    },
    {
      id: "job-10",
      companyId: "hcl-id",
      title: "DevOps Engineer",
      description: "Implement and manage CI/CD pipelines, automate infrastructure, and ensure system reliability.",
      requirements: "Experience with DevOps tools and practices, scripting languages",
      qualifications: "Bachelor's degree in a relevant field with 3+ years of experience.",
      skills: "AWS, Docker, Kubernetes, Jenkins, Ansible, Python, Shell Scripting",
      experienceLevel: "experienced",
      experienceMin: 3,
      experienceMax: 6,
      location: "Noida, Bengaluru",
      jobType: "full-time",
      salary: "₹11 - 17 LPA",
      applyUrl: "https://hcltech.com/careers/devops-engineer",
      closingDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      batchEligible: "",
      isActive: true,
      createdAt: new Date(),
    }
  ];

  jobs.forEach(job => storage.jobs.set(job.id, job));

  // Sample courses (complete list from MemStorage)
  const courses = [
    {
      id: "html-course",
      title: "Complete HTML & CSS Course",
      description: "Learn HTML and CSS from scratch. Build responsive websites and understand web fundamentals.",
      instructor: "John Doe",
      duration: "6 weeks",
      level: "beginner",
      category: "web-development",
      imageUrl: "/images/html-course.jpg",
      courseUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML",
      price: "Free",
      createdAt: new Date(),
    },
    {
      id: "python-course",
      title: "Python Programming for Beginners",
      description: "Master Python programming from basics to advanced concepts. Perfect for beginners and job seekers.",
      instructor: "Jane Smith",
      duration: "8 weeks",
      level: "beginner",
      category: "programming",
      imageUrl: "/images/python-course.jpg",
      courseUrl: "https://www.python.org/about/gettingstarted/",
      price: "₹2,999",
      createdAt: new Date(),
    },
    {
      id: "javascript-course",
      title: "JavaScript Fundamentals",
      description: "Learn JavaScript programming language and build interactive web applications.",
      instructor: "Mike Johnson",
      duration: "10 weeks",
      level: "intermediate",
      category: "web-development",
      imageUrl: "/images/js-course.jpg",
      courseUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      price: "₹3,999",
      createdAt: new Date(),
    },
    {
      id: "react-course",
      title: "React.js Development",
      description: "Build modern web applications with React.js. Learn components, hooks, and state management.",
      instructor: "Sarah Wilson",
      duration: "12 weeks",
      level: "intermediate",
      category: "web-development",
      imageUrl: "/images/react-course.jpg",
      courseUrl: "https://react.dev/learn",
      price: "₹4,999",
      createdAt: new Date(),
    },
    {
      id: "nodejs-course",
      title: "Node.js Backend Development",
      description: "Master server-side development with Node.js. Build APIs and full-stack applications.",
      instructor: "David Lee",
      duration: "10 weeks",
      level: "intermediate",
      category: "backend",
      imageUrl: "/images/nodejs-course.jpg",
      courseUrl: "https://nodejs.org/en/docs/",
      price: "₹5,499",
      createdAt: new Date(),
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

// Company creation endpoint
app.post("/api/companies", (req, res) => {
  try {
    const company = { 
      id: nanoid(), 
      ...req.body,
      createdAt: new Date()
    };
    storage.companies.set(company.id, company);
    res.json(company);
  } catch (error) {
    console.error("Error creating company:", error);
    res.status(500).json({ message: "Failed to create company" });
  }
});

// Job creation endpoint
app.post("/api/jobs", (req, res) => {
  try {
    const job = { 
      id: nanoid(), 
      ...req.body,
      createdAt: new Date()
    };
    storage.jobs.set(job.id, job);
    res.json(job);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Failed to create job" });
  }
});

// Application creation endpoint
app.post("/api/applications", (req, res) => {
  try {
    const application = { 
      id: nanoid(), 
      ...req.body,
      appliedAt: new Date()
    };
    storage.applications.set(application.id, application);
    res.json(application);
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ message: "Failed to create application" });
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

// Job deletion endpoint (soft delete)
app.delete("/api/jobs/:id", (req, res) => {
  try {
    const jobId = req.params.id;
    // Accept userId from query parameter to avoid issues with DELETE body
    const userId = req.query.userId || req.body?.userId || null;
    const job = storage.jobs.get(jobId);
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Create deleted post entry for the job with user context
    const deletedPost = {
      ...job,
      userId: userId, // Store which user deleted this
      deletedAt: new Date(),
      originalType: 'job'
    };

    deletedPosts.set(jobId, deletedPost);
    storage.jobs.delete(jobId);
    
    res.json({ message: "Job deleted successfully", deletedPost });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Failed to delete job" });
  }
});

// Applications routes
app.get("/api/applications/user/:userId", (req, res) => {
  try {
    const applications = Array.from(storage.applications.values())
      .filter(app => app.userId === req.params.userId)
      .map(app => {
        const job = storage.jobs.get(app.jobId);
        const company = job ? storage.companies.get(job.companyId) : null;
        return { ...app, job: job ? { ...job, company } : null };
      });
    res.json(applications);
  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

// Job URL analysis endpoint
app.post("/api/jobs/analyze-url", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ message: "Invalid URL format" });
    }

    // For now, return a simple response indicating the feature is available
    // In a real implementation, you would scrape the job posting
    res.json({
      success: true,
      message: "URL analysis feature is available but requires additional setup for web scraping",
      suggestedData: {
        title: "Software Engineer",
        company: "Technology Company",
        location: "Remote",
        experienceLevel: "fresher",
        description: "Please fill in the job details manually for now"
      }
    });
  } catch (error) {
    console.error("Error analyzing job URL:", error);
    res.status(500).json({ message: "Failed to analyze job URL" });
  }
});

// Deleted posts storage
const deletedPosts = new Map();

// Soft delete job endpoint
app.post("/api/jobs/:id/soft-delete", (req, res) => {
  try {
    const jobId = req.params.id;
    const job = storage.jobs.get(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Move to deleted posts
    const deletedPost = {
      ...job,
      deletedAt: new Date(),
      originalType: 'job'
    };

    deletedPosts.set(jobId, deletedPost);
    storage.jobs.delete(jobId);

    res.json({ message: "Job moved to deleted posts" });
  } catch (error) {
    console.error("Error soft deleting job:", error);
    res.status(500).json({ message: "Failed to move job to deleted posts" });
  }
});

// Get deleted posts endpoint
app.get("/api/deleted-posts", (req, res) => {
  try {
    const posts = Array.from(deletedPosts.values());
    res.json(posts);
  } catch (error) {
    console.error("Error fetching deleted posts:", error);
    res.status(500).json({ message: "Failed to fetch deleted posts" });
  }
});

// Get user-specific deleted posts endpoint
app.get("/api/deleted-posts/user/:userId", (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = Array.from(deletedPosts.values()).filter(post => post.userId === userId);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching user deleted posts:", error);
    res.status(500).json({ message: "Failed to fetch user deleted posts" });
  }
});

// Restore deleted post endpoint
app.post("/api/deleted-posts/:id/restore", (req, res) => {
  try {
    const postId = req.params.id;
    const deletedPost = deletedPosts.get(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Deleted post not found" });
    }

    // Restore to original storage
    if (deletedPost.originalType === 'job') {
      const { deletedAt, originalType, ...jobData } = deletedPost;
      storage.jobs.set(postId, jobData);
    }

    deletedPosts.delete(postId);
    res.json({ message: "Post restored successfully" });
  } catch (error) {
    console.error("Error restoring post:", error);
    res.status(500).json({ message: "Failed to restore post" });
  }
});

// Permanently delete post endpoint
app.delete("/api/deleted-posts/:id", (req, res) => {
  try {
    const postId = req.params.id;

    if (deletedPosts.has(postId)) {
      deletedPosts.delete(postId);
      res.json({ message: "Post permanently deleted" });
    } else {
      res.status(404).json({ message: "Deleted post not found" });
    }
  } catch (error) {
    console.error("Error permanently deleting post:", error);
    res.status(500).json({ message: "Failed to permanently delete post" });
  }
});

// Company soft delete endpoints
const deletedCompanies = new Map();

// Company soft delete endpoint (move to deleted companies)
app.post('/api/companies/:id/soft-delete', (req, res) => {
  try {
    const companyId = req.params.id;
    const company = storage.companies.get(companyId);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Move to deleted companies
    const deletedCompany = {
      ...company,
      deletedAt: new Date(),
      originalType: 'company'
    };

    deletedCompanies.set(companyId, deletedCompany);
    storage.companies.delete(companyId);

    res.json({ message: "Company moved to deleted companies", deletedCompany });
  } catch (error) {
    console.error("Error soft deleting company:", error);
    res.status(500).json({ message: "Failed to move company to deleted companies" });
  }
});

// Get deleted companies endpoint
app.get("/api/deleted-companies", (req, res) => {
  try {
    const companies = Array.from(deletedCompanies.values());

    // Filter out companies older than 7 days and clean them up
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeDeleted = companies.filter(company => {
      const deletedDate = new Date(company.deletedAt);
      if (deletedDate < sevenDaysAgo) {
        // Automatically remove expired deleted companies
        deletedCompanies.delete(company.id);
        return false;
      }
      return true;
    });

    res.json(activeDeleted);
  } catch (error) {
    console.error("Error fetching deleted companies:", error);
    res.status(500).json({ message: "Failed to fetch deleted companies" });
  }
});

// Restore deleted company endpoint
app.post("/api/deleted-companies/:id/restore", (req, res) => {
  try {
    const companyId = req.params.id;
    const deletedCompany = deletedCompanies.get(companyId);

    if (!deletedCompany) {
      return res.status(404).json({ message: "Deleted company not found" });
    }

    // Restore to original storage
    const { deletedAt, originalType, ...companyData } = deletedCompany;
    storage.companies.set(companyId, companyData);

    deletedCompanies.delete(companyId);
    res.json({ message: "Company restored successfully", company: companyData });
  } catch (error) {
    console.error("Error restoring company:", error);
    res.status(500).json({ message: "Failed to restore company" });
  }
});

// Permanently delete company endpoint
app.delete("/api/deleted-companies/:id", (req, res) => {
  try {
    const companyId = req.params.id;

    if (deletedCompanies.has(companyId)) {
      deletedCompanies.delete(companyId);
      res.json({ message: "Company permanently deleted" });
    } else {
      res.status(404).json({ message: "Deleted company not found" });
    }
  } catch (error) {
    console.error("Error permanently deleting company:", error);
    res.status(500).json({ message: "Failed to permanently delete company" });
  }
});

// Course creation endpoint
app.post("/api/courses", (req, res) => {
  try {
    const course = { 
      id: nanoid(), 
      ...req.body,
      price: "Free", // Ensure all courses are free
      createdAt: new Date()
    };
    storage.courses.set(course.id, course);
    res.json(course);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Failed to create course" });
  }
});

// Course update endpoint
app.put("/api/courses/:id", (req, res) => {
  try {
    const courseId = req.params.id;
    const existingCourse = storage.courses.get(courseId);

    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    const updatedCourse = {
      ...existingCourse,
      ...req.body,
      price: "Free", // Ensure all courses remain free
      id: courseId, // Preserve the ID
      createdAt: existingCourse.createdAt, // Preserve creation date
      updatedAt: new Date()
    };

    storage.courses.set(courseId, updatedCourse);
    res.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Failed to update course" });
  }
});

// Course deletion endpoint
app.delete("/api/courses/:id", (req, res) => {
  try {
    const courseId = req.params.id;
    if (storage.courses.has(courseId)) {
      storage.courses.delete(courseId);
      res.json({ message: "Course deleted successfully" });
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Failed to delete course" });
  }
});

// Serve static files from public directory
app.use(express.static('public', {
  maxAge: '1d',
  etag: false,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// SPA routing fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  // Only serve index.html for non-API routes
  if (!req.path.startsWith('/api')) {
    res.sendFile('index.html', { root: 'public' });
  } else {
    res.status(404).json({ message: 'API endpoint not found' });
  }
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error('Error:', err);
  res.status(status).json({ message });
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
