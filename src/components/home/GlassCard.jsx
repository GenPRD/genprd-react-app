import { motion } from 'framer-motion'

const GlassCard = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`bg-white/90 backdrop-blur-lg backdrop-saturate-150 border border-white/40 rounded-2xl shadow-xl ${className}`}
  >
    {children}
  </motion.div>
)

export default GlassCard