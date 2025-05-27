import { CalendarIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline'

const PRDMetadata = ({ prd, isEditing, onChange }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isEditing) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={prd.start_date}
            onChange={(e) => onChange('start_date', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={prd.end_date}
            onChange={(e) => onChange('end_date', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2 text-gray-500" />
          Timeline
        </h3>
        <dl className="mt-2 space-y-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Start Date</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(prd.start_date)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">End Date</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(prd.end_date)}</dd>
          </div>
        </dl>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <ClockIcon className="w-5 h-5 mr-2 text-gray-500" />
          Document Info
        </h3>
        <dl className="mt-2 space-y-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Created At</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(prd.created_at)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Updated At</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(prd.updated_at)}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

export default PRDMetadata 