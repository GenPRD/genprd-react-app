import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BellIcon, Bars3Icon, Cog6ToothIcon, ArrowRightOnRectangleIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

const Navbar = ({ showMobileMenu = false, onMobileMenuClick = () => {} }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <header className="bg-white border-b border-gray-100 py-3.5 px-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile menu button - only shown on mobile */}
          {showMobileMenu && (
            <button
              type="button"
              className="md:hidden p-1.5 mr-3 text-gray-500 hover:text-gray-800 rounded-md"
              onClick={onMobileMenuClick}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-5">
          {/* Notification button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          >
            <BellIcon className="h-5 w-5" />
          </motion.button>
          
          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-full focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {/* User avatar - using avatar URL from API if available */}
              <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-white shadow-sm">
                {user?.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.name || "User"} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      e.target.style.display = 'none';
                      e.target.parentNode.classList.add('bg-gray-800', 'flex', 'items-center', 'justify-center', 'text-white');
                      e.target.parentNode.innerHTML = `<span class="text-sm font-medium">${
                        user?.name ? user.name.charAt(0).toUpperCase() : 'U'
                      }</span>`;
                    }}
                  />
                ) : (
                  <div className="h-full w-full bg-gray-800 flex items-center justify-center text-white">
                    <span className="text-sm font-medium">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                )}
              </div>
            </motion.button>
            
            {/* Dropdown menu - email and name moved inside dropdown as requested */}
            {dropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden"
              >
                <div className="p-3 border-b border-gray-100">
                  <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-sm text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                </div>
                
                <div className="py-1">
                  {/* Profile link */}
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <UserIcon className="h-4 w-4 mr-3 text-gray-500" />
                    Profile
                  </Link>
                  
                  {/* Settings link */}
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Cog6ToothIcon className="h-4 w-4 mr-3 text-gray-500" />
                    Settings
                  </Link>
                  
                  <div className="my-1 border-t border-gray-100"></div>
                  
                  {/* Logout button */}
                  <button
                    className="w-full text-left flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={handleLogout}
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3 text-gray-500" />
                    Log out
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;