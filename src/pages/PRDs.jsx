import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { usePRD } from '../hooks/usePRD';
import { 
  PlusIcon, 
  TrashIcon,
  ArchiveBoxIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import EmptyState from '../components/prd/EmptyState';
import PRDCard from '../components/prd/PRDCard';
import PRDFilters from '../components/prd/PRDFilters';
import ConfirmationModal from '../components/common/ConfirmationModal';
import ContextMenu from '../components/common/ContextMenu';
import { emitEvent, PRD_EVENTS } from '../utils/events';

const PRDs = () => {
  const { user } = useAuth();
  const { 
    getAllPRDs, 
    archivePRD, 
    deletePRD, 
    downloadPRD, 
    togglePinPRD,
    updatePRDStage,
    loading: apiLoading, 
    error: apiError 
  } = usePRD();
  
  // Definisikan state yang belum ada
  const [prds, setPrds] = useState([]);
  const [filteredPrds, setFilteredPrds] = useState([]);
  const [filterStage, setFilterStage] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionPRD, setActionPRD] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [contextMenu, setContextMenu] = useState({
    isOpen: false,
    position: { x: 0, y: 0 },
    prd: null
  });

  // Available stage filters
  const stageFilters = [
    { value: 'all', label: 'All' },
    { value: 'draft', label: 'Draft' },
    { value: 'inprogress', label: 'In Progress' },
    { value: 'finished', label: 'Finished' },
    { value: 'archived', label: 'Archived' }
  ];

  useEffect(() => {
    fetchPRDs();
  }, []);

  useEffect(() => {
    filterPRDs();
  }, [prds, filterStage, searchTerm]);

  const fetchPRDs = async () => {
    try {
      setActionLoading(true);
      console.log('Making API request to fetch PRDs...');
      console.log('API URL:', import.meta.env.VITE_API_URL); // Untuk debugging
      
      const response = await getAllPRDs();
      console.log('API Response:', response);
      
      if (response && response.status === 'success') {
        console.log('Setting PRDs state with data:', response.data.prds);
        setPrds(response.data.prds || []);
      } else {
        console.warn('API Response received but status is not success:', response);
        setActionError('Failed to retrieve PRDs data');
      }
    } catch (error) {
      console.error('Error fetching PRDs:', error);
      if (error.response) {
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      setActionError(error?.message || 'Failed to fetch PRDs. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const filterPRDs = () => {
    let filtered = [...prds];

    if (filterStage !== 'all') {
      filtered = filtered.filter(prd => prd.document_stage === filterStage);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(prd => 
        prd.product_name.toLowerCase().includes(term) ||
        (prd.project_overview && prd.project_overview.toLowerCase().includes(term))
      );
    }

    // Sort by pinned status (pinned first) then by updated date
    filtered.sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      
      const dateA = new Date(a.updated_at || a.created_at);
      const dateB = new Date(b.updated_at || b.created_at);
      return dateB - dateA; // newest first
    });

    setFilteredPrds(filtered);
  };

  const handleArchive = async (prd) => {
    try {
      setActionLoading(true);
      console.log('Archiving PRD with ID:', prd.id);
      const response = await archivePRD(prd.id);
      console.log('Archive response:', response);
      
      if (response && response.status === 'success') {
        // Update local state dengan stage yang sudah diperbarui dari response
        const newStage = response.data.document_stage || 
          (prd.document_stage === 'archived' ? 'draft' : 'archived');
        
        // Buat objek PRD yang sudah diupdate
        const updatedPrd = {
          ...prd,
          document_stage: newStage
        };
        
        setPrds(prds.map(p => 
          p.id === prd.id ? updatedPrd : p
        ));
        
        // Emit event after successful archive/unarchive
        emitEvent(PRD_EVENTS.ARCHIVE_TOGGLED, { prd: updatedPrd });
        
        setShowArchiveModal(false);
        setActionPRD(null);
      } else {
        console.warn('Unexpected API response:', response);
        setActionError('Failed to archive PRD. Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error archiving PRD:', error);
      setActionError(error.message || 'Failed to archive PRD');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePin = async (prd) => {
    try {
      setActionLoading(true);
      console.log('Toggling pin status for PRD with ID:', prd.id);
      const response = await togglePinPRD(prd.id);
      console.log('Pin toggle response:', response);
      
      if (response && response.status === 'success') {
        // Update local state dengan is_pinned dari response atau toggle nilai saat ini
        const newPinnedStatus = response.data?.is_pinned ?? !prd.is_pinned;
        
        // Buat objek PRD yang sudah diupdate
        const updatedPrd = {
          ...prd,
          is_pinned: newPinnedStatus
        };
        
        // Update state prds
        setPrds(prds.map(p => 
          p.id === prd.id ? updatedPrd : p
        ));

        // Emit event after successful pin toggle with updatedPrd
        emitEvent(PRD_EVENTS.PIN_TOGGLED, { prd: updatedPrd });
      } else {
        console.warn('Unexpected API response:', response);
        setActionError('Failed to update pin status. Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error toggling pin status:', error);
      setActionError(error.message || 'Failed to update pin status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!actionPRD) return;
    
    try {
      setActionLoading(true);
      await deletePRD(actionPRD.id);
      setPrds(prds.filter(prd => prd.id !== actionPRD.id));
      setShowDeleteModal(false);
      setActionPRD(null);
    } catch (error) {
      console.error('Error deleting PRD:', error);
      setActionError(error.message || 'Failed to delete PRD');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownload = async (prd) => {
    try {
      setActionLoading(true);
      const response = await downloadPRD(prd.id);
      if (response.status === 'success' && response.data?.download_url) {
        setPrds(prds.map(p => 
          p.id === prd.id 
            ? { ...p, document_stage: 'finished', updated_at: new Date().toISOString() }
            : p
        ));
        window.open(response.data.download_url, '_blank');
      }
    } catch (error) {
      setActionError(error.message || 'Failed to download PRD');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMenuClick = (event, prd) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Get the position of the click relative to the viewport
    const rect = event.currentTarget.getBoundingClientRect();
    
    if (!prd) return;
    
    setContextMenu({
      isOpen: true,
      position: {
        x: rect.right - 5, // Position near the right edge of button
        y: rect.bottom + 5 // Position slightly below button
      },
      prd
    });
  };

  const handleContextMenuClose = () => {
    setContextMenu({
      isOpen: false,
      position: { x: 0, y: 0 },
      prd: null
    });
  };

  const renderContextMenuItems = (prd) => {
    return [
      {
        icon: <PencilSquareIcon className="h-5 w-5" />,
        label: 'Edit',
        onClick: () => {
          window.location.href = `/prds/${prd.id}`;
        }
      },
      {
        icon: <ArrowDownTrayIcon className="h-5 w-5" />,
        label: 'Download',
        onClick: () => handleDownload(prd)
      },
      {
        icon: prd.is_pinned ? 
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.143 17.082a24.248 24.248 0 0 0 3.844.148m-3.844-.148a23.856 23.856 0 0 1-5.455-1.31 8.964 8.964 0 0 0 2.3-5.542m3.155 6.852a3 3 0 0 0 5.667 1.97m1.965-2.277L21 21m-4.225-4.225a23.81 23.81 0 0 0 3.536-1.003A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6.53 6.53m10.245 10.245L6.53 6.53M3 3l18 18" />
          </svg> : 
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.48 3.499-.39-.396a.75.75 0 0 1 1.079-.148l11.25 11.025a.75.75 0 0 1-.12 1.155l-8.711 4.886a.75.75 0 0 1-.832-.132l-10.5-10.5a.75.75 0 0 1-.149-1.078l.396-.396 8.964-5.417Z" />
          </svg>,
        label: prd.is_pinned ? 'Unpin' : 'Pin',
        onClick: () => handlePin(prd)
      },
      {
        icon: <ArchiveBoxIcon className="h-5 w-5" />,
        label: prd.document_stage === 'archived' ? 'Unarchive' : 'Archive',
        onClick: () => {
          setActionPRD(prd);
          setShowArchiveModal(true);
        }
      },
      {
        icon: <TrashIcon className="h-5 w-5" />,
        label: 'Delete',
        onClick: () => {
          setActionPRD(prd);
          setShowDeleteModal(true);
        },
        danger: true
      }
    ];
  };

  return (
    <div className="w-full">
      {/* Header Section - Updated layout with flex to align title and button */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">All PRDs</h1>
            <p className="text-gray-600 mt-1">
              Manage and organize your Product Requirements Documents
            </p>
          </div>
          
          {/* Create New PRD button - now positioned to the right */}
          <Link
            to="/prds/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-800"
          >
            <PlusIcon className="w-5 h-5 mr-2" /> Create New PRD
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {apiLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          <span className="ml-4 text-gray-600">Loading PRDs...</span>
        </div>
      )}

      {/* Error State */}
      {(apiError || actionError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Error</p>
          <p className="text-sm">{apiError || actionError}</p>
          <button
            onClick={() => {
              setActionError(null);
              fetchPRDs();
            }}
            className="mt-2 text-sm text-red-700 hover:text-red-800 underline focus:outline-none"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Content */}
      {!apiLoading && (
        <>
          {/* Filters - Moved up with less bottom margin */}
          <PRDFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStage={filterStage}
            onFilterChange={setFilterStage}
            availableStages={stageFilters}
          />

          {/* PRD Grid */}
          {filteredPrds.length === 0 ? (
            <EmptyState
              isEmpty={prds.length === 0}
              isFiltered={prds.length > 0 && filteredPrds.length === 0}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
              {filteredPrds.map(prd => (
                <motion.div
                  key={prd.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                  data-prd-id={prd.id}
                >
                  <PRDCard
                    prd={prd}
                    onPin={() => handlePin(prd)}
                    onMenuClick={(e) => handleMenuClick(e, prd)}
                    onArchive={() => {
                      setActionPRD(prd);
                      setShowArchiveModal(true);
                    }}
                    onDelete={() => {
                      setActionPRD(prd);
                      setShowDeleteModal(true);
                    }}
                    onDownload={() => handleDownload(prd)}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Show count */}
          {filteredPrds.length > 0 && (
            <div className="text-center text-sm text-gray-500 pt-6">
              Showing {filteredPrds.length} of {prds.length} PRDs
            </div>
          )}
        </>
      )}

      {/* Context Menu - Updated to fix positioning */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        items={contextMenu.prd ? renderContextMenuItems(contextMenu.prd) : []}
        onClose={handleContextMenuClose}
        className="z-50 shadow-lg"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal && actionPRD !== null}
        title="Delete PRD"
        message={
          <span>
            Are you sure you want to delete the PRD "<span className="font-semibold text-gray-700">
              {actionPRD?.product_name}
            </span>"? This action cannot be undone.
          </span>
        }
        icon={<TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />}
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700 focus:ring-red-500"
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setActionPRD(null);
        }}
      />

      {/* Archive Confirmation Modal */}
      <ConfirmationModal
        isOpen={showArchiveModal && actionPRD !== null}
        title={actionPRD?.document_stage === 'archived' ? "Unarchive PRD" : "Archive PRD"}
        message={
          <span>
            Are you sure you want to {actionPRD?.document_stage === 'archived' ? "unarchive" : "archive"} the PRD "<span className="font-semibold text-gray-700">
              {actionPRD?.product_name}
            </span>"?
          </span>
        }
        icon={<ArchiveBoxIcon className="h-6 w-6 text-amber-600" aria-hidden="true" />}
        confirmText={actionPRD?.document_stage === 'archived' ? "Unarchive" : "Archive"}
        confirmButtonClass="bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
        onConfirm={() => handleArchive(actionPRD)}
        onCancel={() => {
          setShowArchiveModal(false);
          setActionPRD(null);
        }}
      />
    </div>
  );
};

export default PRDs;