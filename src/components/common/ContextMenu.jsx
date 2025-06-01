import React, { useEffect, useRef } from 'react';

const ContextMenu = ({ isOpen, position, items, onClose }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className="absolute z-10 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      style={{ 
        top: position?.y || 0, 
        left: position?.x || 0,
        transform: 'translateX(-90%)'
      }}
    >
      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              item.onClick();
              onClose();
            }}
            className={`flex w-full items-center px-4 py-2 text-sm text-left ${item.danger ? 'text-red-700' : 'text-gray-700'} hover:bg-gray-100 hover:text-gray-900`}
            role="menuitem"
            disabled={item.disabled}
          >
            {item.icon && <span className="mr-3 h-5 w-5">{item.icon}</span>}
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContextMenu;