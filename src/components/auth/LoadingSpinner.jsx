import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div 
        className={`rounded-full border-2 border-gray-200 ${sizes[size]}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        style={{ 
          borderTopColor: 'rgb(31, 41, 55)',
          borderRightColor: 'rgb(31, 41, 55)',
          borderBottomColor: 'transparent',
          borderLeftColor: 'transparent'
        }}
      />
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;