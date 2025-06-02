import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './components/auth/AuthProvider'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PublicRoute from './components/auth/PublicRoute'
import AuthCallback from './components/auth/AuthCallback'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Personnel from './pages/Personnel'
import PRDs from './pages/PRDs'
import PRDForm from './pages/PRDForm'
import PRDDetail from './pages/PRDDetail'
import ErrorBoundary from './components/common/ErrorBoundary'

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <div className="app-wrapper">
            <Routes>
              {/* Homepage - Redirects authenticated users to dashboard */}
              <Route path="/" element={
                <PublicRoute redirectTo="/dashboard">
                  <Homepage />
                </PublicRoute>
              } />
              
              {/* Public Routes - Redirects authenticated users */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              
              {/* Auth Callback - Special case, needs to handle tokens */}
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Protected Routes - Requires authentication */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/personnel" element={
                <ProtectedRoute>
                  <Personnel />
                </ProtectedRoute>
              } />
              
              <Route path="/prds" element={
                <ProtectedRoute>
                  <PRDs />
                </ProtectedRoute>
              } />
              
              <Route path="/prds/new" element={
                <ProtectedRoute>
                  <PRDForm />
                </ProtectedRoute>
              } />
              
              <Route path="/prds/:id" element={
                <ProtectedRoute>
                  <PRDDetail />
                </ProtectedRoute>
              } />
              
              {/* 404 Route */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-4">Page not found</p>
                    <a href="/" className="text-primary-600 hover:text-primary-700">
                      ← Back to homepage
                    </a>
                  </div>
                </div>
              } />
            </Routes>
          </div>
          
          {/* Modal Root div - added to ensure modals render at root level */}
          <div id="modal-root"></div>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  )
}

export default App