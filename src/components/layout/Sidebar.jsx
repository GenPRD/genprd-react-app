import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  UserGroupIcon, 
  HomeIcon, 
  PlusIcon 
} from '@heroicons/react/24/outline';
import { FiFileText } from 'react-icons/fi';
import { useDashboard } from '../../hooks/useApi';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: <HomeIcon className="w-5 h-5" /> },
  { to: '/prds', label: 'PRDs', icon: <DocumentTextIcon className="w-5 h-5" /> },
  { to: '/personnel', label: 'Personnel', icon: <UserGroupIcon className="w-5 h-5" /> },
];

const Sidebar = ({ isMobile = false, onCloseMobile = () => {} }) => {
  const location = useLocation();
  const { dashboardData, getDashboard } = useDashboard();
  const [isLoading, setIsLoading] = useState(true);

  // Get recent PRDs from dashboard data
  const recentPRDs = dashboardData?.recentPRDs || [];

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        await getDashboard();
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!dashboardData) {
      fetchDashboardData();
    } else {
      setIsLoading(false);
    }
  }, [dashboardData, getDashboard]);

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  // Handle navigation click for mobile view
  const handleNavClick = (e) => {
    if (isMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-300 flex flex-col py-6 flex-shrink-0 h-full">
      <div className="mb-8 flex items-center px-6">
        <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center mr-2">
          <FiFileText className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-xl text-gray-900">GenPRD</span>
      </div>
      
      {/* Main navigation */}
      <nav className="flex-none space-y-1 px-4 mb-8">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center px-4 py-2.5 rounded-md text-base transition-colors ${
              isActive(link.to) 
                ? 'bg-gray-100 text-gray-900 font-medium' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
            onClick={handleNavClick}
          >
            <span className="text-gray-500 mr-3">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}

        {/* Create PRD button */}
        <div className="py-2">
          <Link
            to="/prds/new"
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
            onClick={handleNavClick}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            New PRD
          </Link>
        </div>
      </nav>

      {/* Recent PRDs */}
      <div className="border-t border-gray-200 pt-4 mt-2 flex-grow overflow-y-auto">
        <div className="px-6 mb-4">
          <h3 className="text-sm font-medium text-gray-900">
            Recent PRDs
          </h3>
        </div>

        <div className="px-4 space-y-1">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin inline-block w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
            </div>
          ) : (
            <>
              {recentPRDs.length > 0 ? (
                recentPRDs.slice(0, 3).map(prd => (
                  <Link
                    key={prd.id}
                    to={`/prds/${prd.id}`}
                    className="block px-4 py-2 hover:bg-gray-50 rounded-md"
                    onClick={handleNavClick}
                  >
                    <span className="block text-sm font-medium truncate text-gray-900">
                      {prd.product_name}
                    </span>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs inline-block px-2 py-0.5 rounded-full 
                        bg-gray-100 text-gray-700
                      `}>
                        {prd.document_stage === 'inprogress' 
                          ? 'In Progress' 
                          : prd.document_stage.charAt(0).toUpperCase() + prd.document_stage.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500">
                        v{prd.document_version}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center text-sm text-gray-500 py-2">
                  No recent PRDs
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;