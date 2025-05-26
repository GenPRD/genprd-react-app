import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { useAuth } from '../../hooks/useAuth'

const AuthenticatedLayout = ({ children }) => {
  const { user, isAuthenticated } = useAuth()

  // Don't render if user is not authenticated or user data is missing
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Sidebar - dengan position sticky */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Navbar - dengan position sticky */}
        <Navbar />
        
        {/* Page content with padding and scrolling */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="w-full max-w-5xl mx-auto pb-20">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AuthenticatedLayout