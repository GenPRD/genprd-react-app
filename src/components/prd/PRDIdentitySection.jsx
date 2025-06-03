import React, { useState } from 'react';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
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
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Invalid Dates';
  }
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays} days`;
};

// New PersonInput component for managing people lists
const PersonInput = ({ value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newValue = [...value, inputValue.trim()];
      onChange(newValue);
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      const newValue = value.slice(0, -1);
      onChange(newValue);
    }
  };

  const removeTag = (index) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };

  return (
    <div className="relative">
      <div className="min-h-[42px] w-full rounded-md border border-gray-300 shadow-sm focus-within:border-gray-500 focus-within:ring-1 focus-within:ring-gray-500 bg-white p-1.5 flex flex-wrap gap-1.5">
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800 group"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 outline-none min-w-[120px] bg-transparent text-sm"
          placeholder={value.length === 0 ? placeholder : "Press Enter to add more..."}
        />
      </div>
    </div>
  );
};

const PRDIdentitySection = ({ prd, isEditing, onChange }) => {
  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-8 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">PRD Identity</h2>
      </div>
      
      {isEditing ? (
        <div className="p-8">
          <div className="grid grid-cols-1 gap-6">
            {/* Date Inputs Row */}
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
            </div>

            {/* People Management Inputs */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document Owners</label>
                <PersonInput
                  value={prd.document_owners || []}
                  onChange={(value) => onChange('document_owners', value)}
                  placeholder="Type name and press Enter..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Developers</label>
                <PersonInput
                  value={prd.developers || []}
                  onChange={(value) => onChange('developers', value)}
                  placeholder="Type name and press Enter..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stakeholders</label>
                <PersonInput
                  value={prd.stakeholders || []}
                  onChange={(value) => onChange('stakeholders', value)}
                  placeholder="Type name and press Enter..."
                />
              </div>
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
                <td className="px-8 py-5 whitespace-nowrap" colSpan="3">
                  <div className="text-sm text-gray-700">{calculateDuration(prd.start_date, prd.end_date)}</div>
                </td>
              </tr>
              <tr>
                <td className="px-8 py-5 whitespace-nowrap align-top">
                  <div className="text-sm font-medium text-gray-900">Document Owners</div>
                </td>
                <td className="px-8 py-5" colSpan="3">
                  <div className="flex flex-wrap gap-2">
                    {prd.document_owners?.map((owner, i) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                        {owner}
                      </span>
                    )) || '-'}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-8 py-5 whitespace-nowrap align-top">
                  <div className="text-sm font-medium text-gray-900">Developers</div>
                </td>
                <td className="px-8 py-5" colSpan="3">
                  <div className="flex flex-wrap gap-2">
                    {prd.developers?.map((dev, i) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                        {dev}
                      </span>
                    )) || '-'}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-8 py-5 whitespace-nowrap align-top">
                  <div className="text-sm font-medium text-gray-900">Stakeholders</div>
                </td>
                <td className="px-8 py-5" colSpan="3">
                  <div className="flex flex-wrap gap-2">
                    {prd.stakeholders?.map((stakeholder, i) => (
                      <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                        {stakeholder}
                      </span>
                    )) || '-'}
                  </div>
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