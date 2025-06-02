import { useEffect, useRef } from 'react'; // tambahkan useRef
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useTestAPI } from '../hooks/useApi';
import { FiArrowRight, FiClipboard, FiDatabase, FiLayers, FiUsers } from 'react-icons/fi';

// Import components
import Button from '../components/common/Button';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import BrowserMockup from '../components/common/BrowserMockup';
import FeatureCard from '../components/common/FeatureCard';
import WorkflowStep from '../components/common/WorkflowStep';
import SectionHeader from '../components/common/SectionHeader';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const Homepage = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { testConnection } = useTestAPI();
  const connectionChecked = useRef(false); // Track if connection was already checked

  useEffect(() => {
    // Hanya jalankan sekali per render lifecycle dan hanya jika belum diperiksa
    if (!connectionChecked.current) {
      connectionChecked.current = true;
      // Tambahkan delay kecil untuk menghindari overload saat halaman pertama kali dimuat
      const timer = setTimeout(() => {
        testConnection()
          .then(() => console.log('API Connected'))
          .catch((error) => console.log('API Offline', error));
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [testConnection]);

  // Features section data
  const features = [
    {
      icon: <FiClipboard size={24} className="transition-colors duration-300" />,
      title: 'AI-Powered PRD Creation',
      description: 'Generate professional PRDs in minutes with our AI assistant that guides you through the entire process.'
    },
    {
      icon: <FiUsers size={24} className="transition-colors duration-300" />,
      title: 'Team Collaboration',
      description: 'Invite your team members, assign roles, and collaborate seamlessly on product requirements.'
    },
    {
      icon: <FiDatabase size={24} className="transition-colors duration-300" />,
      title: 'Centralized Repository',
      description: 'Store all your product requirements in one place with powerful search and organization tools.'
    },
    {
      icon: <FiLayers size={24} className="transition-colors duration-300" />,
      title: 'Version Control',
      description: 'Track changes, review revisions, and maintain a clear history of your product documentation.'
    }
  ];

  // Workflow steps
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

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header isAuthenticated={isAuthenticated} user={user} logout={logout} />

      {/* Hero Section */}
      <section className="pt-28 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 mb-6 leading-tight">
                Create Better PRDs with <span className="text-primary-600">AI Assistance</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Streamline your product development with intelligent requirements documentation
              </p>
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {isAuthenticated ? (
                  <Button 
                    to="/dashboard" 
                    asLink
                    variant="primary"
                    size="lg"
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <Button 
                    to="/login" 
                    asLink
                    variant="primary"
                    size="lg"
                    className="flex items-center group"
                  >
                    Get Started
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                )}
                <Button 
                  to="#features" 
                  asLink
                  variant="secondary"
                  size="lg"
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <BrowserMockup />
            </motion.div>
          </div>
        </div>
      </section>

      <hr className="border-t border-gray-100" />

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader 
            tag="Features"
            title="Everything you need for better PRDs"
            description="Our platform combines AI assistance with collaboration tools to help you create comprehensive product requirements documents faster than ever."
          />
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader 
            tag="Workflow"
            title="Simple 4-step process"
            description="We've simplified the PRD creation process to help you create professional documentation quickly."
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => (
              <WorkflowStep 
                key={index}
                number={step.number}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white overflow-hidden">
        <motion.div 
          className="max-w-xl mx-auto px-4 sm:px-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
            Ready to create better PRDs?
          </h2>
          <p className="mb-8 text-gray-300">
            Join thousands of product teams who use GenPRD to streamline their product development process
          </p>
          
          <Button 
            to={isAuthenticated ? "/dashboard" : "/login"}
            asLink
            variant="white"
            size="lg"
            className="hover:scale-105 transition-transform duration-300"
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started for Free"}
          </Button>
        </motion.div>

        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-600 rounded-full mix-blend-multiply opacity-10"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply opacity-10"></div>
          <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-primary-700 rounded-full mix-blend-multiply opacity-10"></div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Homepage;