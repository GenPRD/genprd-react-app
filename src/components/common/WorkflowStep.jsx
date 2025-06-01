import { motion } from 'framer-motion';

const WorkflowStep = ({ number, title, description }) => {
  return (
    <motion.div 
      className="border-t-2 border-gray-900 pt-6 hover:border-primary-600 transition-colors duration-300"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-sm font-medium text-gray-500 mb-2 block">{number}</span>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600">
        {description}
      </p>
    </motion.div>
  );
};

export default WorkflowStep;