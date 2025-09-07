import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Navbar } from '@/components/job-portal/navbar';
import { Footer } from '@/components/job-portal/footer';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  MessageSquare,
  Clock,
  Users
} from 'lucide-react';
import type { InsertContact } from '@shared/schema';

export default function Contact() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState<InsertContact>({
    name: '',
    email: '',
    message: '',
  });
  const { toast } = useToast();

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      const response = await apiRequest('POST', '/api/contact', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Message sent successfully',
        description: 'Thank you for contacting us. We will get back to you soon.',
      });
      setFormData({ name: '', email: '', message: '' });
    },
    onError: (error) => {
      toast({
        title: 'Failed to send message',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about our job opportunities or courses? We're here to help you succeed in your career journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-blue-600" />
                  Email Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Send us an email and we'll respond within 24 hours</p>
                <a 
                  href="mailto:support@jobportal.com" 
                  className="text-blue-600 hover:underline font-medium"
                  data-testid="email-link"
                >
                  support@jobportal.com
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-green-600" />
                  Call Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">Speak with our support team</p>
                <a 
                  href="tel:+91-98765-43210" 
                  className="text-green-600 hover:underline font-medium"
                  data-testid="phone-link"
                >
                  +91-98765-43210
                </a>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  Mon-Fri 9AM-6PM IST
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-red-600" />
                  Visit Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  123 Tech Park<br />
                  Electronic City<br />
                  Bengaluru, Karnataka 560100<br />
                  India
                </p>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="text-white">Our Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Users className="w-6 h-6 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">10,000+</div>
                    <div className="text-blue-100">Students Placed</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="w-6 h-6 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-blue-100">Partner Companies</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        data-testid="input-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        data-testid="input-email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us how we can help you..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="min-h-32"
                      data-testid="textarea-message"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={contactMutation.isPending}
                    data-testid="button-send"
                  >
                    {contactMutation.isPending ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How do I apply for jobs?</h4>
                  <p className="text-gray-600 text-sm">
                    Simply browse our job listings, click on any position that interests you, and hit the "Apply Now" button. 
                    Make sure your profile is complete before applying.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Are the courses free?</h4>
                  <p className="text-gray-600 text-sm">
                    We offer both free and paid courses. Many foundational courses like HTML/CSS are completely free, 
                    while advanced courses have a nominal fee to cover instruction costs.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">How long does it take to hear back from companies?</h4>
                  <p className="text-gray-600 text-sm">
                    Response times vary by company, but typically you can expect to hear back within 1-2 weeks. 
                    We'll notify you of any updates on your application status.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Do you provide placement assistance?</h4>
                  <p className="text-gray-600 text-sm">
                    Yes! We work closely with hiring partners to ensure our students get the best opportunities. 
                    Our placement team provides resume reviews, interview preparation, and ongoing support.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
