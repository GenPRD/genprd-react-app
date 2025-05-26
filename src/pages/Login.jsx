import { Link as RouterLink, useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { FiMail, FiLock, FiArrowLeft } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { Button } from '@mui/material'

// Simplified login page without glassmorphism effects
const Login = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [error, setError] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = searchParams.get('redirect') || '/dashboard'
      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, searchParams, navigate])

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      const errorMessages = {
        'no_code': 'Authorization code not received',
        'auth_failed': 'Authentication failed',
        'server_error': 'Server error occurred',
        'missing_data': 'Authentication data missing',
        'parse_error': 'Error processing authentication',
        'callback_error': 'Callback processing failed',
        'session_expired': 'Your session has expired',
        'unauthorized': 'Please log in again'
      }
      setError(errorMessages[errorParam] || 'Authentication failed')
    }
  }, [searchParams])

  const handleGoogleLogin = () => {
    setError(null)
    const redirectPath = searchParams.get('redirect') || '/dashboard'
    localStorage.setItem('auth_redirect', redirectPath)
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/web/google`
  }

  // Mock email login (for design only)
  const handleEmailLogin = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      alert('This is a mock login. Only Google login is enabled.')
    }, 1200)
  }

  const redirectMessage = searchParams.get('redirect') ? 'Please log in to access this page.' : null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xl font-medium text-gray-900">GenPRD</span>
          </div>

          <h1 className="text-2xl font-medium text-gray-900 mb-2 text-center">
            Sign in to your account
          </h1>
          <p className="text-gray-600 mb-6 text-center text-sm">
            Access your PRDs and workspace
          </p>

          {redirectMessage && (
            <div className="mb-4 w-full p-3 bg-blue-50 border border-blue-100 rounded-md text-blue-700 text-sm">
              {redirectMessage}
            </div>
          )}
          
          {error && (
            <div className="mb-4 w-full p-3 bg-red-50 border border-red-100 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Google Login */}
          <Button
            onClick={handleGoogleLogin}
            variant="contained"
            fullWidth
            startIcon={<FcGoogle />}
            sx={{ 
              backgroundColor: '#1a1a1a', 
              '&:hover': { backgroundColor: '#2c2c2c' },
              borderRadius: '4px',
              boxShadow: 'none',
              textTransform: 'none',
              py: 1.5,
              mb: 3
            }}
          >
            Continue with Google
          </Button>

          <div className="flex items-center w-full my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="mx-3 text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Mock Email/Password Login */}
          <form onSubmit={handleEmailLogin} className="w-full space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FiMail className="w-5 h-5" />
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-gray-700"
                  placeholder="you@email.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FiLock className="w-5 h-5" />
                </span>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-gray-700"
                  placeholder="Password"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              variant="outlined"
              fullWidth
              sx={{ 
                borderColor: '#e0e0e0',
                color: '#1a1a1a',
                '&:hover': { borderColor: '#1a1a1a', backgroundColor: 'transparent' },
                borderRadius: '4px',
                textTransform: 'none',
                boxShadow: 'none',
                py: 1.5,
                mt: 1
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <p className="mt-6 text-sm text-gray-500 text-center">
            <RouterLink to="/" className="text-gray-900 hover:text-gray-700 inline-flex items-center">
              <FiArrowLeft className="mr-1" /> Back to homepage
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;