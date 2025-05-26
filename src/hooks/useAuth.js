import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import api from '../utils/api'

// Create Auth Context
const AuthContext = createContext()

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// Auth logic with improved state management
export const useAuthProvider = () => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  // Memoized auth check function to prevent unnecessary re-runs
  const checkAuth = useCallback(() => {
    const savedToken = localStorage.getItem('jwt_token')
    const savedUser = localStorage.getItem('user_data')
    
    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setToken(savedToken)
        setUser(parsedUser)
        console.log('✅ Auth restored from localStorage:', parsedUser.email)
      } catch (error) {
        console.error('❌ Error parsing saved user data:', error)
        // Clear corrupted data
        localStorage.removeItem('jwt_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user_data')
        setUser(null)
        setToken(null)
      }
    } else {
      setUser(null)
      setToken(null)
    }
    
    setLoading(false)
    setInitialized(true)
  }, [])

  // Check for existing token on app load
  useEffect(() => {
    if (!initialized) {
      checkAuth()
    }
  }, [checkAuth, initialized])

  // Enhanced login function
  const login = useCallback((userData, tokenData) => {
    console.log('🔐 Login called with:', userData.email)
    setUser(userData)
    setToken(tokenData)
    setLoading(false)
    
    // Ensure localStorage is updated
    localStorage.setItem('jwt_token', tokenData)
    localStorage.setItem('user_data', JSON.stringify(userData))
  }, [])

  // Logout function - now only clears state, navigation handled by caller
  const logout = useCallback(async () => {
    console.log('🔐 Logout called');
    try {
      await api.post('/auth/logout')
      console.log('✅ Server logout successful');
    } catch (error) {
      console.error('❌ Logout API call failed:', error)
      // Continue with local logout even if server call fails
    }
    
    // Clear local state and storage
    setUser(null)
    setToken(null)
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
    console.log('✅ Local auth state cleared');
    // Do NOT navigate here. Navigation will be handled by the component that calls logout.
    // window.location.href = '/'
  }, [])

  const authValue = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    initialized
  }

  console.log('🔍 Auth state:', {
    hasUser: !!user,
    hasToken: !!token,
    isAuthenticated: authValue.isAuthenticated,
    loading,
    initialized
  })

  return authValue
}

export { AuthContext }