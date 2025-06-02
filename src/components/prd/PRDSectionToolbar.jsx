import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const PRDSectionToolbar = ({ onAddCustomSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sectionTitle, setSectionTitle] = useState('');
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleAdd = () => {
    if (sectionTitle.trim()) {
      onAddCustomSection(sectionTitle.trim());
      setSectionTitle('');
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && sectionTitle.trim()) {
      handleAdd();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };
  
  return (
    <div className="mb-12 relative" ref={dropdownRef}>
      <div className="sticky bottom-4 flex justify-center">
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            // Focus the input when opening
            if (!isOpen) {
              setTimeout(() => inputRef.current?.focus(), 100);
            }
          }}
          className="inline-flex items-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all transform hover:scale-105"
        >
          <PlusIcon className="w-5 h-5 mr-2 text-gray-600" />
          Add New Section
          <ChevronDownIcon className={`w-5 h-5 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {isOpen && (
        <div className="absolute bottom-full mb-2 w-96 p-6 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="mb-4">
            <label htmlFor="section-title" className="block text-sm font-medium text-gray-700 mb-2">
              Section Title
            </label>
            <input
              type="text"
              id="section-title"
              ref={inputRef}
              value={sectionTitle}
              onChange={e => setSectionTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-3"
              placeholder="Enter section title"
              autoComplete="off"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!sectionTitle.trim()}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                sectionTitle.trim() 
                  ? 'bg-gray-900 text-white hover:bg-gray-800' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Add Section
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PRDSectionToolbar;