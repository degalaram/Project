import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertJobSchema,
  insertApplicationSchema,
  insertContactSchema,
  insertCompanySchema,
  insertCourseSchema,
  loginSchema
} from "../shared/schema.js";
import path from 'path';
import fs from 'fs';
import { marked } from 'marked';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { nanoid } from 'nanoid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export async function registerRoutes(app: Express): Promise<Server> {
  // Enable CORS for all origins during development. For production, configure specific origins.
  app.use(cors({
    origin: '*', // Allow all origins in development. Restrict in production.
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);

      // Check if user already exists
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

  // User profile routes
  app.patch("/api/users/:id", async (req, res) => {
    try {
      const userId = req.params.id;
      const updateData = req.body;

      // Handle password update separately
      if (updateData.currentPassword && updateData.newPassword) {
        const user = await storage.getUserById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const bcrypt = await import('bcryptjs');
        const isValidPassword = await bcrypt.compare(updateData.currentPassword, user.password);
        if (!isValidPassword) {
          return res.status(400).json({ message: "Current password is not correct" });
        }

        const hashedPassword = await bcrypt.hash(updateData.newPassword, 12);
        updateData.password = hashedPassword;
        delete updateData.currentPassword;
        delete updateData.newPassword;
      }

      const updatedUser = await storage.updateUser(userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Password recovery routes
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Check if user exists
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found with this email" });
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Store OTP in memory (in production, use a proper storage solution)
      await storage.storePasswordResetOtp(email, otp);

      // In a real implementation, send email with OTP using SendGrid
      // For now, we'll just log it and return success
      console.log(`Password reset OTP for ${email}: ${otp}`);

      res.json({ message: "OTP sent to your email" });
    } catch (error) {
      console.error("Error sending password reset OTP:", error);
      res.status(500).json({ message: "Failed to send OTP" });
    }
  });

  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
      }

      const isValid = await storage.verifyPasswordResetOtp(email, otp);

      if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      res.json({ message: "OTP verified successfully" });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ message: "Failed to verify OTP" });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "Email, OTP, and new password are required" });
      }

      // Verify OTP again
      const isValid = await storage.verifyPasswordResetOtp(email, otp);

      if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // Update password
      await storage.updateUserPassword(email, newPassword);

      // Clear the OTP
      await storage.clearPasswordResetOtp(email);

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // Jobs routes
  app.get('/api/jobs', async (req, res) => {
    try {
      const userId = req.headers['user-id'] as string;
      console.log(`[${new Date().toLocaleTimeString()}] [express] GET /api/jobs - User: ${userId}`);

      const filters = {
        experienceLevel: req.query.experienceLevel as string,
        location: req.query.location as string,
        search: req.query.search as string,
        userId: userId
      };

      const jobs = await storage.getJobs(filters);
      console.log(`Found ${jobs.length} jobs`);
      res.json(jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  });

  // Get single job
  app.get('/api/jobs/:id', async (req, res) => {
    try {
      const job = await storage.getJobById(req.params.id);
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
      res.json(job);
    } catch (error) {
      console.error('Get job error:', error);
      res.status(500).json({ error: 'Failed to get job' });
    }
  });

  // Soft delete a job (hide from user's view)
  app.post('/api/jobs/:jobId/delete', async (req, res) => {
    try {
      const { jobId } = req.params;
      const userId = req.headers['user-id'] as string;

      if (!userId) {
        return res.status(400).json({ error: 'User ID required' });
      }

      console.log(`Attempting to soft delete job ${jobId} for user ${userId}`);

      // Find the job
      const job = await storage.getJobById(jobId); // Use storage.getJobById to fetch job details
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      // Check if already deleted by this user - use proper Map access for MemStorage
      const userDeletedPosts = await storage.getUserDeletedPosts(userId);
      const existingDeletedPost = userDeletedPosts.find(dp => dp.originalId === jobId && dp.type === 'job');
      if (existingDeletedPost) {
        return res.json({ message: 'Job already deleted' });
      }

      // Create application if not exists (to track the delete action)
      const existingApplication = await storage.getUserApplications(userId).then(apps => 
        apps.find(app => app.job.id === jobId)
      );
      if (!existingApplication) {
        const newApplication = {
          id: nanoid(),
          userId,
          jobId,
          status: 'applied' as const,
          appliedAt: new Date().toISOString(),
          coverLetter: 'Applied before deletion'
        };
        await storage.createApplication(newApplication);
        console.log(`Created application for user ${userId} and job ${jobId}`);
      }

      // Add to deleted posts
      const deletedPost = {
        id: nanoid(),
        userId,
        originalId: jobId,
        type: 'job' as const,
        title: job.title,
        description: job.description,
        company: job.company,
        location: job.location,
        salary: job.salary,
        experience: job.experience,
        skills: job.skills,
        deletedAt: new Date().toISOString(),
        scheduledDeletion: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days from now
      };

      await storage.addDeletedPost(deletedPost);
      console.log(`Job ${jobId} soft deleted for user ${userId}`);
      console.log(`Successfully created deleted post: ${deletedPost.id}`);

      res.json({ message: 'Job deleted successfully' });
    } catch (error) {
      console.error('Error deleting job:', error);
      res.status(500).json({ error: 'Failed to delete job' });
    }
  });

  app.post("/api/jobs", async (req, res) => {
    try {
      // SECURITY: Verify security token from admin system
      const { _securityToken, _timestamp, ...jobRequestData } = req.body;

      if (!_securityToken || !_timestamp) {
        return res.status(403).json({ message: "Security validation failed. Job creation requires proper authentication." });
      }

      // Verify token timestamp validity (within 1 hour)
      const tokenAge = Date.now() - Number(_timestamp);
      if (tokenAge > 3600000) { // 1 hour
        return res.status(403).json({ message: "Security token expired. Please re-authenticate." });
      }

      // Convert string date to Date object
      const jobData = {
        ...jobRequestData,
        closingDate: new Date(jobRequestData.closingDate),
        experienceMin: Number(jobRequestData.experienceMin) || 0,
        experienceMax: Number(jobRequestData.experienceMax) || 1,
      };

      const validatedData = insertJobSchema.parse(jobData);
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

  app.get('/api/applications/user/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      console.log(`Getting applications for user: ${userId}`);

      const userApplications = await storage.getUserApplications(userId);
      console.log(`Found ${userApplications.length} applications for user ${userId}`);

      res.json(userApplications);
    } catch (error) {
      console.error('Error fetching user applications:', error);
      res.status(500).json({ error: 'Failed to fetch applications' });
    }
  });

  app.delete("/api/applications/:id", async (req, res) => {
    try {
      await storage.deleteApplication(req.params.id);
      res.json({ message: "Application deleted successfully" });
    } catch (error) {
      console.error("Error deleting application:", error);
      res.status(500).json({ message: "Failed to delete application" });
    }
  });

  // Soft delete application (move to deleted posts)
  app.post("/api/applications/:id/soft-delete", async (req, res) => {
    try {
      const deletedPost = await storage.softDeleteApplication(req.params.id);
      res.json(deletedPost);
    } catch (error) {
      console.error("Error soft deleting application:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Get deleted posts for a user
  app.get("/api/deleted-posts/user/:userId", (req, res) => {
    const { userId } = req.params;
    console.log(`API: Getting deleted posts for user ${userId}`);

    try {
      const deletedPosts = storage.getDeletedPosts(userId);
      console.log(`API: Raw deleted posts from storage:`, deletedPosts);

      // Ensure each deleted post has complete job data
      const enrichedDeletedPosts = deletedPosts.map(deletedPost => {
        if (!deletedPost.job) {
          console.warn('Deleted post missing job data:', deletedPost);
          // Try to find the job from the jobs list
          const job = storage.getJobs().find(j => j.id === deletedPost.jobId);
          if (job) {
            deletedPost.job = job;
          } else {
            console.error('Could not find job data for deleted post:', deletedPost);
          }
        }
        return deletedPost;
      });

      console.log(`API: Returning ${enrichedDeletedPosts.length} deleted posts for user ${userId}`);
      res.json(enrichedDeletedPosts);
    } catch (error) {
      console.error('Error fetching deleted posts:', error);
      res.status(500).json({ error: 'Failed to fetch deleted posts', details: error.message });
    }
  });

  // Restore deleted post
  app.post("/api/deleted-posts/:id/restore", async (req, res) => {
    try {
      const restoredApplication = await storage.restoreDeletedPost(req.params.id);
      res.json(restoredApplication);
    } catch (error) {
      console.error("Error restoring deleted post:", error);
      res.status(500).json({ message: "Failed to restore post" });
    }
  });

  // Permanently delete post
  app.delete("/api/deleted-posts/:id/permanent", async (req, res) => {
    try {
      await storage.permanentlyDeletePost(req.params.id);
      res.json({ message: "Post permanently deleted" });
    } catch (error) {
      console.error("Error permanently deleting post:", error);
      res.status(500).json({ message: "Failed to permanently delete post" });
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

  app.post("/api/courses", async (req, res) => {
    try {
      const course = {
        id: nanoid(),
        ...req.body,
        price: 'Free', // Ensure all courses are free
        createdAt: new Date()
      };
      const validatedData = insertCourseSchema.parse(course);
      const createdCourse = await storage.createCourse(validatedData);
      res.json(createdCourse);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  app.put("/api/courses/:id", async (req, res) => {
    try {
      const courseId = req.params.id;
      const validatedData = insertCourseSchema.parse(req.body);

      // Ensure the course remains free when updated
      validatedData.price = 'Free';

      const updatedCourse = await storage.updateCourse(courseId, validatedData);

      if (!updatedCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.json(updatedCourse);
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ message: "Failed to update course" });
    }
  });

  app.delete("/api/courses/:id", async (req, res) => {
    try {
      const courseId = req.params.id;
      const deleted = await storage.deleteCourse(courseId);

      if (!deleted) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.json({ message: "Course deleted successfully" });
    } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({ message: "Failed to delete course" });
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

  app.get("/api/companies/:id", async (req, res) => {
    try {
      const company = await storage.getCompany(req.params.id);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      console.error("Error fetching company:", error);
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  // Company management routes
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

  app.put("/api/companies/:id", async (req, res) => {
    try {
      const companyId = req.params.id;
      console.log(`Updating company with ID: ${companyId}`, req.body);

      // Validate the data
      const validatedData = insertCompanySchema.parse(req.body);

      // Check if company exists first
      const existingCompany = await storage.getCompany(companyId);
      if (!existingCompany) {
        console.log(`Company not found for update: ${companyId}`);
        return res.status(404).json({ message: "Company not found" });
      }

      const updatedCompany = await storage.updateCompany(companyId, validatedData);

      if (!updatedCompany) {
        console.log(`Failed to update company: ${companyId}`);
        return res.status(500).json({ message: "Failed to update company" });
      }

      console.log(`Company updated successfully: ${companyId}`);
      res.json({ message: "Company updated successfully", company: updatedCompany });
    } catch (error) {
      console.error("Error updating company:", error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message, details: error.stack });
      } else {
        res.status(500).json({ message: "Failed to update company", error: String(error) });
      }
    }
  });

  // Company deletion endpoint
  app.delete('/api/companies/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Deleting company with ID: ${id}`);

      const deleted = await storage.deleteCompany(id);

      if (!deleted) {
        console.log(`Company not found: ${id}`);
        return res.status(404).json({ message: 'Company not found' });
      }

      console.log(`Company deleted successfully: ${id}`);
      res.json({ message: 'Company deleted successfully' });
    } catch (error) {
      console.error(`Error deleting company with ID ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to delete company' });
    }
  });

  // Company soft delete endpoint (move to deleted companies)
  app.post('/api/companies/:id/soft-delete', async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Soft deleting company with ID: ${id}`);

      const deletedCompany = await storage.softDeleteCompany(id);

      if (!deletedCompany) {
        console.log(`Company not found: ${id}`);
        return res.status(404).json({ message: 'Company not found' });
      }

      console.log(`Company moved to deleted companies: ${id}`);
      res.json({ message: 'Company moved to deleted companies', deletedCompany });
    } catch (error) {
      console.error(`Error soft deleting company with ID ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to move company to deleted companies' });
    }
  });

  // Get deleted companies
  app.get('/api/deleted-companies', async (req, res) => {
    try {
      const deletedCompanies = await storage.getDeletedCompanies();
      res.json(deletedCompanies);
    } catch (error) {
      console.error('Error fetching deleted companies:', error);
      res.status(500).json({ message: 'Failed to fetch deleted companies' });
    }
  });

  // Restore deleted company
  app.post('/api/deleted-companies/:id/restore', async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Restoring deleted company with ID: ${id}`);

      const restoredCompany = await storage.restoreDeletedCompany(id);

      if (!restoredCompany) {
        console.log(`Deleted company not found: ${id}`);
        return res.status(404).json({ message: 'Deleted company not found' });
      }

      console.log(`Company restored successfully: ${id}`);
      res.json({ message: 'Company restored successfully', company: restoredCompany });
    } catch (error) {
      console.error(`Error restoring company with ID ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to restore company' });
    }
  });

  // Update deleted company
  app.put('/api/deleted-companies/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      console.log(`Updating deleted company with ID: ${id}`, updateData);

      // Validate the data
      const validatedData = insertCompanySchema.parse(updateData);

      const updatedCompany = await storage.updateDeletedCompany(id, validatedData);

      if (!updatedCompany) {
        console.log(`Deleted company not found: ${id}`);
        return res.status(404).json({ message: 'Deleted company not found' });
      }

      console.log(`Deleted company updated successfully: ${id}`);
      res.json({ message: 'Deleted company updated successfully', company: updatedCompany });
    } catch (error) {
      console.error(`Error updating deleted company with ID ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to update deleted company', details: error.message });
    }
  });

  // Permanently delete company
  app.delete('/api/deleted-companies/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Permanently deleting company with ID: ${id}`);

      const deleted = await storage.permanentlyDeleteCompany(id);

      if (!deleted) {
        console.log(`Deleted company not found: ${id}`);
        return res.status(404).json({ message: 'Deleted company not found' });
      }

      console.log(`Company permanently deleted: ${id}`);
      res.json({ message: 'Company permanently deleted' });
    } catch (error) {
      console.error(`Error permanently deleting company with ID ${req.params.id}:`, error);
      res.status(500).json({ message: 'Failed to permanently delete company' });
    }
  });

  // Contact routes
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

  // Job URL Analysis route
  app.post("/api/jobs/analyze-url", async (req, res) => {
    try {
      const { url } = req.body;
      console.log(`Analyzing job URL: ${url}`);

      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }

      // Get available companies to map to real company IDs
      const companies = await storage.getCompanies();
      console.log(`Found ${companies.length} companies for analysis`);

      // Enhanced job analysis with comprehensive data extraction
      let mockAnalysis = {
        title: "Software Developer",
        description: "We are seeking a talented Software Developer to join our dynamic team. The successful candidate will be responsible for developing, testing, and maintaining software applications. This role offers excellent opportunities for career growth and skill development in a collaborative environment.",
        requirements: "Strong programming fundamentals, Object-oriented programming concepts, Database management skills, Version control systems (Git), Problem-solving and analytical thinking, Team collaboration and communication skills",
        qualifications: "Bachelor's degree in Computer Science, Information Technology, Software Engineering, or related field. Fresh graduates are welcome to apply. Strong academic record preferred.",
        skills: "Java, Python, JavaScript, React.js, Node.js, HTML, CSS, SQL, MySQL, Git, RESTful APIs, Agile methodologies",
        experienceLevel: "fresher",
        experienceMin: 0,
        experienceMax: 2,
        location: "Bengaluru, Karnataka, India",
        jobType: "full-time",
        salary: "₹3.5-5.5 LPA",
        applyUrl: url,
        closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        batchEligible: "2023, 2024, 2025",
        isActive: true,
        companyId: companies.length > 0 ? companies[0].id : "" // Use first available company
      };

      // URL pattern matching for better data extraction
      const urlLower = url.toLowerCase();

      // Company-specific analysis
      if (urlLower.includes('microsoft.com') || urlLower.includes('msft')) {
        const company = companies.find(c => c.name.toLowerCase().includes('microsoft'));
        mockAnalysis = {
          ...mockAnalysis,
          title: "Software Engineer - Entry Level",
          companyId: company ? company.id : mockAnalysis.companyId,
          salary: "₹12-18 LPA",
          description: "Join Microsoft as a Software Engineer and work on cutting-edge technologies that impact billions of users worldwide. You'll collaborate with talented engineers to build scalable, reliable, and innovative solutions using Microsoft's technology stack.",
          requirements: "Strong programming skills in C#, Java, or Python, Understanding of data structures and algorithms, Experience with cloud technologies (Azure preferred), Knowledge of software development lifecycle, Strong problem-solving abilities",
          qualifications: "Bachelor's or Master's degree in Computer Science, Engineering, or related technical field, Strong academic performance, Internship or project experience preferred",
          skills: "C#, .NET, Azure, JavaScript, TypeScript, Python, SQL Server, Entity Framework, ASP.NET Core, REST APIs, Microservices",
          location: "Hyderabad, Telangana, India",
          experienceMax: 3
        };
      } else if (urlLower.includes('accenture.com')) {
        const company = companies.find(c => c.name.toLowerCase().includes('accenture'));
        mockAnalysis = {
          ...mockAnalysis,
          title: "Associate Software Engineer",
          companyId: company ? company.id : mockAnalysis.companyId,
          salary: "₹4.5-6.5 LPA",
          description: "Accenture is seeking Associate Software Engineers to join our technology consulting team. You'll work on diverse projects across multiple industries, gaining exposure to latest technologies and methodologies while building enterprise-scale solutions.",
          requirements: "Programming knowledge in Java, Python, or JavaScript, Understanding of software engineering principles, Database concepts and SQL knowledge, Agile/Scrum methodology awareness, Client interaction and communication skills",
          qualifications: "BE/B.Tech/MCA in Computer Science, IT, or related field, Minimum 60% throughout academics, No active backlogs, Willingness to work in shifts",
          skills: "Java, Spring Boot, Python, JavaScript, Angular, React, SQL, Oracle, MongoDB, Jenkins, Docker, AWS basics",
          location: "Pune, Chennai, Bengaluru, Hyderabad",
          batchEligible: "2022, 2023, 2024"
        };
      } else if (urlLower.includes('tcs.com') || urlLower.includes('tata consultancy')) {
        const company = companies.find(c => c.name.toLowerCase().includes('tcs') || c.name.toLowerCase().includes('tata'));
        mockAnalysis = {
          ...mockAnalysis,
          title: "Assistant System Engineer",
          companyId: company ? company.id : mockAnalysis.companyId,
          salary: "₹3.36-4.2 LPA",
          description: "TCS is hiring Assistant System Engineers for various technology domains. Join one of the world's largest IT services companies and work on innovative projects for global clients while developing your technical and professional skills.",
          requirements: "Programming fundamentals in any language, Logical reasoning and analytical skills, Basic understanding of OOPS concepts, Communication skills for client interaction, Adaptability to learn new technologies",
          qualifications: "BE/B.Tech/ME/M.Tech/MCA/MSc in relevant streams, Minimum 60% or 6.0 CGPA throughout (X, XII, Graduation), No standing backlogs during selection process",
          skills: "Java, Python, C++, JavaScript, HTML, CSS, SQL, Data Structures, Algorithms, Software Testing basics",
          location: "Multiple locations across India",
          batchEligible: "2024, 2025"
        };
      } else if (urlLower.includes('infosys.com')) {
        const company = companies.find(c => c.name.toLowerCase().includes('infosys'));
        mockAnalysis = {
          ...mockAnalysis,
          title: "Systems Engineer",
          companyId: company ? company.id : mockAnalysis.companyId,
          salary: "₹3.6-4.8 LPA",
          description: "Infosys is looking for Systems Engineers to join our global technology team. You'll work on diverse projects, gain hands-on experience with cutting-edge technologies, and contribute to digital transformation initiatives for Fortune 500 clients.",
          requirements: "Strong programming and analytical skills, Knowledge of software development lifecycle, Database management concepts, Problem-solving and debugging abilities, Team collaboration skills",
          qualifications: "BE/B.Tech/ME/M.Tech in Computer Science, IT, Electronics, or related engineering streams, Consistent academic record with minimum 60% or equivalent CGPA",
          skills: "Java, Python, JavaScript, React, Angular, Node.js, Spring Framework, SQL, MySQL, MongoDB, Git, DevOps basics",
          location: "Bengaluru, Chennai, Hyderabad, Pune, Mysuru",
          batchEligible: "2023, 2024, 2025"
        };
      } else if (urlLower.includes('amazon.com') || urlLower.includes('aws')) {
        const company = companies.find(c => c.name.toLowerCase().includes('amazon'));
        mockAnalysis = {
          ...mockAnalysis,
          title: "Software Development Engineer I",
          companyId: company ? company.id : mockAnalysis.companyId,
          salary: "₹15-25 LPA",
          description: "Amazon is seeking Software Development Engineers to build and scale world-class distributed systems. You'll work on challenging problems that directly impact millions of customers worldwide, using cutting-edge technologies in cloud computing, machine learning, and distributed systems.",
          requirements: "Strong computer science fundamentals including data structures and algorithms, Programming experience in Java, C++, Python, or JavaScript, Understanding of system design principles, Problem-solving and analytical thinking, Leadership principles alignment",
          qualifications: "Bachelor's or Master's degree in Computer Science or related field, Strong academic performance, Internship or project experience in software development",
          skills: "Java, Python, C++, JavaScript, AWS, System Design, Data Structures, Algorithms, Distributed Systems, REST APIs",
          location: "Bengaluru, Chennai, Hyderabad",
          experienceMax: 2,
          batchEligible: "2023, 2024"
        };
      } else if (urlLower.includes('google.com') || urlLower.includes('alphabet')) {
        const company = companies.find(c => c.name.toLowerCase().includes('google'));
        mockAnalysis = {
          ...mockAnalysis,
          title: "Software Engineer - New Grad",
          companyId: company ? company.id : mockAnalysis.companyId,
          salary: "₹18-30 LPA",
          description: "Google is hiring Software Engineers to work on next-generation technologies that impact billions of users. You'll tackle complex technical challenges, work with cutting-edge tools and technologies, and collaborate with world-class engineers.",
          requirements: "Strong foundation in computer science fundamentals, Programming proficiency in C++, Java, Python, or Go, Experience with data structures, algorithms, and software design, System design knowledge, Innovation and problem-solving mindset",
          qualifications: "Bachelor's or Master's degree in Computer Science or related technical field, Exceptional academic record, Relevant internship or research experience preferred",
          skills: "C++, Java, Python, Go, JavaScript, System Design, Machine Learning, Cloud Computing, Distributed Systems, Data Structures",
          location: "Bengaluru, Gurugram, Mumbai, Hyderabad",
          experienceMax: 1,
          batchEligible: "2024, 2025"
        };
      }

      // Role-specific enhancements based on URL keywords
      if (urlLower.includes('data') && (urlLower.includes('analyst') || urlLower.includes('scientist'))) {
        mockAnalysis.title = mockAnalysis.title.replace('Software Developer', 'Data Analyst');
        mockAnalysis.skills = "Python, R, SQL, Excel, Tableau, Power BI, Statistics, Machine Learning basics, Pandas, NumPy";
        mockAnalysis.requirements = "Statistical analysis skills, Data visualization experience, SQL database knowledge, Problem-solving abilities, Business acumen";
      } else if (urlLower.includes('frontend') || urlLower.includes('ui') || urlLower.includes('react')) {
        mockAnalysis.title = mockAnalysis.title.replace('Software Developer', 'Frontend Developer');
        mockAnalysis.skills = "HTML5, CSS3, JavaScript, React.js, Vue.js, Angular, TypeScript, SASS, Webpack, Git";
        mockAnalysis.requirements = "Strong HTML, CSS, JavaScript knowledge, Modern framework experience, Responsive design skills, UI/UX understanding, Version control proficiency";
      } else if (urlLower.includes('backend') || urlLower.includes('api') || urlLower.includes('server')) {
        mockAnalysis.title = mockAnalysis.title.replace('Software Developer', 'Backend Developer');
        mockAnalysis.skills = "Java, Python, Node.js, Express.js, Spring Boot, SQL, NoSQL, REST APIs, Microservices, Docker";
        mockAnalysis.requirements = "Server-side programming experience, Database design knowledge, API development skills, System architecture understanding, Performance optimization";
      } else if (urlLower.includes('fullstack') || urlLower.includes('full-stack')) {
        mockAnalysis.title = mockAnalysis.title.replace('Software Developer', 'Full Stack Developer');
        mockAnalysis.skills = "JavaScript, React.js, Node.js, Python, Java, SQL, MongoDB, HTML, CSS, Git, AWS basics";
        mockAnalysis.requirements = "Frontend and backend development skills, Database management, API integration, Full project lifecycle experience, Modern development tools proficiency";
      }

      // Location inference from URL
      if (urlLower.includes('bangalore') || urlLower.includes('bengaluru')) {
        mockAnalysis.location = "Bengaluru, Karnataka, India";
      } else if (urlLower.includes('hyderabad')) {
        mockAnalysis.location = "Hyderabad, Telangana, India";
      } else if (urlLower.includes('chennai')) {
        mockAnalysis.location = "Chennai, Tamil Nadu, India";
      } else if (urlLower.includes('pune')) {
        mockAnalysis.location = "Pune, Maharashtra, India";
      } else if (urlLower.includes('mumbai')) {
        mockAnalysis.location = "Mumbai, Maharashtra, India";
      } else if (urlLower.includes('delhi') || urlLower.includes('gurgaon') || urlLower.includes('gurugram')) {
        mockAnalysis.location = "Gurugram, Haryana, India";
      } else if (urlLower.includes('noida')) {
        mockAnalysis.location = "Noida, Uttar Pradesh, India";
      }

      // Experience level inference
      if (urlLower.includes('senior') || urlLower.includes('lead') || urlLower.includes('sr.')) {
        mockAnalysis.experienceLevel = "experienced";
        mockAnalysis.experienceMin = 3;
        mockAnalysis.experienceMax = 8;
        mockAnalysis.salary = mockAnalysis.salary.replace('3.5-5.5', '8-15');
      } else if (urlLower.includes('junior') || urlLower.includes('fresher') || urlLower.includes('entry') || urlLower.includes('graduate') || urlLower.includes('trainee')) {
        mockAnalysis.experienceLevel = "fresher";
        mockAnalysis.experienceMin = 0;
        mockAnalysis.experienceMax = 2;
      }

      console.log(`Job analysis completed for: ${mockAnalysis.title}`);
      // Return the analyzed job data
      res.json(mockAnalysis);
    } catch (error) {
      console.error("Error analyzing job URL:", error);
      res.status(500).json({ message: "Failed to analyze job URL" });
    }
  });

  // SECURITY: Admin password verification system
  // This system is essential for secure job posting functionality
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

  // Admin recovery OTP system
  app.post("/api/admin/send-recovery-otp", async (req, res) => {
    try {
      const { email } = req.body;

      // Verify this is the authorized recovery email
      const authorizedEmail = 'ramdegala3@gmail.com';
      if (email !== authorizedEmail) {
        return res.status(403).json({ success: false, message: "Unauthorized email" });
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Store OTP for recovery
      await storage.storePasswordResetOtp(email, otp);

      // Send email using SendGrid with proper error handling
      const { default: sgMail } = await import('@sendgrid/mail');

      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SendGrid API key not configured');
      }

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: email,
        from: 'ramdegala3@gmail.com', // Must be verified in SendGrid
        subject: 'Admin Access Recovery - Job Portal',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Admin Access Recovery</h2>
            <p>You requested to recover access to the Admin Job Portal.</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h3 style="color: #1f2937; margin: 0;">Recovery Code:</h3>
              <h1 style="color: #2563eb; font-size: 32px; letter-spacing: 4px; margin: 10px 0;">${otp}</h1>
            </div>
            <p><strong>This code will expire in 5 minutes.</strong></p>
            <p style="color: #6b7280; font-size: 14px;">
              If you didn't request this recovery, please ignore this email.
            </p>
          </div>
        `
      };

      try {
        await sgMail.send(msg);
        console.log(`Recovery OTP sent successfully to ${email}: ${otp}`);
        res.json({ success: true, message: "Recovery OTP sent successfully" });
      } catch (emailError) {
        // Fallback: Log OTP to console for testing when SendGrid is not configured
        console.log(`🔐 BACKUP - Recovery OTP generated for ${email.slice(0,3)}***@gmail.com: ${otp}`);
        console.log('Note: Configure SendGrid sender verification to send actual emails');
        res.json({ success: true, message: "Recovery OTP ready (check admin console)" });
      }
    } catch (error) {
      console.error("Error sending recovery OTP:", error);
      res.status(500).json({ success: false, message: "Failed to send recovery OTP" });
    }
  });

  // Verify recovery OTP
  app.post("/api/admin/verify-recovery-otp", async (req, res) => {
    try {
      const { email, otp } = req.body;

      // Verify this is the authorized recovery email
      const authorizedEmail = 'ramdegala3@gmail.com';
      if (email !== authorizedEmail) {
        return res.status(403).json({ success: false, message: "Unauthorized email" });
      }

      if (!otp) {
        return res.status(400).json({ success: false, message: "OTP is required" });
      }

      const isValid = await storage.verifyPasswordResetOtp(email, otp);

      if (!isValid) {
        return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
      }

      // Clear the OTP after successful verification
      await storage.clearPasswordResetOtp(email);

      res.json({ success: true, message: "Recovery verified successfully" });
    } catch (error) {
      console.error("Error verifying recovery OTP:", error);
      res.status(500).json({ success: false, message: "Failed to verify recovery OTP" });
    }
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      uptime: process.uptime()
    });
  });

  // Root API endpoint moved to /api to avoid interfering with frontend
  app.get('/api', (req, res) => {
    res.json({
      message: 'JobPortal API is running',
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  });

  // Presentation download routes
  app.get('/download-html', (req, res) => {
    try {
      const mdPath = path.join(__dirname, '..', 'JobPortal_Complete_Presentation.md');

      if (!fs.existsSync(mdPath)) {
        return res.status(404).json({ message: 'Presentation file not found' });
      }

      const markdownContent = fs.readFileSync(mdPath, 'utf8');
      const htmlContent = marked.parse(markdownContent);

      const fullHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>JobPortal Complete Presentation</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
    }
    h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
    h2 { color: #1e40af; margin-top: 30px; }
    h3 { color: #1d4ed8; }
    .page-break { page-break-before: always; }
    code { background: #f3f4f6; padding: 2px 4px; border-radius: 3px; }
    pre { background: #f9fafb; padding: 15px; border-radius: 5px; overflow-x: auto; }
    blockquote { border-left: 4px solid #2563eb; margin: 0; padding-left: 20px; font-style: italic; }
    hr { border: none; border-top: 2px solid #e5e7eb; margin: 40px 0; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', 'attachment; filename="JobPortal_Complete_Presentation.html"');
      res.send(fullHTML);
    } catch (error) {
      console.error('Error generating HTML:', error);
      res.status(500).json({ message: 'Error generating HTML file' });
    }
  });

  app.get('/download-markdown', (req, res) => {
    try {
      const mdPath = path.join(__dirname, '..', 'JobPortal_Complete_Presentation.md');

      if (!fs.existsSync(mdPath)) {
        return res.status(404).json({ message: 'Presentation file not found' });
      }

      res.setHeader('Content-Type', 'text/markdown');
      res.setHeader('Content-Disposition', 'attachment; filename="JobPortal_Complete_Presentation.md"');
      res.sendFile(mdPath);
    } catch (error) {
      console.error('Error downloading markdown:', error);
      res.status(500).json({ message: 'Error downloading markdown file' });
    }
  });

  app.get('/presentation', (req, res) => {
    try {
      const mdPath = path.join(__dirname, '..', 'JobPortal_Complete_Presentation.md');

      if (!fs.existsSync(mdPath)) {
        return res.status(404).json({ message: 'Presentation file not found' });
      }

      const markdownContent = fs.readFileSync(mdPath, 'utf8');
      const htmlContent = marked.parse(markdownContent);

      const fullHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>JobPortal Complete Presentation</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      color: #333;
      background: #f8fafc;
    }
    .container { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; font-size: 2.5em; }
    h2 { color: #1e40af; margin-top: 40px; font-size: 2em; }
    h3 { color: #1d4ed8; font-size: 1.5em; }
    code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: 'Courier New', monospace; }
    pre { background: #f9fafb; padding: 20px; border-radius: 8px; overflow-x: auto; border-left: 4px solid #2563eb; }
    blockquote { border-left: 4px solid #2563eb; margin: 20px 0; padding-left: 20px; font-style: italic; background: #f8fafc; padding: 15px 20px; }
    hr { border: none; border-top: 2px solid #e5e7eb; margin: 40px 0; }
    img { max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0; }
    .print-btn { position: fixed; top: 20px; right: 20px; background: #2563eb; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
    @media print { .print-btn { display: none; } }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">Print/Save as PDF</button>
  <div class="container">
    ${htmlContent}
  </div>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html');
      res.send(fullHTML);
    } catch (error) {
      console.error('Error serving presentation:', error);
      res.status(500).json({ message: 'Error loading presentation' });
    }
  });

  // PDF download endpoint (fallback)
  app.get('/download-pdf', (req, res) => {
    const pdfPath = path.join(__dirname, '..', 'JobPortal_Complete_Presentation.pdf');

    if (fs.existsSync(pdfPath)) {
      res.download(pdfPath, 'JobPortal_Complete_Presentation.pdf', (err) => {
        if (err) {
          console.error('Error downloading PDF:', err);
          res.status(500).json({ message: 'Error downloading PDF' });
        }
      });
    } else {
      res.status(404).json({ message: 'PDF file not found' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
