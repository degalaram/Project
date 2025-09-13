
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, Component, ErrorInfo, ReactNode } from "react";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Jobs from "@/pages/jobs";
import JobDetails from "@/pages/job-details";
import AdminJobs from "@/pages/admin-jobs";
import Companies from "@/pages/companies";
import Courses from "@/pages/courses";
import CourseDetails from "@/pages/course-details";
import Projects from "@/pages/projects";
import Contact from "@/pages/contact";
import Profile from "@/pages/profile";
import MyApplications from "@/pages/my-applications";
import DeletedPosts from "@/pages/deleted-posts";
import DeletedCompanies from "@/pages/deleted-companies";
import NotFound from "@/pages/not-found";

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              The application encountered an error. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
            {this.state.error && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-500">
                  Error Details
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function Router() {
  const [location] = useLocation();

  // Handle client-side routing for deployment and prevent white page on refresh
  useEffect(() => {
    console.log('🛣️ Current location:', location);
    console.log('🛣️ Window pathname:', window.location.pathname);
    
    // Handle refresh scenarios - redirect to jobs for authenticated users
    const handlePageRefresh = () => {
      const userString = localStorage.getItem('user');
      const isLoggedIn = userString && userString !== 'null' && userString !== 'undefined';
      
      // If user is logged in and on root, redirect to jobs
      if (isLoggedIn && (location === "/" || window.location.pathname === "/")) {
        console.log('🛣️ Redirecting authenticated user to /jobs');
        window.history.replaceState({}, "", "/jobs");
        window.location.reload();
      }
    };
    
    // Check on mount and location changes
    handlePageRefresh();
    
    // Also handle browser back/forward navigation
    const handlePopState = () => {
      setTimeout(handlePageRefresh, 100);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [location]);

  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/jobs" component={Jobs} />
      <Route path="/jobs/:id" component={JobDetails} />
      <Route path="/admin/jobs" component={AdminJobs} />
      <Route path="/companies" component={Companies} />
      <Route path="/courses" component={Courses} />
      <Route path="/courses/:id" component={CourseDetails} />
      <Route path="/projects" component={Projects} />
      <Route path="/contact" component={Contact} />
      <Route path="/profile" component={Profile} />
      <Route path="/my-applications" component={MyApplications} />
      <Route path="/deleted-posts" component={DeletedPosts} />
      <Route path="/deleted-companies" component={DeletedCompanies} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  console.log('🚀 App component rendering...');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
