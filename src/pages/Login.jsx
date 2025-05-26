import { Link as RouterLink, useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { FiMail, FiLock, FiArrowLeft } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { motion } from 'framer-motion'
import AuthGlassCard from '../components/auth/AuthGlassCard'

const bgUrl = '/ai-bg.jpg' // Place your image in public/ and use the correct path

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Background image with overlay */}
      <img
        src={bgUrl}
        alt="AI background"
        className="absolute inset-0 w-full h-full object-cover object-left opacity-80 select-none pointer-events-none z-0"
        draggable="false"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-primary-50/80 to-primary-100/90 z-10" />
      <main className="relative z-20 flex flex-col items-center justify-center w-full min-h-screen px-4">
        <AuthGlassCard>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent tracking-tight mb-2 text-center select-none">
            GenPRD
          </h1>
          <p className="text-lg text-gray-700 mb-6 text-center">Sign in to your account to continue</p>

          {redirectMessage && (
            <div className="mb-4 w-full p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm text-center">
              {redirectMessage}
            </div>
          )}
          {error && (
            <div className="mb-4 w-full p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center px-4 py-3 rounded-lg shadow bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base transition mb-4"
          >
            <FcGoogle className="w-5 h-5 mr-2" /> Continue with Google
          </button>

          <div className="flex items-center w-full my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="mx-3 text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Mock Email/Password Login */}
          <form onSubmit={handleEmailLogin} className="w-full space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
                  className="block w-full pl-10 pr-3 py-2 rounded-lg border border-white/40 bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-500 text-gray-700 placeholder-gray-400 shadow-sm"
                  placeholder="you@email.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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
                  className="block w-full pl-10 pr-3 py-2 rounded-lg border border-white/40 bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-500 text-gray-700 placeholder-gray-400 shadow-sm"
                  placeholder="Password"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 rounded-lg shadow bg-primary-600 hover:bg-primary-700 text-white font-semibold text-base transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-500 text-center">
            <RouterLink to="/" className="text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center">
              <FiArrowLeft className="mr-1" /> Back to homepage
            </RouterLink>
          </p>
        </AuthGlassCard>
      </main>
    </div>
  )
}

export default Login