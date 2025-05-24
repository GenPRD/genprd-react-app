import { useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'

const AuthCallback = () => {
  const { login } = useAuth()

  useEffect(() => {
    console.log('🔥 AuthCallback component mounted!')
    console.log('Current URL:', window.location.href)
    
    const handleAuth = async () => {
      try {
        console.log('🚀 Starting handleAuth function')
        
        // Get code from URL
        const code = new URLSearchParams(window.location.search).get('code')
        console.log('Code from URL:', code ? 'EXISTS' : 'MISSING')
        
        if (!code) {
          console.log('❌ No code found, redirecting to login')
          window.location.href = '/login'
          return
        }

        console.log('📡 Making API call to Express...')
        // Call API
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google/callback?code=${code}`)
        console.log('API Response Status:', response.status)
        
        const data = await response.json()
        console.log('API Response Data:', data)
        
        // Store and redirect
        if (data.status === 'success') {
          console.log('✅ Success response received')
          localStorage.setItem('jwt_token', data.access_token)
          localStorage.setItem('user_data', JSON.stringify(data.user))
          login(data.user, data.access_token)
          
          console.log('🏠 Redirecting to dashboard...')
          // Force a full page reload to ensure React state updates
          window.location.href = '/dashboard'
        } else {
          console.log('❌ Failed response, redirecting to login')
          window.location.href = '/login'
        }
        
      } catch (error) {
        console.error('❌ Error in handleAuth:', error)
        window.location.href = '/login'
      }
    }

    handleAuth()
  }, [login])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>Processing...</div>
    </div>
  )
}

export default AuthCallback