import { Link as RouterLink } from 'react-router-dom'
import { Box, Button } from '@mui/material'
import { FiFileText } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth()

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
  )
}

export default Header