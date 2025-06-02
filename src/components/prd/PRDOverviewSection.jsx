import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const PRDOverviewSection = ({ prd, isEditing, onChange, onAddSection, onRemoveSection, onSectionChange }) => {
  const handleSectionChange = (idx, field, value) => {
    const updatedSections = [...(prd.generated_sections?.overview?.sections || [])];
    if (updatedSections[idx]) {
      updatedSections[idx] = { ...updatedSections[idx], [field]: value };
      onChange('generated_sections', {
        ...prd.generated_sections,
        overview: {
          ...(prd.generated_sections?.overview || {}),
          sections: updatedSections
        }
      });
    }
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-8 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Project Overview</h2>
      </div>
      
      <div className="p-8">
        {/* Main Project Overview */}
        {isEditing ? (
          <div className="mb-7">
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Overview</label>
            <textarea
              rows={5}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-3"
              value={prd.project_overview || ''}
              onChange={(e) => onChange('project_overview', e.target.value)}
              placeholder="Enter project overview..."
            />
          </div>
        ) : (
          <div className="prose max-w-none mb-7">
            <p className="whitespace-pre-line text-gray-700">{prd.project_overview}</p>
          </div>
        )}
        
        {/* Overview Sections (Objective, Problem Statement, etc.) */}
        {(prd.generated_sections?.overview?.sections || []).map((section, idx) => (
          <div key={idx} className="mt-6 border-t border-gray-200 pt-6">
            {isEditing ? (
              <>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-3"
                    value={section.title || ''}
                    onChange={(e) => handleSectionChange(idx, 'title', e.target.value)}
                    placeholder="Section title"
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section Content</label>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-3"
                    value={section.content || ''}
                    onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
                    placeholder="Section content"
                  />
                </div>
                <div className="flex justify-end">
                  <button 
                    type="button"
                    onClick={() => onRemoveSection('overview', idx)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove section
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-base font-medium text-gray-900 mb-3">{section.title}</h3>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line text-gray-700">{section.content}</p>
                </div>
              </>
            )}
          </div>
        ))}
        
        {isEditing && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => onAddSection('overview')}
              className="inline-flex items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Section
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PRDOverviewSection;