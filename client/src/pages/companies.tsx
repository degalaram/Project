import { useState, useEffect } from 'react';
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
import { Plus, Building, Globe, Linkedin, MapPin, Trash2, Edit, Eye } from 'lucide-react';
import type { InsertCompany, Company } from '@shared/schema';
import { getCompanyLogoFromUrl } from '@/utils/skillImages';

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
      queryClient.invalidateQueries({ queryKey: ['companies'] });
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
    
    // Auto-populate logo based on company details
    const updatedFormData = {
      ...formData,
      logo: getCompanyLogoFromUrl(formData.website, formData.linkedinUrl, formData.name) || formData.logo
    };
    
    createCompanyMutation.mutate(updatedFormData);
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
      <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
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

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              data-testid="cancel-company-button"
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createCompanyMutation.isPending}
              data-testid="create-company-button"
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {createCompanyMutation.isPending ? 'Adding...' : 'Add Company'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditCompanyDialog({ company, children }: { company: Company; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<InsertCompany>({
    name: company.name,
    description: company.description || '',
    website: company.website || '',
    linkedinUrl: company.linkedinUrl || '',
    logo: company.logo || '',
    location: company.location || '',
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Reset form data when dialog opens or company changes
  useEffect(() => {
    if (open) {
      setFormData({
        name: company.name,
        description: company.description || '',
        website: company.website || '',
        linkedinUrl: company.linkedinUrl || '',
        logo: company.logo || '',
        location: company.location || '',
      });
    }
  }, [company, open]);

  const updateCompanyMutation = useMutation({
    mutationFn: async (data: InsertCompany) => {
      const response = await apiRequest('PUT', `/api/companies/${company.id}`, data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update company');
      }
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: 'Company updated successfully',
        description: `${formData.name} has been updated successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setOpen(false);
      // Reset form data to prevent stale data
      setFormData({
        name: '',
        description: '',
        website: '',
        linkedinUrl: '',
        logo: '',
        location: '',
      });
    },
    onError: (error: any) => {
      console.error('Company update error:', error);
      toast({
        title: 'Failed to update company',
        description: error.message || 'An error occurred while updating the company.',
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
    
    // Auto-update logo based on the new company details
    const updatedFormData = {
      ...formData,
      logo: getCompanyLogoFromUrl(formData.website, formData.linkedinUrl, formData.name) || formData.logo
    };
    
    updateCompanyMutation.mutate(updatedFormData);
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
      <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
          <DialogDescription>
            Update the company details in the database.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-company-name">Company Name *</Label>
            <Input
              id="edit-company-name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter company name"
              required
              data-testid="edit-company-name-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-company-description">Description</Label>
            <Textarea
              id="edit-company-description"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Company description"
              className="min-h-20"
              data-testid="edit-company-description-textarea"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-company-website">Website</Label>
            <Input
              id="edit-company-website"
              value={formData.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://company.com"
              data-testid="edit-company-website-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-company-linkedin">LinkedIn URL</Label>
            <Input
              id="edit-company-linkedin"
              value={formData.linkedinUrl || ''}
              onChange={(e) => handleChange('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/company/..."
              data-testid="edit-company-linkedin-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-company-location">Location</Label>
            <Input
              id="edit-company-location"
              value={formData.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="City, Country"
              data-testid="edit-company-location-input"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              data-testid="cancel-edit-company-button"
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateCompanyMutation.isPending}
              data-testid="update-company-button"
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {updateCompanyMutation.isPending ? 'Updating...' : 'Update Company'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Companies() {
  const { data: companies = [], isLoading } = useQuery<Company[]>({
    queryKey: ['companies'],
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchInterval: 5000, // Refresh every 5 seconds for better synchronization
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (companyId: string) => {
      const response = await apiRequest('POST', `/api/companies/${companyId}/soft-delete`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete company: ${errorText}`);
      }
      return response.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      queryClient.invalidateQueries({ queryKey: ['deleted-companies'] });
      toast({
        title: "Company moved to trash",
        description: "The company has been moved to deleted companies. You can restore it within 7 days.",
      });
    },
    onError: (error: any) => {
      console.error('Company delete error:', error);
      toast({
        title: "Failed to delete company",
        description: error.message || 'An error occurred while deleting the company.',
        variant: "destructive",
      });
    },
  });

  const getCompanyLogo = (company: Company) => {
    // Use the centralized utility function that properly analyzes URLs
    const dynamicLogo = getCompanyLogoFromUrl(company.website, company.linkedinUrl, company.name);
    
    // If we have a dynamic logo that's different from stored logo, prefer the dynamic one
    if (dynamicLogo && company.logo !== dynamicLogo) {
      return dynamicLogo;
    }
    
    // Otherwise use stored logo or fall back to dynamic logo
    return company.logo || dynamicLogo;
  };

  const handleDeleteCompany = (companyId: string, companyName: string) => {
    if (window.confirm(`Are you sure you want to move ${companyName} to trash? You can restore it from deleted companies within 7 days.`)) {
      deleteMutation.mutate(companyId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
            <div className="w-full sm:w-auto">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">Companies</h1>
              <p className="text-sm sm:text-base text-gray-600">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="h-4 sm:h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-2 sm:h-3 bg-gray-200 rounded"></div>
                    <div className="h-2 sm:h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
          <div className="w-full sm:w-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Companies</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {companies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow relative group">
              <CardContent className="p-3 sm:p-4 md:p-6">
                {/* Company Logo and Basic Info */}
                <div className="flex items-start space-x-2 sm:space-x-3 md:space-x-4 mb-3 sm:mb-4">
                  {/* Company Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-white border-2 rounded-lg flex items-center justify-center shadow-sm">
                      {company.logo || getCompanyLogo(company) ? (
                        <img 
                          src={company.logo || getCompanyLogo(company)!} 
                          alt={company.name}
                          className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 object-contain rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center"><span class="text-xs sm:text-sm md:text-lg font-bold text-blue-600">${company.name.charAt(0).toUpperCase()}</span></div>`;
                            }
                          }}
                        />
                      ) : (
                        <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs sm:text-sm md:text-lg font-bold text-blue-600">{company.name.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                      {company.name}
                    </h3>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-2">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{company.location || 'Location not specified'}</span>
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-2">
                      {company.description ? 
                        (company.description.length > 80 
                          ? `${company.description.substring(0, 80)}...` 
                          : company.description) 
                        : 'A leading global professional services company'
                      }
                    </div>
                  </div>
                </div>

                {/* 4 Centered Icons */}
                <div className="flex items-center justify-center pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2 md:space-x-3">
                    {/* Website Icon */}
                    {company.website ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 p-0 hover:bg-blue-50 hover:border-blue-300"
                        asChild
                        data-testid={`company-website-${company.id}`}
                      >
                        <a 
                          href={company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="Website"
                        >
                          <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                        </a>
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 p-0 opacity-50 cursor-not-allowed"
                        disabled
                        title="Website not available"
                      >
                        <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    )}

                    {/* LinkedIn Icon */}
                    {company.linkedinUrl ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 p-0 hover:bg-blue-50 hover:border-blue-300"
                        asChild
                        data-testid={`company-linkedin-${company.id}`}
                      >
                        <a 
                          href={company.linkedinUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="LinkedIn"
                        >
                          <Linkedin className="w-3 h-3 sm:w-4 sm:h-4" />
                        </a>
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 p-0 opacity-50 cursor-not-allowed"
                        disabled
                        title="LinkedIn not available"
                      >
                        <Linkedin className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    )}

                    {/* Edit Icon */}
                    <EditCompanyDialog company={company}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 p-0 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                        data-testid={`edit-company-${company.id}`}
                        title="Edit Company"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </EditCompanyDialog>

                    {/* Delete Icon */}
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 p-0 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                      onClick={() => handleDeleteCompany(company.id, company.name)}
                      disabled={deleteMutation.isPending}
                      data-testid={`delete-company-${company.id}`}
                      title="Delete Company"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!isLoading && companies.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <Building className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">No companies yet</h3>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4">
              Start by adding your first company to the database.
            </p>
            <AddCompanyDialog>
              <Button data-testid="add-first-company-button" className="w-full sm:w-auto">
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
