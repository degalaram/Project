import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Navbar } from '@/components/job-portal/navbar';
import { 
  ArrowLeft, 
  Building, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Calendar,
  ExternalLink,
  Linkedin,
  Globe,
  CheckCircle,
  BookOpen,
  Award,
  Target
} from 'lucide-react';
import type { Job, Company } from '@shared/schema';
import { getSkillImage } from '@/utils/skillImages';

type JobWithCompany = Job & { company: Company };

export default function JobDetails() {
  const [, navigate] = useLocation();
  const [, params] = useRoute('/jobs/:id');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [hasApplied, setHasApplied] = useState(false);
  const [pendingApplication, setPendingApplication] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    if (!user.id) {
      navigate('/login');
    }
  }, [navigate, user.id]);


  const { data: job, isLoading } = useQuery<JobWithCompany>({
    queryKey: ['jobs', params?.id],
    enabled: !!params?.id,
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['applications/user', user.id],
    enabled: !!user.id,
  });

  useEffect(() => {
    if (job && Array.isArray(applications) && applications.length > 0) {
      const applied = applications.some((app: any) => app.jobId === job.id);
      setHasApplied(applied);
    }
  }, [job, applications]);

  const applyMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/applications', {
        userId: user.id,
        jobId: job!.id,
      });
      return response.json();
    },
    onSuccess: () => {
      setHasApplied(true);
      queryClient.invalidateQueries({ queryKey: ['applications/user', user.id] });
      toast({
        title: 'Applied Successfully!',
        description: 'Your application has been submitted successfully. You can track it in My Applications.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Application failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Handle window focus to detect return from external tab
  useEffect(() => {
    const handleFocus = () => {
      if (pendingApplication && !hasApplied) {
        // Track application when user returns
        applyMutation.mutate();
        setPendingApplication(false);
        setShowSuccess(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [pendingApplication, hasApplied, applyMutation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Job not found</h3>
              <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate('/jobs')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isExpired = new Date(job.closingDate) < new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/jobs')}
          className="mb-6"
          data-testid="back-to-jobs"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>

        {/* Job Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl lg:text-3xl mb-4">{job.title}</CardTitle>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center">
                    <Building className="w-5 h-5 mr-3 text-gray-500" />
                    <span className="text-lg font-medium">{job.company.name}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                    <span>{job.location}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-3 text-gray-500" />
                    <span>{job.salary}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant={job.experienceLevel === 'fresher' ? 'default' : 'secondary'}>
                    {job.experienceLevel === 'fresher' ? 'Fresher Position' : 'Experienced Position'}
                  </Badge>
                  <Badge variant="outline">{job.jobType}</Badge>
                  {job.batchEligible && (
                    <Badge variant="outline">Batch: {job.batchEligible}</Badge>
                  )}
                  {isExpired && <Badge variant="destructive">Expired</Badge>}
                </div>
              </div>
              
              <div className="lg:ml-8 mt-4 lg:mt-0">
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm">Experience: {job.experienceMin}-{job.experienceMax} years</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm">
                      Posted: {new Date(job.createdAt || new Date()).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-orange-600" />
                    <span className="text-sm">
                      Closes: {new Date(job.closingDate).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{job.description}</p>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {job.requirements.split(',').map((req, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 mr-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req.trim()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Qualifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Qualifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{job.qualifications}</p>
              </CardContent>
            </Card>

            {/* Skills Required */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Required</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.skills.split(',').map((skill, index) => {
                    const trimmedSkill = skill.trim();
                    const skillImage = getSkillImage(trimmedSkill);
                    return (
                      <Badge key={index} variant="secondary" className="text-sm flex items-center gap-2 px-3 py-1">
                        {skillImage && (
                          <img 
                            src={skillImage} 
                            alt={trimmedSkill}
                            className="w-4 h-4 object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        {trimmedSkill}
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Section */}
            <Card>
              <CardHeader>
                <CardTitle>Apply for this Job</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hasApplied ? (
                  <div className="text-center py-4">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <p className="text-green-600 font-medium">Application Submitted</p>
                    <p className="text-sm text-gray-600">Your application has been submitted successfully.</p>
                  </div>
                ) : isExpired ? (
                  <div className="text-center py-4">
                    <Clock className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <p className="text-red-600 font-medium">Application Closed</p>
                    <p className="text-sm text-gray-600">The application deadline has passed.</p>
                  </div>
                ) : showSuccess ? (
                  <div className="text-center p-4 space-y-3">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                    <p className="text-green-600 font-medium">Applied Successfully!</p>
                    <p className="text-sm text-gray-600">Your application has been submitted.</p>
                  </div>
                ) : (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => {
                      // Open job application URL in new tab
                      if (job.applyUrl) {
                        window.open(job.applyUrl, '_blank');
                        setPendingApplication(true);
                      } else {
                        // If no external URL, track application immediately
                        applyMutation.mutate();
                      }
                    }}
                    disabled={applyMutation.isPending || pendingApplication}
                    data-testid="apply-now-button"
                  >
                    {pendingApplication ? 'Redirected...' : applyMutation.isPending ? 'Applying...' : 'Apply Now'}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>About {job.company.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Company Logo */}
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center border shadow-sm">
                    <img 
                      src={job.company.logo || '/api/placeholder/80/80'} 
                      alt={job.company.name}
                      className="w-18 h-18 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling!.textContent = job.company.name.charAt(0).toUpperCase();
                      }}
                    />
                    <span className="hidden text-2xl font-semibold text-gray-600"></span>
                  </div>
                </div>
                
                {job.company.description && (
                  <p className="text-sm text-gray-700">{job.company.description}</p>
                )}
                
                <Separator />
                
                <div className="space-y-3">
                  {job.company.website && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => window.open(job.company.website!, '_blank')}
                      data-testid="company-website"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Visit Website
                    </Button>
                  )}
                  
                  {job.company.linkedinUrl && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => window.open(job.company.linkedinUrl!, '_blank')}
                      data-testid="company-linkedin"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
