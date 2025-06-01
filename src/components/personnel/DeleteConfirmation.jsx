import { TrashIcon } from '@heroicons/react/24/outline';
import ModalOverlay from '../common/ModalOverlay';

const DeleteConfirmation = ({ isOpen, onClose, onConfirm, personnelName }) => {
  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
            <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Delete Personnel</h3>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete <span className="font-medium">{personnelName}</span>? This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </ModalOverlay>
  );
};

export default DeleteConfirmation;