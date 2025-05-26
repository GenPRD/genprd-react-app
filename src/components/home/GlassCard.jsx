import { motion } from 'framer-motion'

const GlassCard = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className={`bg-white/60 backdrop-blur-lg backdrop-saturate-150 border border-white/30 shadow-xl rounded-2xl p-8 ${className}`}
  >
    {children}
  </motion.div>
)

export default GlassCard 