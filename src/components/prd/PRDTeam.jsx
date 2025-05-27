import { UserGroupIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

const PRDTeam = ({ prd, isEditing, onChange }) => {
  const handleAddMember = (type) => {
    const newMember = prompt(`Enter new ${type} name:`)
    if (newMember) {
      const currentMembers = prd[type] || []
      onChange(type, [...currentMembers, newMember])
    }
  }

  const handleRemoveMember = (type, index) => {
    const currentMembers = prd[type] || []
    const newMembers = currentMembers.filter((_, i) => i !== index)
    onChange(type, newMembers)
  }

  const renderTeamSection = (title, type, icon) => {
    const members = prd[type] || []

    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
          {icon}
          <span className="ml-2">{title}</span>
        </h3>
        
        {isEditing ? (
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {members.map((member, index) => (
                <div
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                >
                  {member}
                  <button
                    onClick={() => handleRemoveMember(type, index)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleAddMember(type)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add {title}
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {members.map((member, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
              >
                {member}
              </span>
            ))}
            {members.length === 0 && (
              <span className="text-gray-500 text-sm">No {title.toLowerCase()} added</span>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {renderTeamSection('Document Owners', 'document_owners', <UserGroupIcon className="w-5 h-5 text-gray-500" />)}
      {renderTeamSection('Developers', 'developers', <UserGroupIcon className="w-5 h-5 text-gray-500" />)}
      {renderTeamSection('Stakeholders', 'stakeholders', <UserGroupIcon className="w-5 h-5 text-gray-500" />)}
    </div>
  )
}

export default PRDTeam 