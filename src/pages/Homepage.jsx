import { useEffect, useState, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {
  DocumentTextIcon,
  UserGroupIcon,
  SparklesIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline'
import { useTestAPI } from '../hooks/useApi'
import { Button, Card } from '../components/common'
import { 
  Dialog, 
  DialogPanel, 
  Disclosure, 
  DisclosureButton, 
  DisclosurePanel, 
  Menu, 
  MenuButton, 
  MenuItem, 
  MenuItems,
  Transition 
} from '@headlessui/react'

const Homepage = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const { testConnection } = useTestAPI()
  const [activeSlide, setActiveSlide] = useState(0)
  const totalSlides = 3
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  useEffect(() => {
    // Minimal API check, just log for debug
    testConnection().then(
      () => console.log('API Connected'),
      (error) => console.log('API Offline', error)
    )

    // Auto-advance slides every 5 seconds
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides)
    }, 5000)

    return () => clearInterval(interval)
  }, [testConnection])

  const slides = [
    {
      icon: <DocumentTextIcon className="w-10 h-10 text-primary-500" />,
      title: "Create Professional PRDs",
      description: "Generate comprehensive Product Requirement Documents with AI assistance"
    },
    {
      icon: <SparklesIcon className="w-10 h-10 text-primary-500" />,
      title: "AI-Powered Generation",
      description: "Let AI help you draft, refine, and format your product requirements"
    },
    {
      icon: <UserGroupIcon className="w-10 h-10 text-primary-500" />,
      title: "Boost Productivity",
      description: "Adjust your productivity as a project manager by easily creating PRDs"
    }
  ]

  const faqs = [
    {
      question: "What is a PRD?",
      answer: "A Product Requirements Document (PRD) is a detailed description of a product's intended features, functionality, and purpose. It serves as a roadmap for development teams."
    },
    {
      question: "How does the AI generation work?",
      answer: "GenPRD uses advanced language models to analyze your inputs and generate comprehensive, well-structured PRDs. The AI suggests content based on industry standards while allowing you full control over edits."
    },
    {
      question: "Can I collaborate with my team?",
      answer: "Yes! GenPRD allows you to invite team members, assign DARCI roles, and collaborate on PRDs in real-time."
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header with Headless UI Menu */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 flex justify-between items-center py-3">
          <Link to="/" className="flex items-center group">
            <img 
              src="/genprd_logo.png" 
              alt="GenPRD Logo" 
              className="h-8 w-auto group-hover:scale-105 transition-transform duration-300" 
            />
          </Link>
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <Menu as="div" className="relative">
                <MenuButton className="flex items-center space-x-2 text-gray-700 hover:text-primary-500 transition-colors">
                  <img 
                    src={user?.avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "User")} 
                    alt={user?.name} 
                    className="w-8 h-8 rounded-full border border-gray-200"
                  />
                  <span className="hidden sm:block">{user?.name}</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </MenuButton>
                
                <Transition
                  as={Fragment}
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-in"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <MenuItem>
                      {({ active }) => (
                        <Link
                          to="/dashboard"
                          className={`${
                            active ? 'bg-primary-50' : ''
                          } block px-4 py-2 text-sm`}
                        >
                          Dashboard
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <Link
                          to="/prds"
                          className={`${
                            active ? 'bg-primary-50' : ''
                          } block px-4 py-2 text-sm`}
                        >
                          My PRDs
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={`${
                            active ? 'bg-primary-50' : ''
                          } block w-full text-left px-4 py-2 text-sm`}
                        >
                          Logout
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Transition>
              </Menu>
            ) : (
              <Button as={Link} to="/login" size="sm" variant="secondary">
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero with Onboarding Carousel */}
      <section className="flex-grow flex flex-col items-center justify-center px-4 py-10 md:py-16">
        <div className="max-w-xl w-full mx-auto">
          {/* Mobile-inspired onboarding carousel using Transition */}
          <div className="relative h-80 mb-8 overflow-hidden rounded-3xl bg-primary-50">
            {slides.map((slide, index) => (
              <Transition
                key={index}
                show={activeSlide === index}
                as="div" // FIX: Add as="div" here
                enter="transition duration-500 ease-out"
                enterFrom={`transform ${index > activeSlide ? 'translate-x-full' : '-translate-x-full'} opacity-0`}
                enterTo="transform translate-x-0 opacity-100"
                leave="transition duration-500 ease-in"
                leaveFrom="transform translate-x-0 opacity-100"
                leaveTo={`transform ${index < activeSlide ? '-translate-x-full' : 'translate-x-full'} opacity-0`}
                className="absolute inset-0 flex flex-col items-center justify-center p-8"
              >
                <div className="w-20 h-20 mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                  {slide.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">{slide.title}</h2>
                <p className="text-gray-600 text-center max-w-xs">{slide.description}</p>
              </Transition>
            ))}

            {/* Carousel indicators */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
              {[...Array(totalSlides)].map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`${
                    activeSlide === index 
                      ? "bg-primary-500 w-6" 
                      : "bg-gray-300 hover:bg-gray-400"
                  } h-2 rounded-full transition-all duration-300`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* CTA Button with animation */}
          <div className="text-center relative">
            <Button
              as={Link}
              to={isAuthenticated ? "/prds/new" : "/login"}
              size="lg"
              className="w-full sm:w-auto px-8 py-3 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center">
                Start Creating PRDs
                <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-primary-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"/>
            </Button>

            {/* Watch Demo Button with Dialog */}
            <button 
              onClick={() => setIsVideoOpen(true)}
              className="mt-4 text-primary-500 flex items-center justify-center mx-auto hover:text-primary-600 transition-colors"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 mr-2">
                <ChatBubbleBottomCenterTextIcon className="h-4 w-4" />
              </span>
              <span>Learn how it works</span>
            </button>

            {!isAuthenticated && (
              <p className="mt-4 text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-primary-500 hover:underline">
                  Login here
                </Link>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Features Section with appear animations */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Features designed for product managers
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <DocumentTextIcon className="w-8 h-8" />,
                title: "Document Templates",
                description: "Start with pre-built templates tailored for different product types"
              },
              {
                icon: <SparklesIcon className="w-8 h-8" />,
                title: "AI-Powered Writing",
                description: "Generate and refine content with advanced AI assistance"
              },
              {
                icon: <UserGroupIcon className="w-8 h-8" />,
                title: "Team Collaboration",
                description: "Invite team members and assign DARCI roles easily"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="transform transition-all duration-300"
                style={{
                  opacity: 0,
                  transform: 'translateY(10px)',
                  animation: `fadeInUp 700ms ${300 + index * 100}ms forwards`
                }}
              >
                <Card className="bg-white border-none shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4 text-primary-600">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
        
        {/* Add keyframes for fadeInUp animation */}
        <style jsx="true">{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </section>

      {/* FAQ Section with Headless UI Disclosure */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Disclosure key={index}>
                {({ open }) => (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <DisclosureButton className="w-full flex justify-between items-center px-4 py-3 bg-white hover:bg-gray-50 transition-colors">
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      <ChevronDownIcon 
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          open ? 'transform rotate-180' : ''
                        }`}
                      />
                    </DisclosureButton>
                    <DisclosurePanel className="px-4 py-3 bg-gray-50 text-gray-600">
                      {faq.answer}
                    </DisclosurePanel>
                  </div>
                )}
              </Disclosure>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions for Authenticated Users */}
      {isAuthenticated && (
        <section className="py-12 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <Card className="border-primary-100 border shadow-md overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative">
                {/* Background decorative element */}
                <div className="absolute right-0 top-0 h-full w-32 bg-primary-50 transform skew-x-12 -mr-16 opacity-50"></div>
                
                <div className="relative">
                  <h3 className="font-bold text-xl text-gray-900 mb-1">
                    Welcome back, {user?.name?.split(' ')[0] || 'User'}!
                  </h3>
                  <p className="text-gray-600">
                    Continue where you left off
                  </p>
                </div>
                <div className="relative flex flex-wrap gap-2">
                  <Button as={Link} to="/prds" variant="secondary" size="sm">
                    My PRDs
                  </Button>
                  <Button as={Link} to="/prds/new" variant="primary" size="sm">
                    Create New PRD
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-auto bg-gray-50 py-6 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <img src="/genprd_logo.png" alt="GenPRD Logo" className="h-6 w-auto" />
            <span className="ml-2 text-sm text-gray-500">© 2025 GenPRD</span>
          </div>
          <div className="text-sm text-gray-500">
            Generate PRDs with LLM
          </div>
        </div>
      </footer>

      {/* Demo Video Dialog using Headless UI */}
      <Dialog open={isVideoOpen} onClose={() => setIsVideoOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition
            show={isVideoOpen}
            as="div" // FIX: Add as="div" here
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">How GenPRD Works</h3>
                <button 
                  onClick={() => setIsVideoOpen(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Placeholder for video */}
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Video demo would appear here</span>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row justify-between">
                <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                  See how easy it is to create professional PRDs in minutes.
                </p>
                <Button 
                  as={Link}
                  to={isAuthenticated ? "/prds/new" : "/login"}
                  onClick={() => setIsVideoOpen(false)}
                >
                  Try it yourself
                </Button>
              </div>
            </DialogPanel>
          </Transition>
        </div>
      </Dialog>
    </div>
  )
}

export default Homepage