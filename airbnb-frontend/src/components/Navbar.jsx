import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, User, Home as HomeIcon, Calendar, Menu, X, Sparkles, Building2, Heart } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                  <Sparkles className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent group-hover:from-red-600 group-hover:to-pink-600 transition-all">
                  StayEase
                </span>
                <p className="text-xs text-gray-500 font-medium tracking-wide">PREMIUM STAYS</p>
              </div>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/hotels" 
              className="px-4 py-2 text-gray-600 hover:text-red-600 font-medium transition-all rounded-lg hover:bg-red-50 flex items-center gap-2"
            >
              <Building2 className="h-4 w-4" />
              Hotels
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/my-bookings" 
                  className="px-4 py-2 text-gray-600 hover:text-red-600 font-medium transition-all rounded-lg hover:bg-red-50 flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  My Bookings
                </Link>
                <Link 
                  to="/profile" 
                  className="px-4 py-2 text-gray-600 hover:text-red-600 font-medium transition-all rounded-lg hover:bg-red-50 flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-red-600 hover:text-red-700 font-medium transition-all rounded-lg hover:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2.5 text-gray-600 hover:text-red-600 font-medium transition-all rounded-lg hover:bg-red-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-100 animate-slide-in">
            <Link 
              to="/hotels" 
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
            >
              <Building2 className="h-5 w-5" />
              Hotels
            </Link>
            {user ? (
              <>
                <Link 
                  to="/my-bookings" 
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
                >
                  <Calendar className="h-5 w-5" />
                  My Bookings
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
                >
                  <User className="h-5 w-5" />
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
                >
                  <User className="h-5 w-5" />
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
                >
                  <Sparkles className="h-5 w-5" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
