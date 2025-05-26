import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useDashboard } from '../hooks/useApi'
import Layout from '../components/layout/Layout'
import { Link } from 'react-router-dom'
import { 
  DocumentTextIcon, 
  UserGroupIcon, 
  ClockIcon,
  CheckCircleIcon,
  ArchiveBoxIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const { user } = useAuth()
  const { getDashboard, loading, error } = useDashboard()
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        console.log('Fetching dashboard data...')
        const data = await getDashboard()
        console.log('Dashboard data received:', data)
        setDashboardData(data)
      } catch (err) {
        console.error('Error fetching dashboard:', err)
      }
    }

    fetchDashboard()
  }, []) // Keep dependency array empty to avoid infinite loop

  // Safely access dashboard data with fallbacks
  const counts = dashboardData?.counts || {}
  const recentPRDs = dashboardData?.recentPRDs || []

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
            <p className="text-gray-600">Welcome back, {user?.name || 'User'}!</p>
          </div>
          <Link 
            to="/prds/new" 
            className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-600 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-1" /> New PRD
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <span className="ml-4 text-gray-600">Loading dashboard...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> Failed to load dashboard data. Please try again.</span>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total PRDs</p>
                  <p className="text-2xl font-bold text-gray-900">{counts.totalPRD || 0}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{counts.totalInProgress || 0}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Finished</p>
                  <p className="text-2xl font-bold text-gray-900">{counts.totalFinished || 0}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Personnel</p>
                  <p className="text-2xl font-bold text-gray-900">{counts.totalPersonnel || 0}</p>
                </div>
              </div>
            </div>

            {/* Recent PRDs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Recent PRDs</h3>
                <Link to="/prds" className="text-sm text-primary-500 hover:text-primary-600">
                  View all
                </Link>
              </div>
              <div className="p-6">
                {recentPRDs.length > 0 ? (
                  <div className="space-y-4">
                    {recentPRDs.map((prd) => (
                      <Link 
                        to={`/prds/${prd.id}`} 
                        key={prd.id} 
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-200 hover:bg-primary-50 transition-colors"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">{prd.product_name}</h4>
                          <p className="text-sm text-gray-600">Version {prd.document_version}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            prd.document_stage === 'draft' ? 'bg-gray-100 text-gray-800' :
                            prd.document_stage === 'inprogress' ? 'bg-primary-100 text-primary-800' :
                            prd.document_stage === 'finished' ? 'bg-green-100 text-green-800' :
                            'bg-gray-500 bg-opacity-20 text-gray-700'
                          }`}>
                            {prd.document_stage === 'inprogress' ? 'In Progress' : 
                             prd.document_stage.charAt(0).toUpperCase() + prd.document_stage.slice(1)}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(prd.updated_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No PRDs yet. Create your first PRD to get started!</p>
                    <Link 
                      to="/prds/new"
                      className="mt-4 inline-block px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                      Create PRD
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

export default Dashboard