import { motion } from 'framer-motion'

const GlassCard = ({ 
  children, 
  className = '', 
  variant = 'default', 
  hover = true,
  animate = true,
  ...props 
}) => {
  const variants = {
    default: 'glass-card',
    elevated: 'glass-card-elevated',
    subtle: 'glass-card-subtle',
    feature: 'glass-card bg-gradient-to-br from-white/20 to-white/5 hover:from-white/25 hover:to-white/10'
  }
  
  const baseClasses = `${variants[variant]} ${hover ? 'hover-lift' : ''} ${className}`
  
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
        {children}
      </motion.div>
    )
  }
  
  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  )
}

export default GlassCard