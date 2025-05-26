import { useState, useEffect, createContext, useContext } from 'react'
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

// Auth logic (no JSX here)
export const useAuthProvider = () => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for existing token on app load
  useEffect(() => {
    let didCancel = false
    const checkAuth = () => {
      const savedToken = localStorage.getItem('jwt_token')
      const savedUser = localStorage.getItem('user_data')
      if (savedToken && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser)
          if (!didCancel) {
            setToken(prev => prev !== savedToken ? savedToken : prev)
            setUser(prev => prev?.email !== parsedUser.email ? parsedUser : prev)
          }
        } catch (error) {
          if (!didCancel) {
            localStorage.removeItem('jwt_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('user_data')
            setUser(null)
            setToken(null)
          }
        }
      } else {
        if (!didCancel) {
          setUser(null)
          setToken(null)
        }
      }
      if (!didCancel) setLoading(false)
    }
    checkAuth()
    return () => { didCancel = true }
  }, [])

  // Simplified login function
  const login = (userData, tokenData) => {
    setUser(userData)
    setToken(tokenData)
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      // Continue with local logout even if server call fails
    }
    setUser(null)
    setToken(null)
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('refresh_token')
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