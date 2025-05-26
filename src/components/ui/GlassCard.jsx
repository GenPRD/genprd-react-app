import React from 'react';
import { motion } from 'framer-motion'; // Optional: if you want card animations

const GlassCard = ({ children, className, ...props }) => {
  // Apply the glassmorphism classes based on the white theme and primary tint
  const glassClasses = "bg-white/60 backdrop-blur-lg rounded-lg border border-white/40 shadow-sm";

  return (
    <motion.div
      // Optional Framer Motion animations
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${glassClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard; 