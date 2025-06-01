import { motion } from 'framer-motion';

const BrowserMockup = () => {
  return (
    <motion.div 
      className="w-full max-w-md rounded-lg overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {/* Browser Bar */}
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="mx-auto px-16 py-1 bg-white rounded text-xs text-gray-500 text-center">
          app.genprd.com
        </div>
      </div>
      
      {/* App Mockup */}
      <div className="bg-white">
        {/* Top Nav */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-900 rounded-sm mr-2"></div>
            <span className="text-xs font-medium">GenPRD</span>
          </div>
          <div className="w-6 h-6 bg-gray-100 rounded-full"></div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="mb-4">
            <motion.div 
              className="h-4 bg-gray-100 w-1/2 rounded mb-2"
              animate={{ width: ["50%", "60%", "50%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
            <motion.div 
              className="h-3 bg-gray-50 w-3/4 rounded"
              animate={{ width: ["75%", "85%", "75%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.2 }}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="h-16 bg-gray-50 rounded p-2">
              <div className="h-2 bg-gray-100 w-1/2 rounded mb-2"></div>
              <div className="h-2 bg-gray-100 w-3/4 rounded"></div>
            </div>
            <div className="h-16 bg-gray-50 rounded p-2">
              <div className="h-2 bg-gray-100 w-1/2 rounded mb-2"></div>
              <div className="h-2 bg-gray-100 w-3/4 rounded"></div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-md p-3">
            <div className="h-2 bg-gray-100 w-1/3 rounded mb-3"></div>
            <div className="flex items-center justify-between mb-2">
              <div className="h-2 bg-gray-100 w-1/4 rounded"></div>
              <div className="h-2 bg-gray-100 w-1/4 rounded"></div>
              <div className="h-2 bg-gray-100 w-1/4 rounded"></div>
            </div>
            <motion.div 
              className="h-1 bg-primary-500 w-12 rounded-full my-2"
              animate={{ width: ["25%", "65%", "25%"] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            />
            <div className="flex items-center justify-between">
              <div className="h-2 bg-gray-100 w-1/5 rounded"></div>
              <div className="h-2 bg-gray-100 w-1/6 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BrowserMockup;