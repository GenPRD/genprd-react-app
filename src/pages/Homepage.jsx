import { useEffect, useRef } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTestAPI } from '../hooks/useApi'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { 
  FiFileText, FiUsers, FiZap, FiCheckCircle, FiArrowRight, 
  FiEdit, FiDownload, FiCloud, FiSettings, FiLayers,
  FiStar, FiTrendingUp, FiShield, FiClock
} from 'react-icons/fi'

// Enhanced GlassCard with better glassmorphism
const GlassCard = ({ children, className = '', variant = 'default', ...props }) => {
  const variants = {
    default: 'bg-white/10 backdrop-blur-xl border border-white/20',
    elevated: 'bg-white/15 backdrop-blur-2xl border border-white/30 shadow-2xl',
    subtle: 'bg-white/5 backdrop-blur-lg border border-white/10',
    feature: 'bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border border-white/20 hover:from-white/25 hover:to-white/10'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`${variants[variant]} rounded-3xl backdrop-saturate-150 hover:shadow-2xl transition-all duration-500 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Floating particles background
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary-400/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  )
}

// Enhanced Hero section with parallax
const HeroSection = ({ isAuthenticated }) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <motion.section 
      ref={ref}
      style={{ y, opacity }}
      className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden"
    >
      {/* Background gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-purple-50/30 to-blue-50/50" />
      <FloatingParticles />
      
      {/* Main hero content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <GlassCard variant="elevated" className="p-12 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-100/80 to-purple-100/80 backdrop-blur-sm border border-white/30 mb-6">
              <FiStar className="w-4 h-4 text-primary-600 mr-2" />
              <span className="text-sm font-medium text-primary-700">AI-Powered Documentation</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
                Create Perfect
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-primary-600 to-purple-600 bg-clip-text text-transparent">
                PRDs in Seconds
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-700/90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Transform your ideas into comprehensive Product Requirements Documents with 
              <span className="font-semibold text-primary-700"> AI precision</span> and 
              <span className="font-semibold text-purple-700"> professional quality</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <RouterLink
                to={isAuthenticated ? "/prds/new" : "/login"}
                className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-blue-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-primary-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10">Start Creating</span>
                <FiArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </RouterLink>
              
              <button className="group inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-xl border border-white/30 text-gray-700 font-semibold rounded-2xl hover:bg-white/30 transition-all duration-300">
                <FiZap className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </div>
          </motion.div>
        </GlassCard>
        
        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6"
        >
          {[
            { label: 'PRDs Generated', value: '10K+', icon: FiFileText },
            { label: 'Time Saved', value: '85%', icon: FiClock },
            { label: 'User Satisfaction', value: '98%', icon: FiStar },
            { label: 'Active Teams', value: '500+', icon: FiUsers }
          ].map((stat, idx) => (
            <GlassCard key={stat.label} variant="subtle" className="p-4 text-center">
              <stat.icon className="h-6 w-6 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

// Enhanced Features section
const FeaturesSection = () => {
  const features = [
    {
      icon: FiFileText,
      title: "Smart Input Interface",
      description: "Intelligent forms that guide you through every step of PRD creation with contextual suggestions.",
      color: "from-blue-500 to-primary-600"
    },
    {
      icon: FiZap,
      title: "AI-Powered Generation",
      description: "Advanced LLM technology creates comprehensive, industry-standard PRDs in seconds.",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: FiEdit,
      title: "Real-time Collaboration",
      description: "Edit, review, and refine your PRDs with real-time collaboration features.",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: FiDownload,
      title: "Multi-format Export",
      description: "Export as PDF, Word, or Markdown with professional templates and styling.",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: FiShield,
      title: "Enterprise Security",
      description: "Bank-level security with SOC 2 compliance and enterprise-grade data protection.",
      color: "from-indigo-500 to-blue-600"
    },
    {
      icon: FiTrendingUp,
      title: "Analytics & Insights",
      description: "Track PRD performance, team productivity, and project success metrics.",
      color: "from-cyan-500 to-blue-600"
    }
  ]

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-50/30 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            Powerful Features for
            <span className="block bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Modern Teams
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to create, collaborate, and deliver exceptional product documentation.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <GlassCard 
              key={feature.title} 
              variant="feature" 
              className="p-8 group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}

// Enhanced Workflow section
const WorkflowSection = () => {
  const workflow = [
    { 
      icon: FiLayers, 
      label: 'Input Project Details', 
      description: 'Fill structured forms with smart suggestions',
      color: 'from-blue-500 to-primary-600'
    },
    { 
      icon: FiZap, 
      label: 'AI Generation', 
      description: 'LLM processes and creates comprehensive PRD',
      color: 'from-purple-500 to-pink-600'
    },
    { 
      icon: FiEdit, 
      label: 'Review & Refine', 
      description: 'Collaborate and perfect your documentation',
      color: 'from-green-500 to-teal-600'
    },
    { 
      icon: FiDownload, 
      label: 'Export & Share', 
      description: 'Download professional PDFs and share with team',
      color: 'from-orange-500 to-red-600'
    }
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-50/50 to-purple-50/50" />
      
      <div className="relative max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
            Simple 4-Step Process
          </h2>
          <p className="text-xl text-gray-600">
            From idea to professional PRD in minutes, not hours.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {workflow.map((step, idx) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              <GlassCard variant="elevated" className="p-8 text-center h-full">
                <div className="relative mb-6">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${step.color} p-5 mx-auto mb-4 shadow-lg`}>
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-gray-700 shadow-lg">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.label}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </GlassCard>
              
              {idx < workflow.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary-300 to-purple-300 transform -translate-y-1/2" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Homepage = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { testConnection } = useTestAPI()

  useEffect(() => {
    testConnection().then(
      () => console.log('API Connected'),
      (error) => console.log('API Offline', error)
    )
  }, [testConnection])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Enhanced Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl flex items-center justify-center">
              <FiFileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              GenPRD
            </h1>
          </div>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block font-medium text-gray-700">
                Welcome, {user?.name}
              </span>
              <button 
                onClick={logout} 
                className="px-6 py-2 rounded-xl bg-white/60 backdrop-blur border border-white/30 text-gray-700 hover:bg-white/80 font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Logout
              </button>
            </div>
          ) : (
            <RouterLink 
              to="/login" 
              className="px-6 py-2 bg-gradient-to-r from-primary-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Login
            </RouterLink>
          )}
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-20">
        <HeroSection isAuthenticated={isAuthenticated} />
        <FeaturesSection />
        <WorkflowSection />
        
        {/* CTA Section */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-purple-600/10" />
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <GlassCard variant="elevated" className="p-12">
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                Ready to Transform Your Documentation?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of teams already using GenPRD to create better product requirements.
              </p>
              <RouterLink
                to={isAuthenticated ? "/prds/new" : "/login"}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-primary-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Get Started Free
                <FiArrowRight className="ml-2 h-5 w-5" />
              </RouterLink>
            </GlassCard>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="relative py-12 bg-gradient-to-r from-gray-50/80 to-primary-50/80 backdrop-blur-xl border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FiFileText className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-black text-gray-900">GenPRD</span>
            </div>
            <p className="text-gray-600 mb-2">Transformative Horizons</p>
            <p className="text-sm text-gray-500 mb-4">Bridging Mind, Building Futures</p>
            <p className="text-xs text-gray-400">© 2025 GenPRD. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Homepage