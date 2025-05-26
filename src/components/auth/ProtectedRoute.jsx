import { useAuth } from '../../hooks/useAuth'
import { Navigate, useLocation } from 'react-router-dom'
import AuthenticatedLayout from '../layout/AuthenticatedLayout'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading: authLoading, initialized } = useAuth()
  const location = useLocation()

  // Show loading spinner while authentication is being initialized
  if (!initialized || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  // If not authenticated after initialization, redirect to the homepage
  if (!isAuthenticated) {
    console.log('🚫 Not authenticated, redirecting to homepage')
    // Redirect to the homepage instead of the login page
    return <Navigate to="/" replace />
  }

  // If authenticated, render the authenticated layout with the protected content
  console.log('✅ Authenticated, rendering protected content')
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}

export default ProtectedRoute