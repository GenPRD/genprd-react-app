import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';
import logoImage from '../../assets/genprd_logo.svg';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-16 border-t border-gray-100 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and tagline */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-10 w-10 flex items-center justify-center">
                <img 
                  src={logoImage} 
                  alt="GenPRD Logo" 
                  className="w-full h-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentNode.innerHTML = `
                      <div class="w-10 h-10 bg-gray-900 rounded-md flex items-center justify-center">
                        <span class="text-white font-bold text-lg">G</span>
                      </div>
                    `;
                  }}
                />
              </div>
              <span className="text-base font-semibold text-gray-900">GenPRD</span>
            </div>
            <p className="text-sm text-gray-500 mb-2">Transformative Horizons</p>
            <p className="text-xs text-gray-400">Bridging Mind, Building Futures</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Pricing</Link></li>
              <li><Link to="/roadmap" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Roadmap</Link></li>
              <li><Link to="/changelog" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Changelog</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/docs" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Documentation</Link></li>
              <li><Link to="/guides" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Guides</Link></li>
              <li><Link to="/api" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">API Reference</Link></li>
              <li><Link to="/support" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">About</Link></li>
              <li><Link to="/blog" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Social links and copyright */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="https://github.com" className="text-gray-400 hover:text-gray-900 transition-colors">
              <FiGithub size={18} />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="https://twitter.com" className="text-gray-400 hover:text-gray-900 transition-colors">
              <FiTwitter size={18} />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="https://linkedin.com" className="text-gray-400 hover:text-gray-900 transition-colors">
              <FiLinkedin size={18} />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a href="mailto:info@genprd.com" className="text-gray-400 hover:text-gray-900 transition-colors">
              <FiMail size={18} />
              <span className="sr-only">Email</span>
            </a>
          </div>
          
          <div className="flex flex-col text-center md:text-right text-xs text-gray-400">
            <p>© {currentYear} GenPRD. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <Link to="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;