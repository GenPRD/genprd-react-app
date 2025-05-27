import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BellIcon, QuestionMarkCircleIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

const Navbar = ({ showMobileMenu = false, onMobileMenuClick = () => {} }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Helper to get PRD name from location state (if passed) or fallback
  let pageTitle = 'Dashboard';
  if (location.pathname.startsWith('/prds/')) {
    if (location.pathname === '/prds/new') {
      pageTitle = 'Create PRD';
    } else if (/^\/prds\/[\w-]+$/.test(location.pathname)) {
      // Try to get PRD name from location state (if navigated from list)
      pageTitle = location.state?.prdName || 'PRD Detail';
    } else {
      pageTitle = 'PRDs';
    }
  } else if (location.pathname.startsWith('/personnel')) {
    pageTitle = 'Personnel';
  } else if (location.pathname.startsWith('/dashboard')) {
    pageTitle = 'Dashboard';
  }

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Avatar initials
  const getInitials = (name) => {
    if (!name) return 'U';
    
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header 
      className="bg-white border-b border-gray-200 px-4 py-3 w-full" 
      style={{ zIndex: 'var(--z-navbar)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Hamburger menu button - shown only on mobile */}
          {showMobileMenu && (
            <button
              type="button"
              className="md:hidden mr-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={onMobileMenuClick}
              aria-label="Open sidebar"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          )}
          
          <h1 className="text-xl font-semibold text-gray-900">{pageTitle}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700">
            <QuestionMarkCircleIcon className="h-6 w-6" />
          </button>
          
          <button className="text-gray-500 hover:text-gray-700 relative">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
          
          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {/* Avatar or Initials */}
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="User avatar"
                  className="h-8 w-8 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              
              <div
                className={`h-8 w-8 rounded-full bg-gray-700 text-white flex items-center justify-center ${
                  user?.avatarUrl ? 'hidden' : ''
                }`}
              >
                {getInitials(user?.name)}
              </div>
              
              <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                {user?.name}
              </span>
            </button>
            
            {/* Dropdown menu */}
            {dropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white rounded-md overflow-hidden shadow-md border border-gray-200"
                style={{ zIndex: 50 }}
              >
                <div className="py-3 px-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                  {/* Profile link */}
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                    role="menuitem"
                  >
                    My Profile
                  </Link>
                  
                  {/* Settings link */}
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                    role="menuitem"
                  >
                    Settings
                  </Link>
                  
                  {/* Logout button */}
                  <button
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    Sign out
                  </button>
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