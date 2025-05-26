import { PencilIcon, TrashIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const PersonnelCard = ({ person, onEdit, onDelete }) => {
  // Generate single letter initial for avatar
  const getInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };

  // Get background color based on first letter
  const getAvatarBgColor = (name) => {
    const firstChar = name.charAt(0).toLowerCase();
    const charCode = firstChar.charCodeAt(0);
    
    // Simple deterministic color selection based on character code
    if (charCode % 3 === 0) return 'bg-gray-200';
    if (charCode % 3 === 1) return 'bg-gray-300';
    return 'bg-gray-100';
  };

  const initial = getInitial(person.name);
  const bgColorClass = getAvatarBgColor(person.name);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-medium text-gray-700 ${bgColorClass}`}>
            {initial}
          </div>
          
          <div className="ml-4">
            <h3 className="font-medium text-gray-900">{person.name}</h3>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
              {person.role}
            </span>
          </div>
        </div>

        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(person)}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded"
            aria-label="Edit"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(person)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded"
            aria-label="Delete"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {person.contact && (
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
          {person.contact}
        </div>
      )}
    </div>
  );
};

export default PersonnelCard;