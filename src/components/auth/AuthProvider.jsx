import React from 'react'
import { AuthContext, useAuthProvider } from '../../hooks/useAuth'

export const AuthProvider = ({ children }) => {
  const authValue = useAuthProvider()

  console.log('AuthProvider render - auth state:', {
    user: authValue.user?.email,
    token: !!authValue.token,
    isAuthenticated: authValue.isAuthenticated,
    loading: authValue.loading
  })

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  )
}