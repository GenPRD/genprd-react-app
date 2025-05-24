import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useDashboard } from '../hooks/useApi'
import { 
  DocumentTextIcon, 
  UserGroupIcon, 
  ClockIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const { getDashboard, loading, error } = useDashboard()
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboard()
        setDashboardData(response.data)
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      }
    }

    fetchDashboard()
  }, [getDashboard])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Error loading dashboard: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const { counts, recentPRDs } = dashboardData || {}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">GenPRD</h1>
            </div>
            <div className="flex items-center space-x-4">
              <img 
                src={user?.avatar_url} 
                alt={user?.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-gray-700">{user?.name}</span>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total PRDs</p>
                <p className="text-2xl font-bold text-gray-900">{counts?.totalPRD || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{counts?.totalInProgress || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Finished</p>
                <p className="text-2xl font-bold text-gray-900">{counts?.totalFinished || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Personnel</p>
                <p className="text-2xl font-bold text-gray-900">{counts?.totalPersonnel || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent PRDs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent PRDs</h3>
          </div>
          <div className="p-6">
            {recentPRDs && recentPRDs.length > 0 ? (
              <div className="space-y-4">
                {recentPRDs.map((prd) => (
                  <div key={prd.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{prd.product_name}</h4>
                      <p className="text-sm text-gray-600">Version {prd.document_version}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        prd.document_stage === 'draft' ? 'bg-gray-100 text-gray-800' :
                        prd.document_stage === 'inprogress' ? 'bg-yellow-100 text-yellow-800' :
                        prd.document_stage === 'finished' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {prd.document_stage}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(prd.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No PRDs yet. Create your first PRD to get started!</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard