import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div 
      className="bg-white border border-gray-100 rounded-lg p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4 p-2 bg-gray-50 rounded-lg inline-block group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm">
        {description}
      </p>
    </motion.div>
  );
};

export default FeatureCard;