import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HomeIcon,
  DocumentTextIcon,
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  ArchiveBoxIcon,
  DocumentPlusIcon
} from '@heroicons/react/24/outline';
import { useDashboard } from '../../hooks/useApi';
import logoImage from '../../assets/genprd_logo.svg';

const Sidebar = ({ isMobile = false, onCloseMobile = () => {} }) => {
  const location = useLocation();
  const { dashboardData } = useDashboard();
  
  // Get recent PRDs from dashboard data
  const recentPRDs = dashboardData?.recentPRDs || [];

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <HomeIcon className="w-5 h-5" /> },
    { to: '/prds', label: 'All PRDs', icon: <DocumentTextIcon className="w-5 h-5" /> },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  const handleNavClick = () => {
    if (isMobile) {
      onCloseMobile();
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    // Tambahkan border-r dan shadow-sm
    <aside className="w-64 bg-white h-full flex flex-col flex-shrink-0 overflow-hidden border-r border-gray-200 shadow-sm">
      {/* Logo and app brand - using SVG logo */}
      <div className="p-5 flex items-center">
        <img 
          src={logoImage} 
          alt="GenPRD Logo" 
          className="h-8 w-auto mr-3"
          onError={(e) => {
            e.target.onerror = null;
            e.target.parentNode.innerHTML = `
              <div class="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center mr-3">
                <span class="text-white font-bold text-lg">G</span>
              </div>
            ` + e.target.parentNode.innerHTML.split('</img>')[1];
          }}
        />
        <span className="font-semibold text-xl text-gray-900">GenPRD</span>
      </div>
      
      {/* New PRD button - white with soft border as requested */}
      <div className="px-5 pb-4">
        <Link
          to="/prds/new"
          className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-800 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-all shadow-sm"
          onClick={handleNavClick}
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New PRD
        </Link>
      </div>
      
      {/* Main navigation - with soft gray/glassmorphism active state */}
      <nav className="px-5 py-2 flex-none">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center px-4 py-2.5 my-1 rounded-md text-sm font-medium transition-colors ${
              isActive(link.to) 
                ? 'bg-gray-100/80 backdrop-blur-sm text-gray-900' 
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
            onClick={handleNavClick}
          >
            <span className={`mr-3 flex-shrink-0 ${isActive(link.to) ? 'text-gray-800' : 'text-gray-500'}`}>
              {link.icon}
            </span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
      
      {/* Section divider */}
      <div className="px-5 py-3">
        <div className="h-px bg-gray-200"></div>
      </div>
      
      {/* Pinned section */}
      <div className="px-5">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          PINNED
        </h3>
        <div className="space-y-1">
          {recentPRDs.slice(0, 2).map(prd => (
            <Link
              key={`pin-${prd.id}`}
              to={`/prds/${prd.id}`}
              className="block px-4 py-2 hover:bg-gray-50 rounded-md text-sm"
              onClick={handleNavClick}
            >
              <span className="block text-sm font-medium truncate text-gray-900">
                {prd.product_name}
              </span>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <ClockIcon className="w-3 h-3 mr-1" />
                {formatDate(prd.updated_at)}
              </div>
            </Link>
          ))}
          
          {/* If no pinned PRDs yet */}
          {recentPRDs.length === 0 && (
            <div className="px-4 py-3 text-sm text-center text-gray-500 border border-dashed border-gray-200 rounded-md">
              <DocumentPlusIcon className="w-5 h-5 mx-auto mb-1 text-gray-400" />
              <p>No pinned PRDs</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent section */}
      <div className="px-5 mt-6 flex-grow overflow-y-auto">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          RECENT
        </h3>
        <div className="space-y-1">
          {recentPRDs.map(prd => (
            <Link
              key={prd.id}
              to={`/prds/${prd.id}`}
              className="flex justify-between items-center px-4 py-2 hover:bg-gray-50 rounded-md"
              onClick={handleNavClick}
            >
              <span className="block text-sm truncate text-gray-900 flex-grow mr-2">
                {prd.product_name}
              </span>
              {prd.document_stage === 'finished' && (
                <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
              )}
              {prd.document_stage === 'archived' && (
                <ArchiveBoxIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
              )}
              {prd.document_stage === 'inprogress' && (
                <ClockIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
              )}
            </Link>
          ))}
          
          {/* If no recent PRDs */}
          {recentPRDs.length === 0 && (
            <div className="px-4 py-3 text-sm text-center text-gray-500 border border-dashed border-gray-200 rounded-md">
              <DocumentPlusIcon className="w-5 h-5 mx-auto mb-1 text-gray-400" />
              <p>Start by creating a PRD</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;