import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Mapping for DARCI role descriptions
const DARCI_ROLES = {
  'decider': 'Decider (D)',
  'accountable': 'Accountable (A)',
  'responsible': 'Responsible (R)',
  'consulted': 'Consulted (C)',
  'informed': 'Informed (I)'
};

// Helper function to ensure DARCI roles exist
const ensureAllRolesExist = (roles = []) => {
  return Object.keys(DARCI_ROLES).map(roleKey => {
    const existingRole = roles.find(r => r.name === roleKey);
    return existingRole || {
      name: roleKey,
      members: [],
      guidelines: ''
    };
  });
};

// Component for managing members with tag-like interface
const MembersInput = ({ value = [], onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newMembers = [...value, inputValue.trim()];
      onChange(newMembers);
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      const newMembers = value.slice(0, -1);
      onChange(newMembers);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 min-h-[42px] w-full rounded-md border border-gray-300 bg-white p-2">
      {value.map((member, index) => (
        <span
          key={index}
          className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800"
        >
          {member}
          <button
            type="button"
            onClick={() => {
              const newMembers = value.filter((_, i) => i !== index);
              onChange(newMembers);
            }}
            className="ml-1.5 inline-flex items-center justify-center h-5 w-5 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none"
          >
            <XMarkIcon className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? "Type name and press Enter..." : "Press Enter to add more..."}
      />
    </div>
  );
};

const PRDDarciSection = ({
  prd,
  isEditing,
  onSectionChange
}) => {
  const roles = prd.generated_sections?.darci?.roles || [];
  const ensuredRoles = ensureAllRolesExist(roles);

  const getRoleName = (roleKey) => DARCI_ROLES[roleKey] || roleKey;

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-8 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">DARCI Roles</h2>
      </div>

      <div className="overflow-hidden">
        <div className="px-8 py-5">
          <table className="min-w-full">
            <thead>
              <tr>
                <th scope="col" className="w-1/5 py-3 text-left text-sm font-medium text-gray-900">
                  Role
                </th>
                <th scope="col" className="w-2/5 py-3 text-left text-sm font-medium text-gray-900">
                  Members
                </th>
                <th scope="col" className="w-2/5 py-3 text-left text-sm font-medium text-gray-900">
                  Guidelines
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ensuredRoles.map((role, idx) => (
                <tr key={role.name} className="align-top">
                  <td className="py-4 pr-4">
                    <span className="text-sm font-medium text-gray-900">
                      {getRoleName(role.name)}
                    </span>
                  </td>
                  <td className="py-4 pr-8">
                    {isEditing ? (
                      <MembersInput
                        value={role.members || []}
                        onChange={(newMembers) => {
                          onSectionChange('darci', idx, 'members', newMembers);
                        }}
                      />
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {(role.members || []).map((member, midx) => (
                          <span
                            key={midx}
                            className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800"
                          >
                            {member}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-4">
                    {isEditing ? (
                      <div className="w-full">
                        <textarea
                          value={role.guidelines || ''}
                          onChange={(e) =>
                            onSectionChange('darci', idx, 'guidelines', e.target.value)
                          }
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm resize-y"
                          rows={3}
                          style={{ 
                            minHeight: '80px',
                            maxHeight: '200px'
                          }}
                          placeholder={`Enter guidelines for ${getRoleName(role.name)}...`}
                        />
                      </div>
                    ) : (
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {role.guidelines || ''}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PRDDarciSection;