import { motion } from 'framer-motion';

const StatusCard = ({ icon, iconColor, label, count }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
    >
      <div className="p-5">
        <div className={`w-12 h-12 ${iconColor || 'bg-blue-50'} rounded-lg flex items-center justify-center mb-3`}>
          {icon}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{count}</h3>
          <p className="text-sm font-medium text-gray-500 mt-1">{label}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatusCard;