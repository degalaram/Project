import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Navbar } from '@/components/job-portal/navbar';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Building, 
  Trash2,
  ExternalLink,
  Calendar,
  CheckCircle
} from 'lucide-react';

export default function MyApplications() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [user, setUser] = useState<any>({});

  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['/api/applications/user', user.id],
    enabled: !!user.id,
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ['/api/jobs'],
  });

  const removeApplicationMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      const response = await apiRequest('DELETE', `/api/applications/${applicationId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/applications/user', user.id] });
      toast({
        title: 'Application removed',
        description: 'Your job application has been removed successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Remove failed',
        description: error.message || 'Failed to remove application',
        variant: 'destructive',
      });
    },
  });

  // Get job details for each application
  const applicationsWithJobs = Array.isArray(applications) ? applications.map((app: any) => {
    const job = Array.isArray(jobs) ? jobs.find((j: any) => j.id === app.jobId) : null;
    return { ...app, job };
  }).filter(app => app.job) : [];

  const handleRemoveApplication = (applicationId: string) => {
    if (window.confirm('Are you sure you want to remove this application?')) {
      removeApplicationMutation.mutate(applicationId);
    }
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
              <p className="text-gray-600 mt-2">Track and manage your job applications</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{applicationsWithJobs.length}</div>
              <div className="text-sm text-gray-600">Total Applications</div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {applicationsWithJobs.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Briefcase className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Applications Yet</h3>
                <p className="text-gray-600 mb-6">
                  You haven't applied to any jobs yet. Start exploring opportunities and apply to jobs that match your skills.
                </p>
                <Button onClick={() => navigate('/jobs')} data-testid="browse-jobs-button">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Browse Jobs
                </Button>
              </CardContent>
            </Card>
          ) : (
            applicationsWithJobs.map((application: any) => {
              const { job } = application;
              const appliedDate = new Date(application.createdAt || application.appliedAt);
              const isExpired = new Date(job.closingDate) < new Date();
              
              return (
                <Card 
                  key={application.id} 
                  className="w-full hover:shadow-md transition-shadow"
                  data-testid={`application-card-${application.id}`}
                >
                  <CardHeader className="pb-3">
                    {/* Title and Status Row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 leading-tight flex-1">
                        {job.title}
                      </CardTitle>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Badge className="bg-green-500 text-white text-xs px-2 py-1">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Applied
                        </Badge>
                        {isExpired && (
                          <Badge variant="destructive" className="text-xs px-2 py-1">Expired</Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Company Info Row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Building className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <span className="font-medium text-gray-900 truncate">{job.company.name}</span>
                      </div>
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
                        <img 
                          src={job.company.logo || '/api/placeholder/40/40'} 
                          alt={job.company.name}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling!.textContent = job.company.name.charAt(0).toUpperCase();
                          }}
                        />
                        <span className="hidden text-sm font-semibold text-gray-600"></span>
                      </div>
                    </div>
                    
                    {/* Location and Applied Date */}
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span>Applied: {appliedDate.toLocaleDateString('en-GB')}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 space-y-3">
                    {/* Salary and Closing Date */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-green-600">{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>Closes: {new Date(job.closingDate).toLocaleDateString('en-GB')}</span>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <CardDescription className="text-sm leading-relaxed">
                      {job.description.length > 120 
                        ? `${job.description.substring(0, 120)}...` 
                        : job.description
                      }
                    </CardDescription>
                    
                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills.split(',').slice(0, 5).map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
                          {skill.trim()}
                        </Badge>
                      ))}
                      {job.skills.split(',').length > 5 && (
                        <Badge variant="outline" className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 border-gray-200">
                          +{job.skills.split(',').length - 5}
                        </Badge>
                      )}
                    </div>
                    
                    <Separator className="my-3" />
                    
                    {/* Status and Actions */}
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600 text-center sm:text-left">
                        Application Status: <span className="text-green-600 font-medium">Submitted</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewJob(job.id)}
                          data-testid={`view-job-${application.id}`}
                          className="flex-1 text-xs h-8"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Job
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveApplication(application.id)}
                          disabled={removeApplicationMutation.isPending}
                          data-testid={`remove-application-${application.id}`}
                          className="flex-1 text-xs h-8"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
