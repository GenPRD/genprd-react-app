import { useSearchParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom';

// Import custom components
import LoginCard from '../components/auth/LoginCard'
import LoginIllustration from '../components/auth/LoginIllustration'
import AnimatedBackground from '../components/auth/AnimatedBackground'

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
    <div className="min-h-screen flex flex-col">
      {/* Animated background */}
      <AnimatedBackground />
      
      {/* Branding header */}
      <header className="px-6 py-4">
        <Link to="/" className="flex items-center">
          <div className="font-semibold text-gray-900 flex items-center">
            <span className="text-md">GenPRD</span>
            <span className="text-gray-400 font-normal mx-2">•</span>
            <span className="text-xs font-normal text-gray-500">Simplify PRD Creation</span>
          </div>
        </Link>
      </header>
      
      {/* Main content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
          {/* Left: Illustration */}
          <LoginIllustration />
          
          {/* Right: Login form */}
          <div className="flex items-center justify-center">
            <LoginCard 
              error={error}
              redirectMessage={redirectMessage}
              handleGoogleLogin={handleGoogleLogin}
              handleEmailLogin={handleEmailLogin}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
      
      {/* Footer link */}
      <div className="p-4 text-center">
        <Link to="/" className="text-xs text-gray-500 hover:text-gray-700">
          ← Back to homepage
        </Link>
      </div>
    </div>
  );
};

export default Login;