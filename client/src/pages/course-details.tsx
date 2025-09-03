import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Navbar } from '@/components/job-portal/navbar';
import { Footer } from '@/components/job-portal/footer';
import { 
  ArrowLeft, 
  Play, 
  Clock, 
  User, 
  Star,
  BookOpen,
  CheckCircle,
  Download,
  Users,
  Award,
  Target,
  ExternalLink,
  Code,
  Globe
} from 'lucide-react';

interface CourseData {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: string;
  category: string;
  courseUrl: string;
  price: string;
  modules: string[];
  skills: string[];
}

export default function CourseDetails() {
  const [, navigate] = useLocation();
  const [match] = useRoute('/courses/:id');
  const courseId = match?.id;

  // If no courseId from route, try to get it from URL pathname
  const currentPath = window.location.pathname;
  const pathCourseId = currentPath.split('/courses/')[1];
  const finalCourseId = courseId || pathCourseId;

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const getCourseData = (id: string): CourseData => {
    const courseMap: Record<string, CourseData> = {
      // Frontend Courses
      'html-css': {
        id: 'html-css',
        title: 'Complete HTML & CSS Course',
        description: 'Learn HTML and CSS from scratch. Build responsive websites and understand web fundamentals. Master modern layout techniques, flexbox, and CSS Grid.',
        instructor: 'W3Schools',
        duration: '6 weeks',
        level: 'beginner',
        category: 'frontend',
        courseUrl: 'https://www.w3schools.com/html/',
        price: 'Free',
        modules: ['HTML Basics', 'CSS Fundamentals', 'Responsive Design', 'Flexbox', 'CSS Grid', 'Advanced Styling'],
        skills: ['HTML5', 'CSS3', 'Responsive Design', 'Web Accessibility', 'Browser DevTools']
      },
      'javascript': {
        id: 'javascript',
        title: 'JavaScript Fundamentals',
        description: 'Learn JavaScript programming language and build interactive web applications. Cover ES6+ features, DOM manipulation, and async programming.',
        instructor: 'GeeksforGeeks',
        duration: '10 weeks',
        level: 'intermediate',
        category: 'frontend',
        courseUrl: 'https://www.geeksforgeeks.org/javascript/',
        price: 'Free',
        modules: ['JS Basics', 'Functions & Scope', 'Objects & Arrays', 'DOM Manipulation', 'Async Programming', 'ES6+ Features'],
        skills: ['JavaScript ES6+', 'DOM Manipulation', 'Async/Await', 'Fetch API', 'Error Handling']
      },
      'react': {
        id: 'react',
        title: 'React.js Development',
        description: 'Build modern web applications with React.js. Learn components, hooks, state management, and modern React patterns.',
        instructor: 'GeeksforGeeks',
        duration: '12 weeks',
        level: 'intermediate',
        category: 'frontend',
        courseUrl: 'https://www.geeksforgeeks.org/react/',
        price: 'Free',
        modules: ['React Basics', 'Components', 'Hooks', 'State Management', 'Routing', 'Performance'],
        skills: ['React', 'JSX', 'Hooks', 'Context API', 'React Router', 'Redux']
      },
      'angular': {
        id: 'angular',
        title: 'Angular Complete Guide',
        description: 'Master Angular framework for building dynamic single-page applications. Learn TypeScript, services, and routing.',
        instructor: 'GeeksforGeeks',
        duration: '14 weeks',
        level: 'intermediate',
        category: 'frontend',
        courseUrl: 'https://www.geeksforgeeks.org/angular/',
        price: 'Free',
        modules: ['Angular Basics', 'TypeScript', 'Components', 'Services', 'Routing', 'HTTP Client'],
        skills: ['Angular', 'TypeScript', 'RxJS', 'Angular CLI', 'Material Design']
      },
      'vue': {
        id: 'vue',
        title: 'Vue.js Progressive Framework',
        description: 'Learn Vue.js for building user interfaces. Understand reactive data binding and component composition.',
        instructor: 'GeeksforGeeks',
        duration: '10 weeks',
        level: 'intermediate',
        category: 'frontend',
        courseUrl: 'https://www.geeksforgeeks.org/vue-js/',
        price: 'Free',
        modules: ['Vue Basics', 'Template Syntax', 'Components', 'Vuex', 'Vue Router', 'Composition API'],
        skills: ['Vue.js', 'Vuex', 'Vue Router', 'Composition API', 'Single File Components']
      },
      
      // Backend Courses
      'python': {
        id: 'python',
        title: 'Python Programming for Beginners',
        description: 'Master Python programming from basics to advanced concepts. Perfect for beginners and job seekers. Learn data structures, OOP, and libraries.',
        instructor: 'GeeksforGeeks',
        duration: '8 weeks',
        level: 'beginner',
        category: 'backend',
        courseUrl: 'https://www.geeksforgeeks.org/python-programming-language/',
        price: 'Free',
        modules: ['Python Syntax', 'Data Types', 'Control Flow', 'Functions', 'OOP', 'Libraries'],
        skills: ['Python', 'Data Structures', 'OOP', 'File Handling', 'Exception Handling']
      },
      'java': {
        id: 'java',
        title: 'Java Complete Bootcamp',
        description: 'Learn Java programming language with object-oriented programming concepts. Build enterprise applications and understand JVM.',
        instructor: 'GeeksforGeeks',
        duration: '10 weeks',
        level: 'beginner',
        category: 'backend',
        courseUrl: 'https://www.geeksforgeeks.org/java/',
        price: 'Free',
        modules: ['Java Basics', 'OOP Concepts', 'Collections', 'Exception Handling', 'Multithreading', 'JDBC'],
        skills: ['Java', 'OOP', 'Collections', 'Spring Framework', 'Maven', 'JUnit']
      },
      'sql': {
        id: 'sql',
        title: 'SQL Database Fundamentals',
        description: 'Master SQL database operations, queries, joins, and database design. Essential for backend development and data analysis.',
        instructor: 'W3Schools',
        duration: '6 weeks',
        level: 'beginner',
        category: 'backend',
        courseUrl: 'https://www.w3schools.com/sql/',
        price: 'Free',
        modules: ['SQL Basics', 'Data Types', 'Queries', 'Joins', 'Stored Procedures', 'Database Design'],
        skills: ['SQL', 'Database Design', 'MySQL', 'PostgreSQL', 'Query Optimization']
      },
      'nodejs': {
        id: 'nodejs',
        title: 'Node.js Backend Development',
        description: 'Build scalable backend applications using Node.js, Express.js, and databases. Learn API development and microservices.',
        instructor: 'GeeksforGeeks',
        duration: '12 weeks',
        level: 'intermediate',
        category: 'backend',
        courseUrl: 'https://www.geeksforgeeks.org/nodejs/',
        price: 'Free',
        modules: ['Node.js Basics', 'Express.js', 'Database Integration', 'API Development', 'Authentication', 'Deployment'],
        skills: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'JWT', 'npm']
      },
      'django': {
        id: 'django',
        title: 'Django Web Framework',
        description: 'Create powerful web applications using Django Python framework. Learn models, views, templates, and deployment.',
        instructor: 'GeeksforGeeks',
        duration: '10 weeks',
        level: 'intermediate',
        category: 'backend',
        courseUrl: 'https://www.geeksforgeeks.org/django-tutorial/',
        price: 'Free',
        modules: ['Django Basics', 'Models', 'Views', 'Templates', 'Forms', 'Admin Panel'],
        skills: ['Django', 'Python', 'MTV Architecture', 'Django ORM', 'REST Framework']
      },
      'golang': {
        id: 'golang',
        title: 'Go Programming Language',
        description: 'Learn Go for building fast, reliable, and efficient software. Perfect for cloud and backend development.',
        instructor: 'GeeksforGeeks',
        duration: '8 weeks',
        level: 'intermediate',
        category: 'backend',
        courseUrl: 'https://www.geeksforgeeks.org/golang/',
        price: 'Free',
        modules: ['Go Basics', 'Functions', 'Structs', 'Interfaces', 'Concurrency', 'Web Development'],
        skills: ['Go', 'Goroutines', 'Channels', 'HTTP Server', 'JSON Handling']
      },
      
      // Testing Courses
      'selenium': {
        id: 'selenium',
        title: 'Selenium Automation Testing',
        description: 'Learn automated testing with Selenium WebDriver for web applications. Master test frameworks and CI/CD integration.',
        instructor: 'GeeksforGeeks',
        duration: '8 weeks',
        level: 'intermediate',
        category: 'testing',
        courseUrl: 'https://www.geeksforgeeks.org/selenium-tutorial/',
        price: 'Free',
        modules: ['Selenium Basics', 'WebDriver', 'Test Frameworks', 'Page Object Model', 'Grid Setup', 'CI/CD Integration'],
        skills: ['Selenium WebDriver', 'TestNG', 'JUnit', 'Maven', 'Jenkins']
      },
      'jest': {
        id: 'jest',
        title: 'Jest JavaScript Testing',
        description: 'Master JavaScript testing with Jest framework. Learn unit testing, mocking, and test-driven development.',
        instructor: 'GeeksforGeeks',
        duration: '6 weeks',
        level: 'intermediate',
        category: 'testing',
        courseUrl: 'https://www.geeksforgeeks.org/jest-testing-framework/',
        price: 'Free',
        modules: ['Jest Basics', 'Unit Testing', 'Mocking', 'Async Testing', 'Snapshot Testing', 'Coverage Reports'],
        skills: ['Jest', 'Unit Testing', 'Mocking', 'TDD', 'JavaScript Testing']
      },
      'cypress': {
        id: 'cypress',
        title: 'Cypress End-to-End Testing',
        description: 'Modern testing framework for web applications with real-time browser testing and debugging capabilities.',
        instructor: 'Great Learning',
        duration: '6 weeks',
        level: 'intermediate',
        category: 'testing',
        courseUrl: 'https://www.mygreatlearning.com/blog/cypress-testing/',
        price: 'Free',
        modules: ['Cypress Basics', 'Test Writing', 'API Testing', 'Visual Testing', 'Custom Commands', 'CI/CD Integration'],
        skills: ['Cypress', 'E2E Testing', 'API Testing', 'JavaScript', 'Test Automation']
      },
      
      // Cyber Security Courses
      'ethical-hacking': {
        id: 'ethical-hacking',
        title: 'Ethical Hacking Fundamentals',
        description: 'Learn ethical hacking techniques and cybersecurity best practices. Understand penetration testing methodologies.',
        instructor: 'GeeksforGeeks',
        duration: '12 weeks',
        level: 'intermediate',
        category: 'cyber-security',
        courseUrl: 'https://www.geeksforgeeks.org/what-is-ethical-hacking/',
        price: 'Free',
        modules: ['Security Basics', 'Network Security', 'Web App Security', 'Penetration Testing', 'Social Engineering', 'Security Tools'],
        skills: ['Ethical Hacking', 'Penetration Testing', 'Network Security', 'Web Security', 'Kali Linux']
      },
      'network-security': {
        id: 'network-security',
        title: 'Network Security Essentials',
        description: 'Understand network security protocols, firewalls, and intrusion detection systems for protecting digital assets.',
        instructor: 'GeeksforGeeks',
        duration: '10 weeks',
        level: 'intermediate',
        category: 'cyber-security',
        courseUrl: 'https://www.geeksforgeeks.org/network-security/',
        price: 'Free',
        modules: ['Network Fundamentals', 'Firewalls', 'VPN', 'IDS/IPS', 'Wireless Security', 'Incident Response'],
        skills: ['Network Security', 'Firewalls', 'VPN', 'Intrusion Detection', 'Security Protocols']
      },
      
      // DevOps Courses
      'docker': {
        id: 'docker',
        title: 'Docker Containerization',
        description: 'Learn containerization with Docker for application deployment and scaling. Master container orchestration.',
        instructor: 'GeeksforGeeks',
        duration: '8 weeks',
        level: 'intermediate',
        category: 'devops',
        courseUrl: 'https://www.geeksforgeeks.org/docker-tutorial/',
        price: 'Free',
        modules: ['Docker Basics', 'Images & Containers', 'Dockerfile', 'Docker Compose', 'Networking', 'Volume Management'],
        skills: ['Docker', 'Containerization', 'Docker Compose', 'Container Orchestration', 'DevOps']
      },
      'kubernetes': {
        id: 'kubernetes',
        title: 'Kubernetes Orchestration',
        description: 'Master Kubernetes for container orchestration and microservices management in production environments.',
        instructor: 'GeeksforGeeks',
        duration: '10 weeks',
        level: 'advanced',
        category: 'devops',
        courseUrl: 'https://www.geeksforgeeks.org/kubernetes/',
        price: 'Free',
        modules: ['K8s Architecture', 'Pods & Services', 'Deployments', 'ConfigMaps', 'Ingress', 'Monitoring'],
        skills: ['Kubernetes', 'Container Orchestration', 'Microservices', 'Helm', 'kubectl']
      },
      'aws': {
        id: 'aws',
        title: 'AWS Cloud Fundamentals',
        description: 'Learn Amazon Web Services cloud computing platform and services. Prepare for AWS certifications.',
        instructor: 'GeeksforGeeks',
        duration: '12 weeks',
        level: 'beginner',
        category: 'devops',
        courseUrl: 'https://www.geeksforgeeks.org/amazon-web-services-aws/',
        price: 'Free',
        modules: ['AWS Basics', 'EC2', 'S3', 'RDS', 'Lambda', 'CloudFormation'],
        skills: ['AWS', 'Cloud Computing', 'EC2', 'S3', 'Lambda', 'DevOps']
      },
      'jenkins': {
        id: 'jenkins',
        title: 'Jenkins CI/CD Pipeline',
        description: 'Automate your software delivery with Jenkins. Learn continuous integration and deployment practices.',
        instructor: 'GeeksforGeeks',
        duration: '8 weeks',
        level: 'intermediate',
        category: 'devops',
        courseUrl: 'https://www.geeksforgeeks.org/jenkins/',
        price: 'Free',
        modules: ['Jenkins Basics', 'Pipeline Creation', 'Build Automation', 'Plugin Management', 'Integration', 'Best Practices'],
        skills: ['Jenkins', 'CI/CD', 'Build Automation', 'Pipeline', 'DevOps']
      },
      
      // SAP Courses
      'sap-basics': {
        id: 'sap-basics',
        title: 'SAP Fundamentals',
        description: 'Introduction to SAP ERP system and business processes. Learn SAP modules and navigation.',
        instructor: 'Great Learning',
        duration: '8 weeks',
        level: 'beginner',
        category: 'sap',
        courseUrl: 'https://www.mygreatlearning.com/blog/what-is-sap/',
        price: 'Free',
        modules: ['SAP Overview', 'Navigation', 'Master Data', 'Business Processes', 'Reporting', 'Integration'],
        skills: ['SAP ERP', 'Business Processes', 'SAP Navigation', 'Master Data', 'SAP Modules']
      },
      'sap-abap': {
        id: 'sap-abap',
        title: 'SAP ABAP Programming',
        description: 'Learn SAP ABAP programming language for custom development and business logic implementation.',
        instructor: 'Great Learning',
        duration: '12 weeks',
        level: 'intermediate',
        category: 'sap',
        courseUrl: 'https://www.mygreatlearning.com/blog/sap-abap/',
        price: 'Free',
        modules: ['ABAP Basics', 'Data Dictionary', 'Reports', 'Module Pool', 'ALV', 'Enhancement Framework'],
        skills: ['SAP ABAP', 'Data Dictionary', 'ALV Reports', 'Module Pool', 'SAP Development']
      }
    };

    return courseMap[id] || {
      id,
      title: 'Course Not Found',
      description: 'This course is currently being developed.',
      instructor: 'TBD',
      duration: 'TBD',
      level: 'beginner',
      category: 'general',
      courseUrl: '#',
      price: 'Free',
      modules: [],
      skills: []
    };
  };

  const course = getCourseData(finalCourseId || '');
  
  const getCourseImage = (courseId: string) => {
    const imageMap = {
      'html-css': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
      'javascript': 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop',
      'react': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
      'angular': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
      'vue': 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&h=400&fit=crop',
      'python': 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=800&h=400&fit=crop',
      'java': 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&h=400&fit=crop',
      'sql': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop',
      'nodejs': 'https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=800&h=400&fit=crop',
      'django': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
      'golang': 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&h=400&fit=crop',
      'selenium': 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
      'jest': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
      'cypress': 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=400&fit=crop',
      'ethical-hacking': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop',
      'network-security': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop',
      'docker': 'https://images.unsplash.com/photo-1605745341112-85968b19335a?w=800&h=400&fit=crop',
      'kubernetes': 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=400&fit=crop',
      'aws': 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800&h=400&fit=crop',
      'jenkins': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=400&fit=crop',
      'sap-basics': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
      'sap-abap': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop'
    };
    
    return imageMap[courseId] || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop';
  };
  
  const courseImage = getCourseImage(finalCourseId || '');

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkillIcon = (skill: string) => {
    const skillIcons = {
      'HTML5': '🌐',
      'CSS3': '🎨',
      'JavaScript ES6+': '⚡',
      'React': '⚛️',
      'Angular': '🅰️',
      'Vue.js': '💚',
      'Python': '🐍',
      'Java': '☕',
      'SQL': '🗃️',
      'Node.js': '🟢',
      'Django': '🎸',
      'Go': '🔷',
      'Selenium WebDriver': '🤖',
      'Jest': '🃏',
      'Cypress': '🌲',
      'Docker': '🐳',
      'Kubernetes': '☸️',
      'AWS': '☁️',
      'Jenkins': '🔨',
      'SAP ERP': '🏢',
      'SAP ABAP': '📊'
    };
    return skillIcons[skill] || '💡';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate('/courses')}
          data-testid="back-to-courses"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Courses
        </Button>

        {/* Course Header */}
        <div className="mb-6 sm:mb-8">
          <div className="relative w-full h-48 sm:h-64 lg:h-80 rounded-lg overflow-hidden mb-4 sm:mb-6">
            <img 
              src={courseImage} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <Button size="sm" className="sm:size-lg bg-white text-gray-900 hover:bg-gray-100 text-sm sm:text-base">
                <Play className="w-4 h-4 sm:w-6 sm:h-6 mr-2" />
                Start Learning
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex-1 w-full lg:w-auto">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-sm sm:text-lg text-gray-600 mb-4 line-clamp-3">{course.description}</p>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="truncate">{course.instructor}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 fill-yellow-400 text-yellow-400" />
                  <span className="hidden sm:inline">4.8 (1,234 reviews)</span>
                  <span className="sm:hidden">4.8</span>
                </div>
              </div>
            </div>

            <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 lg:gap-0 w-full lg:w-auto justify-between lg:justify-start">
              <Badge className={`${getLevelColor(course.level)} text-xs sm:text-sm`}>
                {course.level}
              </Badge>
              <div className="text-xl sm:text-2xl font-bold text-green-600 lg:mt-2">{course.price}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {/* Course Content */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Course Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {course.modules.map((module, index) => (
                    <div key={index} className="flex items-center p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 sm:mr-3 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base truncate">{module}</h4>
                      </div>
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills You'll Learn */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Skills You'll Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {course.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-sm flex items-center gap-1">
                      <span>{getSkillIcon(skill)}</span>
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <Card className="lg:sticky lg:top-6">
              <CardHeader>
                <CardTitle>Course Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => window.open(course.courseUrl, '_blank')}
                  data-testid="start-course"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Access on {course.instructor}
                </Button>

                <Button variant="outline" className="w-full" size="lg">
                  <Download className="w-4 h-4 mr-2" />
                  Download Resources
                </Button>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold">Course Info</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Level:</span>
                      <Badge className={getLevelColor(course.level)}>{course.level}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Price:</span>
                      <span className="font-bold text-green-600">{course.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Students:</span>
                      <span>12,456</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}