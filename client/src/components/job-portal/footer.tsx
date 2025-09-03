import { 
  Linkedin, 
  Mail, 
  Youtube, 
  X 
} from 'lucide-react';

export function Footer() {
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
              <li><a href="/projects" className="text-gray-300 hover:text-white transition-colors">Projects</a></li>
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
                className="p-2 bg-[#0077B5] hover:bg-[#005A8D] rounded-full transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=ramdegala9@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#EA4335] hover:bg-[#C53929] rounded-full transition-colors"
                title="Gmail"
              >
                <Mail className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.youtube.com/@ramjobportal"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#FF0000] hover:bg-[#CC0000] rounded-full transition-colors"
                title="YouTube"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.twitter.com/ramjobportal"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#1DA1F2] hover:bg-[#1488D8] rounded-full transition-colors"
                title="Twitter"
              >
                <X className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 mt-8 text-center">
          <p className="text-gray-400">&copy; 2025 Ram Job Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}