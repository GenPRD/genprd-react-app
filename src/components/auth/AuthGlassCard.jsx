import { motion } from 'framer-motion'

const AuthGlassCard = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    className={`max-w-md w-full mx-auto p-8 bg-white/90 backdrop-blur-lg backdrop-saturate-150 border border-white/40 rounded-2xl shadow-2xl flex flex-col items-center ${className}`}
  >
    {children}
  </motion.div>
)

export default AuthGlassCard 