import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Navbar } from '@/components/job-portal/navbar';
import { Footer } from '@/components/job-portal/footer';
import { 
  BookOpen, 
  Users, 
  Clock, 
  ChevronRight,
  Search,
  Filter,
  Star,
  Trophy,
  Play,
  Download,
  ExternalLink,
  Code,
  Server,
  Bug,
  Shield,
  Settings,
  Building
} from 'lucide-react';
import type { Course } from '@shared/schema';

export default function Courses() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['/api/courses'],
  });

  const categories = [
    { id: 'all', label: 'All Courses', icon: BookOpen },
    { id: 'frontend', label: 'Frontend', icon: Code },
    { id: 'backend', label: 'Backend', icon: Server },
    { id: 'testing', label: 'Testing', icon: Bug },
    { id: 'cyber-security', label: 'Cyber Security', icon: Shield },
    { id: 'devops', label: 'DevOps', icon: Settings },
    { id: 'sap', label: 'SAP', icon: Building },
  ];

  // Create free courses with new categories
  const freeCourses = [
    // Frontend Courses
    { id: 'html-css', title: 'Complete HTML & CSS Course', description: 'Learn HTML and CSS from scratch. Build responsive websites and understand web fundamentals. Master modern layout techniques, flexbox, and CSS Grid.', instructor: 'W3Schools', duration: '6 weeks', level: 'beginner', category: 'frontend', courseUrl: 'https://www.w3schools.com/html/', price: 'Free', createdAt: new Date().toISOString() },
    { id: 'javascript', title: 'JavaScript Fundamentals', description: 'Learn JavaScript programming language and build interactive web applications. Cover ES6+ features, DOM manipulation, and async programming.', instructor: 'GeeksforGeeks', duration: '10 weeks', level: 'intermediate', category: 'frontend', courseUrl: 'https://www.geeksforgeeks.org/javascript/', price: 'Free', createdAt: new Date().toISOString() },
    { id: 'react', title: 'React.js Development', description: 'Build modern web applications with React.js. Learn components, hooks, state management, and modern React patterns.', instructor: 'GeeksforGeeks', duration: '12 weeks', level: 'intermediate', category: 'frontend', courseUrl: 'https://www.geeksforgeeks.org/react/', price: 'Free', createdAt: new Date().toISOString() },
    { id: 'angular', title: 'Angular Complete Guide', description: 'Master Angular framework for building dynamic single-page applications. Learn TypeScript, services, and routing.', instructor: 'GeeksforGeeks', duration: '14 weeks', level: 'intermediate', category: 'frontend', courseUrl: 'https://www.geeksforgeeks.org/angular/', price: 'Free', createdAt: new Date().toISOString() },
    { id: 'vue', title: 'Vue.js Progressive Framework', description: 'Learn Vue.js for building user interfaces. Understand reactive data binding and component composition.', instructor: 'GeeksforGeeks', duration: '10 weeks', level: 'intermediate', category: 'frontend', courseUrl: 'https://www.geeksforgeeks.org/vue-js/', price: 'Free', createdAt: new Date().toISOString() },

    // Backend Courses  
    { id: 'python', title: 'Python Programming for Beginners', description: 'Master Python programming from basics to advanced concepts. Perfect for beginners and job seekers. Learn data structures, OOP, and libraries.', instructor: 'GeeksforGeeks', duration: '8 weeks', level: 'beginner', category: 'backend', courseUrl: 'https://www.geeksforgeeks.org/python-programming-language/', price: 'Free', createdAt: new Date().toISOString() },
    { id: 'java', title: 'Java Complete Bootcamp', description: 'Learn Java programming language with object-oriented programming concepts. Build enterprise applications and understand JVM.', instructor: 'GeeksforGeeks', duration: '10 weeks', level: 'beginner', category: 'backend', courseUrl: 'https://www.geeksforgeeks.org/java/', price: 'Free', createdAt: new Date().toISOString() },
    { id: 'sql', title: 'SQL Database Fundamentals', description: 'Master SQL database operations, queries, joins, and database design. Essential for backend development and data analysis.', instructor: 'W3Schools', duration: '6 weeks', level: 'beginner', category: 'backend', courseUrl: 'https://www.w3schools.com/sql/', price: 'Free', createdAt: new Date().toISOString() },
    { id: 'nodejs', title: 'Node.js Backend Development', description: 'Build scalable backend applications using Node.js, Express.js, and databases. Learn API development and microservices.', instructor: 'GeeksforGeeks', duration: '12 weeks', level: 'intermediate', category: 'backend', courseUrl: 'https://www.geeksforgeeks.org/nodejs/', price: 'Free', createdAt: new Date().toISOString() },
    { id: 'django', title: 'Django Web Framework', description: 'Create powerful web applications using Django Python framework. Learn models, views, templates, and deployment.', instructor: 'GeeksforGeeks', duration: '10 weeks', level: 'intermediate', category: 'backend', courseUrl: 'https://www.geeksforgeeks.org/django-tutorial/', price: 'Free', createdAt: new Date().toISOString() },
    { id: 'golang', title: 'Go Programming Language', description: 'Learn Go for building fast, reliable, and efficient software. Perfect for cloud and backend development.', instructor: 'GeeksforGeeks', duration: '8 weeks', level: 'intermediate', category: 'backend', courseUrl: 'https://www.geeksforgeeks.org/golang/', price: 'Free', createdAt: new Date().toISOString() },

    // Testing Courses
    { id: 'selenium', title: 'Selenium Automation Testing', description: 'Learn automated testing with Selenium WebDriver for web applications. Master test frameworks and CI/CD integration.', instructor: 'GeeksforGeeks', duration: '8 weeks', level: 'intermediate', category: 'testing', courseUrl: 'https://www.geeksforgeeks.org/selenium-tutorial/', price: 'Free', createdAt: new Date().toISOString() },
    { id: 'jest', title: 'Jest JavaScript Testing', description: 'Master JavaScript testing with Jest framework. Learn unit testing, mocking, and test-driven development.', instructor: 'GeeksforGeeks', duration: '6 weeks', level: 'intermediate', category: 'testing', courseUrl: 'https://www.geeksforgeeks.org/jest-testing-framework/', price: 'Free', createdAt: new Date().toISOString() },
    { id: 'cypress', title: 'Cypress End-to-End Testing', description: 'Modern testing framework for web applications with real-time browser testing and debugging capabilities.', instructor: 'Great Learning', duration: '6 weeks', level: 'intermediate', category: 'testing', courseUrl: 'https://www.mygreatlearning.com/blog/cypress-testing/', price: 'Free', createdAt: new Date().toISOString() },

    // Cyber Security Courses
    { id: 'ethical-hacking', title: 'Ethical Hacking Fundamentals', description: 'Learn ethical hacking techniques and cybersecurity best practices. Understand penetration testing methodologies.', instructor: 'GeeksforGeeks', duration: '12 weeks', level: 'intermediate', category: 'cyber-security', courseUrl: 'https://www.geeksforgeeks.org/what-is-ethical-hacking/', price: 'Free', createdAt: new Date().toISOString() },
    { id: 'network-security', title: 'Network Security Essentials', description: 'Understand network security protocols, firewalls, and intrusion detection systems for protecting digital assets.', instructor: 'GeeksforGeeks', duration: '10 weeks', level: 'intermediate', category: 'cyber-security', courseUrl: 'https://www.geeksforgeeks.org/network-security/', price: 'Free', createdAt: new Date().toISOString() },

    // DevOps Courses
    { id: 'docker', title: 'Docker Containerization', description: 'Learn containerization with Docker for application deployment and scaling. Master container orchestration.', instructor: 'GeeksforGeeks', duration: '8 weeks', level: 'intermediate', category: 'devops', courseUrl: 'https://www.geeksforgeeks.org/docker-tutorial/', price: 'Free', createdAt: new Date().toISOString() },
    { id: 'kubernetes', title: 'Kubernetes Orchestration', description: 'Master Kubernetes for container orchestration and microservices management in production environments.', instructor: 'GeeksforGeeks', duration: '10 weeks', level: 'advanced', category: 'devops', courseUrl: 'https://www.geeksforgeeks.org/kubernetes/', price: 'Free', createdAt: new Date().toISOString() },
    { id: 'aws', title: 'AWS Cloud Fundamentals', description: 'Learn Amazon Web Services cloud computing platform and services. Prepare for AWS certifications.', instructor: 'GeeksforGeeks', duration: '12 weeks', level: 'beginner', category: 'devops', courseUrl: 'https://www.geeksforgeeks.org/amazon-web-services-aws/', price: 'Free', createdAt: new Date().toISOString() },
    { id: 'jenkins', title: 'Jenkins CI/CD Pipeline', description: 'Automate your software delivery with Jenkins. Learn continuous integration and deployment practices.', instructor: 'GeeksforGeeks', duration: '8 weeks', level: 'intermediate', category: 'devops', courseUrl: 'https://www.geeksforgeeks.org/jenkins/', price: 'Free', createdAt: new Date().toISOString() },

    // SAP Courses
    { id: 'sap-basics', title: 'SAP Fundamentals', description: 'Introduction to SAP ERP system and business processes. Learn SAP modules and navigation.', instructor: 'Great Learning', duration: '8 weeks', level: 'beginner', category: 'sap', courseUrl: 'https://www.mygreatlearning.com/blog/what-is-sap/', price: 'Free', createdAt: new Date().toISOString() },
    { id: 'sap-abap', title: 'SAP ABAP Programming', description: 'Learn SAP ABAP programming language for custom development and business logic implementation.', instructor: 'Great Learning', duration: '12 weeks', level: 'intermediate', category: 'sap', courseUrl: 'https://www.mygreatlearning.com/blog/sap-abap/', price: 'Free', createdAt: new Date().toISOString() }
  ];

  const filteredCourses = freeCourses.filter((course) => {
    const matchesSearch = searchTerm === '' || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.instructor && course.instructor.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCourseClick = (course: any) => {
    // Use wouter navigation for proper SPA routing
    navigate(`/courses/${course.id}`);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'advanced': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getCourseImage = (courseId: string) => {
    const imageMap: Record<string, string> = {
      'html-css': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
      'javascript': 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop',
      'react': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
      'angular': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
      'vue': 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400&h=300&fit=crop',
      'python': 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400&h=300&fit=crop',
      'java': 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=400&h=300&fit=crop',
      'sql': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=300&fit=crop',
      'nodejs': 'https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=400&h=300&fit=crop',
      'django': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      'golang': 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=300&fit=crop',
      'selenium': 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
      'jest': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
      'cypress': 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=300&fit=crop',
      'ethical-hacking': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop',
      'network-security': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
      'docker': 'https://images.unsplash.com/photo-1605745341112-85968b19335a?w=400&h=300&fit=crop',
      'kubernetes': 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=300&fit=crop',
      'aws': 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400&h=300&fit=crop',
      'jenkins': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
      'sap-basics': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      'sap-abap': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop'
    };
    
    return imageMap[courseId] || 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Learn New Skills</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Enhance your career prospects with our curated collection of courses. 
            From programming fundamentals to advanced technologies.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8 border dark:border-gray-700">
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  placeholder="Search courses, instructors, topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm sm:text-base dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  data-testid="search-courses"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                data-testid={`category-${category.id}`}
              >
                <category.icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{category.label}</span>
                <span className="sm:hidden">{category.label.split(' ')[0]}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full">
              <Card className="bg-white dark:bg-gray-800 border dark:border-gray-700">
                <CardContent className="p-8 text-center">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your search criteria or check back later for new courses.
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredCourses.map((course: any) => (
              <Card 
                key={course.id} 
                className="group hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden bg-white dark:bg-gray-800 border dark:border-gray-700 h-full flex flex-col"
                onClick={() => handleCourseClick(course)}
                data-testid={`course-card-${course.id}`}
              >
                <div className="relative">
                  <div className="w-full h-32 sm:h-40 md:h-48 overflow-hidden">
                    <img 
                      src={getCourseImage(course.id)} 
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback to gradient if image fails to load
                        e.currentTarget.style.display = 'none';
                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                        if (nextElement) {
                          nextElement.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="w-full h-32 sm:h-40 md:h-48 bg-gradient-to-r from-blue-500 to-purple-600 hidden items-center justify-center">
                      <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                    <Badge className={`${getLevelColor(course.level || 'beginner')} text-xs`}>
                      {course.level}
                    </Badge>
                  </div>
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center text-yellow-500 bg-white dark:bg-gray-800 px-1 sm:px-2 py-1 rounded">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                    <span className="text-xs sm:text-sm font-medium ml-1">4.8</span>
                  </div>
                </div>
                <CardHeader className="pb-2 sm:pb-4 p-3 sm:p-6 flex-grow">
                  <CardTitle className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 text-gray-600 dark:text-gray-400">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 p-3 sm:p-6 pb-3 sm:pb-6 mt-auto">
                  <div className="space-y-2 sm:space-y-3">
                    {/* Instructor */}
                    {course.instructor && (
                      <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                        <span className="truncate">{course.instructor}</span>
                      </div>
                    )}

                    {/* Duration */}
                    {course.duration && (
                      <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                        <span>{course.duration}</span>
                      </div>
                    )}

                    {/* Skills Preview */}
                    <div className="flex flex-wrap gap-1 mb-1 sm:mb-2">
                      {course.id === 'html-css' && (
                        <>
                          <span className="text-xs bg-orange-100 text-orange-800 px-1 sm:px-2 py-1 rounded flex items-center gap-1">🌐 <span className="hidden sm:inline">HTML5</span></span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-1 sm:px-2 py-1 rounded flex items-center gap-1">🎨 <span className="hidden sm:inline">CSS3</span></span>
                        </>
                      )}
                      {course.id === 'javascript' && (
                        <>
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-1 sm:px-2 py-1 rounded flex items-center gap-1">⚡ <span className="hidden sm:inline">JavaScript</span></span>
                          <span className="text-xs bg-green-100 text-green-800 px-1 sm:px-2 py-1 rounded flex items-center gap-1">🔧 <span className="hidden sm:inline">ES6+</span></span>
                        </>
                      )}
                      {course.id === 'react' && (
                        <>
                          <span className="text-xs bg-cyan-100 text-cyan-800 px-1 sm:px-2 py-1 rounded flex items-center gap-1">⚛️ <span className="hidden sm:inline">React</span></span>
                          <span className="text-xs bg-purple-100 text-purple-800 px-1 sm:px-2 py-1 rounded flex items-center gap-1">🪝 <span className="hidden sm:inline">Hooks</span></span>
                        </>
                      )}
                      {course.id === 'python' && (
                        <>
                          <span className="text-xs bg-green-100 text-green-800 px-1 sm:px-2 py-1 rounded flex items-center gap-1">🐍 <span className="hidden sm:inline">Python</span></span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-1 sm:px-2 py-1 rounded flex items-center gap-1">📊 <span className="hidden sm:inline">Data</span></span>
                        </>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" 
                          />
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-1 sm:ml-2">(4.8)</span>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-2 sm:pt-4">
                      <div className="text-sm sm:text-lg font-bold text-green-600 dark:text-green-400">
                        {course.price}
                      </div>
                      <Button 
                        size="sm"
                        className="text-xs sm:text-sm px-2 sm:px-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/courses/${course.id}`);
                        }}
                        data-testid={`enroll-course-${course.id}`}
                      >
                        <span className="hidden sm:inline">View Course</span>
                        <span className="sm:hidden">View</span>
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Popular Courses Section */}
        {selectedCategory === 'all' && (
          <div className="mt-8 sm:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Most Popular Courses</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Featured Courses */}
              <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-white text-lg sm:text-xl">HTML & CSS Mastery</CardTitle>
                  <CardDescription className="text-blue-100 text-sm sm:text-base">
                    Start your web development journey with HTML and CSS fundamentals.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-base sm:text-lg font-bold text-white">Free</span>
                    <Button 
                      variant="secondary"
                      size="sm"
                      className="text-xs sm:text-sm"
                      onClick={() => window.open('https://www.geeksforgeeks.org/html-tutorial/', '_blank')}
                      data-testid="featured-html-course"
                    >
                      <span className="hidden sm:inline">Start Learning</span>
                      <span className="sm:hidden">Start</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-white text-lg sm:text-xl">Python Programming</CardTitle>
                  <CardDescription className="text-green-100 text-sm sm:text-base">
                    Learn Python from scratch and build real-world applications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-base sm:text-lg font-bold text-white">Free</span>
                    <Button 
                      variant="secondary"
                      size="sm"
                      className="text-xs sm:text-sm"
                      onClick={() => window.open('https://www.geeksforgeeks.org/python-programming-language/', '_blank')}
                      data-testid="featured-python-course"
                    >
                      <span className="hidden sm:inline">Start Learning</span>
                      <span className="sm:hidden">Start</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
