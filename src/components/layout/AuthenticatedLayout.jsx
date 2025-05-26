import Sidebar from './Sidebar'
import { useAuth } from '../../hooks/useAuth'

const AuthenticatedLayout = ({ children }) => {
  const { user, loading: authLoading } = useAuth()

  // Do not render children if user is not yet loaded (handles Strict Mode double render)
  // Initial authLoading check is in ProtectedRoute
  if (!user) {
    // This state should ideally not be reached often due to ProtectedRoute,
    // but acts as a safeguard during Strict Mode's rapid re-renders.
    // We can return a minimal placeholder or null here.
    // Given ProtectedRoute already shows a loader for authLoading,
    // we can just return null or a very minimal div if user is unexpectedly null here.
    return null
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 relative overflow-hidden">
      {/* Soft background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-primary-50/80 to-primary-100/90 z-0 backdrop-blur-md" />
      {/* Sidebar */}
      <div className="z-20 flex-shrink-0">
        <Sidebar />
      </div>
      {/* Main content area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

export default AuthenticatedLayout 