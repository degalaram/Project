import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Navbar } from '@/components/job-portal/navbar';
import { 
  Trash2, 
  RotateCcw, 
  Calendar, 
  Building, 
  AlertTriangle,
  Clock,
  CheckCircle2,
  Edit
} from 'lucide-react';
import type { InsertCompany } from '@shared/schema';

interface DeletedCompany {
  id: string;
  name: string;
  description?: string;
  website?: string;
  linkedinUrl?: string;
  logo?: string;
  location?: string;
  deletedAt: string;
  originalType: string;
}

function EditDeletedCompanyDialog({ company, children }: { company: DeletedCompany; children: React.ReactNode }) {
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
    setFormData({
      name: company.name,
      description: company.description || '',
      website: company.website || '',
      linkedinUrl: company.linkedinUrl || '',
      logo: company.logo || '',
      location: company.location || '',
    });
  }, [company, open]);

  const updateCompanyMutation = useMutation({
    mutationFn: async (data: InsertCompany) => {
      const response = await apiRequest('PUT', `/api/deleted-companies/${company.id}`, data);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update company: ${errorText}`);
      }
      return response.json();
    },
    onSuccess: (updatedCompany) => {
      toast({
        title: 'Company updated successfully',
        description: 'The deleted company details have been updated.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/deleted-companies'] });
      setOpen(false);
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
    updateCompanyMutation.mutate(formData);
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
          <DialogTitle>Edit Deleted Company</DialogTitle>
          <DialogDescription>
            Update the company details. Note: This company is in trash and will be permanently deleted in {getDaysRemaining(company.deletedAt)} days.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-deleted-company-name">Company Name *</Label>
            <Input
              id="edit-deleted-company-name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter company name"
              required
              data-testid="edit-deleted-company-name-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-deleted-company-description">Description</Label>
            <Textarea
              id="edit-deleted-company-description"
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Company description"
              className="min-h-20"
              data-testid="edit-deleted-company-description-textarea"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-deleted-company-website">Website</Label>
            <Input
              id="edit-deleted-company-website"
              value={formData.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://company.com"
              data-testid="edit-deleted-company-website-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-deleted-company-linkedin">LinkedIn URL</Label>
            <Input
              id="edit-deleted-company-linkedin"
              value={formData.linkedinUrl || ''}
              onChange={(e) => handleChange('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/company/..."
              data-testid="edit-deleted-company-linkedin-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-deleted-company-location">Location</Label>
            <Input
              id="edit-deleted-company-location"
              value={formData.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="City, Country"
              data-testid="edit-deleted-company-location-input"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              data-testid="cancel-edit-deleted-company-button"
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateCompanyMutation.isPending}
              data-testid="update-deleted-company-button"
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

// Calculate days remaining
const getDaysRemaining = (deletedAt: string) => {
  const deletedDate = new Date(deletedAt);
  const expiryDate = new Date(deletedDate.getTime() + 7 * 24 * 60 * 60 * 1000); // Add 7 days
  const now = new Date();
  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

export default function DeletedCompanies() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch deleted companies
  const { data: deletedCompanies = [], isLoading } = useQuery<DeletedCompany[]>({
    queryKey: ['/api/deleted-companies'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Restore company mutation
  const restoreCompanyMutation = useMutation({
    mutationFn: async (companyId: string) => {
      const response = await apiRequest('POST', `/api/deleted-companies/${companyId}/restore`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Company restored',
        description: 'The company has been restored successfully.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/deleted-companies'] });
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
    },
    onError: (error) => {
      toast({
        title: 'Failed to restore company',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Permanently delete company mutation
  const permanentDeleteMutation = useMutation({
    mutationFn: async (companyId: string) => {
      const response = await apiRequest('DELETE', `/api/deleted-companies/${companyId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Company permanently deleted',
        description: 'The company has been permanently removed from the system.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/deleted-companies'] });
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete company',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Filter companies that haven't expired yet
  const activeDeletedCompanies = deletedCompanies.filter(company => getDaysRemaining(company.deletedAt) > 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading deleted companies...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Deleted Companies</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Companies are kept here for 7 days before permanent deletion. You can restore them during this period.
          </p>
        </div>

        {/* Warning Banner */}
        <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-amber-800 dark:text-amber-300 font-medium">
                  Companies will be permanently deleted after 7 days
                </p>
                <p className="text-amber-700 dark:text-amber-400 text-sm">
                  Use the restore option to bring back any company you need before it's permanently removed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deleted Companies List */}
        {activeDeletedCompanies.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <CheckCircle2 className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No deleted companies</h3>
              <p className="text-gray-600 dark:text-gray-400">
                There are no companies in the trash. All companies are active or have been permanently removed.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeDeletedCompanies.map((company) => {
              const daysRemaining = getDaysRemaining(company.deletedAt);
              const isUrgent = daysRemaining <= 2;

              return (
                <Card 
                  key={company.id} 
                  className={`hover:shadow-lg transition-all duration-200 ${
                    isUrgent ? 'border-red-200 dark:border-red-800' : ''
                  }`}
                  data-testid={`deleted-company-card-${company.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          <Building className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                            {company.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{company.location}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={isUrgent ? "destructive" : "secondary"}
                        className="flex items-center space-x-1"
                      >
                        <Clock className="w-3 h-3" />
                        <span>{daysRemaining}d left</span>
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <CardDescription className="mb-4 line-clamp-3">
                      {company.description || 'No description available'}
                    </CardDescription>

                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>Deleted: {new Date(company.deletedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => restoreCompanyMutation.mutate(company.id)}
                        disabled={restoreCompanyMutation.isPending}
                        className="flex-1"
                        data-testid={`restore-company-${company.id}`}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Restore
                      </Button>
                      <EditDeletedCompanyDialog company={company}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                          data-testid={`edit-deleted-company-${company.id}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </EditDeletedCompanyDialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to permanently delete this company? This action cannot be undone.')) {
                            permanentDeleteMutation.mutate(company.id);
                          }
                        }}
                        disabled={permanentDeleteMutation.isPending}
                        data-testid={`permanent-delete-company-${company.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
