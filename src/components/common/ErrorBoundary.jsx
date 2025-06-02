import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
    console.log('ErrorBoundary initialized');
  }

  static getDerivedStateFromError(error) {
    console.log('ErrorBoundary caught an error:', error.message);
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Uncaught error in component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-700 mb-4">An error occurred in the application. Please try refreshing the page.</p>
            {this.state.error && (
              <pre className="bg-gray-100 p-3 text-left text-sm text-gray-700 rounded overflow-auto max-h-32 mb-4">
                {this.state.error.toString()}
              </pre>
            )}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                  window.location.reload();
                }}
                className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
              >
                Refresh Page
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                  window.location.href = '/';
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;