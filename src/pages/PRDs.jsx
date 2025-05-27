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
import { TrashIcon as TrashIconOutline } from '@heroicons/react/24/outline';

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

  // Function to open delete modal
  const handleDeleteClick = (prd) => {
    setActionPRD(prd);
    setShowDeleteModal(true);
  };

  // Function to confirm delete (called from modal)
  const handleConfirmDelete = async () => {
    if (!actionPRD) return; // Should not happen if modal is opened correctly
    try {
      await deletePRD(actionPRD.id);
      setPrds(prds.filter(prd => prd.id !== actionPRD.id));
      setActionPRD(null);
    } catch (error) {
      console.error('Error deleting PRD:', error);
      setActionError(error.message || 'Failed to delete PRD');
    } finally {
      setShowDeleteModal(false); // Close modal
    }
  };

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
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Product Requirements Documents</h1>
        <p className="text-gray-600 mt-1">
          Manage and organize your PRDs
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
          <span className="ml-4 text-gray-600">Loading PRDs...</span>
        </div>
      )}

      {/* Error State */}
      {(error || actionError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error || actionError}</p>
          <button
            onClick={() => fetchPRDs()}
            className="mt-2 text-sm text-red-700 hover:text-red-800 underline focus:outline-none"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <>
          {/* Filters */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
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
            <div className="bg-white border border-gray-200 rounded-lg text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {prds.length === 0 ? 'No PRDs found' : 'No PRDs match your filters'}
              </h3>
              <p className="text-gray-500 mb-6">
                {prds.length === 0 
                  ? 'Create your first Product Requirements Document to get started.' 
                  : 'Try adjusting your search or filter criteria.'}
              </p>
              {prds.length === 0 && (
                <Link
                  to="/prds/new"
                  className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Your First PRD
                </Link>
              )}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg divide-y">
              {filteredPrds.map(prd => (
                <div key={prd.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link 
                        to={`/prds/${prd.id}`}
                        className="text-lg font-medium text-gray-900 hover:text-blue-600"
                      >
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
                        onClick={() => handleDeleteClick(prd)}
                        className="p-2 text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDownload(prd)}
                        className="p-2 text-gray-400 hover:text-blue-600"
                        title="Download"
                      >
                        <ArrowDownTrayIcon className="w-5 h-5" />
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

      {/* Delete Confirmation Modal (Implemented directly) */}
      {showDeleteModal && actionPRD && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

            {/* Modal panel */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIconOutline className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Delete PRD
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the PRD "<span className="font-semibold text-gray-700">{actionPRD.product_name}</span>"?
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PRDs