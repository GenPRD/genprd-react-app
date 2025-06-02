import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const PRDTimelineSection = ({ prd, isEditing, onSectionChange, onRemoveSection, onAddSection }) => {
  const phases = prd.generated_sections?.project_timeline?.phases || [];
  
  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Project Timeline</h2>
      </div>
      
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Person In Charge</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Period</th>
              {isEditing && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {phases.map((phase, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {isEditing ? (
                      <input 
                        type="text" 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm" 
                        value={phase.pic || ''}
                        onChange={(e) => onSectionChange('project_timeline', idx, 'pic', e.target.value)}
                        placeholder="Person responsible"
                      />
                    ) : (
                      phase.pic || '-'
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {isEditing ? (
                      <input 
                        type="text" 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm" 
                        value={phase.activity || ''}
                        onChange={(e) => onSectionChange('project_timeline', idx, 'activity', e.target.value)}
                        placeholder="Activity description"
                      />
                    ) : (
                      phase.activity || '-'
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {isEditing ? (
                      <input 
                        type="text" 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm" 
                        value={phase.time_period || ''}
                        onChange={(e) => onSectionChange('project_timeline', idx, 'time_period', e.target.value)}
                        placeholder="e.g. Week 1-2"
                      />
                    ) : (
                      phase.time_period || '-'
                    )}
                  </div>
                </td>
                {isEditing && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => onRemoveSection('project_timeline', idx)} 
                      className="text-red-600 hover:text-red-900"
                      aria-label="Delete timeline item"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        
        {phases.length === 0 && !isEditing && (
          <div className="px-6 py-4 text-center text-sm text-gray-500">
            No timeline items defined.
          </div>
        )}
        
        {isEditing && (
          <div className="px-6 py-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => onAddSection('project_timeline')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Timeline Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PRDTimelineSection;