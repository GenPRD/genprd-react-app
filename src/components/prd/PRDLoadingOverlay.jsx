import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { SparklesIcon } from '@heroicons/react/24/outline';

// Styles for animations
const overlayStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
  
  @keyframes dots {
    0%, 20% { content: "."; }
    40% { content: ".."; }
    60%, 80% { content: "..."; }
  }
`;

const loadingMessages = [
  "Generating your PRD with AI...",
  "Analyzing requirements...",
  "Creating product specifications...",
  "Defining user stories...",
  "Building acceptance criteria...",
  "Outlining technical requirements...",
  "Drafting implementation plan...",
  "Finalizing document..."
];

// Modified to accept either isVisible or direct rendering
const PRDLoadingOverlay = ({ isVisible = true, step }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  
  // Inject styles once
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.type = 'text/css';
    styleEl.appendChild(document.createTextNode(overlayStyles));
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);
  
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);
    
    // Disable scrolling
    document.body.style.overflow = 'hidden';
    
    return () => {
      clearInterval(interval);
      document.body.style.overflow = '';
    };
  }, [isVisible]);
  
  if (!isVisible) return null;
  
  const overlayContent = (
    <div 
      className="fixed inset-0 z-[99999] overflow-hidden flex items-center justify-center"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Backdrop with high opacity and blur effect */}
      <div 
        className="fixed inset-0 bg-gray-900 bg-opacity-95 transition-opacity"
        style={{
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          animation: 'fadeIn 0.3s ease-out forwards',
          position: 'fixed',
          zIndex: 99998
        }}
      />
      
      {/* Loading content */}
      <div 
        className="relative z-[99999] bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4"
        style={{ 
          animation: 'fadeIn 0.2s ease-out forwards',
          zIndex: 99999
        }}
      >
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 mb-6 text-gray-700 flex items-center justify-center">
            <SparklesIcon className="h-full w-full" style={{ animation: 'pulse 1.5s infinite ease-in-out' }} />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            {loadingMessages[messageIndex]}
          </h2>
          
          <div className="w-full mt-4">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gray-800 rounded-full"
                style={{ 
                  width: '100%', 
                  animation: 'pulse 2s infinite'
                }}
              ></div>
            </div>
            
            <div className="flex justify-center space-x-1 mt-6">
              {[0, 1, 2].map((i) => (
                <div 
                  key={i} 
                  className={`h-2 w-2 rounded-full 
                    ${i === messageIndex % 3 ? 'bg-gray-800' : 'bg-gray-300'}`}
                ></div>
              ))}
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            This may take a minute or two...
          </p>
        </div>
      </div>
    </div>
  );
  
  return ReactDOM.createPortal(overlayContent, document.body);
};

export default PRDLoadingOverlay;