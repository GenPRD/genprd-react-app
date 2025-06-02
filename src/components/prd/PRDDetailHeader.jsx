import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PencilSquareIcon, 
  ArrowDownTrayIcon, 
  TrashIcon, 
  ArchiveBoxIcon 
} from '@heroicons/react/24/outline';

const PRDDetailHeader = ({ 
  prd, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDownload, 
  onDelete, 
  onArchive 
}) => {
  
  const getStageColor = (stage) => {
    switch(stage) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'inprogress':
        return 'bg-blue-100 text-blue-800';
      case 'finished':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="py-6 px-8">
      <Link
        to="/prds"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium mb-5"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Back to PRDs
      </Link>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {isEditing ? (
            <input
              className="text-3xl font-bold text-gray-900 border-b-2 border-gray-200 focus:outline-none focus:border-gray-900 bg-gray-50 px-3 py-2 rounded-md w-full"
              value={prd.product_name}
              onChange={e => onEdit('product_name', e.target.value)}
              placeholder="Product Name"
            />
          ) : (
            <h1 className="text-3xl font-bold text-gray-900">{prd.product_name}</h1>
          )}
          
          <div className="flex items-center space-x-2 ml-4">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getStageColor(prd.document_stage)}`}>
              {prd.document_stage === 'inprogress' 
                ? 'In Progress' 
                : prd.document_stage.charAt(0).toUpperCase() + prd.document_stage.slice(1)}
            </span>
            <span className="text-sm font-medium text-gray-500">v{prd.document_version}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {!isEditing ? (
            <>
              <button 
                onClick={onEdit} 
                className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 transition-all"
              >
                <PencilSquareIcon className="w-5 h-5 mr-2" />
                Edit
              </button>
              
              <button 
                onClick={onDownload}
                className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 transition-all"
              >
                <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                Download
              </button>
              
              {prd.document_stage !== 'archived' && (
                <button 
                  onClick={onArchive}
                  className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <ArchiveBoxIcon className="w-5 h-5 mr-2" />
                  Archive
                </button>
              )}
              
              <button 
                onClick={onDelete}
                className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-all"
              >
                <TrashIcon className="w-5 h-5 mr-2" />
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onCancel}
                className="inline-flex items-center px-4 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="inline-flex items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-all"
              >
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PRDDetailHeader;