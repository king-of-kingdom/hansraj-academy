import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, BookOpen, Settings, ChevronDown, Sparkles, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout, cart, isAdmin } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/courses', label: 'Courses' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const isHomePage = location.pathname === '/';
  const showTransparent = isHomePage && !isScrolled;

  return (
    <>
      <nav className={`navbar-fixed ${showTransparent ? 'navbar-transparent' : 'navbar-solid'}`}>
        {/* Animated gradient border at bottom when scrolled */}
        {isScrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient" style={{ backgroundSize: '200% 200%' }}></div>
        )}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                showTransparent 
                  ? 'bg-white/10 backdrop-blur-sm border border-white/20' 
                  : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500'
              } group-hover:scale-110 group-hover:rotate-3`}>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                <BookOpen className="w-6 h-6 text-white relative z-10" />
                {/* Sparkle */}
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-pulse" />
              </div>
              <div>
                <span className={`font-bold text-xl transition-all duration-300 ${
                  showTransparent ? 'text-white text-glow-white' : 'text-gradient-animated'
                }`}>
                  Hansraj Academy
                </span>
                <p className={`text-xs hidden sm:block transition-colors duration-300 ${
                  showTransparent ? 'text-white/70' : 'text-gray-500'
                }`}>
                  Learn Here, Earn Anytime Anywhere
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link relative px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                    location.pathname === link.path
                      ? showTransparent 
                        ? 'bg-white/20 text-white backdrop-blur-sm' 
                        : 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600'
                      : showTransparent
                        ? 'text-white/90 hover:bg-white/10 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
                  )}
                </Link>
              ))}
            </div>

            {/* Right side buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              {user ? (
                <>
                  {/* Cart */}
                  <Link 
                    to="/cart" 
                    className={`relative p-3 rounded-xl transition-all duration-300 group ${
                      showTransparent 
                        ? 'text-white hover:bg-white/10' 
                        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                  >
                    <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center font-bold animate-bounce shadow-lg shadow-red-500/30">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                  
                  {/* User Menu */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                        showTransparent 
                          ? 'text-white hover:bg-white/10' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 transition-all group-hover:scale-110`}>
                        <span className="text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium hidden xl:block">{user.name.split(' ')[0]}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showUserMenu && (
                      <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl py-2 border border-gray-100 animate-scale-in overflow-hidden">
                        {/* Gradient top */}
                        <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                        
                        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                          <p className="font-bold text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                        
                        {isAdmin ? (
                          <Link 
                            to="/admin" 
                            className="flex items-center px-5 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 transition-all group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                              <Settings className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-semibold">Admin Panel</p>
                              <p className="text-xs text-gray-400">Manage everything</p>
                            </div>
                          </Link>
                        ) : (
                          <Link 
                            to="/dashboard" 
                            className="flex items-center px-5 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 transition-all group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                              <User className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <p className="font-semibold">My Dashboard</p>
                              <p className="text-xs text-gray-400">View your courses</p>
                            </div>
                          </Link>
                        )}
                        
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button 
                            onClick={handleLogout}
                            className="flex items-center w-full px-5 py-3 text-red-600 hover:bg-red-50 transition-all group"
                          >
                            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                              <LogOut className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-semibold">Logout</p>
                              <p className="text-xs text-red-400">See you soon!</p>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login" 
                    className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                      showTransparent 
                        ? 'text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/50' 
                        : 'text-gray-700 border-2 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="relative group flex items-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white px-6 py-2.5 rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5"
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <Zap className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                    <span className="relative z-10">Get Started</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className={`lg:hidden p-2.5 rounded-xl transition-all duration-300 ${
                showTransparent 
                  ? 'text-white hover:bg-white/10' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="relative w-6 h-6">
                <Menu className={`w-6 h-6 absolute transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                <X className={`w-6 h-6 absolute transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden absolute top-full left-0 right-0 transition-all duration-500 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
          <div className="bg-white/95 backdrop-blur-xl shadow-2xl border-t border-gray-100 mx-4 my-2 rounded-2xl overflow-hidden">
            {/* Gradient top */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="flex items-center">
                    {location.pathname === link.path && (
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mr-3"></span>
                    )}
                    {link.label}
                  </span>
                </Link>
              ))}
              
              {user ? (
                <>
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <Link 
                      to="/cart" 
                      className="flex items-center justify-between px-4 py-3.5 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      <span className="flex items-center">
                        <ShoppingCart className="w-5 h-5 mr-3 text-indigo-500" />
                        Shopping Cart
                      </span>
                      {cart.length > 0 && (
                        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-7 h-7 text-xs flex items-center justify-center font-bold shadow-lg">
                          {cart.length}
                        </span>
                      )}
                    </Link>
                    
                    {isAdmin ? (
                      <Link 
                        to="/admin" 
                        className="flex items-center px-4 py-3.5 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                      >
                        <Settings className="w-5 h-5 mr-3 text-indigo-500" />
                        Admin Panel
                      </Link>
                    ) : (
                      <Link 
                        to="/dashboard" 
                        className="flex items-center px-4 py-3.5 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                      >
                        <User className="w-5 h-5 mr-3 text-indigo-500" />
                        My Dashboard
                      </Link>
                    )}
                    
                    <button 
                      onClick={handleLogout} 
                      className="w-full flex items-center text-left px-4 py-3.5 rounded-xl text-red-600 hover:bg-red-50 transition-all"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-4 space-y-3 border-t border-gray-100">
                  <Link 
                    to="/login" 
                    className="block px-4 py-3.5 text-center rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center justify-center px-4 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-semibold shadow-lg shadow-purple-500/30"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Spacer for non-home pages */}
      {!isHomePage && <div className="h-20"></div>}
    </>
  );
}
