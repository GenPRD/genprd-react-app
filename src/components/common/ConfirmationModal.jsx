import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

// Styles for animations
const modalStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes scaleIn {
    from { transform: scale(0.95); }
    to { transform: scale(1); }
  }
`;

const ConfirmationModal = ({ 
  isOpen, 
  title, 
  message, 
  icon, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  confirmButtonClass = 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500', 
  onConfirm, 
  onCancel 
}) => {
  const modalRef = useRef(null);
  const cancelButtonRef = useRef(null);
  
  // Inject styles once
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.type = 'text/css';
    styleEl.appendChild(document.createTextNode(modalStyles));
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);
  
  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    // Focus on cancel button when modal opens
    if (cancelButtonRef.current) {
      cancelButtonRef.current.focus();
    }
    
    // Disable scroll on body when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onCancel]);
  
  // Close when clicking outside the modal
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onCancel();
    }
  };
  
  if (!isOpen) return null;
  
  return ReactDOM.createPortal(
    <div 
      className="fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center"
      onClick={handleBackdropClick}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Backdrop dengan opacity yang lebih tinggi */}
      <div 
        className="fixed inset-0 bg-gray-900 bg-opacity-95 transition-opacity"
        style={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          animation: 'fadeIn 0.3s ease-out forwards',
          position: 'fixed',
          zIndex: 9998
        }}
      />
      
      {/* Modal content */}
      <div
        ref={modalRef}
        className="relative z-[9999] bg-white rounded-lg shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        style={{ 
          animation: 'fadeIn 0.2s ease-out forwards, scaleIn 0.3s ease-out forwards',
          zIndex: 9999
        }}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            {icon && (
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                {icon}
              </div>
            )}
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {title}
              </h3>
              <div className="mt-2">
                <div className="text-sm text-gray-500">{message}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${confirmButtonClass}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onCancel}
            ref={cancelButtonRef}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;