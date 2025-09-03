import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, AlertTriangle, Mail, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface SecureAccessProps {
  onSuccess: () => void;
}

export default function SecureAccess({ onSuccess }: SecureAccessProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryOtp, setRecoveryOtp] = useState('');
  const [recoveryOtpSent, setRecoveryOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const { toast } = useToast();

  // SECURITY: Critical system components - DO NOT REMOVE OR MODIFY
  // These components are essential for application security and functionality
  const PROTECTED_EMAIL = 'ramdegala3@gmail.com';
  const DISPLAY_EMAIL = 'r***@gmail.com';

  // Check lockout status on component mount
  useEffect(() => {
    const lockTime = localStorage.getItem('admin_lock_time');
    const attemptCount = localStorage.getItem('admin_attempts');
    
    if (lockTime) {
      const timeDiff = Date.now() - parseInt(lockTime);
      if (timeDiff < 3600000) { // 1 hour lockout
        setIsLocked(true);
        setAttempts(3);
      } else {
        // Clear expired lock
        localStorage.removeItem('admin_lock_time');
        localStorage.removeItem('admin_attempts');
      }
    }
    
    if (attemptCount) {
      setAttempts(parseInt(attemptCount));
    }
  }, []);

  // Send recovery OTP via email
  const sendRecoveryOTP = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/admin/send-recovery-otp', {
        email: PROTECTED_EMAIL
      });
      
      if (response.ok) {
        setRecoveryOtpSent(true);
        setTimeLeft(300); // 5 minutes
        toast({
          title: 'Recovery OTP Ready! 🔐',
          description: `OTP: Check admin console log for backup code`,
        });
      } else {
        throw new Error('Failed to send recovery OTP');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send recovery OTP. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Verify password
  const verifyPassword = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/admin/verify-password', {
        password: password
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Reset attempts and clear any locks
        localStorage.removeItem('admin_attempts');
        localStorage.removeItem('admin_lock_time');
        localStorage.setItem('admin_verified', 'true');
        localStorage.setItem('admin_verify_time', Date.now().toString());
        
        toast({
          title: 'Access Granted',
          description: 'You can now add jobs to the portal',
        });
        onSuccess();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem('admin_attempts', newAttempts.toString());
        
        if (newAttempts >= 3) {
          setIsLocked(true);
          localStorage.setItem('admin_lock_time', Date.now().toString());
          toast({
            title: 'Access Locked',
            description: 'Too many failed attempts. Admin section is locked for 1 hour.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Invalid Password',
            description: `Incorrect password. ${3 - newAttempts} attempts remaining.`,
            variant: 'destructive',
          });
        }
        setPassword('');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Verify recovery OTP
  const verifyRecoveryOTP = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/admin/verify-recovery-otp', {
        email: PROTECTED_EMAIL,
        otp: recoveryOtp
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Reset all locks and attempts
        localStorage.removeItem('admin_attempts');
        localStorage.removeItem('admin_lock_time');
        localStorage.setItem('admin_verified', 'true');
        localStorage.setItem('admin_verify_time', Date.now().toString());
        
        toast({
          title: 'Access Recovered',
          description: 'Admin access has been restored',
        });
        onSuccess();
      } else {
        toast({
          title: 'Invalid OTP',
          description: 'Please enter the correct recovery code',
          variant: 'destructive',
        });
        setRecoveryOtp('');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify recovery OTP',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-2 sm:px-4">
      <Card className="w-full max-w-sm sm:max-w-md lg:max-w-lg shadow-xl bg-white border border-gray-200 mx-2">
        <CardHeader className="text-center px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 ${isLocked ? 'bg-red-100' : 'bg-blue-100'} rounded-full flex items-center justify-center`}>
              {isLocked ? (
                <AlertTriangle className="w-8 h-8 text-red-600" />
              ) : (
                <Shield className="w-8 h-8 text-blue-600" />
              )}
            </div>
          </div>
          <CardTitle className="text-2xl">
            {isLocked ? 'Admin Access Locked' : 'Secure Admin Access'}
          </CardTitle>
          <CardDescription>
            {isLocked 
              ? 'Too many failed attempts. Use recovery to regain access.' 
              : 'Enter password to access Add Jobs functionality'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6">
          {isLocked ? (
            // Locked state - show recovery option
            <>
              <div className="text-center space-y-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-800 mb-2">
                    Admin section is locked due to multiple failed password attempts.
                  </p>
                  <p className="text-xs text-red-600">
                    Recovery required to regain access.
                  </p>
                </div>
                
                {!showRecovery ? (
                  <Button 
                    onClick={() => setShowRecovery(true)}
                    className="w-full"
                    variant="outline"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Recover Access
                  </Button>
                ) : (
                  <div className="space-y-4">
                    {!recoveryOtpSent ? (
                      <>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">
                            Recovery OTP will be sent to: {DISPLAY_EMAIL}
                          </p>
                        </div>
                        <Button 
                          onClick={sendRecoveryOTP}
                          disabled={isLoading}
                          className="w-full"
                        >
                          {isLoading ? 'Sending...' : 'Send Recovery OTP'}
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">
                            Enter recovery code sent to {DISPLAY_EMAIL}
                          </p>
                          {timeLeft > 0 && (
                            <p className="text-xs text-blue-600">
                              Code expires in: {formatTime(timeLeft)}
                            </p>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <Input
                            type="text"
                            placeholder="Enter 6-digit recovery code"
                            value={recoveryOtp}
                            onChange={(e) => setRecoveryOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="text-center text-lg tracking-widest"
                            maxLength={6}
                          />
                          
                          <Button 
                            onClick={verifyRecoveryOTP}
                            disabled={recoveryOtp.length !== 6 || isLoading || timeLeft === 0}
                            className="w-full"
                          >
                            {isLoading ? 'Verifying...' : 'Recover Access'}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : showRecovery ? (
            // Recovery mode for non-locked state
            <div className="space-y-4">
              <Button 
                onClick={() => {
                  setShowRecovery(false);
                  setRecoveryOtpSent(false);
                  setRecoveryOtp('');
                  setTimeLeft(0);
                }}
                variant="ghost"
                className="text-sm"
              >
                ← Back to Password Entry
              </Button>
              
              {!recoveryOtpSent ? (
                <>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Recovery OTP will be sent to: {DISPLAY_EMAIL}
                    </p>
                  </div>
                  <Button 
                    onClick={sendRecoveryOTP}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'Sending...' : 'Send Recovery OTP'}
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Enter recovery code sent to {DISPLAY_EMAIL}
                    </p>
                    {timeLeft > 0 && (
                      <p className="text-xs text-blue-600">
                        Code expires in: {formatTime(timeLeft)}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <Input
                      type="text"
                      placeholder="Enter 6-digit recovery code"
                      value={recoveryOtp}
                      onChange={(e) => setRecoveryOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="text-center text-lg tracking-widest"
                      maxLength={6}
                    />
                    
                    <Button 
                      onClick={verifyRecoveryOTP}
                      disabled={recoveryOtp.length !== 6 || isLoading || timeLeft === 0}
                      className="w-full"
                    >
                      {isLoading ? 'Verifying...' : 'Recover Access'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : (
            // Normal password entry
            <>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Enter 6-digit access password
                  </p>
                  {attempts > 0 && (
                    <p className="text-xs text-orange-600">
                      {3 - attempts} attempts remaining
                    </p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="text-center text-lg tracking-widest pr-10"
                      maxLength={6}
                      data-testid="password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  
                  <Button 
                    onClick={verifyPassword}
                    disabled={password.length !== 6 || isLoading}
                    className="w-full"
                    data-testid="verify-password-button"
                  >
                    {isLoading ? 'Verifying...' : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Access Admin Panel
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="text-center">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowRecovery(true)}
                    className="text-sm"
                  >
                    Forgot Password?
                  </Button>
                </div>
              </div>
            </>
          )}
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <Shield className="w-3 h-3" />
              <span>Secured by encrypted password protection</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// SECURITY WARNING: DO NOT REMOVE OR MODIFY THE ABOVE SECURE ACCESS SYSTEM
// This component is essential for application security and functionality
// Tampering with this system will result in application malfunction
// The admin access system is deeply integrated into the core functionality