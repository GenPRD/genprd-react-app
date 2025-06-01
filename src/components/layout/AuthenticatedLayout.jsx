import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../../hooks/useAuth';

const AuthenticatedLayout = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  // Don't render if user is not authenticated or user data is missing
  if (!isAuthenticated || !user || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Desktop Sidebar - tambahkan soft border */}
      <div className="hidden md:block md:w-64 flex-shrink-0 border-r border-gray-200 shadow-sm">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-gray-600 bg-opacity-50 z-40"
            onClick={handleOverlayClick}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar - tambahkan soft border */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden fixed inset-y-0 left-0 w-64 bg-white z-50 border-r border-gray-200 shadow-md"
          >
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                className="text-gray-500 hover:text-gray-900"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <Sidebar isMobile={true} onCloseMobile={() => setSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          showMobileMenu={true}
          onMobileMenuClick={() => setSidebarOpen(true)}
        />

        {/* Main content with scrolling - ubah bg jadi putih */}
        <main className="flex-1 overflow-y-auto bg-white py-6">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;