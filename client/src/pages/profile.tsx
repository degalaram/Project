import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Navbar } from '@/components/job-portal/navbar';
import { 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Edit,
  Save,
  X
} from 'lucide-react';

export default function Profile() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [user, setUser] = useState<any>({});
  const [editMode, setEditMode] = useState({
    name: false,
    phone: false,
    email: false,
    password: false
  });
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    currentPassword: '',
    newPassword: ''
  });

  // Check if user is logged in and load data
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setFormData({
      fullName: parsedUser.fullName || '',
      phone: parsedUser.phone || '',
      email: parsedUser.email || '',
      currentPassword: '',
      newPassword: ''
    });
  }, [navigate]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('PATCH', `/api/users/${user.id}`, data);
      return response.json();
    },
    onSuccess: (updatedUser) => {
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Close edit mode
      setEditMode({
        name: false,
        phone: false,
        email: false,
        password: false
      });
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    },
  });

  const handleEdit = (field: string) => {
    setEditMode(prev => ({ ...prev, [field]: true }));
  };

  const handleCancel = (field: string) => {
    setEditMode(prev => ({ ...prev, [field]: false }));
    // Reset form data
    setFormData(prev => ({
      ...prev,
      fullName: user.fullName || '',
      phone: user.phone || '',
      email: user.email || '',
      currentPassword: '',
      newPassword: ''
    }));
  };

  const handleSave = (field: string) => {
    let updateData: any = {};
    
    switch (field) {
      case 'name':
        updateData = { fullName: formData.fullName };
        break;
      case 'phone':
        updateData = { phone: formData.phone };
        break;
      case 'email':
        updateData = { email: formData.email };
        break;
      case 'password':
        if (!formData.currentPassword || !formData.newPassword) {
          toast({
            title: 'Password update failed',
            description: 'Please provide both current and new password',
            variant: 'destructive',
          });
          return;
        }
        updateData = { 
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword 
        };
        break;
    }
    
    updateProfileMutation.mutate(updateData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account details and preferences</p>
        </div>

        <div className="grid gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Full Name */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="fullName">Full Name</Label>
                  {editMode.name ? (
                    <div className="flex items-center space-x-2 mt-2">
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="flex-1"
                        data-testid="edit-name-input"
                      />
                      <Button 
                        size="sm" 
                        onClick={() => handleSave('name')}
                        disabled={updateProfileMutation.isPending}
                        data-testid="save-name-button"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleCancel('name')}
                        data-testid="cancel-name-button"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-gray-900 font-medium">{user.fullName || 'Not provided'}</p>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEdit('name')}
                        data-testid="edit-name-button"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  {editMode.phone ? (
                    <div className="flex items-center space-x-2 mt-2">
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="flex-1"
                        data-testid="edit-phone-input"
                      />
                      <Button 
                        size="sm" 
                        onClick={() => handleSave('phone')}
                        disabled={updateProfileMutation.isPending}
                        data-testid="save-phone-button"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleCancel('phone')}
                        data-testid="cancel-phone-button"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        <p className="text-gray-900 font-medium">{user.phone || 'Not provided'}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEdit('phone')}
                        data-testid="edit-phone-button"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="email">Email Address</Label>
                  {editMode.email ? (
                    <div className="flex items-center space-x-2 mt-2">
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="flex-1"
                        data-testid="edit-email-input"
                      />
                      <Button 
                        size="sm" 
                        onClick={() => handleSave('email')}
                        disabled={updateProfileMutation.isPending}
                        data-testid="save-email-button"
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleCancel('email')}
                        data-testid="cancel-email-button"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                        <p className="text-gray-900 font-medium">{user.email}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEdit('email')}
                        data-testid="edit-email-button"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label>Password</Label>
                  {editMode.password ? (
                    <div className="space-y-3 mt-2">
                      <Input
                        type="password"
                        placeholder="Current Password"
                        value={formData.currentPassword}
                        onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                        data-testid="current-password-input"
                      />
                      <Input
                        type="password"
                        placeholder="New Password"
                        value={formData.newPassword}
                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                        data-testid="new-password-input"
                      />
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          onClick={() => handleSave('password')}
                          disabled={updateProfileMutation.isPending}
                          data-testid="save-password-button"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Update Password
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleCancel('password')}
                          data-testid="cancel-password-button"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-gray-600">••••••••</p>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEdit('password')}
                        data-testid="edit-password-button"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}