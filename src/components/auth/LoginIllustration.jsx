import { motion } from 'framer-motion';
import probeImage from '../../assets/probe.png'; // Pastikan path ini benar

const LoginIllustration = () => {
  return (
    <motion.div 
      className="hidden lg:flex flex-col items-center justify-center h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative w-full max-w-md">
        <motion.img 
          src={probeImage}
          alt="AI Assistant Robot"
          className="w-full h-auto max-h-80 object-contain"
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Streamline Your PRD Creation</h3>
          <p className="text-gray-600 text-sm max-w-sm mx-auto">
            Let our AI assistant help you organize, write, and refine your product requirements documents.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoginIllustration;