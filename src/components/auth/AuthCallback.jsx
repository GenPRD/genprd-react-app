import { useEffect, useRef } from 'react'
import { useAuth } from '../../hooks/useAuth'

const AuthCallback = () => {
  const { login } = useAuth()
  const hasProcessed = useRef(false)

  useEffect(() => {
    // Prevent double processing in React Strict Mode
    if (hasProcessed.current) {
      console.log('🔄 AuthCallback already processed, skipping')
      return
    }

    console.log('🔥 AuthCallback component mounted!')
    console.log('Current URL:', window.location.href)
    
    const handleAuth = async () => {
      hasProcessed.current = true
      
      try {
        console.log('🚀 Starting handleAuth function')
        
        // Get parameters from URL (sent by backend redirect)
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        const refreshToken = urlParams.get('refresh_token')
        const userParam = urlParams.get('user')
        
        console.log('Token from URL:', token ? 'EXISTS' : 'MISSING')
        console.log('Refresh Token from URL:', refreshToken ? 'EXISTS' : 'MISSING')
        console.log('User from URL:', userParam ? 'EXISTS' : 'MISSING')
        
        if (!token || !userParam) {
          console.log('❌ Missing token or user data, redirecting to login')
          window.location.href = '/login?error=missing_data'
          return
        }

        try {
          // Parse user data
          const userData = JSON.parse(decodeURIComponent(userParam))
          console.log('✅ Successfully parsed user data:', userData.email)
          
          // Store tokens and user data
          localStorage.setItem('jwt_token', token)
          if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken)
            console.log('✅ Refresh token stored')
          }
          localStorage.setItem('user_data', JSON.stringify(userData))
          console.log('✅ All auth data stored in localStorage')
          
          // Update React state immediately
          login(userData, token)
          console.log('✅ React auth state updated')
          
          // Small delay to ensure state is propagated
          setTimeout(() => {
            // Get redirect path and clean up
            const redirectPath = localStorage.getItem('auth_redirect') || '/dashboard'
            localStorage.removeItem('auth_redirect')
            
            console.log('🏠 Redirecting to:', redirectPath)
            
            // Use React Router navigation instead of window.location
            window.location.replace(redirectPath)
          }, 100)
          
        } catch (parseError) {
          console.error('❌ Error parsing user data:', parseError)
          window.location.href = '/login?error=parse_error'
        }
        
      } catch (error) {
        console.error('❌ Error in handleAuth:', error)
        window.location.href = '/login?error=callback_error'
      }
    }

    handleAuth()
  }, [login])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Processing authentication...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we log you in</p>
      </div>
    </div>
  )
}

export default AuthCallback