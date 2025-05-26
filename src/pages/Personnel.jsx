import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePersonnel } from '../hooks/useApi';
import { PlusIcon } from '@heroicons/react/24/outline';

// Import komponen-komponen personnel
import PersonnelList from '../components/personnel/PersonnelList';
import PersonnelForm from '../components/personnel/PersonnelForm';
import DeleteConfirmation from '../components/personnel/DeleteConfirmation';
import Toast from '../components/ui/Toast';

const Personnel = () => {
  const { user } = useAuth();
  const { getAllPersonnel, createPersonnel, updatePersonnel, deletePersonnel, loading, error } = usePersonnel();
  
  const [personnel, setPersonnel] = useState([]);
  const [currentPersonnel, setCurrentPersonnel] = useState(null);
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    fetchPersonnel();
  }, []);

  useEffect(() => {
    if (error) {
      showToast('error', `Error: ${error}`);
    }
  }, [error]);

  const fetchPersonnel = async () => {
    try {
      const response = await getAllPersonnel();
      
      if (response.status === 'success' && response.data) {
        setPersonnel(response.data);
      } else {
        setPersonnel([]);
        showToast('error', 'Failed to load personnel data');
      }
    } catch (error) {
      console.error('Error fetching personnel:', error);
      showToast('error', 'Failed to load personnel data');
    }
  };

  const handleOpenFormModal = (person = null) => {
    setCurrentPersonnel(person);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (person) => {
    setCurrentPersonnel(person);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (currentPersonnel) {
        // Update existing personnel
        const response = await updatePersonnel(currentPersonnel.id, formData);
        if (response.status === 'success') {
          setPersonnel(personnel.map(p => 
            p.id === currentPersonnel.id ? response.data : p
          ));
          showToast('success', 'Personnel updated successfully');
        }
      } else {
        // Create new personnel
        const response = await createPersonnel(formData);
        if (response.status === 'success') {
          setPersonnel([...personnel, response.data]);
          showToast('success', 'Personnel created successfully');
        }
      }
      
      setIsFormModalOpen(false);
      setCurrentPersonnel(null);
    } catch (error) {
      console.error('Error saving personnel:', error);
      showToast('error', 'Failed to save personnel');
    }
  };

  const handleConfirmDelete = async () => {
    if (!currentPersonnel) return;
    
    try {
      await deletePersonnel(currentPersonnel.id);
      setPersonnel(personnel.filter(p => p.id !== currentPersonnel.id));
      setIsDeleteModalOpen(false);
      setCurrentPersonnel(null);
      showToast('success', 'Personnel deleted successfully');
    } catch (error) {
      console.error('Error deleting personnel:', error);
      showToast('error', 'Failed to delete personnel');
    }
  };

  const showToast = (type, message) => {
    setToast({
      visible: true,
      type,
      message
    });
  };

  const hideToast = () => {
    setToast({
      ...toast,
      visible: false
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Personnel Management</h1>
          <p className="text-gray-600 mt-1">Manage your team members for PRD projects</p>
        </div>
        <button 
          onClick={() => handleOpenFormModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-800"
        >
          <PlusIcon className="w-5 h-5 mr-2" /> Add Personnel
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <p className="font-medium">Error loading personnel</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <PersonnelList
        personnel={personnel}
        loading={loading}
        onAdd={() => handleOpenFormModal()}
        onEdit={handleOpenFormModal}
        onDelete={handleOpenDeleteModal}
      />

      {/* Modals */}
      <PersonnelForm
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        currentPersonnel={currentPersonnel}
      />

      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        personnelName={currentPersonnel?.name}
      />

      {/* Toast notification */}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.visible}
        onClose={hideToast}
      />
    </div>
  );
};

export default Personnel;