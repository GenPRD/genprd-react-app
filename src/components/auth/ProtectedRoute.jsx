import { useAuth } from '../../hooks/useAuth'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  // Also check localStorage as fallback
  const hasStoredAuth = localStorage.getItem('jwt_token') && localStorage.getItem('user_data')

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Allow access if either React state OR localStorage has auth data
  return (isAuthenticated || hasStoredAuth) ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute