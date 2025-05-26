import { motion } from 'framer-motion'
import { Paper } from '@mui/material'

const GlassCard = ({ 
  children, 
  className = '', 
  variant = 'default', 
  hover = true,
  animate = true,
  elevation = 0,
  ...props 
}) => {
  const variants = {
    default: 'bg-white/10 backdrop-blur-xl border border-white/20',
    elevated: 'bg-white/15 backdrop-blur-2xl border border-white/30 shadow-2xl',
    subtle: 'bg-white/5 backdrop-blur-lg border border-white/10',
    feature: 'bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/20 hover:from-white/25 hover:to-white/10'
  }
  
  const baseClasses = `rounded-3xl backdrop-saturate-150 transition-all duration-500 ${variants[variant]} ${hover ? 'hover:shadow-2xl' : ''} ${className}`
  
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={hover ? { y: -5, scale: 1.02 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={baseClasses}
        {...props}
      >
        <Paper elevation={elevation} className="bg-transparent h-full w-full">
          {children}
        </Paper>
      </motion.div>
    )
  }
  
  return (
    <Paper elevation={elevation} className={`${baseClasses} h-full w-full`} {...props}>
      {children}
    </Paper>
  )
}

export default GlassCard