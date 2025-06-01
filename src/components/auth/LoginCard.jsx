import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import Button from '../common/Button';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import logoImage from '../../assets/genprd_logo.svg';

const LoginCard = ({ 
  error, 
  redirectMessage, 
  handleGoogleLogin, 
  handleEmailLogin,
  email,
  setEmail,
  password,
  setPassword,
  isLoading 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <motion.div
      className="w-full max-w-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-2">
            <img 
              src={logoImage} 
              alt="GenPRD Logo" 
              className="h-16 w-16"
              onError={(e) => {
                e.target.onerror = null;
                e.target.parentNode.innerHTML = `
                  <div class="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center">
                    <span class="text-white font-bold text-lg">G</span>
                  </div>    
                `;
              }}
            />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">
            Welcome back
          </h1>
          <p className="text-gray-600 text-sm">
            Sign in to access your PRDs and workspace
          </p>
        </div>

        {(error || redirectMessage) && (
          <div className={`mb-4 w-full p-3 rounded-md text-sm flex items-start ${
            error ? 'bg-red-50 border border-red-100 text-red-700' : 'bg-blue-50 border border-blue-100 text-blue-700'
          }`}>
            <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
            <span>{error || redirectMessage}</span>
          </div>
        )}

        <div className="mb-6">
          <Button
            onClick={handleGoogleLogin}
            variant="secondary"
            size="lg"
            className="w-full flex items-center justify-center"
          >
            <FcGoogle size={18} className="mr-2" />
            <span>Sign in with Google</span>
          </Button>
        </div>

        <div className="flex items-center w-full my-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="mx-3 text-gray-400 text-xs">or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <form onSubmit={handleEmailLogin} className="w-full space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiMail size={16} className="flex-shrink-0" />
              </span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="block w-full pl-10 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-gray-700 transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiLock size={16} className="flex-shrink-0" />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-gray-700 transition-all"
                placeholder="••••••••"
              />
              <button 
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? 
                  <FiEyeOff size={16} className="flex-shrink-0" /> : 
                  <FiEye size={16} className="flex-shrink-0" />
                }
              </button>
            </div>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="w-full mt-2"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

        <p className="mt-6 text-sm text-gray-500 text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
            Create account
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginCard;