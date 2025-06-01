import { useEffect, useRef } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { motion } from 'framer-motion'
import LoadingSpinner from './LoadingSpinner'
import AnimatedBackground from './AnimatedBackground'

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative">
      <AnimatedBackground />
      
      <motion.div 
        className="text-center bg-white p-8 rounded-lg shadow-lg border border-gray-100"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <LoadingSpinner size="xl" />
        
        <motion.h2 
          className="mt-4 text-xl font-semibold text-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Processing your sign in
        </motion.h2>
        
        <motion.p 
          className="text-gray-600 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Please wait while we log you in...
        </motion.p>
        
        <motion.div
          className="mt-6 flex flex-col space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span className="text-sm text-gray-600">Authorizing account</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span className="text-sm text-gray-600">Setting up your session</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-primary-500 animate-pulse mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-sm text-gray-600">Redirecting to your dashboard</span>
          </div>
        </motion.div>
      </motion.div>
      
      <motion.div
        className="absolute bottom-8 text-center text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        ©{new Date().getFullYear()} GenPRD. All rights reserved.
      </motion.div>
    </div>
  );
};

export default AuthCallback;