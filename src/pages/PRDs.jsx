import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { usePRD } from '../hooks/usePRD'
// import Layout from '../components/layout/Layout'
import { 
  PlusIcon, 
  DocumentTextIcon,
  ArchiveBoxIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

// Date formatting utility
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'N/A'
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'N/A'
  }
}

const PRDs = () => {
  const { user } = useAuth()
  const { getAllPRDs, archivePRD, deletePRD, downloadPRD, loading, error } = usePRD()
  
  const [prds, setPrds] = useState([])
  const [filteredPrds, setFilteredPrds] = useState([])
  const [filterStage, setFilterStage] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [actionPRD, setActionPRD] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState(null)

  useEffect(() => {
    fetchPRDs()
  }, [])

  useEffect(() => {
    filterPRDs()
  }, [prds, filterStage, searchTerm])

  const fetchPRDs = async () => {
    try {
      const response = await getAllPRDs()
      if (response.status === 'success') {
        setPrds(response.data)
      }
    } catch (error) {
      console.error('Error fetching PRDs:', error)
    }
  }

  const filterPRDs = () => {
    let filtered = [...prds]

    if (filterStage !== 'all') {
      filtered = filtered.filter(prd => prd.document_stage === filterStage)
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(prd => 
        prd.product_name.toLowerCase().includes(term) ||
        (prd.project_overview && prd.project_overview.toLowerCase().includes(term))
      )
    }

    setFilteredPrds(filtered)
  }

  const handleArchive = async (id) => {
    try {
      await archivePRD(id)
      setPrds(prds.map(prd => 
        prd.id === id ? { ...prd, document_stage: 'archived' } : prd
      ))
    } catch (error) {
      console.error('Error archiving PRD:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this PRD?')) {
      try {
        await deletePRD(id)
        setPrds(prds.filter(prd => prd.id !== id))
      } catch (error) {
        console.error('Error deleting PRD:', error)
      }
    }
  }

  const handleDownload = async (prd) => {
    try {
      const response = await downloadPRD(prd.id)
      if (response.status === 'success' && response.data?.download_url) {
        setPrds(prds.map(p => 
          p.id === prd.id 
            ? { ...p, document_stage: 'finished', updated_at: new Date().toISOString() }
            : p
        ))
        window.open(response.data.download_url, '_blank')
      }
    } catch (error) {
      setActionError(error.message || 'Failed to download PRD')
    }
  }

  const getStageColor = (stage) => {
    switch (stage) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'inprogress':
        return 'bg-blue-100 text-blue-800'
      case 'finished':
        return 'bg-green-100 text-green-800'
      case 'archived':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Product Requirements Documents</h2>
            <p className="text-gray-600 mt-1">Manage and organize your PRDs</p>
          </div>
          <Link 
            to="/prds/new" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create New PRD
          </Link>
        </div>

        {/* Error Display */}
        {(error || actionError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-1">{error || actionError}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Loading PRDs...</span>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-sm font-medium text-gray-500">Total PRDs</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{prds.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
                <p className="mt-1 text-2xl font-semibold text-blue-600">
                  {prds.filter(p => p.document_stage === 'inprogress').length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-sm font-medium text-gray-500">Finished</h3>
                <p className="mt-1 text-2xl font-semibold text-green-600">
                  {prds.filter(p => p.document_stage === 'finished').length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-sm font-medium text-gray-500">Archived</h3>
                <p className="mt-1 text-2xl font-semibold text-purple-600">
                  {prds.filter(p => p.document_stage === 'archived').length}
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search PRDs..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={filterStage}
                    onChange={(e) => setFilterStage(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="all">All Stages</option>
                    <option value="draft">Draft</option>
                    <option value="inprogress">In Progress</option>
                    <option value="finished">Finished</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PRD List */}
            {filteredPrds.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 text-center py-12">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {prds.length === 0 ? 'No PRDs found' : 'No PRDs match your filters'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {prds.length === 0 
                    ? 'Create your first Product Requirements Document to get started.' 
                    : 'Try adjusting your search or filter criteria.'
                  }
                </p>
                {prds.length === 0 && (
                  <Link
                    to="/prds/new"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Create Your First PRD
                  </Link>
                )}
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg divide-y">
                {filteredPrds.map(prd => (
                  <div key={prd.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link to={`/prds/${prd.id}`} className="text-lg font-medium text-blue-600 hover:text-blue-800">
                          {prd.product_name}
                        </Link>
                        <p className="mt-1 text-sm text-gray-500">{prd.project_overview}</p>
                        <div className="mt-2 flex items-center space-x-4">
                          <span className="text-sm text-gray-500">Version: {prd.document_version}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(prd.document_stage)}`}>
                            {prd.document_stage}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleArchive(prd.id)}
                          className="p-2 text-gray-400 hover:text-purple-600"
                          title="Archive"
                        >
                          <ArchiveBoxIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(prd.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Show count */}
            {filteredPrds.length > 0 && (
              <div className="text-center text-sm text-gray-500 pt-4">
                Showing {filteredPrds.length} of {prds.length} PRDs
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

export default PRDs