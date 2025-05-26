import { useAuth } from '../../hooks/useAuth'

const Navbar = () => {
  const { user, logout } = useAuth()
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div />
      <div className="flex items-center space-x-4">
        <img
          src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}`}
          alt={user?.name}
          className="w-8 h-8 rounded-full border"
        />
        <span className="text-gray-700">{user?.name}</span>
        <button
          onClick={logout}
          className="text-gray-500 hover:text-primary-600 px-3 py-1 rounded transition"
        >
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar