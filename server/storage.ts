import {
  type User, type InsertUser, type Company, type InsertCompany,
  type Job, type InsertJob, type Course, type InsertCourse,
  type Application, type InsertApplication, type Contact, type InsertContact,
  type LoginData
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export interface IStorage {
  // Auth
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  validateUser(email: string, password: string): Promise<User | undefined>;
  updateUserPassword(email: string, newPassword: string): Promise<void>;

  // Password reset
  storePasswordResetOtp(email: string, otp: string): Promise<void>;
  verifyPasswordResetOtp(email: string, otp: string): Promise<boolean>;
  clearPasswordResetOtp(email: string): Promise<void>;

  // Companies
  getCompanies(): Promise<Company[]>;
  getCompany(id: string): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: string, updates: Partial<InsertCompany>): Promise<Company | undefined>;
  deleteCompany(id: string): Promise<boolean>;

  // Deleted Companies
  softDeleteCompany(id: string): Promise<any>;
  getDeletedCompanies(): Promise<any[]>;
  restoreDeletedCompany(id: string): Promise<Company | undefined>;
  permanentlyDeleteCompany(id: string): Promise<boolean>;
  updateDeletedCompany(id: string, updateData: any): Promise<any>;

  // Jobs
  getJobs(filters?: { experienceLevel?: string; location?: string; search?: string }): Promise<(Job & { company: Company })[]>;
  getJob(id: string): Promise<(Job & { company: Company }) | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: string, job: Partial<InsertJob>): Promise<Job | undefined>;
  deleteJob(jobId: string): Promise<void>; // Added deleteJob to the interface

  // Applications
  createApplication(application: InsertApplication): Promise<Application>;
  getUserApplications(userId: string): Promise<(Application & { job: Job & { company: Company } })[]>;
  deleteApplication(id: string): Promise<void>;

  // Courses
  getCourses(category?: string): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: string, updates: Partial<InsertCourse>): Promise<Course | undefined>;
  deleteCourse(courseId: string): Promise<boolean>; // Added deleteCourse to the interface

  // Contact
  createContact(contact: InsertContact): Promise<Contact>;

  // Deleted Posts
  addDeletedPost(post: any): Promise<void>;
  getDeletedPosts(): Promise<any[]>;
  deletePostFromDeleted(id: string): Promise<void>;
  softDeleteJob(jobId: string): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private companies: Map<string, Company>;
  private jobs: Map<string, Job>;
  private courses: Map<string, Course>;
  private applications: Map<string, Application>;
  private contacts: Map<string, Contact>;
  private passwordResetOtps: Map<string, {otp: string; expiresAt: Date }>;
  private deletedPosts = new Map<string, any>();
  private deletedCompanies = new Map<string, any>();

  constructor() {
    this.users = new Map();
    this.companies = new Map();
    this.jobs = new Map();
    this.courses = new Map();
    this.applications = new Map();
    this.contacts = new Map();
    this.passwordResetOtps = new Map();

    // Initialize with sample data
    this.initializeSampleData();
  }

  async initializeSampleData() {
    // Add new companies to ensure they persist
    const newCompanies = [
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

    // Sample companies (including existing ones)
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
      ...newCompanies
    ];

    companies.forEach(company => this.companies.set(company.id, company));

    // Sample jobs
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
      },
      {
        id: "job-expired",
        companyId: "infosys-id",
        title: "Software Developer - Expired",
        description: "This position has been closed.",
        requirements: "Programming skills",
        qualifications: "Bachelor's degree",
        skills: "Java, Python",
        experienceLevel: "fresher",
        experienceMin: 0,
        experienceMax: 1,
        location: "Bengaluru",
        jobType: "full-time",
        salary: "₹3.5 LPA",
        applyUrl: "https://infosys.com/careers",
        closingDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        batchEligible: "2024",
        isActive: false,
        createdAt: new Date(),
      }
    ];

    jobs.forEach(job => this.jobs.set(job.id, job));

    // Sample courses
    const courses = [
      {
        id: "html-course",
        title: "Complete HTML & CSS Course",
        description: "Learn HTML and CSS from scratch. Build responsive websites and understand web fundamentals.",
        instructor: "John Doe",
        duration: "6 weeks",
        level: "beginner",
        category: "web-development",
        imageUrl: "/images/html_css_course.png",
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
        imageUrl: "/images/python_course.png",
        courseUrl: "https://www.python.org/about/gettingstarted/",
        price: "Free",
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
        imageUrl: "/images/javascript_course.png",
        courseUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        price: "Free",
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
        imageUrl: "/images/react_course.png",
        courseUrl: "https://react.dev/learn",
        price: "Free",
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
        imageUrl: "/images/nodejs_course.png",
        courseUrl: "https://nodejs.org/en/docs/",
        price: "Free",
        createdAt: new Date(),
      },
      {
        id: "data-structures-course",
        title: "Data Structures & Algorithms",
        description: "Learn essential data structures and algorithms for programming interviews and competitive coding.",
        instructor: "Dr. Alex Kumar",
        duration: "14 weeks",
        level: "intermediate",
        category: "programming",
        imageUrl: "/images/dsa_course.png",
        courseUrl: "https://www.geeksforgeeks.org/data-structures/",
        price: "Free",
        createdAt: new Date(),
      },
      {
        id: "machine-learning-course",
        title: "Introduction to Machine Learning",
        description: "Get started with machine learning concepts, algorithms, and practical implementation.",
        instructor: "Dr. Priya Sharma",
        duration: "16 weeks",
        level: "advanced",
        category: "data-science",
        imageUrl: "/images/ml_course.png",
        courseUrl: "https://www.tensorflow.org/learn/ml-basics",
        price: "Free",
        createdAt: new Date(),
      },
      {
        id: "cybersecurity-course",
        title: "Cybersecurity Fundamentals",
        description: "Learn cybersecurity basics, ethical hacking, and network security principles.",
        instructor: "Mark Roberts",
        duration: "12 weeks",
        level: "intermediate",
        category: "cybersecurity",
        imageUrl: "/images/cybersecurity_course.png",
        courseUrl: "https://www.cybrary.it/courses/cybersecurity-fundamentals/",
        price: "Free",
        createdAt: new Date(),
      },
      {
        id: "database-course",
        title: "Database Management Systems",
        description: "Master SQL, database design, and learn popular database management systems.",
        instructor: "Lisa Chen",
        duration: "8 weeks",
        level: "beginner",
        category: "database",
        imageUrl: "/images/database_course.png",
        courseUrl: "https://www.khanacademy.org/computing/computer-programming/sql",
        price: "Free",
        createdAt: new Date(),
      },
      {
        id: "cloud-computing-course",
        title: "Cloud Computing Essentials",
        description: "Understand cloud concepts, services, and deployment models.",
        instructor: "Alice Green",
        duration: "10 weeks",
        level: "intermediate",
        category: "cloud",
        imageUrl: "/images/cloud_computing_course.png",
        courseUrl: "https://aws.amazon.com/training/cloud-essentials/",
        price: "Free",
        createdAt: new Date(),
      },
      {
        id: "devops-course",
        title: "DevOps Principles and Practices",
        description: "Learn DevOps methodologies, tools, and practices for continuous integration and delivery.",
        instructor: "Bob White",
        duration: "12 weeks",
        level: "intermediate",
        category: "devops",
        imageUrl: "/images/devops_course.png",
        courseUrl: "https://azure.microsoft.com/en-us/services/devops/",
        price: "Free",
        createdAt: new Date(),
      }
    ];

    courses.forEach(course => this.courses.set(course.id, course));

    // Sample projects
    const projects = [
      {
        id: "project-1",
        title: "Job Portal Web Application",
        description: "A full-stack web application for job seekers and employers.",
        technologies: ["React", "Node.js", "Express", "MongoDB"],
        demoUrl: "https://job-portal-demo.example.com",
        codeUrl: "https://github.com/yourusername/job-portal",
        createdAt: new Date(),
      },
      {
        id: "project-2",
        title: "E-commerce Platform",
        description: "An online store with product catalog, shopping cart, and payment gateway integration.",
        technologies: ["React", "Django", "PostgreSQL"],
        demoUrl: "https://ecommerce-demo.example.com",
        codeUrl: "https://github.com/yourusername/ecommerce",
        createdAt: new Date(),
      },
      {
        id: "project-3",
        title: "Task Management Tool",
        description: "A productivity tool to manage tasks, projects, and deadlines.",
        technologies: ["Vue.js", "Firebase"],
        demoUrl: "https://task-manager-demo.example.com",
        codeUrl: "https://github.com/yourusername/task-manager",
        createdAt: new Date(),
      },
      {
        id: "project-4",
        title: "Blog Application",
        description: "A simple blogging platform with user authentication and content management.",
        technologies: ["Angular", "Node.js", "MySQL"],
        demoUrl: "https://blog-demo.example.com",
        codeUrl: "https://github.com/yourusername/blog-app",
        createdAt: new Date(),
      },
      {
        id: "project-5",
        title: "Data Visualization Dashboard",
        description: "A dashboard to visualize data trends and insights.",
        technologies: ["Python", "Pandas", "Matplotlib", "Flask"],
        demoUrl: "https://dataviz-demo.example.com",
        codeUrl: "https://github.com/yourusername/data-visualization",
        createdAt: new Date(),
      }
    ];

    // Add projects to storage (assuming a 'projects' map exists or is added)
    // For now, let's just log them to simulate having them
    // console.log("Initialized projects:", projects);
  }

  // Auth methods
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const id = randomUUID();
    const user: User = {
      id,
      email: insertUser.email,
      fullName: insertUser.fullName,
      phone: insertUser.phone || null,
      password: hashedPassword,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async validateUser(email: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByEmail(email);
    if (!user) return undefined;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : undefined;
  }

  // Company methods
  async getCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }

  async getCompany(id: string): Promise<Company | undefined> {
    return this.companies.get(id);
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const id = randomUUID();
    const company: Company = {
      id,
      name: insertCompany.name,
      description: insertCompany.description || null,
      website: insertCompany.website || null,
      linkedinUrl: insertCompany.linkedinUrl || null,
      logo: insertCompany.logo || null,
      location: insertCompany.location || null,
      createdAt: new Date(),
    };
    this.companies.set(id, company);
    return company;
  }

  async updateCompany(id: string, updates: Partial<InsertCompany>): Promise<Company | undefined> {
    const existing = this.companies.get(id);
    if (!existing) return undefined;

    const updated: Company = {
      ...existing,
      ...updates,
      id: existing.id, // Preserve original ID
      createdAt: existing.createdAt // Preserve creation date
    };
    this.companies.set(id, updated);
    return updated;
  }

  // Job methods
  async getJobs(filters?: { experienceLevel?: string; location?: string; search?: string }): Promise<(Job & { company: Company })[]> {
    let jobs = Array.from(this.jobs.values());

    if (filters?.experienceLevel) {
      jobs = jobs.filter(job => job.experienceLevel === filters.experienceLevel);
    }

    if (filters?.location) {
      jobs = jobs.filter(job => job.location.toLowerCase().includes(filters.location!.toLowerCase()));
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      jobs = jobs.filter(job =>
        job.title.toLowerCase().includes(search) ||
        job.description.toLowerCase().includes(search) ||
        job.skills.toLowerCase().includes(search)
      );
    }

    return jobs.map(job => {
      const company = this.companies.get(job.companyId)!;
      return { ...job, company };
    });
  }

  async getJob(id: string): Promise<(Job & { company: Company }) | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;

    const company = this.companies.get(job.companyId)!;
    return { ...job, company };
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = randomUUID();
    const job: Job = {
      id,
      companyId: insertJob.companyId,
      title: insertJob.title,
      description: insertJob.description,
      requirements: insertJob.requirements,
      qualifications: insertJob.qualifications,
      skills: insertJob.skills,
      experienceLevel: insertJob.experienceLevel,
      experienceMin: insertJob.experienceMin || null,
      experienceMax: insertJob.experienceMax || null,
      location: insertJob.location,
      jobType: insertJob.jobType,
      salary: insertJob.salary || null,
      applyUrl: insertJob.applyUrl || null,
      closingDate: insertJob.closingDate,
      batchEligible: insertJob.batchEligible || null,
      isActive: insertJob.isActive ?? true,
      createdAt: new Date(),
    };
    this.jobs.set(id, job);
    return job;
  }

  async updateJob(id: string, updates: Partial<InsertJob>): Promise<Job | undefined> {
    const existing = this.jobs.get(id);
    if (!existing) return undefined;

    const updated: Job = { ...existing, ...updates };
    this.jobs.set(id, updated);
    return updated;
  }

  // Helper to save jobs (for MemStorage)
  private async saveJobs(): Promise<void> {
    // In a real scenario, this would persist to a file or database.
    // For this in-memory store, no action is strictly needed for persistence,
    // but it's good practice to have a placeholder if storage were more complex.
  }

  // Helper to save applications (for MemStorage)
  private async saveApplications(): Promise<void> {
    // Similar to saveJobs, placeholder for persistence.
  }

  async deleteJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (job) {
      this.jobs.delete(jobId);
      // In a real scenario, you might want to save this change.
      // For this in-memory store, the change is immediate.
    }

    // Also remove any applications for this job
    Array.from(this.applications.entries()).forEach(([key, app]) => {
      if (app.jobId === jobId) {
        this.applications.delete(key);
      }
    });
    // In a real scenario, you might want to save this change.
  }


  // Application methods
  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = randomUUID();
    const application: Application = {
      id,
      userId: insertApplication.userId,
      jobId: insertApplication.jobId,
      status: insertApplication.status || null,
      appliedAt: new Date(),
    };
    this.applications.set(id, application);
    return application;
  }

  async getUserApplications(userId: string): Promise<(Application & { job: Job & { company: Company } })[]> {
    const userApps = Array.from(this.applications.values()).filter(app => app.userId === userId);

    return userApps.map(app => {
      const job = this.jobs.get(app.jobId)!;
      const company = this.companies.get(job.companyId)!;
      return { ...app, job: { ...job, company } };
    });
  }

  async deleteApplication(id: string): Promise<void> {
    this.applications.delete(id);
  }

  // Course methods
  async getCourses(category?: string): Promise<Course[]> {
    let courses = Array.from(this.courses.values());

    if (category) {
      courses = courses.filter(course => course.category === category);
    }

    return courses;
  }

  async getCourse(id: string): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = randomUUID();
    const course: Course = {
      id,
      title: insertCourse.title,
      description: insertCourse.description,
      instructor: insertCourse.instructor || null,
      duration: insertCourse.duration || null,
      level: insertCourse.level || null,
      category: insertCourse.category,
      imageUrl: insertCourse.imageUrl || null,
      courseUrl: insertCourse.courseUrl || null,
      price: "Free", // All courses are now free
      createdAt: new Date(),
    };
    this.courses.set(id, course);
    return course;
  }

  async updateCourse(id: string, updates: Partial<InsertCourse>): Promise<Course | undefined> {
    const existing = this.courses.get(id);
    if (!existing) return undefined;

    const updated: Course = {
      ...existing,
      ...updates,
      id: existing.id, // Preserve original ID
      createdAt: existing.createdAt, // Preserve creation date
      price: "Free" // Ensure all courses remain free
    };
    this.courses.set(id, updated);
    return updated;
  }

  async deleteCourse(courseId: string): Promise<boolean> {
    const deleted = this.courses.delete(courseId);
    return deleted;
  }

  // Contact methods
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      ...insertContact,
      id,
      createdAt: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
  }

  // Company deletion method
  async deleteCompany(id: string): Promise<boolean> {
    // First, delete all jobs associated with this company
    const jobsToDelete = Array.from(this.jobs.values()).filter(job => job.companyId === id);
    jobsToDelete.forEach(job => this.jobs.delete(job.id));

    // Then delete the company
    const deleted = this.companies.delete(id);
    return deleted;
  }

  // Company soft delete methods
  async softDeleteCompany(id: string): Promise<any> {
    const company = this.companies.get(id);
    if (!company) {
      return null;
    }

    // Move company to deleted companies with timestamp
    const deletedCompany = {
      ...company,
      deletedAt: new Date(),
      originalType: 'company'
    };

    this.deletedCompanies.set(id, deletedCompany);
    this.companies.delete(id);

    return deletedCompany;
  }

  async getDeletedCompanies(): Promise<any[]> {
    const deletedCompanies = Array.from(this.deletedCompanies.values());

    // Filter out companies older than 7 days and clean them up
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeDeleted = deletedCompanies.filter(company => {
      const deletedDate = new Date(company.deletedAt);
      if (deletedDate < sevenDaysAgo) {
        // Automatically remove expired deleted companies
        this.deletedCompanies.delete(company.id);
        return false;
      }
      return true;
    });

    return activeDeleted;
  }

  async restoreDeletedCompany(id: string): Promise<Company | undefined> {
    console.log(`Attempting to restore deleted company: ${id}`);
    const deletedCompany = this.deletedCompanies.get(id);

    if (!deletedCompany) {
      console.log(`Deleted company not found: ${id}`);
      return null;
    }

    // Create a new company from the deleted company data
    const restoredCompany = {
      id: deletedCompany.id,
      name: deletedCompany.name,
      description: deletedCompany.description,
      website: deletedCompany.website,
      linkedinUrl: deletedCompany.linkedinUrl,
      logo: deletedCompany.logo,
      location: deletedCompany.location,
      createdAt: new Date(), // Set new creation date
    };

    // Add back to companies
    this.companies.set(id, restoredCompany);

    // Remove from deleted companies
    this.deletedCompanies.delete(id);

    console.log(`Company restored successfully: ${id}`);
    return restoredCompany;
  }

  async updateDeletedCompany(id: string, updateData: any) {
    console.log(`Attempting to update deleted company: ${id}`);
    const deletedCompany = this.deletedCompanies.get(id);

    if (!deletedCompany) {
      console.log(`Deleted company not found: ${id}`);
      return null;
    }

    // Update the deleted company with new data
    const updatedDeletedCompany = {
      ...deletedCompany,
      name: updateData.name || deletedCompany.name,
      description: updateData.description !== undefined ? updateData.description : deletedCompany.description,
      website: updateData.website !== undefined ? updateData.website : deletedCompany.website,
      linkedinUrl: updateData.linkedinUrl !== undefined ? updateData.linkedinUrl : deletedCompany.linkedinUrl,
      logo: updateData.logo !== undefined ? updateData.logo : deletedCompany.logo,
      location: updateData.location !== undefined ? updateData.location : deletedCompany.location,
    };

    // Save the updated deleted company
    this.deletedCompanies.set(id, updatedDeletedCompany);

    console.log(`Deleted company updated successfully: ${id}`);
    return updatedDeletedCompany;
  }

  async permanentlyDeleteCompany(id: string): Promise<boolean> {
    const deleted = this.deletedCompanies.delete(id);
    return deleted;
  }

  // Password reset methods
  async updateUserPassword(email: string, newPassword: string): Promise<void> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = { ...user, password: hashedPassword };
    this.users.set(user.id, updatedUser);
  }

  async storePasswordResetOtp(email: string, otp: string): Promise<void> {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    this.passwordResetOtps.set(email, {otp, expiresAt });
  }

  async verifyPasswordResetOtp(email: string, otp: string): Promise<boolean> {
    const stored = this.passwordResetOtps.get(email);
    if (!stored) {
      return false;
    }

    // Check if OTP has expired
    if (new Date() > stored.expiresAt) {
      this.passwordResetOtps.delete(email);
      return false;
    }

    return stored.otp === otp;
  }

  async clearPasswordResetOtp(email: string): Promise<void> {
    this.passwordResetOtps.delete(email);
  }

  // Missing getJobById method (alias for getJob)
  async getJobById(id: string): Promise<(Job & { company: Company }) | undefined> {
    return this.getJob(id);
  }

  // Deleted Posts methods
  async addDeletedPost(post: any): Promise<void> {
    const id = randomUUID();
    this.deletedPosts.set(id, { ...post, id, deletedAt: new Date() });
  }

  async getUserDeletedPosts(userId: string): Promise<any[]> {
    const deletedPosts = Array.from(this.deletedPosts.values());
    return deletedPosts.filter(post => post.userId === userId);
  }

  async softDeleteApplication(applicationId: string): Promise<any> {
    const application = this.applications.get(applicationId);
    if (!application) {
      throw new Error('Application not found');
    }

    const job = await this.getJob(application.jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    // Create deleted post
    const deletedPost = {
      id: randomUUID(),
      userId: application.userId,
      jobId: application.jobId,
      applicationId: applicationId,
      job: job,
      deletedAt: new Date(),
    };

    this.deletedPosts.set(deletedPost.id, deletedPost);

    // Remove from applications
    this.applications.delete(applicationId);

    return deletedPost;
  }

  async restoreDeletedPost(deletedPostId: string): Promise<any> {
    const deletedPost = this.deletedPosts.get(deletedPostId);
    if (!deletedPost) {
      throw new Error('Deleted post not found');
    }

    // Restore the application
    const restoredApplication: Application = {
      id: deletedPost.applicationId || randomUUID(),
      userId: deletedPost.userId,
      jobId: deletedPost.jobId,
      status: null,
      appliedAt: new Date(),
    };

    this.applications.set(restoredApplication.id, restoredApplication);

    // Remove from deleted posts
    this.deletedPosts.delete(deletedPostId);

    return restoredApplication;
  }

  async permanentlyDeletePost(deletedPostId: string): Promise<void> {
    this.deletedPosts.delete(deletedPostId);
  }

  async softDeleteJob(jobId: string, userId: string): Promise<any> {
    const job = await this.getJobById(jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    // Create deleted post
    const deletedPost = {
      id: randomUUID(),
      userId: userId,
      jobId: jobId,
      applicationId: null,
      job: job,
      deletedAt: new Date(),
    };

    this.deletedPosts.set(deletedPost.id, deletedPost);

    // Remove the job from active jobs
    this.jobs.delete(jobId);

    return deletedPost;
  }

  async getDeletedPosts(): Promise<any[]> {
    return Array.from(this.deletedPosts.values());
  }

  async deletePostFromDeleted(id: string): Promise<void> {
    this.deletedPosts.delete(id);
  }

  async softDeleteJob(jobId: string, userId?: string): Promise<any> {
    const job = await this.getJob(jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    // Create deleted post for the job
    const deletedPost = {
      id: randomUUID(),
      userId: userId || 'system', // Use provided userId or default to system
      jobId: jobId,
      job: job,
      deletedAt: new Date(),
      type: 'job'
    };

    this.deletedPosts.set(deletedPost.id, deletedPost);

    // Remove the job from active jobs
    this.jobs.delete(jobId);

    return deletedPost;
  }

  }

// Import database connection
import { db } from "./db.js";
import * as schema from "@shared/schema";
import { eq, gt } from "drizzle-orm";

// Database storage implementation using Drizzle ORM
export class DbStorage implements IStorage {
  // Auth methods
  async getUserByEmail(email: string): Promise<User | undefined> {
    const users = await db.select().from(schema.users).where(eq(schema.users.email, email));
    return users[0];
  }

  async getUserById(id: string): Promise<User | undefined> {
    const users = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return users[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    const userData = {
      ...user,
      password: hashedPassword,
    };
    const [newUser] = await db.insert(schema.users).values(userData).returning();
    return newUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db.update(schema.users)
      .set(updates)
      .where(eq(schema.users.id, id))
      .returning();
    return updatedUser;
  }

  async validateUser(email: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByEmail(email);
    if (!user) return undefined;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : undefined;
  }

  async updateUserPassword(email: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await db.update(schema.users)
      .set({ password: hashedPassword })
      .where(eq(schema.users.email, email));
  }

  // Company methods
  async getCompanies(): Promise<Company[]> {
    return await db.select().from(schema.companies);
  }

  async getCompany(id: string): Promise<Company | undefined> {
    const companies = await db.select().from(schema.companies).where(eq(schema.companies.id, id));
    return companies[0];
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const [company] = await db.insert(schema.companies).values(insertCompany).returning();
    return company;
  }

  async updateCompany(id: string, updates: Partial<InsertCompany>): Promise<Company | undefined> {
    const [updatedCompany] = await db.update(schema.companies)
      .set(updates)
      .where(eq(schema.companies.id, id))
      .returning();
    return updatedCompany;
  }

  async deleteCompany(id: string): Promise<boolean> {
    // First, delete all jobs associated with this company
    await db.delete(schema.jobs).where(eq(schema.jobs.companyId, id));

    // Then delete the company
    const result = await db.delete(schema.companies).where(eq(schema.companies.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Job methods
  async getJobs(filters?: { experienceLevel?: string; location?: string; search?: string }): Promise<(Job & { company: Company })[]> {
    // This is a simplified version - you might want to add proper filtering with Drizzle
    const jobsWithCompanies = await db
      .select()
      .from(schema.jobs)
      .leftJoin(schema.companies, eq(schema.jobs.companyId, schema.companies.id));

    return jobsWithCompanies.map(row => ({
      ...row.jobs,
      company: row.companies!
    }));
  }

  async getJob(id: string): Promise<(Job & { company: Company }) | undefined> {
    const result = await db
      .select()
      .from(schema.jobs)
      .leftJoin(schema.companies, eq(schema.jobs.companyId, schema.companies.id))
      .where(eq(schema.jobs.id, id));

    if (!result[0]) return undefined;

    return {
      ...result[0].jobs,
      company: result[0].companies!
    };
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db.insert(schema.jobs).values(insertJob).returning();
    return job;
  }

  async updateJob(id: string, updates: Partial<InsertJob>): Promise<Job | undefined> {
    const [updatedJob] = await db.update(schema.jobs)
      .set(updates)
      .where(eq(schema.jobs.id, id))
      .returning();
    return updatedJob;
  }

  async deleteJob(jobId: string): Promise<void> {
    // Delete the job itself
    await db.delete(schema.jobs).where(eq(schema.jobs.id, jobId));

    // Also remove any applications for this job
    await db.delete(schema.applications).where(eq(schema.applications.jobId, jobId));
  }


  // Application methods
  async createApplication(application: InsertApplication): Promise<Application> {
    const [app] = await db.insert(schema.applications).values(application).returning();
    return app;
  }

  async getUserApplications(userId: string): Promise<(Application & { job: Job & { company: Company } })[]> {
    // Simplified version - you might want to improve this query
    const apps = await db.select().from(schema.applications).where(eq(schema.applications.userId, userId));
    const result = [];

    for (const app of apps) {
      const job = await this.getJob(app.jobId);
      if (job) {
        result.push({
          ...app,
          job
        });
      }
    }

    return result;
  }

  async deleteApplication(id: string): Promise<void> {
    await db.delete(schema.applications).where(eq(schema.applications.id, id));
  }

  // Course methods
  async getCourses(category?: string): Promise<Course[]> {
    if (category) {
      // Make all courses free when fetching
      const courses = await db.select().from(schema.courses).where(eq(schema.courses.category, category));
      return courses.map(course => ({ ...course, price: "Free" }));
    }
    // Make all courses free when fetching
    const allCourses = await db.select().from(schema.courses);
    return allCourses.map(course => ({ ...course, price: "Free" }));
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const courses = await db.select().from(schema.courses).where(eq(schema.courses.id, id));
    if (courses.length > 0) {
      // Make the fetched course free
      return { ...courses[0], price: "Free" };
    }
    return undefined;
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    try {
      const courseData = {
        ...insertCourse,
        price: "Free", // Ensure all created courses are free
      };
      const [newCourse] = await db.insert(schema.courses).values(courseData).returning();
      console.log('Course created successfully:', newCourse.title);
      return newCourse;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  async updateCourse(id: string, updates: Partial<InsertCourse>): Promise<Course | undefined> {
    try {
      const courseData = {
        ...updates,
        price: "Free", // Ensure all courses remain free
      };
      const [updatedCourse] = await db.update(schema.courses)
        .set(courseData)
        .where(eq(schema.courses.id, id))
        .returning();
      return updatedCourse;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  async deleteCourse(courseId: string): Promise<boolean> {
    const result = await db.delete(schema.courses).where(eq(schema.courses.id, courseId));
    return (result.rowCount || 0) > 0;
  }

  // Contact methods
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(schema.contacts).values(insertContact).returning();
    return contact;
  }

  // Password reset methods (using in-memory for now - in production you'd use Redis or database)
  private passwordResetOtps = new Map<string, { otp: string; expiresAt: Date }>();

  async storePasswordResetOtp(email: string, otp: string): Promise<void> {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    this.passwordResetOtps.set(email, { otp, expiresAt });
  }

  async verifyPasswordResetOtp(email: string, otp: string): Promise<boolean> {
    const stored = this.passwordResetOtps.get(email);
    if (!stored) return false;

    if (new Date() > stored.expiresAt) {
      this.passwordResetOtps.delete(email);
      return false;
    }

    return stored.otp === otp;
  }

  async clearPasswordResetOtp(email: string): Promise<void> {
    this.passwordResetOtps.delete(email);
  }

  // Deleted Posts methods for DbStorage (placeholder, actual implementation would involve a separate table or soft delete)
  async addDeletedPost(post: any): Promise<void> {
    // In a real DB, you'd insert into a 'deleted_posts' table
    // For this example, we'll simulate it by just logging
    console.log("Adding post to deleted posts:", post);
    // Example: await db.insert(schema.deletedPosts).values({ ...post, deletedAt: new Date() });
  }

  async getDeletedPosts(): Promise<any[]> {
    // In a real DB, you'd select from 'deleted_posts' and potentially filter by date
    console.log("Fetching deleted posts...");
    // Example: return await db.select().from(schema.deletedPosts).where(gt(schema.deletedPosts.deletedAt, new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)));
    return []; // Placeholder
  }

  async deletePostFromDeleted(id: string): Promise<void> {
    // In a real DB, you'd delete from 'deleted_posts'
    console.log(`Deleting post with ID ${id} from deleted posts.`);
    // Example: await db.delete(schema.deletedPosts).where(eq(schema.deletedPosts.id, id));
  }
}

// Use database storage if DATABASE_URL is available, otherwise fall back to MemStorage
// For development in Replit, force MemStorage until database is properly configured
export const storage = process.env.NODE_ENV === 'production' && process.env.DATABASE_URL ? new DbStorage() : new MemStorage();
