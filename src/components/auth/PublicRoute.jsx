import { useAuth } from '../../hooks/useAuth'
import { Navigate } from 'react-router-dom'

const PublicRoute = ({ children, redirectTo = '/dashboard' }) => {
  const { isAuthenticated, loading, initialized } = useAuth()

  // Wait for auth to be initialized before making decisions
  if (!initialized || loading) {
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
  if (isAuthenticated) {
    console.log('✅ User authenticated, redirecting from public route to:', redirectTo)
    return <Navigate to={redirectTo} replace />
  }

  // Not authenticated, show public content
  return children
}

export default PublicRoute  