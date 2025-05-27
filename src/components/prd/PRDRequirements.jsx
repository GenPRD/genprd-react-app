import { DocumentTextIcon, PlusIcon, XMarkIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

const PRDRequirements = ({ prd, isEditing, onChange }) => {
  const [editingRequirement, setEditingRequirement] = useState(null)

  const handleAddRequirement = () => {
    const newRequirement = {
      id: Date.now(),
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending'
    }
    const currentRequirements = prd.requirements || []
    onChange('requirements', [...currentRequirements, newRequirement])
    setEditingRequirement(newRequirement.id)
  }

  const handleRemoveRequirement = (id) => {
    const currentRequirements = prd.requirements || []
    const newRequirements = currentRequirements.filter(req => req.id !== id)
    onChange('requirements', newRequirements)
  }

  const handleUpdateRequirement = (id, field, value) => {
    const currentRequirements = prd.requirements || []
    const newRequirements = currentRequirements.map(req => 
      req.id === id ? { ...req, [field]: value } : req
    )
    onChange('requirements', newRequirements)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <DocumentTextIcon className="w-5 h-5 text-gray-500 mr-2" />
          Requirements
        </h3>
        {isEditing && (
          <button
            onClick={handleAddRequirement}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Requirement
          </button>
        )}
      </div>

      <div className="space-y-4">
        {(prd.requirements || []).map((requirement) => (
          <div
            key={requirement.id}
            className="bg-white shadow rounded-lg p-4"
          >
            {editingRequirement === requirement.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={requirement.title}
                    onChange={(e) => handleUpdateRequirement(requirement.id, 'title', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={requirement.description}
                    onChange={(e) => handleUpdateRequirement(requirement.id, 'description', e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                      value={requirement.priority}
                      onChange={(e) => handleUpdateRequirement(requirement.id, 'priority', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={requirement.status}
                      onChange={(e) => handleUpdateRequirement(requirement.id, 'status', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingRequirement(null)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Done
                  </button>
                  <button
                    onClick={() => handleRemoveRequirement(requirement.id)}
                    className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                  >
                    <XMarkIcon className="w-4 h-4 mr-2" />
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-medium text-gray-900">{requirement.title}</h4>
                  {isEditing && (
                    <button
                      onClick={() => setEditingRequirement(requirement.id)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <p className="mt-2 text-gray-600">{requirement.description}</p>
                <div className="mt-4 flex space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(requirement.priority)}`}>
                    {requirement.priority.charAt(0).toUpperCase() + requirement.priority.slice(1)} Priority
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(requirement.status)}`}>
                    {requirement.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
        {(!prd.requirements || prd.requirements.length === 0) && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No requirements</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new requirement.</p>
            {isEditing && (
              <div className="mt-6">
                <button
                  onClick={handleAddRequirement}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Requirement
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PRDRequirements 