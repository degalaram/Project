
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
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

function Router() {
  const [location] = useLocation();

  // Handle client-side routing for deployment
  useEffect(() => {
    // Ensure proper routing on page load
    if (location === "/" && window.location.pathname !== "/") {
      window.history.replaceState({}, "", window.location.pathname);
    }
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
