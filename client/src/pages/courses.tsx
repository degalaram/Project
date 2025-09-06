import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/job-portal/navbar';
import { Footer } from '@/components/job-portal/footer';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
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
  Building,
  Plus,
  Save,
  Trash2,
  Edit
} from 'lucide-react';
import type { Course } from '@shared/schema';

// Edit Course Dialog Component
function EditCourseDialog({ course, children }: { course: any; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    instructor: course.instructor || '',
    duration: course.duration || '',
    level: course.level || 'beginner',
    category: course.category,
    courseUrl: course.courseUrl || '',
    price: 'Free'
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Reset form data when dialog opens or course changes
  useEffect(() => {
    setFormData({
      title: course.title,
      description: course.description,
      instructor: course.instructor || '',
      duration: course.duration || '',
      level: course.level || 'beginner',
      category: course.category,
      courseUrl: course.courseUrl || '',
      price: 'Free'
    });
  }, [course, open]);

  const updateCourseMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('PUT', `/api/courses/${course.id}`, data);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update course: ${errorText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Course updated successfully',
        description: 'The course details have been updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      setOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update course',
        description: error.message || 'An error occurred while updating the course.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.courseUrl.trim()) {
      toast({
        title: 'Please fill required fields',
        description: 'Course title and URL are required.',
        variant: 'destructive',
      });
      return;
    }
    updateCourseMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-[95vw] max-w-[95vw] max-h-[90vh] overflow-y-auto mx-2">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
          <DialogDescription>
            Update the course details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-course-title">Course Title *</Label>
            <Input
              id="edit-course-title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter course title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-course-description">Description</Label>
            <Textarea
              id="edit-course-description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Course description"
              className="min-h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-course-instructor">Instructor</Label>
              <Input
                id="edit-course-instructor"
                value={formData.instructor}
                onChange={(e) => handleChange('instructor', e.target.value)}
                placeholder="Instructor name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-course-duration">Duration</Label>
              <Input
                id="edit-course-duration"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                placeholder="e.g., 8 weeks"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-course-level">Level</Label>
              <Select value={formData.level} onValueChange={(value) => handleChange('level', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-course-category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="cyber-security">Cyber Security</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                  <SelectItem value="sap">SAP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-course-url">Course URL *</Label>
            <Input
              id="edit-course-url"
              value={formData.courseUrl}
              onChange={(e) => handleChange('courseUrl', e.target.value)}
              placeholder="https://example.com/course"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateCourseMutation.isPending}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {updateCourseMutation.isPending ? 'Updating...' : 'Update Course'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Add Course Form Component
function AddCourseDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    duration: '',
    level: 'beginner',
    category: 'frontend',
    courseUrl: '',
    price: 'Free'
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Delete course mutation
  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const response = await apiRequest('DELETE', `/api/courses/${courseId}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete course: ${errorText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Course deleted successfully',
        description: 'The course has been removed from the catalog.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete course',
        description: error.message || 'An error occurred while deleting the course.',
        variant: 'destructive',
      });
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: async (courseData: any) => {
      const response = await apiRequest('POST', '/api/courses', courseData);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create course: ${errorText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Course created successfully',
        description: 'The new course has been added to the catalog.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      setOpen(false);
      setFormData({
        title: '',
        description: '',
        instructor: '',
        duration: '',
        level: 'beginner',
        category: 'frontend',
        courseUrl: '',
        price: 'Free'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create course',
        description: error.message || 'An error occurred while creating the course.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.courseUrl.trim()) {
      toast({
        title: 'Please fill required fields',
        description: 'Course title and URL are required.',
        variant: 'destructive',
      });
      return;
    }
    createCourseMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-[95vw] max-w-[95vw] max-h-[90vh] overflow-y-auto mx-2">
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>
            Create a new course to add to the catalog.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="course-title">Course Title *</Label>
            <Input
              id="course-title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter course title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course-description">Description</Label>
            <Textarea
              id="course-description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Course description"
              className="min-h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course-instructor">Instructor</Label>
              <Input
                id="course-instructor"
                value={formData.instructor}
                onChange={(e) => handleChange('instructor', e.target.value)}
                placeholder="Instructor name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course-duration">Duration</Label>
              <Input
                id="course-duration"
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
                placeholder="e.g., 8 weeks"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course-level">Level</Label>
              <Select value={formData.level} onValueChange={(value) => handleChange('level', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course-category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="cyber-security">Cyber Security</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                  <SelectItem value="sap">SAP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course-url">Course URL *</Label>
            <Input
              id="course-url"
              value={formData.courseUrl}
              onChange={(e) => handleChange('courseUrl', e.target.value)}
              placeholder="https://example.com/course"
              required
            />
          </div>

          <input type="hidden" name="price" value="Free" />

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createCourseMutation.isPending}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {createCourseMutation.isPending ? (
                'Creating...'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Course
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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

  const { data: dbCourses = [], isLoading } = useQuery({
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

  // Combine database courses with static free courses
  const allCourses = [...dbCourses, ...freeCourses];

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = searchTerm === '' || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.instructor && course.instructor.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCourseClick = (course: any) => {
    // If course has a courseUrl, open it directly
    if (course.courseUrl) {
      window.open(course.courseUrl, '_blank');
    } else {
      // Fallback to course details page
      navigate(`/courses/${course.id}`);
    }
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
      'html-css': 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400&h=300&fit=crop', // HTML/CSS code
      'javascript': 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop', // JavaScript code
      'react': 'https://images.unsplash.com/photo-1633356122544-f13432a6cee?w=400&h=300&fit=crop', // React development
      'angular': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop', // Angular development
      'vue': 'https://images.unsplash.com/photo-1588508065123-287b28183da?w=400&h=300&fit=crop', // Vue development
      'python': 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=400&h=300&fit=crop', // Python code
      'java': 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=400&h=300&fit=crop', // Java development
      'sql': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=300&fit=crop', // Database/SQL
      'nodejs': 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=400&h=300&fit=crop', // Node.js development
      'django': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop', // Django development
      'golang': 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&h=300&fit=crop', // Go development
      'selenium': 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop', // Testing/automation
      'jest': 'https://images.unsplash.com/photo-1611224923853-80b018f02d71?w=400&h=300&fit=crop', // JavaScript testing
      'cypress': 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=300&fit=crop', // End-to-end testing
      'ethical-hacking': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop', // Cybersecurity
      'network-security': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop', // Network security
      'docker': 'https://images.unsplash.com/photo-1605745341112-85968b19335a?w=400&h=300&fit=crop', // Containerization
      'kubernetes': 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=300&fit=crop', // Container orchestration
      'aws': 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=400&h=300&fit=crop', // Cloud computing
      'jenkins': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop', // CI/CD
      'sap-basics': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop', // Enterprise software
      'sap-abap': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop' // SAP development
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
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Learn New Skills</h1>
            <AddCourseDialog>
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 h-10 w-10"
                data-testid="add-course-button"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </AddCourseDialog>
          </div>
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

                    {/* Skills Preview with Technology Icons */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {course.id === 'html-css' && (
                        <>
                          <div className="flex items-center gap-1 bg-orange-50 border border-orange-200 px-2 py-1 rounded-md">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" alt="HTML5" className="w-4 h-4" />
                            <span className="text-xs text-orange-700 font-medium hidden sm:inline">HTML5</span>
                          </div>
                          <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 px-2 py-1 rounded-md">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" alt="CSS3" className="w-4 h-4" />
                            <span className="text-xs text-blue-700 font-medium hidden sm:inline">CSS3</span>
                          </div>
                        </>
                      )}
                      {course.id === 'javascript' && (
                        <>
                          <div className="flex items-center gap-1 bg-yellow-50 border border-yellow-200 px-2 py-1 rounded-md">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" alt="JavaScript" className="w-4 h-4" />
                            <span className="text-xs text-yellow-700 font-medium hidden sm:inline">JavaScript</span>
                          </div>
                          <div className="flex items-center gap-1 bg-green-50 border border-green-200 px-2 py-1 rounded-md">
                            <span className="text-xs text-green-700 font-medium">ES6+</span>
                          </div>
                        </>
                      )}
                      {course.id === 'react' && (
                        <>
                          <div className="flex items-center gap-1 bg-cyan-50 border border-cyan-200 px-2 py-1 rounded-md">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" alt="React" className="w-4 h-4" />
                            <span className="text-xs text-cyan-700 font-medium hidden sm:inline">React</span>
                          </div>
                          <div className="flex items-center gap-1 bg-purple-50 border border-purple-200 px-2 py-1 rounded-md">
                            <span className="text-xs text-purple-700 font-medium">Hooks</span>
                          </div>
                        </>
                      )}
                      {course.id === 'angular' && (
                        <>
                          <div className="flex items-center gap-1 bg-red-50 border border-red-200 px-2 py-1 rounded-md">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angularjs/angularjs-original.svg" alt="Angular" className="w-4 h-4" />
                            <span className="text-xs text-red-700 font-medium hidden sm:inline">Angular</span>
                          </div>
                          <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 px-2 py-1 rounded-md">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" alt="TypeScript" className="w-4 h-4" />
                            <span className="text-xs text-blue-700 font-medium hidden sm:inline">TypeScript</span>
                          </div>
                        </>
                      )}
                      {course.id === 'vue' && (
                        <>
                          <div className="flex items-center gap-1 bg-green-50 border border-green-200 px-2 py-1 rounded-md">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg" alt="Vue.js" className="w-4 h-4" />
                            <span className="text-xs text-green-700 font-medium hidden sm:inline">Vue.js</span>
                          </div>
                        </>
                      )}
                      {course.id === 'python' && (
                        <>
                          <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 px-2 py-1 rounded-md">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" alt="Python" className="w-4 h-4" />
                            <span className="text-xs text-blue-700 font-medium hidden sm:inline">Python</span>
                          </div>
                        </>
                      )}
                      {course.id === 'java' && (
                        <>
                          <div className="flex items-center gap-1 bg-orange-50 border border-orange-200 px-2 py-1 rounded-md">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" alt="Java" className="w-4 h-4" />
                            <span className="text-xs text-orange-700 font-medium hidden sm:inline">Java</span>
                          </div>
                        </>
                      )}
                      {course.id === 'sql' && (
                        <>
                          <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 px-2 py-1 rounded-md">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" alt="SQL" className="w-4 h-4" />
                            <span className="text-xs text-blue-700 font-medium hidden sm:inline">SQL</span>
                          </div>
                        </>
                      )}
                      {course.id === 'nodejs' && (
                        <>
                          <div className="flex items-center gap-1 bg-green-50 border border-green-200 px-2 py-1 rounded-md">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" alt="Node.js" className="w-4 h-4" />
                            <span className="text-xs text-green-700 font-medium hidden sm:inline">Node.js</span>
                          </div>
                          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-2 py-1 rounded-md">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" alt="Express" className="w-4 h-4" />
                            <span className="text-xs text-gray-700 font-medium hidden sm:inline">Express</span>
                          </div>
                        </>
                      )}
                      {course.id === 'django' && (
                        <>
                          <div className="flex items-center gap-1 bg-green-50 border border-green-200 px-2 py-1 rounded-md">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg" alt="Django" className="w-4 h-4" />
                            <span className="text-xs text-green-700 font-medium hidden sm:inline">Django</span>
                          </div>
                        </>
                      )}
                      {course.id === 'golang' && (
                        <>
                          <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 px-2 py-1 rounded-md">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg" alt="Go" className="w-4 h-4" />
                            <span className="text-xs text-blue-700 font-medium hidden sm:inline">Go</span>
                          </div>
                        </>
                      )}
                      {course.id === 'selenium' && (
                        <>
                          <div className="flex items-center gap-1 bg-green-50 border border-green-200 px-2 py-1 rounded-md">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/selenium/selenium-original.svg" alt="Selenium" className="w-4 h-4" />
                            <span className="text-xs text-green-700 font-medium hidden sm:inline">Selenium</span>
                          </div>
                        </>
                      )}
                      {course.id === 'jest' && (
                        <>
                          <div className="flex items-center gap-1 bg-red-50 border border-red-200 px-2 py-1 rounded-md">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jest/jest-plain.svg" alt="Jest" className="w-4 h-4" />
                            <span className="text-xs text-red-700 font-medium hidden sm:inline">Jest</span>
                          </div>
                        </>
                      )}
                      {course.id === 'cypress' && (
                        <>
                          <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-2 py-1 rounded-md">
                            <span className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold">C</span>
                            <span className="text-xs text-gray-700 font-medium hidden sm:inline">Cypress</span>
                          </div>
                        </>
                      )}
                      {course.id === 'ethical-hacking' && (
                        <>
                          <div className="flex items-center gap-1 bg-red-50 border border-red-200 px-2 py-1 rounded-md">
                            <span className="text-xs text-red-700 font-medium">🛡️ Security</span>
                          </div>
                        </>
                      )}
                      {course.id === 'network-security' && (
                        <>
                          <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 px-2 py-1 rounded-md">
                            <span className="text-xs text-blue-700 font-medium">🔒 Network</span>
                          </div>
                        </>
                      )}
                      {course.id === 'docker' && (
                        <>
                          <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 px-2 py-1 rounded-md">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" alt="Docker" className="w-4 h-4" />
                            <span className="text-xs text-blue-700 font-medium hidden sm:inline">Docker</span>
                          </div>
                        </>
                      )}
                      {course.id === 'kubernetes' && (
                        <>
                          <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 px-2 py-1 rounded-md">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-plain.svg" alt="Kubernetes" className="w-4 h-4" />
                            <span className="text-xs text-blue-700 font-medium hidden sm:inline">Kubernetes</span>
                          </div>
                        </>
                      )}
                      {course.id === 'aws' && (
                        <>
                          <div className="flex items-center gap-1 bg-orange-50 border border-orange-200 px-2 py-1 rounded-md">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" alt="AWS" className="w-4 h-4" />
                            <span className="text-xs text-orange-700 font-medium hidden sm:inline">AWS</span>
                          </div>
                        </>
                      )}
                      {course.id === 'jenkins' && (
                        <>
                          <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 px-2 py-1 rounded-md">
                            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg" alt="Jenkins" className="w-4 h-4" />
                            <span className="text-xs text-blue-700 font-medium hidden sm:inline">Jenkins</span>
                          </div>
                        </>
                      )}
                      {course.id === 'sap-basics' && (
                        <>
                          <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 px-2 py-1 rounded-md">
                            <span className="text-xs text-blue-700 font-medium">🏢 SAP</span>
                          </div>
                        </>
                      )}
                      {course.id === 'sap-abap' && (
                        <>
                          <div className="flex items-center gap-1 bg-blue-50 border border-blue-200 px-2 py-1 rounded-md">
                            <span className="text-xs text-blue-700 font-medium">📊 ABAP</span>
                          </div>
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
                        Free
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm"
                          className="text-xs sm:text-sm px-2 sm:px-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (course.courseUrl) {
                              window.open(course.courseUrl, '_blank');
                            } else {
                              navigate(`/courses/${course.id}`);
                            }
                          }}
                          data-testid={`enroll-course-${course.id}`}
                        >
                          <span className="hidden sm:inline">
                            {course.courseUrl ? 'Start Course' : 'View Course'}
                          </span>
                          <span className="sm:hidden">
                            {course.courseUrl ? 'Start' : 'View'}
                          </span>
                          {course.courseUrl ? (
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                          ) : (
                            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                          )}
                        </Button>
                        {/* Only show edit and delete buttons for database courses, not static free courses */}
                        {!freeCourses.find(fc => fc.id === course.id) && (
                          <>
                            <EditCourseDialog course={course}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="p-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                                onClick={(e) => e.stopPropagation()}
                                data-testid={`edit-course-${course.id}`}
                              >
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </EditCourseDialog>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="p-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
                                  deleteCourseMutation.mutate(course.id);
                                }
                              }}
                              disabled={deleteCourseMutation.isPending}
                              data-testid={`delete-course-${course.id}`}
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </>
                        )}
                      </div>
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
