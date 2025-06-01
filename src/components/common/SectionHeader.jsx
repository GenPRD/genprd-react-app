import { motion } from 'framer-motion';

const SectionHeader = ({ tag, title, description }) => {
  return (
    <motion.div 
      className="max-w-xl mx-auto text-center mb-12"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {tag && (
        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase inline-block mb-2">
          {tag}
        </span>
      )}
      <h2 className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900 leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base text-gray-600">
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeader;