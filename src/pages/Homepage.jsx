import { useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTestAPI } from '../hooks/useApi'
import { motion } from 'framer-motion'
import { FiFileText, FiUsers, FiZap, FiCheckCircle, FiArrowRight, FiEdit, FiDownload, FiCloud, FiSettings, FiLayers } from 'react-icons/fi'
import GlassCard from '../components/home/GlassCard'

const Homepage = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { testConnection } = useTestAPI()

  useEffect(() => {
    testConnection().then(
      () => console.log('API Connected'),
      (error) => console.log('API Offline', error)
    )
  }, [testConnection])

  // Features, workflow, benefits, tech stack from README/poster
  const features = [
    {
      icon: FiFileText,
      title: "Guided Input Interface",
      description: "Easily input project details with a user-friendly, structured form."
    },
    {
      icon: FiZap,
      title: "AI-Powered PRD Generation",
      description: "Generate comprehensive, standardized PRDs using Large Language Models."
    },
    {
      icon: FiEdit,
      title: "Editable Output",
      description: "Review and edit the generated PRD to ensure completeness and accuracy."
    },
    {
      icon: FiDownload,
      title: "Export as PDF",
      description: "Download your finalized PRD as a professionally styled PDF document."
    },
    {
      icon: FiUsers,
      title: "Collaboration",
      description: "Boost teamwork with clear, structured, and accessible PRDs for all team members."
    },
    {
      icon: FiCheckCircle,
      title: "Standardization",
      description: "Ensure consistency and quality across all your project documentation."
    }
  ]

  const workflow = [
    { icon: FiLayers, label: 'Fill Structured Fields' },
    { icon: FiZap, label: 'Generate PRD with LLM' },
    { icon: FiEdit, label: 'Review & Edit Output' },
    { icon: FiDownload, label: 'Export as PDF' }
  ]

  const benefits = [
    "Reduces inconsistencies across team documents.",
    "Boosts collaboration by providing a clear and structured format.",
    "Makes PRD creation accessible even to non-technical users.",
    "Saves time and reduces human error in documentation."
  ]

  const techStack = [
    { icon: FiCloud, name: 'React' },
    { icon: FiSettings, name: 'Node.js & Express' },
    { icon: FiZap, name: 'Flask & LLM API' },
    { icon: FiLayers, name: 'Tailwind CSS' },
    { icon: FiDownload, name: 'Docker' },
    { icon: FiCloud, name: 'Google Cloud Platform' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex flex-col">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-md border-b border-white/30 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent tracking-tight drop-shadow-md select-none">
            GenPRD
          </h1>
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block font-medium text-gray-700">{user?.name}</span>
              <button onClick={logout} className="px-4 py-2 rounded-md bg-primary-100/60 backdrop-blur border border-primary-200/40 text-primary-700 hover:bg-primary-200/70 font-semibold transition shadow">
                Logout
              </button>
            </div>
          ) : (
            <RouterLink 
              to="/login" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 shadow"
            >
              Login
            </RouterLink>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center py-16 px-4">
        <GlassCard className="max-w-2xl w-full mx-auto mb-10">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent drop-shadow-lg">
            AI-Powered Product Requirements<br className="hidden sm:block" /> Documentation in Seconds
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 mb-8">
            GenPRD streamlines PRD creation with AI, ensuring standardization, collaboration, and rapid, high-quality documentation for your projects.
          </p>
          <RouterLink
            to={isAuthenticated ? "/prds/new" : "/login"}
            className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-semibold rounded-md text-white bg-primary-600 hover:bg-primary-700 shadow-lg transition"
          >
            Get Started
            <FiArrowRight className="ml-2 h-5 w-5" />
          </RouterLink>
        </GlassCard>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-primary-700 mb-10 text-center">Key Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <GlassCard key={feature.title}>
                <feature.icon className="h-10 w-10 text-primary-500 mb-4" />
                <h4 className="font-semibold text-lg mb-2 text-primary-700">{feature.title}</h4>
                <p className="text-gray-700 text-base">{feature.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-primary-700 mb-10 text-center">Workflow</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            {workflow.map((step, idx) => (
              <GlassCard key={step.label} className="flex flex-col items-center w-full max-w-xs">
                <div className="bg-white/70 backdrop-blur text-primary-700 rounded-full p-4 mb-2 shadow-lg">
                  <step.icon className="h-7 w-7" />
                </div>
                <span className="font-medium text-base text-gray-800">{step.label}</span>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-br from-white to-primary-50">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-primary-700 mb-10 text-center">Benefits</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((benefit, idx) => (
              <GlassCard key={benefit} className="flex items-start gap-3">
                <FiCheckCircle className="text-primary-500 mt-1 flex-shrink-0" />
                <span className="text-gray-700 text-base">{benefit}</span>
              </GlassCard>
            ))}
          </ul>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-primary-700 mb-8 text-center">Tech Stack</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {techStack.map((tech, idx) => (
              <GlassCard key={tech.name} className="flex items-center gap-2 px-4 py-2 w-auto">
                <tech.icon className="h-5 w-5" />
                <span className="text-primary-700 font-medium">{tech.name}</span>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-md border-t border-white/30 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-2">
          <span className="text-lg font-bold text-primary-700 tracking-wide">Transformative Horizons</span>
          <span className="text-sm text-gray-500">Bridging Mind, Building Futures</span>
          <span className="text-xs text-gray-400 mt-2">© 2025 GenPRD</span>
        </div>
      </footer>
    </div>
  )
}

export default Homepage