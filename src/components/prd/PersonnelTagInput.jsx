import { useState, useEffect, useRef, useCallback } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * A custom input component for personnel selection with tag/badge UI
 */
const PersonnelTagInput = ({ label, value, onChange, placeholder, options, required }) => {
  const [inputValue, setInputValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const blurTimeoutRef = useRef(null);
  
  // Filter options based on input value - menggunakan useCallback untuk mencegah infinite loop
  const updateFilteredOptions = useCallback(() => {
    if (inputValue) {
      return options.filter(opt => 
        !value.includes(opt) && 
        opt.toLowerCase().includes(inputValue.toLowerCase())
      ).slice(0, 5); // Show only top 5 matches
    } else {
      return [];
    }
  }, [inputValue, value, options]);
  
  // Update filtered options when dependencies change
  useEffect(() => {
    setFilteredOptions(updateFilteredOptions());
  }, [updateFilteredOptions]);
  
  // Handle clicks outside the component
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target) && focused) {
        setFocused(false);
        if (inputValue) {
          addTag(inputValue);
          setInputValue('');
        }
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [focused, inputValue]);
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  const addTag = (tag) => {
    if (tag && tag.trim() && !value.includes(tag.trim())) {
      onChange([...value, tag.trim()]);
      setInputValue('');
    }
  };
  
  const removeTag = (tag) => {
    onChange(value.filter(t => t !== tag));
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        addTag(filteredOptions[0]);
      } else {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    } else if (e.key === ',' || e.key === ';') {
      e.preventDefault();
      if (inputValue) {
        addTag(inputValue.replace(',', '').replace(';', '').trim());
      }
    }
  };
  
  const handleContainerClick = (e) => {
    // If clicking on the container (but not on a badge or other focused element),
    // focus the input field
    if (e.target === containerRef.current || 
        e.target.classList.contains('tag-container')) {
      inputRef.current?.focus();
    }
  };
  
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-gray-900">*</span>}
      </label>
      <div 
        ref={containerRef}
        className={`tag-container relative flex flex-wrap min-h-[42px] items-center p-1 border ${focused ? 'border-gray-500 ring-1 ring-gray-500' : 'border-gray-300'} rounded-md bg-white`}
        onClick={handleContainerClick}
      >
        {value.map((tag, index) => (
          <div 
            key={index} 
            className="flex items-center bg-gray-100 text-gray-800 text-sm rounded-md px-2 py-1 m-1 whitespace-nowrap"
          >
            {tag}
            <button
              type="button"
              className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
            >
              <XMarkIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        <div className="relative flex-grow">
          <input
            ref={inputRef}
            type="text"
            className="w-full p-1.5 border-0 focus:ring-0 text-sm"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            placeholder={value.length === 0 ? placeholder : ''}
          />
          
          {/* Dropdown for suggestions */}
          {filteredOptions.length > 0 && focused && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
              {filteredOptions.map((option) => (
                <div
                  key={option}
                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 text-gray-900 hover:bg-gray-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    addTag(option);
                    setFilteredOptions([]);
                    // Keep focus on input after selection
                    setTimeout(() => {
                      inputRef.current?.focus();
                    }, 10);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Enter names separated by comma, or press Enter after each name
      </p>
    </div>
  );
};

export default PersonnelTagInput;