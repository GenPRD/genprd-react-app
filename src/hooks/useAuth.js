import { useState, useEffect, createContext, useContext } from 'react'

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

// Auth logic (no JSX here)
export const useAuthProvider = () => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for existing token on app load
  useEffect(() => {
    console.log('useAuthProvider: Checking for existing auth data...')
    const savedToken = localStorage.getItem('jwt_token')
    const savedUser = localStorage.getItem('user_data')
    
    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        console.log('useAuthProvider: Found existing auth data for:', parsedUser.email)
        setToken(savedToken)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        localStorage.removeItem('jwt_token')
        localStorage.removeItem('user_data')
      }
    } else {
      console.log('useAuthProvider: No existing auth data found')
    }
    setLoading(false)
  }, [])

  // Simplified login function
  const login = (userData, tokenData) => {
    console.log('login() called')
    setUser(userData)
    setToken(tokenData)
    // No redirect here anymore
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('user_data')
    window.location.href = '/'
  }

  return {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token
  }
}

export { AuthContext }