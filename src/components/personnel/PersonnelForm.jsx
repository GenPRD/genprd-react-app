import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

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
          className="bg-white rounded-lg w-full max-w-md shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal header */}
          <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">
              {currentPersonnel ? 'Edit Personnel' : 'Add Personnel'}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          {/* Modal body */}
          <div className="px-6 py-4">
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
              
              {/* Modal footer */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800"
                >
                  {currentPersonnel ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonnelForm;