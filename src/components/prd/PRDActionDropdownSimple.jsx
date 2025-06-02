import React, { useState } from 'react';
import { 
  EllipsisVerticalIcon,
  PencilSquareIcon, 
  ArrowDownTrayIcon, 
  ArchiveBoxIcon, 
  TrashIcon
} from '@heroicons/react/24/outline';

// Versi sederhana dropdown tanpa advanced click outside handling
const PRDActionDropdownSimple = ({
  prd,
  onEdit,
  onDownload,
  onArchive,
  onDelete,
  onChangeStage
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative inline-block text-left">
      {/* Dropdown button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 text-gray-600 hover:bg-gray-100 rounded-full"
      >
        <EllipsisVerticalIcon className="w-6 h-6" />
      </button>
      
      {/* Actual dropdown menu - positioned absolutely */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
          style={{
            zIndex: 9999, 
            position: 'fixed',
            right: '16px',
            minWidth: '200px'
          }}
          onClick={() => setIsOpen(false)}
        >
          <div className="py-1">
            <button
              className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={onEdit}
            >
              <PencilSquareIcon className="mr-3 h-5 w-5 text-gray-400" />
              Edit
            </button>
            
            <button
              className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={onDownload}
            >
              <ArrowDownTrayIcon className="mr-3 h-5 w-5 text-gray-400" />
              Download
            </button>
          </div>
          
          {/* Simplified actions */}
          <div className="py-1">
            <button
              className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              onClick={prd.document_stage === 'archived' ? () => onChangeStage('draft') : onArchive}
            >
              <ArchiveBoxIcon className="mr-3 h-5 w-5 text-gray-400" />
              {prd.document_stage === 'archived' ? 'Unarchive' : 'Archive'}
            </button>
            
            <button
              className="group flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-100 w-full text-left"
              onClick={onDelete}
            >
              <TrashIcon className="mr-3 h-5 w-5 text-red-400" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PRDActionDropdownSimple;