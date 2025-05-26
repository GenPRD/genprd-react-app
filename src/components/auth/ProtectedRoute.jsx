import { useAuth } from '../../hooks/useAuth'
import { Navigate, useLocation } from 'react-router-dom'
import AuthenticatedLayout from '../layout/AuthenticatedLayout'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const location = useLocation()

  // Show a loading spinner while authentication status is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, redirect to login with the current location
  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  // If authenticated, render the authenticated layout with the protected content
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}

export default ProtectedRoute