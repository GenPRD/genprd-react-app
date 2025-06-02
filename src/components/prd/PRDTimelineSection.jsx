import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// Helper to format date range
const formatDateRange = (dateString) => {
  if (!dateString) return '';
  
  const [startStr, endStr] = dateString.split(' - ');
  if (!startStr || !endStr) return dateString;

  const start = new Date(startStr);
  const end = new Date(endStr);

  return `${start.toLocaleString('default', { month: 'long' })} ${start.getDate()} - ${end.toLocaleString('default', { month: 'long' })} ${end.getDate()}, ${end.getFullYear()}`;
};

// Helper to validate date range against PRD dates
const isValidDateRange = (startDate, endDate, prdStartDate, prdEndDate) => {
  if (!startDate || !endDate || !prdStartDate || !prdEndDate) return true;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const prdStart = new Date(prdStartDate);
  const prdEnd = new Date(prdEndDate);

  return start >= prdStart && end <= prdEnd;
};

const PRDTimelineSection = ({
  prd,
  isEditing,
  onSectionChange,
  onRemoveSection,
  onAddSection
}) => {
  const phases = prd.generated_sections?.project_timeline?.phases || [];

  // Custom date range input component
  const DateRangeInput = ({ value, onChange, idx }) => {
    const [startStr, endStr] = (value || '').split(' - ');
    const [startDate, setStartDate] = React.useState(startStr ? new Date(startStr) : null);
    const [endDate, setEndDate] = React.useState(endStr ? new Date(endStr) : null);
    const [error, setError] = React.useState('');

    const handleDateChange = (dates) => {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);

      if (start && end) {
        // Validate against PRD dates
        if (!isValidDateRange(start, end, prd.start_date, prd.end_date)) {
          setError('Phase dates must be within PRD timeline');
          return;
        }
        setError('');
        
        const dateString = `${start.toISOString().split('T')[0]} - ${end.toISOString().split('T')[0]}`;
        onChange('time_period', dateString);
      }
    };

    return (
      <div>
        <DatePicker
          selected={startDate}
          onChange={handleDateChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
          dateFormat="MMM d, yyyy"
          placeholderText="Select date range"
          minDate={prd.start_date ? new Date(prd.start_date) : null}
          maxDate={prd.end_date ? new Date(prd.end_date) : null}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-8 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Project Timeline</h2>
      </div>

      <div className="overflow-hidden">
        <div className="px-8 py-5">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th scope="col" className="pb-3 text-left text-sm font-medium text-gray-900 w-1/4">
                  Person In Charge
                </th>
                <th scope="col" className="pb-3 text-left text-sm font-medium text-gray-900 w-1/3">
                  Activity
                </th>
                <th scope="col" className="pb-3 text-left text-sm font-medium text-gray-900">
                  Time Period
                </th>
                {isEditing && (
                  <th scope="col" className="pb-3 text-right text-sm font-medium text-gray-900 w-20">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {phases.map((phase, idx) => (
                <tr key={idx} className="align-top">
                  <td className="py-4 pr-4">
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                        value={phase.pic || ''}
                        onChange={(e) => onSectionChange('project_timeline', idx, 'pic', e.target.value)}
                        placeholder="Person in charge"
                      />
                    ) : (
                      <div className="text-sm text-gray-900">{phase.pic || '-'}</div>
                    )}
                  </td>
                  <td className="py-4 pr-4">
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                        value={phase.activity || ''}
                        onChange={(e) => onSectionChange('project_timeline', idx, 'activity', e.target.value)}
                        placeholder="Activity description"
                      />
                    ) : (
                      <div className="text-sm text-gray-900">{phase.activity || '-'}</div>
                    )}
                  </td>
                  <td className="py-4 pr-4">
                    {isEditing ? (
                      <DateRangeInput
                        value={phase.time_period}
                        onChange={(field, value) => onSectionChange('project_timeline', idx, field, value)}
                        idx={idx}
                      />
                    ) : (
                      <div className="text-sm text-gray-900">
                        {formatDateRange(phase.time_period) || '-'}
                      </div>
                    )}
                  </td>
                  {isEditing && (
                    <td className="py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onRemoveSection('project_timeline', idx)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {phases.length === 0 && (
                <tr>
                  <td colSpan={isEditing ? 4 : 3} className="py-4 text-center text-sm text-gray-500">
                    No timeline phases defined yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {isEditing && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => onAddSection('project_timeline')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Timeline Phase
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PRDTimelineSection;