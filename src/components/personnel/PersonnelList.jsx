import { UserGroupIcon } from '@heroicons/react/24/outline';
import PersonnelCard from './PersonnelCard';

const PersonnelList = ({ personnel, onAdd, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        <span className="ml-4 text-gray-600">Loading personnel data...</span>
      </div>
    );
  }

  if (personnel.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm text-center p-12">
        <UserGroupIcon className="mx-auto h-12 w-12 text-gray-300" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No personnel records found</h3>
        <p className="mt-1 text-gray-500">Add team members to include in your PRD projects.</p>
        <div className="mt-6">
          <button
            onClick={onAdd}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none"
          >
            Add your first team member
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {personnel.map(person => (
        <PersonnelCard
          key={person.id}
          person={person}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default PersonnelList;