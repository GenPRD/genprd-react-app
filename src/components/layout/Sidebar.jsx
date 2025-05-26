import { Link, useLocation } from 'react-router-dom'
import { DocumentTextIcon, UserGroupIcon, HomeIcon } from '@heroicons/react/24/outline'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: <HomeIcon className="w-5 h-5" /> },
  { to: '/prds', label: 'PRDs', icon: <DocumentTextIcon className="w-5 h-5" /> },
  { to: '/personnel', label: 'Personnel', icon: <UserGroupIcon className="w-5 h-5" /> },
]

const Sidebar = () => {
  const location = useLocation()
  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col py-6 px-4">
      <div className="mb-8 flex items-center">
        <img src="/genprd_logo.png" alt="GenPRD" className="h-8 w-auto mr-2" />
        <span className="font-bold text-primary-600 text-lg">GenPRD</span>
      </div>
      <nav className="flex-1 space-y-2">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-primary-50 transition ${
              location.pathname.startsWith(link.to) ? 'bg-primary-100 font-semibold text-primary-700' : ''
            }`}
          >
            {link.icon}
            <span className="ml-3">{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar