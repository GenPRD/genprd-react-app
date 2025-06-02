import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const PRDMetricsSection = ({ prd, isEditing, onSectionChange, onRemoveSection, onAddSection }) => {
  const metrics = prd.generated_sections?.success_metrics?.metrics || [];
  
  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Success Metrics</h2>
      </div>
      
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Definition</th>
              {isEditing && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {metrics.map((metric, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {isEditing ? (
                      <input 
                        type="text" 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm" 
                        value={metric.name || ''}
                        onChange={(e) => onSectionChange('success_metrics', idx, 'name', e.target.value)}
                        placeholder="Metric name"
                      />
                    ) : (
                      metric.name || '-'
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">
                    {isEditing ? (
                      <input 
                        type="text" 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm" 
                        value={metric.target || ''}
                        onChange={(e) => onSectionChange('success_metrics', idx, 'target', e.target.value)}
                        placeholder="Target value"
                      />
                    ) : (
                      metric.target || '-'
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">
                    {isEditing ? (
                      <input 
                        type="text" 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm" 
                        value={metric.current || ''}
                        onChange={(e) => onSectionChange('success_metrics', idx, 'current', e.target.value)}
                        placeholder="Current value"
                      />
                    ) : (
                      metric.current || '-'
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">
                    {isEditing ? (
                      <input 
                        type="text" 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm" 
                        value={metric.definition || ''}
                        onChange={(e) => onSectionChange('success_metrics', idx, 'definition', e.target.value)}
                        placeholder="Metric definition"
                      />
                    ) : (
                      metric.definition || '-'
                    )}
                  </div>
                </td>
                {isEditing && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => onRemoveSection('success_metrics', idx)} 
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        
        {isEditing && (
          <div className="px-6 py-4">
            <button
              type="button"
              onClick={() => onAddSection('success_metrics')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Metric
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PRDMetricsSection;