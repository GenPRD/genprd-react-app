import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import RecentPRDItem from './RecentPRDItem';
import NoContent from './NoContent';

const RecentPRDsList = ({ recentPRDs }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6 overflow-hidden"
    >
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent PRDs</h2>
          <Link to="/prds" className="text-sm text-blue-600 hover:text-blue-800 flex items-center font-medium">
            View all
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
      
      {recentPRDs.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {recentPRDs.map((prd, index) => (
            <RecentPRDItem key={prd.id} prd={prd} index={index} />
          ))}
        </div>
      ) : (
        <NoContent />
      )}
    </motion.div>
  );
};

export default RecentPRDsList;