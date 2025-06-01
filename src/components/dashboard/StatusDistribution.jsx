import { motion } from 'framer-motion';
import StatusProgressBar from './StatusProgressBar';

const StatusDistribution = ({ counts }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
    >
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">PRD Status Distribution</h2>
      </div>
      <div className="p-5 space-y-5">
        <StatusProgressBar 
          label="Draft" 
          count={counts.totalDraft || 0} 
          total={counts.totalPRD || 1} 
          color="bg-gray-400" 
        />
        
        <StatusProgressBar 
          label="In Progress" 
          count={counts.totalInProgress || 0} 
          total={counts.totalPRD || 1} 
          color="bg-blue-500" 
        />
        
        <StatusProgressBar 
          label="Finished" 
          count={counts.totalFinished || 0} 
          total={counts.totalPRD || 1} 
          color="bg-green-500" 
        />
        
        <StatusProgressBar 
          label="Archived" 
          count={counts.totalArchived || 0} 
          total={counts.totalPRD || 1} 
          color="bg-gray-500" 
        />
      </div>
    </motion.div>
  );
};

export default StatusDistribution;