import React, { useState, useRef, useEffect } from 'react';
import { 
  EllipsisVerticalIcon, 
  PencilSquareIcon, 
  ArrowDownTrayIcon, 
  ArchiveBoxIcon, 
  TrashIcon,
  DocumentCheckIcon,
  DocumentIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const PRDActionDropdown = ({ 
  prd, 
  onEdit, 
  onDownload, 
  onArchive, 
  onDelete,
  onChangeStage
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  
  // Improved click outside detection
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setIsOpen(false);
      });
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleClickOutside);
    };
  }, [isOpen]);
  
  const isArchived = prd?.document_stage === 'archived';
  
  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Toggling dropdown:", !isOpen);
    setIsOpen(!isOpen);
  };
  
  const handleAction = (action) => {
    // Close dropdown first
    setIsOpen(false);
    // Then execute action with small delay
    setTimeout(() => {
      action();
    }, 10);
  };
  
  return (
    <div className="relative inline-block text-left" style={{ zIndex: 50 }}>
      <button
        type="button"
        onClick={toggleDropdown}
        ref={buttonRef}
        className="inline-flex items-center justify-center p-3 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        id="prd-actions-menu-button"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="sr-only">Open actions menu</span>
        <EllipsisVerticalIcon className="h-6 w-6" aria-hidden="true" />
      </button>
      
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="fixed origin-top-right right-4 mt-2 w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="prd-actions-menu-button"
          tabIndex="-1"
          style={{
            zIndex: 100,
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div className="py-1" role="none">
            <button
              className="group flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              onClick={() => handleAction(onEdit)}
              role="menuitem"
              tabIndex="-1"
            >
              <PencilSquareIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
              Edit
            </button>
            
            <button
              className="group flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              onClick={() => handleAction(onDownload)}
              role="menuitem"
              tabIndex="-1"
            >
              <ArrowDownTrayIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
              Download
            </button>
          </div>
          
          <div className="py-1" role="none">
            <div className="px-4 py-2 text-xs text-gray-500">Change Document Stage</div>
            <button
              className={`group flex items-center px-4 py-2.5 text-sm w-full text-left ${
                prd.document_stage === 'draft' 
                  ? 'bg-gray-100 text-gray-900 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={() => handleAction(() => onChangeStage('draft'))}
              role="menuitem"
              tabIndex="-1"
            >
              <DocumentIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
              Draft
            </button>
            
            <button
              className={`group flex items-center px-4 py-2.5 text-sm w-full text-left ${
                prd.document_stage === 'inprogress' 
                  ? 'bg-gray-100 text-gray-900 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={() => handleAction(() => onChangeStage('inprogress'))}
              role="menuitem"
              tabIndex="-1"
            >
              <ArrowPathIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
              In Progress
            </button>
            
            <button
              className={`group flex items-center px-4 py-2.5 text-sm w-full text-left ${
                prd.document_stage === 'finished' 
                  ? 'bg-gray-100 text-gray-900 font-medium' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
              onClick={() => handleAction(() => onChangeStage('finished'))}
              role="menuitem"
              tabIndex="-1"
            >
              <DocumentCheckIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
              Finished
            </button>
          </div>
          
          <div className="py-1" role="none">
            {isArchived ? (
              <button
                className="group flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                onClick={() => handleAction(onArchive)}
                role="menuitem"
                tabIndex="-1"
              >
                <ArchiveBoxIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                Unarchive
              </button>
            ) : (
              <button
                className="group flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                onClick={() => handleAction(onArchive)}
                role="menuitem"
                tabIndex="-1"
              >
                <ArchiveBoxIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" aria-hidden="true" />
                Archive
              </button>
            )}
            
            <button
              className="group flex items-center px-4 py-2.5 text-sm text-red-700 hover:bg-red-100 hover:text-red-900 w-full text-left"
              onClick={() => handleAction(onDelete)}
              role="menuitem"
              tabIndex="-1"
            >
              <TrashIcon className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" aria-hidden="true" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PRDActionDropdown;