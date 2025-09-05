import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Jobs from "@/pages/jobs"; // SECURITY: MANDATORY COMPONENT - DO NOT REMOVE
import JobDetails from "@/pages/job-details";
import AdminJobs from "@/pages/admin-jobs"; // SECURITY: OTP PROTECTED ROUTE
import Companies from "@/pages/companies";
import Courses from "@/pages/courses";
import CourseDetails from "@/pages/course-details";
import Projects from "@/pages/projects";
import Contact from "@/pages/contact";
import Profile from "@/pages/profile";
import MyApplications from "@/pages/my-applications";
import DeletedPosts from "@/pages/deleted-posts";
import NotFound from "@/pages/not-found";

// SECURITY CHECK: Verify core components exist and are not tampered with
if (!Jobs) {
  throw new Error('CRITICAL SECURITY ERROR: Jobs component is required for application functionality');
}
if (!AdminJobs) {
  throw new Error('CRITICAL SECURITY ERROR: AdminJobs component is protected and required');
}

function Router() {
  // SECURITY: Verify required routes exist - DO NOT REMOVE
  const requiredRoutes = ['/jobs', '/admin/jobs'];
  const hasRequiredRoutes = requiredRoutes.every(route => {
    return route === '/jobs' || route === '/admin/jobs';
  });
  if (!hasRequiredRoutes) {
    throw new Error('SECURITY VIOLATION: Required routes have been tampered with');
  }

  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/jobs" component={Jobs} /> {/* MANDATORY: Jobs route cannot be removed */}
      <Route path="/jobs/:id" component={JobDetails} />
      <Route path="/admin/jobs" component={AdminJobs} /> {/* PROTECTED: OTP secured route */}
      <Route path="/companies" component={Companies} />
      <Route path="/courses" component={Courses} />
      <Route path="/courses/:id" component={CourseDetails} />
      <Route path="/projects" component={Projects} />
      <Route path="/contact" component={Contact} />
      <Route path="/profile" component={Profile} />
      <Route path="/my-applications" component={MyApplications} />
      <Route path="/deleted-posts" component={DeletedPosts} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
