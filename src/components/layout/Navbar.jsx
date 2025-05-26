import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  BellIcon, 
  QuestionMarkCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Button } from '@mui/material';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Page titles based on current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.includes('/prds') && path !== '/prds/new') return 'Product Requirements';
    if (path === '/prds/new') return 'Create PRD';
    if (path.includes('/personnel')) return 'Personnel';
    if (path.includes('/profile')) return 'Profile Settings';
    return 'GenPRD';
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (dropdownOpen) setDropdownOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  // Rendering
  return (
    <header className="bg-white border-b border-gray-300 px-6 py-4 flex-shrink-0 sticky top-0 z-10">
      <div className="flex items-center justify-between w-full">
        {/* Left side - Page Title */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
        </div>
        
        {/* Right side - Notifications and User Menu */}
        <div className="flex items-center space-x-3">
          {/* Help Icon */}
          <button 
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
            onClick={() => window.open('https://genprd-docs.example.com', '_blank')}
          >
            <QuestionMarkCircleIcon className="w-6 h-6" />
          </button>
          
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button 
              className="p-1.5 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none relative"
              onClick={toggleNotifications}
            >
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-0 right-0 bg-gray-800 w-2 h-2 rounded-full"></span>
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md overflow-hidden shadow-md border border-gray-200 z-20">
                <div className="py-2 px-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                  <button className="text-xs text-gray-700 hover:text-gray-900">Mark all as read</button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {/* Notifications content */}
                </div>
              </div>
            )}
          </div>
          
          {/* User Profile */}
          <div className="relative" ref={dropdownRef}>
            {user && (
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-3 hidden sm:inline-block">
                  {user?.name || user?.email || 'User'}
                </span>
                <button
                  onClick={toggleDropdown}
                  className="focus:outline-none rounded-full border border-gray-300"
                  aria-label="User menu"
                >
                  <img
                    src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.email || 'User')}&background=f0f0f0&color=333333`}
                    alt={user?.name || 'User Avatar'}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                </button>
              </div>
            )}

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md overflow-hidden shadow-md border border-gray-200 z-20">
                <div className="py-3 px-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                  {/* Dropdown menu items */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;