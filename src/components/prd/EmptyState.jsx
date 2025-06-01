import React from 'react';
import { Link } from 'react-router-dom';
import { DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline';

const EmptyState = ({ isEmpty, isFiltered }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg text-center py-12 px-4">
      <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {isEmpty ? 'No PRDs found' : 'No PRDs match your filters'}
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {isEmpty
          ? 'Create your first Product Requirements Document to get started.'
          : 'Try adjusting your search or filter criteria.'}
      </p>
      {isEmpty && (
        <Link
          to="/prds/new"
          className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Your First PRD
        </Link>
      )}
    </div>
  );
};

export default EmptyState;