import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/api';
import { Navbar } from '@/components/job-portal/navbar';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Building, 
  Trash2,
  RotateCcw,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function DeletedPosts() {
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

  const { data: deletedPosts = [], isLoading, error } = useQuery({
    queryKey: ['deleted-posts', user.id],
    queryFn: async () => {
      if (!user.id) return [];
      console.log(`Fetching deleted posts for user: ${user.id}`);
      const response = await apiRequest('GET', `/api/deleted-posts/user/${user.id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch deleted posts');
      }
      const data = await response.json();
      console.log(`Received deleted posts:`, data);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!user.id,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // Add logging for debugging
  console.log('User ID:', user.id);
  console.log('Deleted posts data:', deletedPosts);
  console.log('Query error:', error);
  console.log('Loading state:', isLoading);

  const restorePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await apiRequest('POST', `/api/deleted-posts/${postId}/restore`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to restore post');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deleted-posts', user.id] });
      queryClient.invalidateQueries({ queryKey: ['applications/user', user.id] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast({
        title: 'Post restored successfully',
        description: 'Your job application has been restored and moved back to My Applications.',
      });
    },
    onError: (error: any) => {
      console.error('Restore post error:', error);
      toast({
        title: 'Restore failed',
        description: error.message || 'Failed to restore post',
        variant: 'destructive',
      });
    },
  });

  const permanentDeleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await apiRequest('DELETE', `/api/deleted-posts/${postId}/permanent`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to permanently delete post');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deleted-posts', user.id] });
      toast({
        title: 'Post permanently deleted',
        description: 'The post has been permanently removed and cannot be restored.',
      });
    },
    onError: (error: any) => {
      console.error('Permanent delete error:', error);
      toast({
        title: 'Delete failed',
        description: error.message || 'Failed to permanently delete post',
        variant: 'destructive',
      });
    },
  });

  const handleRestorePost = (postId: string) => {
    restorePostMutation.mutate(postId);
  };

  const handlePermanentDelete = (postId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this post? This action cannot be undone.')) {
      permanentDeleteMutation.mutate(postId);
    }
  };

  const getDaysLeft = (deletedAt: string) => {
    const deletedDate = new Date(deletedAt);
    const expiryDate = new Date(deletedDate.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days from deletion
    const now = new Date();
    const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    return Math.max(0, daysLeft);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading deleted posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Error Loading Posts</h3>
            <p className="text-gray-600 mb-6">
              Something went wrong while fetching your deleted posts. Please try again later.
            </p>
            <Button onClick={() => navigate('/jobs')} data-testid="browse-jobs-button">
              <Briefcase className="w-4 h-4 mr-2" />
              Go to Jobs
            </Button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Deleted Posts</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Posts will be permanently deleted after 5 days
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg border border-red-200 dark:border-red-800">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {deletedPosts.length}
              </div>
              <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                Deleted Posts
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {deletedPosts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Trash2 className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Deleted Posts</h3>
                <p className="text-gray-600 mb-6">
                  You haven't deleted any job applications. Deleted posts will appear here and can be restored within 5 days.
                </p>
                <Button onClick={() => navigate('/jobs')} data-testid="browse-jobs-button">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Browse Jobs
                </Button>
              </CardContent>
            </Card>
          ) : (
            deletedPosts.map((deletedPost: any) => {
              const { job } = deletedPost;
              const deletedDate = new Date(deletedPost.deletedAt);
              const daysLeft = getDaysLeft(deletedPost.deletedAt);
              const isExpired = new Date(job.closingDate) < new Date();

              return (
                <Card 
                  key={deletedPost.id} 
                  className="w-full border-red-200 bg-red-50/30"
                  data-testid={`deleted-post-card-${deletedPost.id}`}
                >
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    {/* Header with Title and Deleted Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-2 sm:gap-0">
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                          {job.title}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            <span>{job.company.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Deleted: {deletedDate.toLocaleDateString('en-GB')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
                          Deleted
                        </Badge>
                        {daysLeft > 0 && (
                          <Badge variant="outline" className="px-2 sm:px-3 py-1 text-xs sm:text-sm border-orange-300 text-orange-700">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {daysLeft} days left
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Salary and Closing Date */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mb-4 text-xs sm:text-sm">
                      <span className="font-semibold text-green-600">{job.salary}</span>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Closes: {new Date(job.closingDate).toLocaleDateString('en-GB')}</span>
                      </div>
                      {isExpired && (
                        <Badge variant="destructive" className="text-xs px-2 py-1">Expired</Badge>
                      )}
                    </div>

                    {/* Job Description */}
                    <p className="text-gray-700 text-xs sm:text-sm mb-4 leading-relaxed">
                      {job.description.length > 150 
                        ? `${job.description.substring(0, 150)}...` 
                        : job.description
                      }
                    </p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                      {job.skills.split(',').slice(0, 6).map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs px-2 py-1 bg-gray-50 text-gray-600 border-gray-200">
                          {skill.trim()}
                        </Badge>
                      ))}
                      {job.skills.split(',').length > 6 && (
                        <Badge variant="outline" className="text-xs px-2 py-1 bg-gray-50 text-gray-600 border-gray-200">
                          +{job.skills.split(',').length - 6}
                        </Badge>
                      )}
                    </div>

                    {/* Bottom Section - Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 sm:pt-4 border-t border-gray-200 gap-3 sm:gap-0">
                      <div className="text-xs sm:text-sm text-gray-600">
                        {daysLeft > 0 ? (
                          <span className="text-orange-600 font-medium">
                            Will be permanently deleted in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium">Expired - Will be deleted soon</span>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 items-center sm:items-end">
                        {daysLeft > 0 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRestorePost(deletedPost.id)}
                            disabled={restorePostMutation.isPending}
                            data-testid={`restore-post-${deletedPost.id}`}
                            className="text-xs h-8 w-full sm:w-auto"
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Restore
                          </Button>
                        )}
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handlePermanentDelete(deletedPost.id)}
                          disabled={permanentDeleteMutation.isPending}
                          data-testid={`permanent-delete-${deletedPost.id}`}
                          className="text-xs h-8 w-full sm:w-auto"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete Forever
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
