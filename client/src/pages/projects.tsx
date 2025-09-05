import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/job-portal/navbar';
import { Footer } from '@/components/job-portal/footer'; // Assuming Footer component is here
import { 
  FolderOpen, 
  Github, 
  ExternalLink, 
  Star,
  Eye,
  Code,
  Smartphone,
  Globe,
  Database,
  Cpu
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  duration: string;
  featured: boolean;
}

export default function Projects() {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const projects: Project[] = [
    {
      id: 'todo-app',
      title: 'Todo List Application',
      description: 'Build a full-featured todo application with React and local storage. Learn component state management, event handling, and data persistence.',
      category: 'web-development',
      difficulty: 'beginner',
      technologies: ['React', 'JavaScript', 'CSS', 'Local Storage'],
      githubUrl: 'https://github.com/tastejs/todomvc/tree/master/examples/react',
      liveUrl: 'https://todomvc.com/examples/react/',
      duration: '2-3 hours',
      featured: true,
    },
    {
      id: 'weather-app',
      title: 'Weather Dashboard',
      description: 'Create a responsive weather application that fetches data from weather APIs. Includes location detection, 5-day forecast, and beautiful UI.',
      category: 'web-development',
      difficulty: 'intermediate',
      technologies: ['React', 'API Integration', 'Responsive Design', 'Charts'],
      githubUrl: 'https://github.com/john-smilga/react-projects/tree/master/12-sidebar-modal',
      liveUrl: 'https://react-projects-12-sidebar-modal.netlify.app/',
      duration: '1-2 days',
      featured: true,
    },
    {
      id: 'ecommerce-api',
      title: 'E-commerce REST API',
      description: 'Build a complete e-commerce backend with user authentication, product management, shopping cart, and payment processing.',
      category: 'backend',
      difficulty: 'advanced',
      technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Stripe'],
      githubUrl: 'https://github.com/john-smilga/node-express-course/tree/main/03-task-manager/final',
      liveUrl: 'https://nodejs-course-task-manager.herokuapp.com/',
      duration: '1-2 weeks',
      featured: false,
    },
    {
      id: 'mobile-expense-tracker',
      title: 'Mobile Expense Tracker',
      description: 'React Native app for tracking daily expenses with categories, charts, and budget alerts. Includes offline functionality.',
      category: 'mobile',
      difficulty: 'intermediate',
      technologies: ['React Native', 'SQLite', 'Charts', 'Push Notifications'],
      githubUrl: 'https://github.com/academind/react-native-practical-guide-code/tree/course-resources',
      liveUrl: 'https://expo.dev/@academind/expense-tracker',
      duration: '1 week',
      featured: true,
    },
    {
      id: 'blog-cms',
      title: 'Blog Content Management System',
      description: 'Full-stack blog application with admin panel, rich text editor, comment system, and SEO optimization.',
      category: 'full-stack',
      difficulty: 'advanced',
      technologies: ['Next.js', 'PostgreSQL', 'Prisma', 'TailwindCSS', 'Vercel'],
      githubUrl: 'https://github.com/vercel/next.js/tree/canary/examples/blog-starter',
      liveUrl: 'https://next-blog-starter.vercel.app/',
      duration: '2-3 weeks',
      featured: false,
    },
    {
      id: 'data-visualization',
      title: 'Sales Data Visualization',
      description: 'Interactive dashboard for visualizing sales data with multiple chart types, filters, and real-time updates.',
      category: 'data-science',
      difficulty: 'intermediate',
      technologies: ['Python', 'Pandas', 'Plotly', 'Streamlit', 'CSV Processing'],
      githubUrl: 'https://github.com/streamlit/demo-uber-nyc-pickups',
      liveUrl: 'https://share.streamlit.io/streamlit/demo-uber-nyc-pickups',
      duration: '3-5 days',
      featured: false,
    },
    {
      id: 'social-media-app',
      title: 'Social Media Platform',
      description: 'Build a complete social media platform with user profiles, posts, comments, likes, and real-time chat functionality.',
      category: 'full-stack',
      difficulty: 'advanced',
      technologies: ['React', 'Node.js', 'Socket.io', 'PostgreSQL', 'JWT'],
      githubUrl: 'https://github.com/john-smilga/react-projects/tree/master/14-cart',
      liveUrl: 'https://react-useReducer-cart.netlify.app/',
      duration: '2-3 weeks',
      featured: false,
    },
    {
      id: 'portfolio-website',
      title: 'Professional Portfolio Website',
      description: 'Create a stunning personal portfolio website with animations, dark mode, and responsive design.',
      category: 'web-development',
      difficulty: 'intermediate',
      technologies: ['React', 'Three.js', 'Framer Motion', 'TailwindCSS'],
      githubUrl: 'https://github.com/soumyajit4419/Portfolio',
      liveUrl: 'https://soumyajit.vercel.app/',
      duration: '1-2 weeks',
      featured: false,
    }
  ];

  const categories = [
    { id: 'all', label: 'All Projects', icon: FolderOpen },
    { id: 'web-development', label: 'Web Development', icon: Globe },
    { id: 'mobile', label: 'Mobile Apps', icon: Smartphone },
    { id: 'backend', label: 'Backend', icon: Database },
    { id: 'full-stack', label: 'Full Stack', icon: Code },
    { id: 'data-science', label: 'Data Science', icon: Cpu },
  ];

  const filteredProjects = projects.filter((project) => {
    return selectedCategory === 'all' || project.category === selectedCategory;
  });

  const featuredProjects = projects.filter(project => project.featured);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web-development': return Globe;
      case 'mobile': return Smartphone;
      case 'backend': return Database;
      case 'full-stack': return Code;
      case 'data-science': return Cpu;
      default: return FolderOpen;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900"> {/* Added dark:bg-gray-900 for dark mode */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Practice Projects</h1> {/* Added dark:text-white */}
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"> {/* Added dark:text-gray-300 */}
            Build real-world projects to enhance your skills and create an impressive portfolio. 
            Each project includes detailed instructions and source code.
          </p>
        </div>

        {/* Featured Projects */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Projects</h2> {/* Added dark:text-white */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => {
              const CategoryIcon = getCategoryIcon(project.category);
              return (
                <Card key={project.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 dark:bg-gray-800 dark:border-gray-700"> {/* Added dark theme classes */}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CategoryIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" /> {/* Added dark theme class */}
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"> {/* Added dark theme classes */}
                        Featured
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">{project.title}</CardTitle> {/* Added dark:text-white */}
                    <CardDescription className="text-gray-600 dark:text-gray-300">{project.description}</CardDescription> {/* Added dark:text-gray-300 */}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className={getDifficultyColor(project.difficulty) + " dark:bg-opacity-20"}> {/* Added dark theme class */}
                          {project.difficulty}
                        </Badge>
                        <span className="text-sm text-gray-600 dark:text-gray-300">{project.duration}</span> {/* Added dark:text-gray-300 */}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs text-gray-700 dark:text-gray-300"> {/* Added dark theme class */}
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs text-gray-700 dark:text-gray-300"> {/* Added dark theme class */}
                            +{project.technologies.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {project.githubUrl && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(project.githubUrl, '_blank')}
                            data-testid={`github-${project.id}`}
                            className="text-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700" // Added dark theme classes
                          >
                            <Github className="w-4 h-4 mr-1 text-gray-700 dark:text-gray-300" /> {/* Added dark theme class */}
                            Code
                          </Button>
                        )}
                        {project.liveUrl && (
                          <Button 
                            size="sm"
                            onClick={() => window.open(project.liveUrl, '_blank')}
                            data-testid={`demo-${project.id}`}
                            className="dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700" // Added dark theme classes
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Demo
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center text-gray-700 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700" // Added dark theme classes
                data-testid={`category-${category.id}`}
              >
                <category.icon className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" /> {/* Added dark theme class */}
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* All Projects */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6"> {/* Added dark:text-white */}
            {selectedCategory === 'all' ? 'All Projects' : categories.find(c => c.id === selectedCategory)?.label}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const CategoryIcon = getCategoryIcon(project.category);
              return (
                <Card 
                  key={project.id} 
                  className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700" // Added dark theme classes
                  data-testid={`project-card-${project.id}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CategoryIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" /> {/* Added dark theme class */}
                      {project.featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">{project.title}</CardTitle> {/* Added dark:text-white */}
                    <CardDescription className="text-gray-600 dark:text-gray-300">{project.description}</CardDescription> {/* Added dark:text-gray-300 */}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className={getDifficultyColor(project.difficulty) + " dark:bg-opacity-20"}> {/* Added dark theme class */}
                          {project.difficulty}
                        </Badge>
                        <span className="text-sm text-gray-600 dark:text-gray-300">{project.duration}</span> {/* Added dark:text-gray-300 */}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs text-gray-700 dark:text-gray-300"> {/* Added dark theme class */}
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs text-gray-700 dark:text-gray-300"> {/* Added dark theme class */}
                            +{project.technologies.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {project.githubUrl && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(project.githubUrl, '_blank')}
                            data-testid={`github-${project.id}`}
                            className="text-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700" // Added dark theme classes
                          >
                            <Github className="w-4 h-4 mr-1 text-gray-700 dark:text-gray-300" /> {/* Added dark theme class */}
                            Code
                          </Button>
                        )}
                        {project.liveUrl && (
                          <Button 
                            size="sm"
                            onClick={() => window.open(project.liveUrl, '_blank')}
                            data-testid={`demo-${project.id}`}
                            className="dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700" // Added dark theme classes
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Demo
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 dark:from-purple-700 dark:to-pink-700"> {/* Added dark theme classes */}
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-white">Ready to Start Building?</h3>
              <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                These projects are designed to help you learn by doing. Each one includes step-by-step instructions, 
                starter code, and guidance to help you succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => navigate('/courses')}
                  data-testid="view-courses"
                  className="dark:bg-white dark:text-purple-600" // Added dark theme classes
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Courses First
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-purple-50 dark:bg-transparent dark:text-white dark:border-white" // Added dark theme classes
                  onClick={() => navigate('/contact')}
                  data-testid="get-help"
                >
                  Get Help Building
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
