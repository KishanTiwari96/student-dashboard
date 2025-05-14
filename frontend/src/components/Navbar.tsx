import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useUser } from '../contexts/UserContext'
import ConfirmationModal from './ConfirmationModal'

const Navbar = () => {
  const { currentUser, logout } = useAuth()
  const { displayName, photoURL } = useUser()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsDropdownOpen(false)
  }, [location])
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setIsDropdownOpen(false)
    } catch (error) {
      console.error('Failed to log out', error)
    }
  }

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-yellow-300 font-semibold' : 'text-white hover:text-blue-200'
  }

  // Get user display name or fallback to email
  const getUserDisplayName = () => {
    if (displayName) {
      return displayName;
    }
    return currentUser?.email?.split('@')[0] || '';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (displayName) {
      return displayName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();
    }
    return currentUser?.email?.charAt(0).toUpperCase() || '';
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-blue-900/95 backdrop-blur-md shadow-lg py-2' : 'bg-gradient-to-r from-blue-800 to-indigo-700 py-3'
      }`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center group">
            <div className="relative w-10 h-10 mr-2 bg-blue-500 rounded-full overflow-hidden shadow-inner group-hover:scale-110 transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-600 opacity-80"></div>
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 h-6 w-6 m-auto text-white transform group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-wide">Student<span className="text-yellow-300">Hub</span></span>
              <span className="text-xs text-blue-200 tracking-widest -mt-1 opacity-80">DASHBOARD</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/')}`}>
              Home
            </Link>
            <Link to="/students" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/students')}`}>
              Students
            </Link>
            {currentUser && (
              <Link to="/add-student" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/add-student')}`}>
                Add Student
              </Link>
            )}

            {/* Authentication */}
            {currentUser ? (
              <div className="relative ml-3" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
                  aria-expanded={isDropdownOpen}
                >
                  <div className="relative">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold border-2 border-white shadow-md overflow-hidden">
                      {photoURL ? (
                        <img src={photoURL} alt="User" className="h-full w-full object-cover" />
                      ) : (
                        getUserInitials()
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border border-white"></div>
                  </div>
                  <div className="hidden md:flex items-center ml-2">
                    <span className="mr-1 text-white">{getUserDisplayName()}</span>
                    <svg className={`h-4 w-4 text-blue-200 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div 
                  className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
                    isDropdownOpen ? 'opacity-100 visible transform-none' : 'opacity-0 invisible -translate-y-2'
                  }`}
                >
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Your Profile
                    </div>
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </div>
                  </Link>
                  <button 
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-red-50"
                  >
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Log out
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-2">
                <Link to="/login" className="px-3 py-1.5 text-sm font-medium text-white hover:text-blue-200 transition-colors duration-200">
                  Login
                </Link>
                <Link to="/signup" className="px-4 py-1.5 text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition duration-200 transform hover:-translate-y-0.5">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center p-2 rounded-md text-blue-200 hover:text-white focus:outline-none"
          >
            <svg className={`h-6 w-6 ${isMobileMenuOpen ? 'hidden' : 'block'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg className={`h-6 w-6 ${isMobileMenuOpen ? 'block' : 'hidden'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gradient-to-b from-blue-900/95 to-indigo-900/95 backdrop-blur-md">
            <Link to="/" className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/' ? 'bg-blue-800 text-white' : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}>
              Home
            </Link>
            <Link to="/students" className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/students' ? 'bg-blue-800 text-white' : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}>
              Students
            </Link>
            {currentUser && (
              <Link to="/add-student" className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/add-student' ? 'bg-blue-800 text-white' : 'text-blue-200 hover:bg-blue-800 hover:text-white'}`}>
                Add Student
              </Link>
            )}
            {currentUser ? (
              <div className="pt-4 pb-3 border-t border-blue-800">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-lg font-semibold overflow-hidden">
                      {photoURL ? (
                        <img src={photoURL} alt="User" className="h-full w-full object-cover" />
                      ) : (
                        getUserInitials()
                      )}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">
                      {getUserDisplayName()}
                    </div>
                    <div className="text-sm font-medium text-blue-200 truncate max-w-[200px]">
                      {currentUser?.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-blue-200 hover:bg-blue-800 hover:text-white">
                    Your Profile
                  </Link>
                  <Link to="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-blue-200 hover:bg-blue-800 hover:text-white">
                    Settings
                  </Link>
                  <button 
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-blue-200 hover:bg-red-900 hover:text-white"
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-blue-800 flex flex-col space-y-2 px-3">
                <Link to="/login" className="px-3 py-2 rounded-md text-base font-medium text-blue-200 hover:bg-blue-800 hover:text-white">
                  Login
                </Link>
                <Link to="/signup" className="px-4 py-2 text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-700 shadow-md text-center">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out of your account?"
        confirmText="Log Out"
        cancelText="Cancel"
        type="warning"
      />
    </>
  )
}

export default Navbar 