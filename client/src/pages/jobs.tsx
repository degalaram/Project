
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Navbar } from '@/components/job-portal/navbar';
import {
  Search,
  MapPin,
  Users,
  Calendar,
  CheckCircle,
  Eye,
  Linkedin,
  Mail,
  Youtube,
  X,
  Trash2,
  Instagram
} from 'lucide-react';
import { FaWhatsapp, FaTelegram } from 'react-icons/fa';
import type { Job, Company } from '@shared/schema';

type JobWithCompany = Job & { company: Company };

// Footer component updated to display "Ram Job Portal 2025 All rights reserved"
const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Ram Job Portal</h3>
            <p className="text-gray-300 mb-4">
              Your gateway to amazing career opportunities. Connect with top companies and find your dream job.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/jobs" className="text-gray-300 hover:text-white transition-colors">Browse Jobs</a></li>
              <li><a href="/companies" className="text-gray-300 hover:text-white transition-colors">Companies</a></li>
              <li><a href="/courses" className="text-gray-300 hover:text-white transition-colors">Courses</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Social Media & Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center md:text-left">Connect With Us</h3>
            <div className="flex justify-center md:justify-start space-x-4 mb-4">
              <a
                href="https://www.linkedin.com/in/ramdegala/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#0077B5] hover:bg-[#005A8D] rounded-full transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a
                href="mailto:ramdegala9@gmail.com"
                className="p-2 bg-[#EA4335] hover:bg-[#C53929] rounded-full transition-colors"
                title="Gmail"
              >
                <Mail className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.youtube.com/@yourchannel" // Replace with actual YouTube URL
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#FF0000] hover:bg-[#CC0000] rounded-full transition-colors"
                title="YouTube"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.twitter.com/yourhandle" // Replace with actual Twitter URL
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#1DA1F2] hover:bg-[#1488D8] rounded-full transition-colors"
                title="Twitter"
              >
                <X className="w-5 h-5 text-white" />
              </a>
            </div>
            <p className="text-gray-300 text-sm text-center md:text-left">
              Email: ramdegala9@gmail.com
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 mt-8 text-center">
          <p className="text-gray-400">&copy; 2025 Ram Job Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};


  const getCompanyLogo = (company: Company) => {
    const name = company.name.toLowerCase();

    // First, check if company already has a logo URL
    if (company.logo && company.logo.trim()) {
      return company.logo;
    }

    // Major tech companies with specific logo mappings
    const companyLogos = {
      'accenture': 'https://logo.clearbit.com/accenture.com',
      'tcs': 'https://logo.clearbit.com/tcs.com',
      'tata consultancy': 'https://logo.clearbit.com/tcs.com',
      'infosys': 'https://logo.clearbit.com/infosys.com',
      'hcl': 'https://logo.clearbit.com/hcltech.com',
      'hcl technologies': 'https://logo.clearbit.com/hcltech.com',
      'wipro': 'https://logo.clearbit.com/wipro.com',
      'cognizant': 'https://logo.clearbit.com/cognizant.com',
      'capgemini': 'https://logo.clearbit.com/capgemini.com',
      'microsoft': 'https://logo.clearbit.com/microsoft.com',
      'google': 'https://logo.clearbit.com/google.com',
      'alphabet': 'https://logo.clearbit.com/google.com',
      'amazon': 'https://logo.clearbit.com/amazon.com',
      'oracle': 'https://logo.clearbit.com/oracle.com',
      'ibm': 'https://logo.clearbit.com/ibm.com',
      'adobe': 'https://logo.clearbit.com/adobe.com',
      'salesforce': 'https://logo.clearbit.com/salesforce.com',
      'intel': 'https://logo.clearbit.com/intel.com',
      'nvidia': 'https://logo.clearbit.com/nvidia.com',
      'cisco': 'https://logo.clearbit.com/cisco.com',
      'apple': 'https://logo.clearbit.com/apple.com',
      'facebook': 'https://logo.clearbit.com/facebook.com',
      'meta': 'https://logo.clearbit.com/meta.com',
      'netflix': 'https://logo.clearbit.com/netflix.com',
      'uber': 'https://logo.clearbit.com/uber.com',
      'airbnb': 'https://logo.clearbit.com/airbnb.com',
      'spotify': 'https://logo.clearbit.com/spotify.com',
      'twitter': 'https://logo.clearbit.com/twitter.com',
      'linkedin': 'https://logo.clearbit.com/linkedin.com',
      'paypal': 'https://logo.clearbit.com/paypal.com',
      'tesla': 'https://logo.clearbit.com/tesla.com',
      'adp': 'https://logo.clearbit.com/adp.com',
      'honeywell': 'https://logo.clearbit.com/honeywell.com',
      'zoho': 'https://logo.clearbit.com/zoho.com',
      'freshworks': 'https://logo.clearbit.com/freshworks.com',
      'byju': 'https://logo.clearbit.com/byjus.com',
      'flipkart': 'https://logo.clearbit.com/flipkart.com',
      'paytm': 'https://logo.clearbit.com/paytm.com',
      'ola': 'https://logo.clearbit.com/olacabs.com',
      'swiggy': 'https://logo.clearbit.com/swiggy.com',
      'zomato': 'https://logo.clearbit.com/zomato.com'
    };

    // Check for exact company name matches
    for (const [key, logoUrl] of Object.entries(companyLogos)) {
      if (name.includes(key)) {
        return logoUrl;
      }
    }

    // Try to extract domain from LinkedIn URL first (often more reliable)
    if (company.linkedinUrl && company.linkedinUrl.trim()) {
      try {
        const linkedinUrl = new URL(company.linkedinUrl);
        const pathParts = linkedinUrl.pathname.split('/');
        const companySlug = pathParts[pathParts.indexOf('company') + 1];

        if (companySlug && companySlug !== 'company') {
          // Try common domain patterns based on LinkedIn company slug
          const possibleDomains = [
            `${companySlug}.com`,
            `${companySlug}.co`,
            `${companySlug}.in`,
            `${companySlug}.org`
          ];

          // Return the first potential logo URL
          return `https://logo.clearbit.com/${possibleDomains[0]}`;
        }
      } catch (error) {
        console.log('Error parsing LinkedIn URL:', error);
      }
    }

    // Try to fetch logo from company website
    if (company.website && company.website.trim()) {
      try {
        const domain = new URL(company.website).hostname.replace('www.', '');
        return `https://logo.clearbit.com/${domain}`;
      } catch (error) {
        console.log('Error parsing website URL:', error);
      }
    }

    // Fallback: try to generate domain from company name
    const cleanName = name
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '')
      .toLowerCase();

    if (cleanName.length > 2) {
      return `https://logo.clearbit.com/${cleanName}.com`;
    }

    return null;
  };



const getExperienceBadgeColor = (level: string) => {
  switch (level) {
    case 'fresher': return 'bg-green-500 text-white';
    case 'experienced': return 'bg-blue-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

export default function Jobs() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  const [user, setUser] = useState<any>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = () => {
      try {
        const userString = localStorage.getItem('user');
        if (!userString || userString === 'null' || userString === 'undefined') {
          console.log('User not found in localStorage, redirecting to login');
          navigate('/login');
          return;
        }
        
        const parsedUser = JSON.parse(userString);
        if (!parsedUser || !parsedUser.id) {
          console.log('Invalid user data, redirecting to login');
          navigate('/login');
          return;
        }
        
        setUser(parsedUser);
        setIsAuthChecked(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const { data: allJobs = [], isLoading, error: jobsError, refetch } = useQuery({
    queryKey: ['jobs', user?.id],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      
      if (user?.id) {
        headers['user-id'] = user.id;
      }
      
      const response = await apiRequest('GET', '/api/jobs', undefined, headers);
      return response.json();
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: isAuthChecked && !!user?.id,
  });

  // Refetch jobs when component mounts or tab becomes active
  useEffect(() => {
    if (isAuthChecked && user?.id) {
      refetch();
    }
  }, [refetch, isAuthChecked, user?.id]);

  const { data: applications = [] } = useQuery({
    queryKey: ['applications/user', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await apiRequest('GET', `/api/applications/user/${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      return response.json();
    },
    enabled: isAuthChecked && !!user?.id,
    staleTime: 0,
    retry: 3,
  });

  useEffect(() => {
    console.log('Applications data updated:', applications);
    if (Array.isArray(applications) && applications.length > 0) {
      const appliedJobIds = applications.map((app: any) => app.jobId);
      console.log('Setting applied job IDs:', appliedJobIds);
      setAppliedJobs(appliedJobIds);
    } else {
      console.log('No applications found, resetting applied jobs');
      setAppliedJobs([]);
    }
  }, [applications]);

  // Application mutation - MOVED TO TOP TO FIX HOOKS VIOLATION
  const applyMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await apiRequest('POST', '/api/applications', {
        userId: user?.id,
        jobId: jobId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications/user', user?.id] });
      toast({
        title: 'Application submitted!',
        description: 'Your job application has been submitted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Application failed',
        description: error.message || 'Failed to submit application',
        variant: 'destructive',
      });
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: async ({ jobId, userId }: { jobId: string; userId: string }) => {
      if (!userId) {
        throw new Error('User not logged in');
      }

      // Use the correct delete endpoint and send user-id in headers as expected by backend
      const response = await apiRequest('POST', `/api/jobs/${jobId}/delete`, undefined, { 'user-id': userId });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to delete job';

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          console.error('Server returned non-JSON response:', errorText);
          errorMessage = 'Server error occurred';
        }

        throw new Error(errorMessage);
      }

      return response.json();
    },
    onSuccess: () => {
      // Update the UI by invalidating queries (tab already switched)
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['applications/user', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['deleted-posts', user?.id] });
      queryClient.refetchQueries({ queryKey: ['/api/deleted-posts/user', user?.id] });
      
      toast({
        title: 'Job deleted successfully',
        description: 'The job has been moved to deleted posts and can be restored within 5 days.',
      });
    },
    onError: (error: any) => {
      console.error('Delete job error:', error);
      toast({
        title: 'Delete failed',
        description: error.message || 'Failed to delete job',
        variant: 'destructive',
      });
    },
  });

  // Show loading while checking authentication
  if (!isAuthChecked) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if API fails
  if (jobsError && isAuthChecked) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Failed to connect to the server. Please try again later.</p>
            <button 
              onClick={() => refetch()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              data-testid="button-retry"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredJobs = Array.isArray(allJobs) ? allJobs.filter((job: JobWithCompany) => {
    const matchesSearch = searchTerm === '' ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation = locationFilter === '' ||
      job.location.toLowerCase().includes(locationFilter.toLowerCase());

    const now = new Date();
    const closingDate = new Date(job.closingDate);
    const isExpired = closingDate < now;

    switch (activeTab) {
      case 'fresher':
        return matchesSearch && matchesLocation && job.experienceLevel === 'fresher' && !isExpired;
      case 'experienced':
        return matchesSearch && matchesLocation && job.experienceLevel === 'experienced' && !isExpired;
      case 'expired':
        return matchesSearch && matchesLocation && (isExpired || !job.isActive);
      default:
        return matchesSearch && matchesLocation && !isExpired && job.isActive;
    }
  }) : [];


  const handleDeleteJob = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    if (!user || !user.id) {
      navigate('/login');
      return;
    }
    if (window.confirm('Are you sure you want to delete this job? It will be moved to deleted posts and can be restored within 5 days.')) {
      // Perform deletion and let the success handler manage UI updates
      deleteJobMutation.mutate({ jobId, userId: user.id });
    }
  };

  const handleJobClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleApplyJob = (e: React.MouseEvent, job: JobWithCompany) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    // If job has an apply URL, open it in a new tab
    if (job.applyUrl) {
      window.open(job.applyUrl, '_blank');
      // Still track the application internally
      applyMutation.mutate(job.id);
    } else {
      // Fallback to internal application tracking
      applyMutation.mutate(job.id);
    }
  };

  const handleShare = (e: React.MouseEvent, job: JobWithCompany, platform: string) => {
    e.stopPropagation();
    const jobUrl = `${window.location.origin}/jobs/${job.id}`;
    const text = `Check out this job: ${job.title} at ${job.company.name}`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + jobUrl)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(jobUrl)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'instagram':
        // Instagram doesn't have direct link sharing, so copy to clipboard
        navigator.clipboard.writeText(jobUrl);
        alert('Link copied to clipboard! You can paste it on Instagram.');
        break;
      case 'gmail':
        window.location.href = `mailto:?subject=${encodeURIComponent(job.title)}&body=${encodeURIComponent(text + ' ' + jobUrl)}`;
        break;
      default:
        navigator.clipboard.writeText(jobUrl);
        alert('Link copied to clipboard!');
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      {/* Job Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search jobs, companies, skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="search-jobs"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-10"
                  data-testid="search-location"
                />
              </div>
            </div>
            <Button data-testid="search-button">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Job Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile: 2x2 Grid Layout */}
          <div className="block sm:hidden mb-6">
            <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'all' 
                    ? 'bg-primary text-primary-foreground shadow' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                data-testid="tab-all-jobs"
              >
                All Jobs
              </button>
              <button
                onClick={() => setActiveTab('fresher')}
                className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'fresher' 
                    ? 'bg-primary text-primary-foreground shadow' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                data-testid="tab-fresher-jobs"
              >
                Fresher Jobs
              </button>
              <button
                onClick={() => setActiveTab('experienced')}
                className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'experienced' 
                    ? 'bg-primary text-primary-foreground shadow' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                data-testid="tab-experienced-jobs"
              >
                Experienced Jobs
              </button>
              <button
                onClick={() => setActiveTab('expired')}
                className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'expired' 
                    ? 'bg-primary text-primary-foreground shadow' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                data-testid="tab-expired-jobs"
              >
                Expired Jobs
              </button>
            </div>
          </div>

          {/* Desktop: Horizontal Layout */}
          <TabsList className="hidden sm:grid w-full grid-cols-4 mb-4 sm:mb-6 md:mb-8 h-auto p-1">
            <TabsTrigger value="all" data-testid="tab-all-jobs-desktop" className="text-sm px-3 py-2">All Jobs</TabsTrigger>
            <TabsTrigger value="fresher" data-testid="tab-fresher-jobs-desktop" className="text-sm px-3 py-2">Fresher Jobs</TabsTrigger>
            <TabsTrigger value="experienced" data-testid="tab-experienced-jobs-desktop" className="text-sm px-3 py-2">Experienced Jobs</TabsTrigger>
            <TabsTrigger value="expired" data-testid="tab-expired-jobs-desktop" className="text-sm px-3 py-2">Expired Jobs</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {filteredJobs.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-gray-400 mb-4">
                      <Users className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                    <p className="text-gray-600">
                      {activeTab === 'expired'
                        ? 'No expired jobs in your search criteria.'
                        : 'Try adjusting your search criteria or check back later for new opportunities.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredJobs.map((job: JobWithCompany) => {
                  const isApplied = appliedJobs.includes(job.id);
                  const isExpired = new Date(job.closingDate) < new Date();

                  return (
                    <Card
                      key={job.id}
                      className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500 w-full"
                      onClick={() => handleJobClick(job.id)}
                      data-testid={`job-card-${job.id}`}
                    >
                      <CardContent className="p-3 sm:p-4 md:p-6">
                        {/* Header with Company Logos */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-3 flex-1">
                            {/* Left Company Logo */}
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                              {job.company.logo || getCompanyLogo(job.company) ? (
                                <img 
                                  src={job.company.logo || getCompanyLogo(job.company)!} 
                                  alt={job.company.name}
                                  className="w-8 h-8 sm:w-12 sm:h-12 object-contain rounded"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    const parent = target.parentElement;
                                    if (parent) {
                                      parent.innerHTML = `<div class="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center"><span class="text-sm sm:text-lg font-bold text-blue-600">${job.company.name.charAt(0).toUpperCase()}</span></div>`;
                                    }
                                  }}
                                />
                              ) : (
                                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <span className="text-sm sm:text-lg font-bold text-blue-600">{job.company.name.charAt(0).toUpperCase()}</span>
                                </div>
                              )}
                            </div>

                            {/* Job Info */}
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight">
                                {job.title}
                              </CardTitle>
                              <p className="text-blue-600 dark:text-blue-400 font-medium mb-1 text-sm sm:text-base">{job.company.name}</p>
                              <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">
                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                                <span className="truncate">{job.location}</span>
                              </div>
                              <div className="text-green-600 font-semibold text-sm sm:text-base md:text-lg">
                                {job.salary}
                              </div>
                            </div>
                          </div>

                          {/* Right Company Logo - Larger */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ml-4">
                            {job.company.logo || getCompanyLogo(job.company) ? (
                              <img 
                                src={job.company.logo || getCompanyLogo(job.company)!} 
                                alt={job.company.name}
                                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain rounded-lg"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `<div class="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-blue-100 rounded-xl flex items-center justify-center"><span class="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">${job.company.name.charAt(0).toUpperCase()}</span></div>`;
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-blue-100 rounded-xl flex items-center justify-center">
                                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">{job.company.name.charAt(0).toUpperCase()}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Experience & Closing Date - Mobile Optimized */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                            <span>{job.experienceMin}-{job.experienceMax} years</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                            <span>Closes: {new Date(job.closingDate).toLocaleDateString('en-GB')}</span>
                          </div>
                        </div>

                        {/* Skills Section - Mobile Responsive */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                          {job.skills.split(',').slice(0, 4).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                              {skill.trim()}
                            </Badge>
                          ))}
                          {job.skills.split(',').length > 4 && (
                            <Badge variant="outline" className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                              +{job.skills.split(',').length - 4} more
                            </Badge>
                          )}
                        </div>

                        {/* Bottom Section Layout */}
                        <div className="pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            {/* Left Side: Social Media Icons (4 icons) */}
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <button
                                onClick={(e) => handleShare(e, job, 'whatsapp')}
                                className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-gray-700 rounded-full transition-colors"
                                title="Share on WhatsApp"
                                data-testid={`share-whatsapp-${job.id}`}
                              >
                                <FaWhatsapp className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                onClick={(e) => handleShare(e, job, 'telegram')}
                                className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-full transition-colors"
                                title="Share on Telegram"
                                data-testid={`share-telegram-${job.id}`}
                              >
                                <FaTelegram className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                onClick={(e) => handleShare(e, job, 'instagram')}
                                className="p-1 text-pink-600 hover:bg-pink-50 dark:hover:bg-gray-700 rounded-full transition-colors"
                                title="Share on Instagram"
                                data-testid={`share-instagram-${job.id}`}
                              >
                                <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <button
                                onClick={(e) => handleShare(e, job, 'gmail')}
                                className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-full transition-colors"
                                title="Share via Gmail"
                                data-testid={`share-gmail-${job.id}`}
                              >
                                <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>

                            {/* Right Side: Action Buttons */}
                            <div className="flex flex-wrap items-center justify-end gap-1 sm:gap-2 flex-1">
                              {/* Experience Badge */}
                              <Badge className={`${getExperienceBadgeColor(job.experienceLevel)} px-1 sm:px-2 py-0.5 sm:py-1 text-xs font-medium`}>
                                {job.experienceLevel === 'fresher' ? 'Fresher' : 'Experienced'}
                              </Badge>

                              {/* View Details Button */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleJobClick(job.id);
                                }}
                                className="text-xs h-6 sm:h-7 px-1 sm:px-2"
                                data-testid={`view-details-${job.id}`}
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View Details
                              </Button>

                              {/* Apply Button or Applied Status */}
                              {isApplied ? (
                                <div className="flex items-center space-x-1">
                                  <CheckCircle className="w-3 h-3 text-green-600" />
                                  <span className="text-xs text-green-600 font-medium">Applied</span>
                                </div>
                              ) : !isExpired ? (
                                <Button
                                  size="sm"
                                  onClick={(e) => handleApplyJob(e, job)}
                                  className="bg-blue-600 hover:bg-blue-700 text-xs h-6 sm:h-7 px-1 sm:px-2"
                                  data-testid={`apply-now-${job.id}`}
                                >
                                  Apply Now
                                </Button>
                              ) : (
                                <span className="text-xs text-gray-500">Expired</span>
                              )}

                              {/* Delete Button */}
                              {!isExpired && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => handleDeleteJob(e, job.id)}
                                  className="text-xs h-6 sm:h-7 px-1 sm:px-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                                  data-testid={`delete-job-${job.id}`}
                                  title="Delete Job"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
