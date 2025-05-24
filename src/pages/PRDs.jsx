import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'

const PRDs = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My PRDs</h1>
            <Link 
              to="/prds/new"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              Create New PRD
            </Link>
          </div>
          
          <p className="text-gray-600 mb-4">Welcome {user?.name}! This page is under construction.</p>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">🚧 Coming soon: View and manage all your Product Requirements Documents</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PRDs