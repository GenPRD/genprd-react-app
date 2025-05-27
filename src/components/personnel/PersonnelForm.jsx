import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ModalOverlay from '../ui/ModalOverlay';

const PersonnelForm = ({ isOpen, onClose, onSubmit, currentPersonnel = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    contact: ''
  });

  useEffect(() => {
    if (currentPersonnel) {
      setFormData({
        name: currentPersonnel.name || '',
        role: currentPersonnel.role || '',
        contact: currentPersonnel.contact || ''
      });
    } else {
      setFormData({
        name: '',
        role: '',
        contact: ''
      });
    }
  }, [currentPersonnel, isOpen]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {currentPersonnel ? 'Edit Personnel' : 'Add Personnel'}
        </h3>
        <button
          className="text-gray-400 hover:text-gray-500 focus:outline-none"
          onClick={onClose}
          aria-label="Close modal"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      
      {/* Form Body */}
      <div className="p-4 overflow-y-auto max-h-[70vh]">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
              placeholder="Enter name"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <input
              type="text"
              name="role"
              id="role"
              required
              value={formData.role}
              onChange={handleInputChange}
              className="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
              placeholder="Enter role"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
              Contact
            </label>
            <input
              type="text"
              name="contact"
              id="contact"
              required
              value={formData.contact}
              onChange={handleInputChange}
              className="shadow-sm focus:ring-gray-500 focus:border-gray-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
              placeholder="Email or phone number"
            />
          </div>
          
          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-gray-900 hover:bg-gray-800"
            >
              {currentPersonnel ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
};

export default PersonnelForm;