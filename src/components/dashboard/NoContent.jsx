import { Link } from 'react-router-dom';
import { DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline';

const NoContent = () => {
  return (
    <div className="py-12 px-4 text-center">
      <DocumentTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No PRDs yet</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Create your first PRD to get started with organizing your product requirements
      </p>
      <Link
        to="/prds/new"
        className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        Create PRD
      </Link>
    </div>
  );
};

export default NoContent;