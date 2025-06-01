import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTestAPI } from '../hooks/useApi';
import { Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

// Import icons
import { 
  FiDatabase, 
  FiUsers, 
  FiClipboard, 
  FiLayers,
  FiArrowRight,
  FiFileText
} from 'react-icons/fi';

const Homepage = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { testConnection } = useTestAPI();

  useEffect(() => {
    testConnection().then(
      () => console.log('API Connected'),
      (error) => console.log('API Offline', error)
    );
  }, [testConnection]);

  // Fitur untuk ditampilkan
  const features = [
    {
      icon: <FiClipboard size={24} className="text-gray-900" />,
      title: 'AI-Powered PRD Creation',
      description: 'Generate professional PRDs in minutes with our AI assistant that guides you through the entire process.'
    },
    {
      icon: <FiUsers size={24} className="text-gray-900" />,
      title: 'Team Collaboration',
      description: 'Invite your team members, assign roles, and collaborate seamlessly on product requirements.'
    },
    {
      icon: <FiDatabase size={24} className="text-gray-900" />,
      title: 'Centralized Repository',
      description: 'Store all your product requirements in one place with powerful search and organization tools.'
    },
    {
      icon: <FiLayers size={24} className="text-gray-900" />,
      title: 'Version Control',
      description: 'Track changes, review revisions, and maintain a clear history of your product documentation.'
    }
  ];

  // Langkah-langkah workflow
  const workflowSteps = [
    {
      number: '01',
      title: 'Define your product',
      description: 'Start with basic information and let our AI guide you through defining your product vision.'
    },
    {
      number: '02',
      title: 'Specify requirements',
      description: 'Break down features, user stories, and technical specifications with intelligent suggestions.'
    },
    {
      number: '03',
      title: 'Collaborate & refine',
      description: 'Get feedback from stakeholders and iterate on your requirements in real-time.'
    },
    {
      number: '04',
      title: 'Export & share',
      description: 'Publish your finalized PRD in multiple formats ready for your development team.'
    }
  ];

  // Inline Header component (previously imported)
  const Header = () => {
    return (
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center">
              <FiFileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-medium text-gray-900">GenPRD</span>
          </div>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block text-sm text-gray-600">
                {user?.name}
              </span>
              <Button 
                onClick={logout} 
                variant="outlined"
                sx={{ 
                  borderColor: '#e0e0e0',
                  color: '#1a1a1a',
                  '&:hover': { borderColor: '#1a1a1a', backgroundColor: 'transparent' },
                  borderRadius: '4px',
                  textTransform: 'none',
                  boxShadow: 'none'
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              component={RouterLink} 
              to="/login" 
              variant="contained"
              sx={{ 
                backgroundColor: '#1a1a1a', 
                '&:hover': { backgroundColor: '#2c2c2c' },
                borderRadius: '4px',
                boxShadow: 'none',
                textTransform: 'none'
              }}
            >
              Login
            </Button>
          )}
        </div>
      </header>
    );
  };

  // Inline Footer component (previously imported)
  const Footer = () => {
    return (
      <footer className="py-8 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center">
              <FiFileText className="h-3 w-3 text-white" />
            </div>
            <span className="text-base font-medium text-gray-900">GenPRD</span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Transformative Horizons</p>
          <p className="text-xs text-gray-400 mb-2">Bridging Mind, Building Futures</p>
          <p className="text-xs text-gray-400">© 2025 GenPRD. All rights reserved.</p>
        </div>
      </footer>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Lebih Minimalis */}
      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl font-medium text-gray-900 mb-4">
                Create Better PRDs with AI Assistance
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Streamline your product development with intelligent requirements documentation
              </p>
              <div className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <Button 
                    variant="contained"
                    component={RouterLink}
                    to="/dashboard"
                    sx={{ 
                      backgroundColor: '#1a1a1a', 
                      '&:hover': { backgroundColor: '#2c2c2c' },
                      borderRadius: '4px',
                      boxShadow: 'none',
                      textTransform: 'none',
                      py: 1.5,
                      px: 3
                    }}
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <Button 
                    variant="contained" 
                    component={RouterLink}
                    to="/login"
                    endIcon={<FiArrowRight />}
                    sx={{ 
                      backgroundColor: '#1a1a1a', 
                      '&:hover': { backgroundColor: '#2c2c2c' },
                      borderRadius: '4px',
                      boxShadow: 'none',
                      textTransform: 'none',
                      py: 1.5,
                      px: 3
                    }}
                  >
                    Get Started
                  </Button>
                )}
                <Button 
                  variant="outlined" 
                  component={RouterLink}
                  to="#features"
                  sx={{ 
                    borderColor: '#e0e0e0',
                    color: '#1a1a1a',
                    '&:hover': { borderColor: '#1a1a1a', backgroundColor: 'transparent' },
                    borderRadius: '4px',
                    textTransform: 'none',
                    boxShadow: 'none',
                    py: 1.5,
                    px: 3
                  }}
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-md rounded-md overflow-hidden border border-gray-200 shadow-sm">
                {/* Browser Bar */}
                <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="mx-auto px-16 py-1 bg-white rounded text-xs text-gray-500 text-center">
                    app.genprd.com
                  </div>
                </div>
                
                {/* App Mockup */}
                <div className="bg-white">
                  {/* Top Nav */}
                  <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-900 rounded-sm mr-2"></div>
                      <span className="text-xs font-medium">GenPRD</span>
                    </div>
                    <div className="w-6 h-6 bg-gray-100 rounded-full"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <div className="mb-4">
                      <div className="h-4 bg-gray-100 w-1/2 rounded mb-2"></div>
                      <div className="h-3 bg-gray-50 w-3/4 rounded"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="h-16 bg-gray-50 rounded p-2">
                        <div className="h-2 bg-gray-100 w-1/2 rounded mb-2"></div>
                        <div className="h-2 bg-gray-100 w-3/4 rounded"></div>
                      </div>
                      <div className="h-16 bg-gray-50 rounded p-2">
                        <div className="h-2 bg-gray-100 w-1/2 rounded mb-2"></div>
                        <div className="h-2 bg-gray-100 w-3/4 rounded"></div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-md p-3">
                      <div className="h-2 bg-gray-100 w-1/3 rounded mb-3"></div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-2 bg-gray-100 w-1/4 rounded"></div>
                        <div className="h-2 bg-gray-100 w-1/4 rounded"></div>
                        <div className="h-2 bg-gray-100 w-1/4 rounded"></div>
                      </div>
                      <div className="h-1 bg-gray-200 w-full rounded-full my-2"></div>
                      <div className="flex items-center justify-between">
                        <div className="h-2 bg-gray-100 w-1/5 rounded"></div>
                        <div className="h-2 bg-gray-100 w-1/6 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-t border-gray-100" />

      {/* Features Section - Lebih Minimalis */}
      <div id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mx-auto text-center mb-12">
            <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">Features</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-medium text-gray-900">
              Everything you need for better PRDs
            </h2>
            <p className="mt-3 text-gray-600">
              Our platform combines AI assistance with collaboration tools to help you create comprehensive 
              product requirements documents faster than ever.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white border border-gray-100 rounded-lg p-6">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workflow Section - Lebih Minimalis */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl mx-auto text-center mb-12">
            <span className="text-xs font-medium tracking-wider text-gray-500 uppercase">Workflow</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-medium text-gray-900">
              Simple 4-step process
            </h2>
            <p className="mt-3 text-gray-600">
              We've simplified the PRD creation process to help you create professional documentation quickly.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, index) => (
              <div key={index} className="border-t-2 border-gray-900 pt-6">
                <span className="text-sm text-gray-500 mb-2 block">{step.number}</span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section - Lebih Minimalis */}
      <div className="py-16 bg-gray-900 text-white">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-medium mb-4">
            Ready to create better PRDs?
          </h2>
          <p className="mb-8 text-gray-300">
            Join thousands of product teams who use GenPRD to streamline their product development process
          </p>
          
          <Button 
            variant="contained" 
            component={RouterLink}
            to={isAuthenticated ? "/dashboard" : "/login"}
            sx={{ 
              backgroundColor: 'white', 
              color: '#1a1a1a',
              '&:hover': { backgroundColor: '#f5f5f5' },
              borderRadius: '4px',
              boxShadow: 'none',
              textTransform: 'none',
              py: 1.5,
              px: 4
            }}
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Homepage;