import { SparklesIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

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

const PRDLoadingOverlay = ({ step }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 3000);
    
    // Disable scrolling
    document.body.style.overflow = 'hidden';
    
    return () => {
      clearInterval(interval);
      document.body.style.overflow = '';
    };
  }, []);

  // Konten overlay yang akan dirender
  const overlayContent = (
    <div className="fixed inset-0 w-full h-full z-[999999] flex items-center justify-center">
      {/* Backdrop dengan blur yang lebih tebal dan lebih gelap */}
      <div 
        className="fixed inset-0 w-full h-full bg-gray-900 bg-opacity-85"
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      />
      
      <div className="relative z-[1000000] bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 mb-4 text-gray-700">
            <SparklesIcon className="h-full w-full animate-spin" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">
            {loadingMessages[messageIndex]}
          </h2>
          
          <div className="w-full mt-4">
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div className="animate-pulse bg-gray-700 h-full rounded" style={{width: '100%'}}></div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-1 mt-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`h-2 w-2 rounded-full ${i === messageIndex % 3 ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
              ))}
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            This may take a minute or two...
          </p>
        </div>
      </div>
    </div>
  );
  
  // Gunakan React Portal untuk merender overlay langsung ke document.body
  return ReactDOM.createPortal(
    overlayContent,
    document.body
  );
};

export default PRDLoadingOverlay;