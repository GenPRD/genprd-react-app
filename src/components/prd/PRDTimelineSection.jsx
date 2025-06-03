import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { XCircleIcon } from '@heroicons/react/20/solid';

// Helper to format date range with validation
const formatDateRange = (dateString) => {
  if (!dateString) return '';
  
  const [startStr, endStr] = dateString.split(' - ');
  if (!startStr || !endStr) return dateString; // Return original string if not a range

  const start = new Date(startStr);
  const end = new Date(endStr);

  // Add validation
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Invalid Date Range';
  }

  return `${start.toLocaleString('en-US', { month: 'long' })} ${start.getDate()} - ${end.toLocaleString('en-US', { month: 'long' })} ${end.getDate()}, ${end.getFullYear()}`;
};

// Helper to validate date range against PRD dates
const isValidDateRange = (startDate, endDate, prdStartDate, prdEndDate) => {
  // If PRD dates are missing or invalid, any phase date range is valid
  if (!prdStartDate || !prdEndDate || isNaN(prdStartDate.getTime()) || isNaN(prdEndDate.getTime())) {
    return true;
  }

  // If phase dates are missing or invalid, it's not a valid range
  if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return false;
  }

  // Check if phase dates are within PRD date range
  return startDate >= prdStartDate && endDate <= prdEndDate;
};

const PRDTimelineSection = ({
  prd,
  isEditing,
  onSectionChange,
  onRemoveSection,
  onAddSection
}) => {
  const prdStartDate = prd.start_date ? new Date(prd.start_date) : null;
  const prdEndDate = prd.end_date ? new Date(prd.end_date) : null;

  const DateRangeInput = ({ value, onChange, prdStartDate, prdEndDate }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [error, setError] = useState('');

    // Initialize dates from value string
    useEffect(() => {
      if (value) {
        const [startStr, endStr] = value.split(' - ');
        const start = startStr ? new Date(startStr) : null;
        const end = endStr ? new Date(endStr) : null;
        setStartDate(start && !isNaN(start.getTime()) ? start : null);
        setEndDate(end && !isNaN(end.getTime()) ? end : null);
      } else {
         setStartDate(null);
         setEndDate(null);
      }
    }, [value]);

    const handleDateChange = (dates) => {
      const [start, end] = dates;

      // Always update local state with what datepicker gives us
      setStartDate(start);
      setEndDate(end);

      // Only update parent state and validate when BOTH start and end dates are selected
      if (start && end) {
         const prdStart = prdStartDate ? new Date(prdStartDate) : null;
         const prdEnd = prdEndDate ? new Date(prdEndDate) : null;

         if (!isValidDateRange(start, end, prdStart, prdEnd)) {
           setError('Phase dates must be within PRD timeline');
           onChange(''); // Clear value in parent if validation fails
         } else {
           setError('');
           const dateString = `${start.toISOString().split('T')[0]} - ${end.toISOString().split('T')[0]}`;
           onChange(dateString);
         }
      } else if (!start && !end) {
          // If both dates are cleared, clear value and error in parent
          onChange('');
          setError('');
      } else {
         // If only one date is selected (the start date when selecting range)
         setError(''); // Clear error as partial selection is not an error itself
         // Do NOT call onChange here, wait for the end date selection
      }
    };
    
    // Function to clear the selected dates
    const handleClearDates = () => {
      setStartDate(null);
      setEndDate(null);
      setError(''); // Clear any validation errors
      onChange(''); // Clear value in parent
    };

    // Add validation for minDate and maxDate props based on PRD dates
    const minPrdDate = (prdStartDate && !isNaN(new Date(prdStartDate).getTime())) ? new Date(prdStartDate) : null;
    const maxPrdDate = (prdEndDate && !isNaN(new Date(prdEndDate).getTime())) ? new Date(prdEndDate) : null;

    return (
      <div className="relative flex items-center">
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm pr-7"
          dateFormat="yyyy-MM-dd"
          placeholderText="Select date range"
          minDate={minPrdDate}
          maxDate={maxPrdDate}
          isClearable={false}
        />
        {(startDate || endDate) && (
          <button
            type="button"
            onClick={handleClearDates}
            className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <XCircleIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  };

  const phases = prd.generated_sections?.project_timeline?.phases || [];

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-8 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Project Timeline</h2>
          {isEditing && (
            <button
              type="button"
              onClick={() => onAddSection('project_timeline')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Timeline Phase
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th scope="col" className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Person In Charge
              </th>
              <th scope="col" className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                Activity
              </th>
              <th scope="col" className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time Period
              </th>
              {isEditing && (
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {phases.map((phase, idx) => (
              <tr key={idx}>
                <td className="px-8 py-4 whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="text"
                      value={phase.pic || ''}
                      onChange={(e) => onSectionChange('project_timeline', idx, 'pic', e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Person in charge"
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{phase.pic || '-'}</div>
                  )}
                </td>
                <td className="px-8 py-4 whitespace-nowrap">
                  {isEditing ? (
                    <input
                      type="text"
                      value={phase.activity || ''}
                      onChange={(e) => onSectionChange('project_timeline', idx, 'activity', e.target.value)}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Activity description"
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{phase.activity || '-'}</div>
                  )}
                </td>
                <td className="px-8 py-4 whitespace-nowrap">
                  {isEditing ? (
                    <DateRangeInput
                      value={phase.time_period}
                      onChange={(value) => onSectionChange('project_timeline', idx, 'time_period', value)}
                      prdStartDate={prdStartDate}
                      prdEndDate={prdEndDate}
                    />
                  ) : (
                    <div className="text-sm text-gray-900">
                      {formatDateRange(phase.time_period) || '-'}
                    </div>
                  )}
                </td>
                {isEditing && (
                  <td className="px-8 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => onRemoveSection('project_timeline', idx)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {phases.length === 0 && (
              <tr>
                <td colSpan={isEditing ? 4 : 3} className="px-8 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                  No timeline phases defined yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PRDTimelineSection;