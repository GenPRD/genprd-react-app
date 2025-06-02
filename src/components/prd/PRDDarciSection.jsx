import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

const PRDDarciSection = ({ prd, isEditing, onSectionChange, onRemoveSection, onAddSection }) => {
  const roles = prd.generated_sections?.darci?.roles || [];
  
  const roleLabels = {
    'decider': 'Decider',
    'accountable': 'Accountable',
    'responsible': 'Responsible',
    'consulted': 'Consulted',
    'informed': 'Informed'
  };
  
  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-8 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">DARCI Roles</h2>
      </div>
      
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="px-8 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-8 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
              <th scope="col" className="px-8 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guidelines</th>
              {isEditing && <th scope="col" className="px-8 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {roles.map((role, idx) => {
              const roleName = role.name || '';
              
              return (
                <tr key={idx}>
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {isEditing ? (
                        <select 
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-3"
                          value={roleName}
                          onChange={(e) => onSectionChange('darci', idx, 'name', e.target.value)}
                        >
                          {Object.entries(roleLabels).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                      ) : (
                        roleLabels[roleName] || roleName
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm text-gray-700">
                      {isEditing ? (
                        <input 
                          type="text" 
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-3" 
                          value={role.members?.join(', ') || ''}
                          onChange={(e) => onSectionChange('darci', idx, 'members', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                          placeholder="Enter members (comma separated)"
                        />
                      ) : (
                        role.members?.join(', ') || '-'
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm text-gray-700">
                      {isEditing ? (
                        <textarea 
                          rows={2}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-3"
                          value={role.guidelines || ''}
                          onChange={(e) => onSectionChange('darci', idx, 'guidelines', e.target.value)}
                          placeholder="Guidelines for this role"
                        />
                      ) : (
                        role.guidelines || '-'
                      )}
                    </div>
                  </td>
                  {isEditing && (
                    <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => onRemoveSection('darci', idx)} 
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {isEditing && (
          <div className="px-8 py-5 border-t border-gray-200">
            <button
              type="button"
              onClick={() => onAddSection('darci')}
              className="inline-flex items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-all"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Role
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PRDDarciSection;