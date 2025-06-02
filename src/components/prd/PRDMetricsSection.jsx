import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const PRDMetricsSection = ({ prd, isEditing, onSectionChange, onRemoveSection, onAddSection }) => {
  const metrics = prd.generated_sections?.success_metrics?.metrics || [];
  
  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-8 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Success Metrics</h2>
      </div>
      
      <div className="overflow-hidden">
        <div className="px-8 py-5">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th scope="col" className="pb-3 text-left text-sm font-medium text-gray-900 w-1/4">
                  Metric
                </th>
                <th scope="col" className="pb-3 text-left text-sm font-medium text-gray-900 w-1/6">
                  Target
                </th>
                <th scope="col" className="pb-3 text-left text-sm font-medium text-gray-900 w-1/6">
                  Current
                </th>
                <th scope="col" className="pb-3 text-left text-sm font-medium text-gray-900">
                  Definition
                </th>
                {isEditing && (
                  <th scope="col" className="pb-3 text-right text-sm font-medium text-gray-900 w-20">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {metrics.map((metric, idx) => (
                <tr key={idx} className="align-top">
                  <td className="py-4 pr-4">
                    {isEditing ? (
                      <input 
                        type="text" 
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm" 
                        value={metric.name || ''}
                        onChange={(e) => onSectionChange('success_metrics', idx, 'name', e.target.value)}
                        placeholder="Metric name"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">
                        {metric.name || '-'}
                      </div>
                    )}
                  </td>
                  <td className="py-4 pr-4">
                    {isEditing ? (
                      <input 
                        type="text" 
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm" 
                        value={metric.target || ''}
                        onChange={(e) => onSectionChange('success_metrics', idx, 'target', e.target.value)}
                        placeholder="Target value"
                      />
                    ) : (
                      <div className="text-sm text-gray-700">
                        {metric.target || '-'}
                      </div>
                    )}
                  </td>
                  <td className="py-4 pr-4">
                    {isEditing ? (
                      <input 
                        type="text" 
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm" 
                        value={metric.current || ''}
                        onChange={(e) => onSectionChange('success_metrics', idx, 'current', e.target.value)}
                        placeholder="Current value"
                      />
                    ) : (
                      <div className="text-sm text-gray-700">
                        {metric.current || '-'}
                      </div>
                    )}
                  </td>
                  <td className="py-4 pr-4">
                    {isEditing ? (
                      <input 
                        type="text" 
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm" 
                        value={metric.definition || ''}
                        onChange={(e) => onSectionChange('success_metrics', idx, 'definition', e.target.value)}
                        placeholder="Description of how this metric is measured"
                      />
                    ) : (
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {metric.definition || '-'}
                      </div>
                    )}
                  </td>
                  {isEditing && (
                    <td className="py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onRemoveSection('success_metrics', idx)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {metrics.length === 0 && (
                <tr>
                  <td colSpan={isEditing ? 5 : 4} className="py-4 text-center text-sm text-gray-500">
                    No metrics defined yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {isEditing && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => onAddSection('success_metrics')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Metric
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PRDMetricsSection;