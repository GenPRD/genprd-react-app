import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useApi';
import { Link } from 'react-router-dom';
import {
  DocumentTextIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusIcon,
  ArchiveBoxIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const { dashboardData, loading, error, getDashboard } = useDashboard();

  useEffect(() => {
    if (user && !dashboardData && !loading && !error) {
      getDashboard();
    }
  }, [user, dashboardData, loading, error, getDashboard]);

  const counts = dashboardData?.counts || {};
  const recentPRDs = dashboardData?.recentPRDs || [];

  // Status Card Component with enhanced styling
  const StatusCard = ({ icon, label, count }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-center shadow-sm">
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-semibold text-gray-900">{count}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {user?.name || 'User'}</h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your PRDs today.
        </p>
        <div className="mt-6">
          <Link
            to="/prds/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-800"
          >
            <PlusIcon className="w-5 h-5 mr-2" /> Create New PRD
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          <span className="ml-4 text-gray-600">Loading dashboard data...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8">
          <p className="font-medium">Failed to load dashboard data</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => getDashboard()}
            className="mt-2 text-sm text-red-700 hover:text-red-800 underline focus:outline-none"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Dashboard Content */}
      {dashboardData && !loading && !error && (
        <>
          {/* Stats Cards - Prima row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatusCard
              icon={<DocumentTextIcon className="w-6 h-6 text-gray-700" />}
              label="Total PRDs"
              count={counts.totalPRD || 0}
            />
            <StatusCard
              icon={<UserGroupIcon className="w-6 h-6 text-gray-700" />}
              label="Personnel"
              count={counts.totalPersonnel || 0}
            />
            <StatusCard
              icon={<DocumentDuplicateIcon className="w-6 h-6 text-gray-700" />}
              label="Draft PRDs"
              count={counts.totalDraft || 0}
            />
            <StatusCard
              icon={<ArchiveBoxIcon className="w-6 h-6 text-gray-700" />}
              label="Archived"
              count={counts.totalArchived || 0}
            />
          </div>

          {/* Stats Cards - Secondary row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <StatusCard
              icon={<ClockIcon className="w-6 h-6 text-gray-700" />}
              label="In Progress"
              count={counts.totalInProgress || 0}
            />
            <StatusCard
              icon={<CheckCircleIcon className="w-6 h-6 text-gray-700" />}
              label="Finished"
              count={counts.totalFinished || 0}
            />
          </div>

          {/* Recent PRDs */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Recent PRDs</h2>
              <Link 
                to="/prds" 
                className="text-sm text-gray-700 hover:text-gray-900 font-medium"
              >
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
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <div className="mb-2 sm:mb-0">
                        <h3 className="font-medium text-gray-900">{prd.product_name}</h3>
                        <p className="text-sm text-gray-600">Version {prd.document_version}</p>
                        <span className="mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                          {prd.document_stage === 'inprogress' 
                            ? 'In Progress' 
                            : prd.document_stage.charAt(0).toUpperCase() + prd.document_stage.slice(1)}
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
                    className="mt-4 inline-block px-4 py-2 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Create PRD
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* PRD Stage Distribution */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden p-6 mt-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">PRD Status Distribution</h2>
            <div className="space-y-4">
              {/* Draft */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Draft</span>
                  <span className="font-medium text-gray-800">{counts.totalDraft || 0}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-gray-400 h-2.5 rounded-full" style={{ width: `${Math.round((counts.totalDraft / (counts.totalPRD || 1)) * 100)}%` }}></div>
                </div>
              </div>
              
              {/* In Progress */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">In Progress</span>
                  <span className="font-medium text-gray-800">{counts.totalInProgress || 0}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-gray-600 h-2.5 rounded-full" style={{ width: `${Math.round((counts.totalInProgress / (counts.totalPRD || 1)) * 100)}%` }}></div>
                </div>
              </div>
              
              {/* Finished */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Finished</span>
                  <span className="font-medium text-gray-800">{counts.totalFinished || 0}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-gray-800 h-2.5 rounded-full" style={{ width: `${Math.round((counts.totalFinished / (counts.totalPRD || 1)) * 100)}%` }}></div>
                </div>
              </div>
              
              {/* Archived */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Archived</span>
                  <span className="font-medium text-gray-800">{counts.totalArchived || 0}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-gray-500 h-2.5 rounded-full" style={{ width: `${Math.round((counts.totalArchived / (counts.totalPRD || 1)) * 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;