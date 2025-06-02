import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

const PRDCustomSection = ({ 
  section, 
  isEditing, 
  onUpdate, 
  onDelete 
}) => {
  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-8 py-5 border-b border-gray-200 flex justify-between items-center">
        {isEditing ? (
          <input
            type="text"
            className="text-lg font-medium text-gray-900 border-b border-gray-200 bg-transparent focus:border-gray-900 focus:ring-0 focus:outline-none px-1 py-1 w-full"
            value={section.title}
            onChange={(e) => onUpdate({ ...section, title: e.target.value })}
            placeholder="Section Title"
          />
        ) : (
          <h2 className="text-lg font-medium text-gray-900">{section.title}</h2>
        )}
        
        {isEditing && (
          <button
            type="button"
            onClick={() => onDelete(section.id)}
            className="text-gray-400 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 p-1 rounded-md"
            title="Delete section"
            aria-label="Delete section"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="p-8">
        {isEditing ? (
          <textarea
            rows={8}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-3"
            value={section.content || ''}
            onChange={(e) => onUpdate({ ...section, content: e.target.value })}
            placeholder="Enter section content here..."
          />
        ) : (
          <div className="prose prose-gray max-w-none">
            <p className="whitespace-pre-line text-gray-700">{section.content || 'No content added yet.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PRDCustomSection;