import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BoltIcon, 
  UserGroupIcon, 
  DocumentArrowDownIcon 
} from '@heroicons/react/24/outline'
import { useTestAPI } from '../hooks/useApi'

const Homepage = () => {
  const [apiStatus, setApiStatus] = useState('checking...')
  const { testConnection, loading } = useTestAPI()

  useEffect(() => {
    const checkAPI = async () => {
      try {
        const response = await testConnection()
        setApiStatus(`✅ API Connected: ${response.message || 'OK'}`)
      } catch (error) {
        setApiStatus(`❌ API Error: ${error.message}`)
      }
    }

    checkAPI()
  }, [testConnection])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">GenPRD</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Generate PRDs with
            <span className="text-primary-600"> AI Power</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create comprehensive Product Requirements Documents effortlessly with our AI-powered platform. 
            Perfect for project managers who want to focus on strategy, not formatting.
          </p>
          
          {/* API Status */}
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-lg shadow-sm">
              <span className="text-sm text-gray-600 mr-2">API Status:</span>
              <span className={`text-sm font-medium ${loading ? 'text-gray-500' : 'text-gray-900'}`}>
                {loading ? 'Checking...' : apiStatus}
              </span>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Link
              to="/login"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Start Creating PRDs
            </Link>
          </div>
        </div>

        {/* Features with Heroicons */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BoltIcon className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Generation</h3>
            <p className="text-gray-600">Generate comprehensive PRDs using advanced language models</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UserGroupIcon className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Management</h3>
            <p className="text-gray-600">Manage personnel and assign DARCI roles efficiently</p>
          </div>

          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <DocumentArrowDownIcon className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">PDF Export</h3>
            <p className="text-gray-600">Export your PRDs as professional PDF documents</p>
          </div>
        </div>
      </main>

      {/* Environment Test Component */}
      <div className="p-4">
        <h3>Environment Test</h3>
        <p>API URL: {import.meta.env.VITE_API_URL}</p>
      </div>
    </div>
  )
}

export default Homepage