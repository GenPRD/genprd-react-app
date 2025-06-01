import { useEffect, useRef } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { motion } from 'framer-motion'
import AnimatedBackground from './AnimatedBackground'

const AuthCallback = () => {
  const { login } = useAuth()
  const hasProcessed = useRef(false)

  useEffect(() => {
    // Prevent double processing in React Strict Mode
    if (hasProcessed.current) {
      return
    }

    const handleAuth = async () => {
      hasProcessed.current = true
      
      try {
        // Get parameters from URL (sent by backend redirect)
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        const refreshToken = urlParams.get('refresh_token')
        const userParam = urlParams.get('user')
        
        if (!token || !userParam) {
          window.location.href = '/login?error=missing_data'
          return
        }

        try {
          // Parse user data
          const userData = JSON.parse(decodeURIComponent(userParam))
          
          // Store tokens and user data
          localStorage.setItem('jwt_token', token)
          if (refreshToken) {
            localStorage.setItem('refresh_token', refreshToken)
          }
          localStorage.setItem('user_data', JSON.stringify(userData))
          
          // Update React state immediately
          login(userData, token)
          
          // Small delay for animation to show before redirect
          setTimeout(() => {
            // Get redirect path and clean up
            const redirectPath = localStorage.getItem('auth_redirect') || '/dashboard'
            localStorage.removeItem('auth_redirect')
            
            // Use React Router navigation instead of window.location
            window.location.replace(redirectPath)
          }, 1500) // Increased delay to show animation
          
        } catch (parseError) {
          window.location.href = '/login?error=parse_error'
        }
        
      } catch (error) {
        window.location.href = '/login?error=callback_error'
      }
    }

    handleAuth()
  }, [login])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-gray-50">
      <AnimatedBackground />
      
      <motion.div 
        className="bg-white p-10 rounded-xl shadow-lg border border-gray-100 max-w-md mx-auto text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-center mb-6">
          <motion.div 
            className="h-16 w-16 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <motion.div 
              className="absolute inset-0 border-4 border-t-gray-800 border-r-transparent border-b-transparent border-l-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            ></motion.div>
          </motion.div>
        </div>
        
        <motion.h2 
          className="text-2xl font-semibold text-gray-800 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Signing you in
        </motion.h2>
        
        <motion.p 
          className="text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Please wait while we redirect you to your dashboard
        </motion.p>
        
        {/* Progress steps */}
        <div className="space-y-4 mx-auto max-w-xs">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-500">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Authentication successful</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-500">
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Creating your session</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              <motion.svg 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="h-3 w-3" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </motion.svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Redirecting to dashboard</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthCallback;