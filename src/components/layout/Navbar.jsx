import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="flex items-center justify-between bg-white/80 backdrop-blur-lg backdrop-saturate-150 border-b border-white/40 px-6 py-3 shadow-md flex-shrink-0 z-30 relative">
      {/* Left side - potentially for a menu button or other branding if needed */}
      <div className="flex-grow" />
      
      {/* Right side - User Avatar with Dropdown */}
      <div className="relative" ref={dropdownRef}>
        {user && (
          <button
            onClick={toggleDropdown}
            className="focus:outline-none rounded-full transition-opacity hover:opacity-90"
            aria-label="User menu"
          >
            <img
              src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.email || 'User')}&background=random&color=fff`}
              alt={user?.name || 'User Avatar'}
              className="w-9 h-9 rounded-full border border-primary-300 object-cover"
            />
          </button>
        )}

        {dropdownOpen && (
          <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg overflow-hidden shadow-xl ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
              {/* Dropdown Items */}
              <button
                onClick={() => {
                  console.log('Profile Settings clicked');
                  setDropdownOpen(false);
                  // TODO: Navigate to profile settings page when created
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                role="menuitem"
              >
                Profile Settings
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                role="menuitem"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
