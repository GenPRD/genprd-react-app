import { useAuth } from '../hooks/useAuth'

const Personnel = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Personnel Management</h1>
          <p className="text-gray-600">Welcome {user?.name}! This page is under construction.</p>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">🚧 Coming soon: Manage your team members and assign DARCI roles</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Personnel