import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Navbar } from '@/components/job-portal/navbar';
import { Footer } from '@/components/job-portal/footer';
import { Plus, Building, Globe, Linkedin, MapPin, Trash2 } from 'lucide-react';
import type { InsertCompany, Company } from '@shared/schema';

function AddCompanyDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<InsertCompany>({
    name: '',
    description: '',
    website: '',
    linkedinUrl: '',
    logo: '',
    location: '',
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCompanyMutation = useMutation({
    mutationFn: async (data: InsertCompany) => {
      const response = await apiRequest('POST', '/api/companies', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Company added successfully',
        description: 'The company has been added to the database.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
      setOpen(false);
      setFormData({
        name: '',
        description: '',
        website: '',
        linkedinUrl: '',
        logo: '',
        location: '',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to add company',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: 'Please enter company name',
        description: 'Company name is required.',
        variant: 'destructive',
      });
      return;
    }
    createCompanyMutation.mutate(formData);
  };

  const handleChange = (field: keyof InsertCompany, value: string) => {
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
          <DialogDescription>
            Add a new company to the database for job postings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name *</Label>
            <Input
              id="company-name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter company name"
              required
              data-testid="company-name-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-description">Description</Label>
            <Textarea
              id="company-description"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Company description"
              className="min-h-20"
              data-testid="company-description-textarea"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-website">Website</Label>
            <Input
              id="company-website"
              value={formData.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://company.com"
              data-testid="company-website-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-linkedin">LinkedIn URL</Label>
            <Input
              id="company-linkedin"
              value={formData.linkedinUrl || ''}
              onChange={(e) => handleChange('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/company/..."
              data-testid="company-linkedin-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-location">Location</Label>
            <Input
              id="company-location"
              value={formData.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="City, Country"
              data-testid="company-location-input"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              data-testid="cancel-company-button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createCompanyMutation.isPending}
              data-testid="create-company-button"
            >
              {createCompanyMutation.isPending ? 'Adding...' : 'Add Company'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Companies() {
  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ['/api/companies'],
  });

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (companyId: string) => {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete company');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
      toast({
        title: "Company deleted",
        description: "Company has been successfully removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getCompanyLogo = (company: Company) => {
    const name = company.name.toLowerCase();
    
    // Major tech companies with working logos
    if (name.includes('accenture')) return 'https://logo.clearbit.com/accenture.com';
    if (name.includes('tcs') || name.includes('tata consultancy')) return 'https://logo.clearbit.com/tcs.com';
    if (name.includes('infosys')) return 'https://logo.clearbit.com/infosys.com';
    if (name.includes('hcl')) return 'https://logo.clearbit.com/hcltech.com';
    if (name.includes('wipro')) return 'https://logo.clearbit.com/wipro.com';
    if (name.includes('cognizant')) return 'https://logo.clearbit.com/cognizant.com';
    if (name.includes('capgemini')) return 'https://logo.clearbit.com/capgemini.com';
    if (name.includes('microsoft')) return 'https://logo.clearbit.com/microsoft.com';
    if (name.includes('google')) return 'https://logo.clearbit.com/google.com';
    if (name.includes('amazon')) return 'https://logo.clearbit.com/amazon.com';
    if (name.includes('oracle')) return 'https://logo.clearbit.com/oracle.com';
    if (name.includes('ibm')) return 'https://logo.clearbit.com/ibm.com';
    
    // Try to fetch logo from company website
    if (company.website) {
      try {
        const domain = new URL(company.website).hostname.replace('www.', '');
        return `https://logo.clearbit.com/${domain}`;
      } catch {
        return null;
      }
    }
    
    return null;
  };

  const handleDeleteCompany = (companyId: string, companyName: string) => {
    if (window.confirm(`Are you sure you want to delete ${companyName}? This action cannot be undone.`)) {
      deleteMutation.mutate(companyId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Companies</h1>
              <p className="text-gray-600">
                Manage companies for job postings and recruitment.
              </p>
            </div>
            <AddCompanyDialog>
              <Button className="w-full sm:w-auto" data-testid="add-company-button">
                <Plus className="w-4 h-4 mr-2" />
                Add Company
              </Button>
            </AddCompanyDialog>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4 md:p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        {/* Footer */}
        <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Company Info */}
              <div>
                <h3 className="text-xl font-bold mb-4">JobPortal</h3>
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
                <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
                <div className="flex space-x-4 mb-4">
                  <a 
                    href="https://www.linkedin.com/in/ramdegala/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                    title="LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"/>
                    </svg>
                  </a>
                  <a 
                    href="mailto:ramdegala9@gmail.com"
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                    title="Gmail"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://youtube.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                    title="YouTube"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                  </a>
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-colors"
                    title="Twitter"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/>
                    </svg>
                  </a>
                </div>
                <p className="text-gray-300 text-sm">
                  Email: ramdegala9@gmail.com
                </p>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-8 mt-8 text-center">
              <p className="text-gray-400">&copy; 2025 Ram Job Portal. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Companies</h1>
            <p className="text-gray-600">
              Manage companies for job postings and recruitment.
            </p>
          </div>

          <AddCompanyDialog>
            <Button className="w-full sm:w-auto" data-testid="add-company-button">
              <Plus className="w-4 h-4 mr-2" />
              <span className="text-blue-500">Add Jobs</span>
            </Button>
          </AddCompanyDialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {companies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white dark:bg-white border rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm company-logo-container">
                      {company.logo || getCompanyLogo(company) ? (
                        <img 
                          src={company.logo || getCompanyLogo(company)!} 
                          alt={company.name}
                          className="w-10 h-10 md:w-14 md:h-14 object-contain rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><span class="text-lg font-bold text-blue-600">${company.name.charAt(0).toUpperCase()}</span></div>`;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-lg font-bold text-blue-600">{company.name.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base md:text-lg">{company.name}</CardTitle>
                      {company.location && (
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {company.location}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCompany(company.id, company.name)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Delete Company"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {company.description && (
                  <CardDescription className="text-sm mb-4 line-clamp-3">
                    {company.description}
                  </CardDescription>
                )}

                <div className="flex flex-wrap gap-2">
                  {company.website && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-xs"
                      data-testid={`company-website-${company.id}`}
                    >
                      <a href={company.website} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-3 h-3 mr-1" />
                        Website
                      </a>
                    </Button>
                  )}

                  {company.linkedinUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-xs"
                      data-testid={`company-linkedin-${company.id}`}
                    >
                      <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-3 h-3 mr-1" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!isLoading && companies.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No companies yet</h3>
            <p className="text-gray-500 mb-4">
              Start by adding your first company to the database.
            </p>
            <AddCompanyDialog>
              <Button data-testid="add-first-company-button">
                <Plus className="w-4 h-4 mr-2" />
                Add First Company
              </Button>
            </AddCompanyDialog>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}