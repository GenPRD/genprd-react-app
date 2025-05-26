import { TrashIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';

const DeleteConfirmation = ({ isOpen, onClose, onConfirm, personnelName }) => {
  // Jika modal terbuka, kita perlu mencegah scroll pada body
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);
  
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - full screen dan berada di belakang semua elemen UI */}
      <div 
        className="fixed inset-0 bg-gray-800 bg-opacity-75 modal-backdrop" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal container - centered dan di atas backdrop */}
      <div className="fixed inset-0 flex items-center justify-center modal-content px-4">
        <div 
          className="bg-white rounded-lg w-full max-w-md shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
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
          
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              onClick={onConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmation;