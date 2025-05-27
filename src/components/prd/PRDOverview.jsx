import { DocumentTextIcon } from '@heroicons/react/24/outline'

const PRDOverview = ({ prd, isEditing, onChange }) => {
  if (isEditing) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">Project Overview</label>
        <textarea
          value={prd.project_overview}
          onChange={(e) => onChange('project_overview', e.target.value)}
          rows={6}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
          placeholder="Enter project overview..."
        />
      </div>
    )
  }

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <DocumentTextIcon className="w-5 h-5 mr-2 text-gray-500" />
        Project Overview
      </h3>
      <p className="mt-2 text-gray-600 whitespace-pre-wrap">{prd.project_overview}</p>
    </div>
  )
}

export default PRDOverview 