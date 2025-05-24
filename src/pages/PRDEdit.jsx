import { useAuth } from '../hooks/useAuth'
import { useParams, Link } from 'react-router-dom'

const PRDEdit = () => {
  const { user } = useAuth()
  const { id } = useParams()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit PRD - ID: {id}</h1>
            <div className="flex space-x-4">
              <Link 
                to={`/prds/${id}`} 
                className="text-gray-600 hover:text-gray-900"
              >
                ← View PRD
              </Link>
              <Link 
                to="/prds" 
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to PRDs
              </Link>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">Welcome {user?.name}! This page is under construction.</p>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">🚧 Coming soon: Edit PRD content and regenerate sections</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PRDEdit