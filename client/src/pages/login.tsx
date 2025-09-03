import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Eye, EyeOff } from 'lucide-react';
import type { LoginData, InsertUser } from '@shared/schema';

// Recovery form component
function ForgotPasswordForm({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  const sendOtpMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest('POST', '/api/auth/forgot-password', { email });
      return response.json();
    },
    onSuccess: () => {
      setStep('otp');
      toast({
        title: 'OTP Sent',
        description: 'Please check your email for the verification code.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (data: { email: string; otp: string }) => {
      const response = await apiRequest('POST', '/api/auth/verify-otp', data);
      return response.json();
    },
    onSuccess: () => {
      setStep('password');
      toast({
        title: 'OTP Verified',
        description: 'Please enter your new password.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Invalid OTP',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { email: string; otp: string; newPassword: string }) => {
      const response = await apiRequest('POST', '/api/auth/reset-password', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Password Reset Successful',
        description: 'Your password has been updated. Please sign in with your new password.',
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }
    sendOtpMutation.mutate(email);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter the OTP.',
        variant: 'destructive',
      });
      return;
    }
    verifyOtpMutation.mutate({ email, otp });
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all password fields.',
        variant: 'destructive',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }
    resetPasswordMutation.mutate({ email, otp, newPassword });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Password Recovery</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              data-testid="close-recovery"
            >
              ×
            </Button>
          </div>
          
          {step === 'email' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <Label htmlFor="recovery-email">Email Address</Label>
                <Input
                  id="recovery-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="recovery-email-input"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={sendOtpMutation.isPending}
                data-testid="send-otp-button"
              >
                {sendOtpMutation.isPending ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                  data-testid="otp-input"
                />
                <p className="text-sm text-gray-600 mt-1">
                  OTP sent to {email}
                </p>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={verifyOtpMutation.isPending}
                data-testid="verify-otp-button"
              >
                {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </form>
          )}

          {step === 'password' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  data-testid="new-password-input"
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  data-testid="confirm-password-input"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={resetPasswordMutation.isPending}
                data-testid="reset-password-button"
              >
                {resetPasswordMutation.isPending ? 'Updating...' : 'Change Password'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function Login() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('signin');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  
  // Login form state
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Signup form state
  const [signupData, setSignupData] = useState<InsertUser>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest('POST', '/api/auth/login', data);
      return response.json();
    },
    onSuccess: (user) => {
      localStorage.setItem('user', JSON.stringify(user));
      setLoginError('');
      toast({
        title: 'Login successful',
        description: 'Welcome back! Redirecting to jobs page...',
      });
      navigate('/jobs');
    },
    onError: (error) => {
      setLoginError('Wrong username or wrong password');
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      const response = await apiRequest('POST', '/api/auth/register', data);
      return response.json();
    },
    onSuccess: (user) => {
      localStorage.setItem('user', JSON.stringify(user));
      setSignupError('');
      toast({
        title: 'Account created successfully',
        description: 'Welcome! Redirecting to jobs page...',
      });
      navigate('/jobs');
    },
    onError: (error) => {
      setSignupError(error.message);
    },
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    loginMutation.mutate(loginData);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    signupMutation.mutate(signupData);
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
    if (loginError) setLoginError('');
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value,
    });
    if (signupError) setSignupError('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div 
          className="w-full bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(45deg, rgba(99, 102, 241, 0.8), rgba(139, 92, 246, 0.8)), url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzYzNjZmMTtzdG9wLW9wYWNpdHk6MSIgLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojOGI1Y2Y2O3N0b3Atb3BhY2l0eToxIiAvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgo8L3N2Zz4=')`
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Smart Job Portal Made Simple
              </h1>
              <p className="text-lg lg:text-xl text-blue-100 max-w-md">
                Find, reserve, and apply for job opportunities in seconds. Join thousands of satisfied users.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Authentication form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          {/* Development notice */}
          <div className="mb-4 sm:mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs sm:text-sm text-blue-700 text-center">
              🔧 Development Mode: Login/Signup page always shows for testing
            </p>
          </div>

          <Card className="shadow-lg border-0">
            <CardContent className="p-4 sm:p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin" data-testid="signin-tab">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" data-testid="signup-tab">Sign Up</TabsTrigger>
                </TabsList>

                {/* Sign In Tab */}
                <TabsContent value="signin">
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-red-600">Email or Phone *</Label>
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder=""
                        value={loginData.email}
                        onChange={handleLoginChange}
                        required
                        data-testid="login-email-input"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-red-600">Password *</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          name="password"
                          type={showLoginPassword ? 'text' : 'password'}
                          placeholder=""
                          value={loginData.password}
                          onChange={handleLoginChange}
                          required
                          data-testid="login-password-input"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          data-testid="toggle-login-password"
                        >
                          {showLoginPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Error message */}
                    {loginError && (
                      <p className="text-red-500 text-sm" data-testid="login-error">
                        {loginError}
                      </p>
                    )}

                    {/* Remember me checkbox */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember-me"
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                          data-testid="remember-me-checkbox"
                        />
                        <Label htmlFor="remember-me" className="text-sm">
                          Remember me
                        </Label>
                      </div>
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-blue-600 text-sm"
                        onClick={() => setShowForgotPassword(true)}
                        data-testid="forgot-password-link"
                      >
                        Forgot password?
                      </Button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loginMutation.isPending}
                      data-testid="signin-button"
                    >
                      {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>

                {/* Sign Up Tab */}
                <TabsContent value="signup">
                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name *</Label>
                      <Input
                        id="signup-name"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={signupData.fullName}
                        onChange={handleSignupChange}
                        required
                        data-testid="signup-name-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email *</Label>
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={signupData.email}
                        onChange={handleSignupChange}
                        required
                        data-testid="signup-email-input"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Phone Number *</Label>
                      <Input
                        id="signup-phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={signupData.phone || ''}
                        onChange={handleSignupChange}
                        required
                        data-testid="signup-phone-input"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password *</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          name="password"
                          type={showSignupPassword ? 'text' : 'password'}
                          placeholder="Create a password"
                          value={signupData.password}
                          onChange={handleSignupChange}
                          required
                          data-testid="signup-password-input"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          data-testid="toggle-signup-password"
                        >
                          {showSignupPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Error message */}
                    {signupError && (
                      <p className="text-red-500 text-sm" data-testid="signup-error">
                        {signupError}
                      </p>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={signupMutation.isPending}
                      data-testid="signup-button"
                    >
                      {signupMutation.isPending ? 'Creating account...' : 'Sign Up'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <ForgotPasswordForm onClose={() => setShowForgotPassword(false)} />
      )}
    </div>
  );
}