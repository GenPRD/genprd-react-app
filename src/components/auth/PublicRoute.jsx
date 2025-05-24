import { useAuth } from '../../hooks/useAuth'
import { Navigate } from 'react-router-dom'

const PublicRoute = ({ children, redirectTo = '/dashboard' }) => {
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

  // If user is authenticated, redirect them away from public routes like login
  return (isAuthenticated || hasStoredAuth) ? <Navigate to={redirectTo} replace /> : children
}

export default PublicRoute