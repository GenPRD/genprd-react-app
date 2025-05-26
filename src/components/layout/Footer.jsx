import { Typography, Box } from '@mui/material'
import { FiFileText } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="py-8 border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center">
            <FiFileText className="h-3 w-3 text-white" />
          </div>
          <span className="text-base font-medium text-gray-900">GenPRD</span>
        </div>
        <p className="text-sm text-gray-500 mb-1">Transformative Horizons</p>
        <p className="text-xs text-gray-400 mb-2">Bridging Mind, Building Futures</p>
        <p className="text-xs text-gray-400">© 2025 GenPRD. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer