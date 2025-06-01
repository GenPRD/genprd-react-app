import { Link } from 'react-router-dom';
import Button from './Button';
import logoImage from '../../assets/genprd_logo.svg'; // Pastikan file ini ada di folder assets

const Header = ({ isAuthenticated, user, logout }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <div className="h-12 w-12 flex items-center">
            <img 
              src={logoImage} 
              alt="GenPRD Logo" 
              className="w-full h-full"
              onError={(e) => {
                // Fallback if the image fails to load
                e.target.onerror = null;
                e.target.parentNode.innerHTML = `
                  <div class="w-12 h-12 bg-gray-900 rounded-md flex items-center justify-center">
                    <span class="text-white font-bold text-xl">G</span>
                  </div>
                `;
              }} 
            />
          </div>
          <span className="text-xl font-medium text-gray-900">GenPRD</span>
        </Link>
        
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <span className="hidden sm:block text-sm text-gray-600">
              {user?.name}
            </span>
            <Button 
              variant="outline" 
              size="md"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button 
            to="/login" 
            asLink
            variant="primary"
          >
            Login
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;