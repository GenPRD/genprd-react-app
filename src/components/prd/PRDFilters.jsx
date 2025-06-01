import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const PRDFilters = ({ 
  searchTerm, 
  onSearchChange, 
  filterStage, 
  onFilterChange,
  availableStages
}) => {
  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search PRDs..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          {availableStages.map(stage => (
            <button
              key={stage.value}
              onClick={() => onFilterChange(stage.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                filterStage === stage.value
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PRDFilters;