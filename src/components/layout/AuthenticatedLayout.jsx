import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useAuth } from '../../hooks/useAuth'

const AuthenticatedLayout = ({ children }) => {
  const { user, isAuthenticated } = useAuth()

  // Don't render if user is not authenticated or user data is missing
  if (!isAuthenticated || !user) {
    console.log('⚠️ AuthenticatedLayout: User not authenticated or missing')
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  console.log('✅ AuthenticatedLayout: Rendering for user:', user.email)

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 relative overflow-hidden">
      {/* Soft background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-primary-50/80 to-primary-100/90 z-0 backdrop-blur-md" />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Navbar */}
        <Navbar />
        
        {/* Page content with padding and scrolling */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="w-full max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AuthenticatedLayout