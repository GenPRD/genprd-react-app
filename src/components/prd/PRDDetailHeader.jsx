import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  XMarkIcon,
  CheckIcon,
  DocumentIcon,
  ArrowPathIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';
import PRDActionDropdownSimple from './PRDActionDropdownSimple';

const PRDDetailHeader = ({ 
  prd, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDownload, 
  onDelete, 
  onArchive,
  onChangeStage
}) => {
  const [productName, setProductName] = useState(prd?.product_name || '');
  const [documentVersion, setDocumentVersion] = useState(prd?.document_version || '');
  
  // Reset local state when prd changes
  useEffect(() => {
    if (prd) {
      setProductName(prd.product_name || '');
      setDocumentVersion(prd.document_version || '');
    }
  }, [prd]);

  const handleSave = () => {
    // Pass all changes as a single object to parent
    const changes = {
      product_name: productName,
      document_version: documentVersion
    };
    console.log('Sending changes to parent:', changes); // Debug log
    onEdit(changes); // Send changes to parent
    onSave(); // Trigger save in parent
  };

  const StageButton = ({ stage, label, icon: Icon }) => (
    <button
      onClick={() => onChangeStage(stage)}
      className={`inline-flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${
        prd.document_stage === stage
          ? 'bg-gray-100 text-gray-900 font-medium'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-4 h-4 mr-1.5" />
      {label}
    </button>
  );

  if (!prd) return null;

  return (
    <div className="py-6 px-8">
      {/* Back button */}
      <Link
        to="/prds"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium mb-5"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-2" />
        Back to PRDs
      </Link>

      {/* Main header content */}
      <div className="space-y-4">
        {/* Title and version row */}
        <div className="flex items-start justify-between">
          <div className="flex-1 mr-8">
            {isEditing ? (
              <input
                className="text-3xl font-bold text-gray-900 border-b-2 border-gray-200 focus:outline-none focus:border-gray-900 bg-transparent px-1 py-1 w-full"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Product Name"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900">{prd.product_name}</h1>
            )}
          </div>
          
          <div className="flex items-center space-x-3 flex-shrink-0">
            {isEditing ? (
              <div className="flex items-center space-x-3">
                {/* Version input */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-xs">
                    v
                  </span>
                  <input
                    type="text"
                    className="pl-6 pr-2 py-1 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                    value={documentVersion}
                    onChange={(e) => setDocumentVersion(e.target.value)}
                    placeholder="1.0"
                    style={{ width: '70px' }}
                  />
                </div>
                
                {/* Edit mode buttons */}
                <button
                  onClick={onCancel}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white text-gray-700 hover:bg-gray-50"
                >
                  <XMarkIcon className="w-5 h-5 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium bg-gray-900 text-white hover:bg-gray-800"
                >
                  <CheckIcon className="w-5 h-5 mr-2" />
                  Save Changes
                </button>
              </div>
            ) : (
              <>
                <span className="text-sm font-medium text-gray-500">v{prd.document_version}</span>
                <PRDActionDropdownSimple
                  prd={prd}
                  onEdit={() => onEdit()}
                  onDownload={onDownload}
                  onArchive={onArchive}
                  onDelete={onDelete}
                  onChangeStage={onChangeStage}
                />
              </>
            )}
          </div>
        </div>

        {/* Status buttons row */}
        {!isEditing && (
          <div className="flex items-center space-x-2 border-t border-gray-200 pt-4">
            <span className="text-sm text-gray-500 mr-2">Status:</span>
            <div className="flex space-x-2">
              <StageButton 
                stage="draft" 
                label="Draft" 
                icon={DocumentIcon}
              />
              <StageButton 
                stage="inprogress" 
                label="In Progress" 
                icon={ArrowPathIcon}
              />
              <StageButton 
                stage="finished" 
                label="Finished" 
                icon={DocumentCheckIcon}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PRDDetailHeader;