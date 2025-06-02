import React, { useEffect } from 'react';

const ContextMenu = ({ isOpen, position, items, onClose, className = '' }) => {
  useEffect(() => {
    if (isOpen) {
      // Close menu on any click outside
      const handleOutsideClick = () => {
        onClose();
      };
      
      document.addEventListener('click', handleOutsideClick);
      return () => document.removeEventListener('click', handleOutsideClick);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calculate position to ensure dropdown appears closer to the trigger button
  // and adjusts if near window edges
  const adjustPosition = () => {
    // Basic positioning - start with original position
    let posX = position.x;
    let posY = position.y;
    let transform = 'translate(-90%, 0)'; // Default transform to align near button
    
    // Get window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Check if menu would go off the right edge
    if (position.x + 180 > windowWidth) {
      transform = 'translate(-100%, 0)'; // Move it fully to the left
    }
    
    // Check if menu would go off the bottom
    const estimatedMenuHeight = items.length * 36 + 16; // Rough estimate of menu height
    if (position.y + estimatedMenuHeight > windowHeight) {
      transform = 'translate(-90%, -100%)'; // Place above instead
    }
    
    return {
      top: `${posY}px`,
      left: `${posX}px`,
      transform
    };
  };

  return (
    <div 
      className={`fixed bg-white border border-gray-200 rounded-md shadow-xl overflow-hidden z-50 min-w-[180px] ${className}`}
      style={adjustPosition()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="py-1">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
              item.onClick();
            }}
            className={`w-full text-left px-4 py-2.5 text-sm ${item.danger 
              ? 'text-red-600 hover:bg-red-50 hover:text-red-700' 
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            } flex items-center transition-colors`}
          >
            <span className="mr-3 w-5 h-5 flex items-center justify-center">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContextMenu;