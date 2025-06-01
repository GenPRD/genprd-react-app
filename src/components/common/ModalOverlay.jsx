import { useEffect } from 'react';
import ReactDOM from 'react-dom';

const ModalOverlay = ({ isOpen, onClose, children }) => {
  // Lock scrolling when modal is open
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

  // Don't render anything if modal is closed
  if (!isOpen) return null;

  // Find modal root or fallback to body
  const modalRoot = document.getElementById('modal-root') || document.body;

  // Use portal to render modal
  return ReactDOM.createPortal(
    <div className="modal-container">
      {/* Backdrop with blur - z-index super tinggi */}
      <div 
        className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm"
        style={{ zIndex: 100000 }}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content - z-index lebih tinggi dari backdrop */}
      <div 
        className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none"
        style={{ zIndex: 100001 }}
      >
        <div 
          className="bg-white rounded-lg shadow-xl pointer-events-auto w-full max-w-md overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
      
      <style jsx global>{`
        .modal-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
        }
        
        body.overflow-hidden {
          overflow: hidden;
        }
      `}</style>
    </div>,
    modalRoot
  );
};

export default ModalOverlay;