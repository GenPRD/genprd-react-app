import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useApi';
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';

// Import komponen yang telah dimodularisasi
import StatusCard from '../components/dashboard/StatusCard';
import RecentPRDsList from '../components/dashboard/RecentPRDsList';
import StatusDistribution from '../components/dashboard/StatusDistribution';

const Dashboard = () => {
  const { user } = useAuth();
  const { dashboardData, loading, error, getDashboard } = useDashboard();

  useEffect(() => {
    if (user && !dashboardData && !loading && !error) {
      getDashboard();
    }
  }, [user, dashboardData, loading, error, getDashboard]);

  const counts = dashboardData?.counts || {};
  const recentPRDs = dashboardData?.recentPRDs || [];

  const staggerAnimation = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <div className="w-full">
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <span className="ml-4 text-gray-600">Loading dashboard...</span>
        </div>
      )}
      
      {error && !loading && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="font-medium">Failed to load dashboard</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => getDashboard()}
            className="mt-2 text-sm text-red-700 hover:text-red-800 underline focus:outline-none"
          >
            Try Again
          </button>
        </div>
      )}
      
      {dashboardData && !loading && !error && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerAnimation}
          className="space-y-6"
        >
          {/* Overview section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
            <p className="text-gray-600">
              Overview of your Product Requirements Documents
            </p>
          </motion.div>
          
          {/* Main stats cards - redesigned without trend percentages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <StatusCard 
              icon={<DocumentTextIcon className="w-6 h-6 text-blue-600" />}
              iconColor="bg-blue-50"
              label="Total PRDs" 
              count={counts.totalPRD || 0}
            />
            <StatusCard 
              icon={<ClockIcon className="w-6 h-6 text-amber-600" />}
              iconColor="bg-amber-50"
              label="In Progress" 
              count={counts.totalInProgress || 0}
            />
            <StatusCard 
              icon={<CheckCircleIcon className="w-6 h-6 text-green-600" />}
              iconColor="bg-green-50"
              label="Completed" 
              count={counts.totalFinished || 0}
            />
            <StatusCard 
              icon={<ArchiveBoxIcon className="w-6 h-6 text-gray-600" />}
              iconColor="bg-gray-100"
              label="Archived" 
              count={counts.totalArchived || 0}
            />
          </div>
          
          {/* Recent PRDs section - now using modular component */}
          <RecentPRDsList recentPRDs={recentPRDs} />
          
          {/* PRD Status distribution - now using modular component */}
          <StatusDistribution counts={counts} />
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;