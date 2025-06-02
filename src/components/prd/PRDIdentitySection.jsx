import React from 'react';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 'N/A';
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays} days`;
};

const PRDIdentitySection = ({ prd, isEditing, onChange }) => {
  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-8 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">PRD Identity</h2>
      </div>
      
      {isEditing ? (
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input 
                type="date" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-3" 
                value={prd.start_date || ''} 
                onChange={e => onChange('start_date', e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input 
                type="date" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-3" 
                value={prd.end_date || ''} 
                onChange={e => onChange('end_date', e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Document Version</label>
              <input 
                type="text" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-3" 
                value={prd.document_version || ''} 
                onChange={e => onChange('document_version', e.target.value)} 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Document Owners</label>
              <input 
                type="text" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-3" 
                value={(prd.document_owners || []).join(', ')} 
                onChange={e => onChange('document_owners', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} 
                placeholder="Separate names with commas"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Developers</label>
              <input 
                type="text" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-3" 
                value={(prd.developers || []).join(', ')} 
                onChange={e => onChange('developers', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} 
                placeholder="Separate names with commas"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stakeholders</label>
              <input 
                type="text" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-3" 
                value={(prd.stakeholders || []).join(', ')} 
                onChange={e => onChange('stakeholders', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} 
                placeholder="Separate names with commas"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden px-2">
          <table className="min-w-full">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-8 py-5 whitespace-nowrap w-1/4">
                  <div className="text-sm font-medium text-gray-900">Start Date</div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{formatDate(prd.start_date)}</div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap w-1/4">
                  <div className="text-sm font-medium text-gray-900">End Date</div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{formatDate(prd.end_date)}</div>
                </td>
              </tr>
              <tr>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Duration</div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{calculateDuration(prd.start_date, prd.end_date)}</div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Document Version</div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{prd.document_version}</div>
                </td>
              </tr>
              <tr>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Document Owners</div>
                </td>
                <td className="px-8 py-5">
                  <div className="text-sm text-gray-700">{prd.document_owners?.join(', ') || '-'}</div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Developers</div>
                </td>
                <td className="px-8 py-5">
                  <div className="text-sm text-gray-700">{prd.developers?.join(', ') || '-'}</div>
                </td>
              </tr>
              <tr>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Stakeholders</div>
                </td>
                <td className="px-8 py-5" colSpan="3">
                  <div className="text-sm text-gray-700">{prd.stakeholders?.join(', ') || '-'}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PRDIdentitySection;