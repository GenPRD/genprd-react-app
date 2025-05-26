import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useDashboard } from '../hooks/useApi'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import GlassCard from '../components/home/GlassCard'
import {
  DocumentTextIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const { user } = useAuth()
  const { dashboardData, loading, error, getDashboard } = useDashboard()

  console.log('🔄 Dashboard render. State:', { user: !!user, loading, error, hasData: !!dashboardData })

  useEffect(() => {
    console.log('🔄 Dashboard useEffect triggered. User:', !!user, 'Loading:', loading, 'Has Data:', !!dashboardData, 'Error:', error)
    if (user && !dashboardData && !loading && !error) {
      console.log('📊 Dashboard: Triggering data fetch for user:', user.email)
      getDashboard()
    }
  }, [user, dashboardData, loading, error, getDashboard])

  const counts = dashboardData?.counts || {}
  const recentPRDs = dashboardData?.recentPRDs || []

  console.log('🔄 Dashboard about to render with:', { loading, error, hasData: !!dashboardData, counts, recentPRDs: recentPRDs.length })

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="w-full"
    >
      <GlassCard className="mb-8 p-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent tracking-tight mb-2">Dashboard</h2>
        <p className="text-lg text-gray-700">Welcome back, <span className="font-semibold text-primary-600">{user?.name || user?.email || 'User'}</span>!</p>
        <div className="mt-6">
          <Link
            to="/prds/new"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" /> New PRD
          </Link>
        </div>
      </GlassCard>

      {/* Loading/Error State for Dashboard Data - Show if loading OR data is null AND not in error */}
      {loading || (!dashboardData && !error) ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <span className="ml-4 text-gray-600">Loading dashboard data...</span>
        </div>
      ) : error ? (
        <GlassCard className="mb-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> Failed to load dashboard data. Please try again.</span>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </GlassCard>
      ) : (
        <> {/* Render dashboard content only when data is loaded and no error */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <GlassCard className="flex items-center p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <DocumentTextIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total PRDs</p>
                <p className="text-2xl font-bold text-gray-900">{counts.totalPRD || 0}</p>
              </div>
            </GlassCard>
            <GlassCard className="flex items-center p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{counts.totalInProgress || 0}</p>
              </div>
            </GlassCard>
            <GlassCard className="flex items-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Finished</p>
                <p className="text-2xl font-bold text-gray-900">{counts.totalFinished || 0}</p>
              </div>
            </GlassCard>
            <GlassCard className="flex items-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Personnel</p>
                <p className="text-2xl font-bold text-gray-900">{counts.totalPersonnel || 0}</p>
              </div>
            </GlassCard>
          </div>

          <GlassCard>
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Recent PRDs</h3>
              <Link to="/prds" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">View all</Link>
            </div>
            <div className="p-4 sm:p-6">
              {recentPRDs.length > 0 ? (
                <div className="space-y-4">
                  {recentPRDs.map((prd) => (
                    <Link
                      to={`/prds/${prd.id}`}
                      key={prd.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-200 hover:bg-primary-50 transition-colors"
                    >
                      <div className="mb-2 sm:mb-0">
                        <h4 className="font-medium text-gray-900">{prd.product_name}</h4>
                        <p className="text-sm text-gray-600">Version {prd.document_version}</p>
                        <span className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          prd.document_stage === 'draft' ? 'bg-gray-100 text-gray-800' :
                          prd.document_stage === 'inprogress' ? 'bg-primary-100 text-primary-800' :
                          prd.document_stage === 'finished' ? 'bg-green-100 text-green-800' :
                          'bg-gray-500 bg-opacity-20 text-gray-700'
                        }`}>
                          {prd.document_stage === 'inprogress' ? 'In Progress' :
                            prd.document_stage.charAt(0).toUpperCase() + prd.document_stage.slice(1)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 flex-shrink-0">
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
          </GlassCard>
        </>
      )}
    </motion.div>
  )
}

export default Dashboard