import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ClockIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const RecentPRDItem = ({ prd, index }) => {
  return (
    <motion.div 
      key={prd.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link
        to={`/prds/${prd.id}`}
        className="block hover:bg-gray-50 transition-colors duration-150"
      >
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex-grow">
              <h3 className="font-medium text-gray-900 mb-1">{prd.product_name}</h3>
              <div className="flex items-center text-sm text-gray-500">
                <ClockIcon className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                Updated {new Date(prd.updated_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
            <div className="flex items-center">
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                prd.document_stage === 'draft' ? 'bg-gray-100 text-gray-600' :
                prd.document_stage === 'inprogress' ? 'bg-blue-50 text-blue-600' :
                prd.document_stage === 'finished' ? 'bg-green-50 text-green-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {prd.document_stage === 'inprogress' 
                  ? 'In Progress' 
                  : prd.document_stage.charAt(0).toUpperCase() + prd.document_stage.slice(1)}
              </span>
              <ChevronRightIcon className="w-4 h-4 text-gray-400 ml-3" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RecentPRDItem;