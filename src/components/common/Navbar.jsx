import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { RefreshCw as Recycling, Sun, Moon, LogIn, UserCheck, Shield, Truck, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, switchRole } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-gray-200/50 dark:border-gray-800/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-eco-600 via-emerald-500 to-ocean-500 p-0.5 shadow-lg shadow-eco-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-white dark:bg-dark-900 rounded-[14px] flex items-center justify-center">
              <Recycling className="w-6 h-6 text-eco-500 group-hover:rotate-180 transition-transform duration-700" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-1.5">
              EcoCycle <span className="px-1.5 py-0.5 text-xs font-bold text-eco-600 dark:text-eco-400 bg-eco-500/10 rounded-md border border-eco-500/20">AI</span>
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium -mt-1 tracking-wider uppercase">
              Pune E-Waste Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-eco-500 dark:hover:text-eco-400 transition-colors">
            Home
          </Link>
          <Link to="/ai-identify" className="text-gray-600 dark:text-gray-300 hover:text-eco-500 dark:hover:text-eco-400 transition-colors flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-emerald-500" /> AI Scan
          </Link>
          <Link to="/centers" className="text-gray-600 dark:text-gray-300 hover:text-eco-500 dark:hover:text-eco-400 transition-colors">
            Pune Centers
          </Link>
          <Link to="/impact" className="text-gray-600 dark:text-gray-300 hover:text-eco-500 dark:hover:text-eco-400 transition-colors">
            Eco Impact
          </Link>
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center space-x-4">
          
          {/* Admin Testing Switcher - Only visible if user role is admin */}
          {user?.role === 'admin' && (
            <div className="flex items-center bg-gray-100 dark:bg-dark-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 text-xs">
              <button
                onClick={() => switchRole('user')}
                className={`px-2.5 py-1 rounded-lg transition-all ${user?.role === 'user' ? 'bg-eco-500 text-white font-semibold shadow' : 'text-gray-500'}`}
              >
                User
              </button>
              <button
                onClick={() => switchRole('agent')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${user?.role === 'agent' ? 'bg-sky-600 text-white font-semibold shadow' : 'text-gray-500'}`}
              >
                <Truck className="w-3 h-3" /> Agent
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${user?.role === 'admin' ? 'bg-purple-600 text-white font-semibold shadow' : 'text-gray-500'}`}
              >
                <Shield className="w-3 h-3" /> Admin
              </button>
            </div>
          )}

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300 hover:text-eco-500 transition-colors border border-gray-200 dark:border-gray-700"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>

          {/* User Auth Buttons */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <Link
                to={user?.role === 'admin' ? '/admin' : user?.role === 'agent' ? '/agent' : '/dashboard'}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-eco-500/10 text-eco-600 dark:text-eco-400 hover:bg-eco-500/20 transition-all border border-eco-500/20 font-semibold text-sm"
              >
                <img src={user?.avatar_url} alt={user?.full_name} className="w-6 h-6 rounded-full object-cover" />
                <span>Dashboard</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/auth"
                className="px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-eco-500 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/auth?mode=signup"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-eco-600 to-emerald-600 rounded-xl hover:shadow-lg hover:shadow-eco-500/25 transition-all transform hover:-translate-y-0.5"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-gray-200 dark:border-gray-800 px-4 pt-2 pb-6 space-y-3">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-700 dark:text-gray-200 font-medium">Home</Link>
          <Link to="/ai-identify" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-700 dark:text-gray-200 font-medium">AI Scan</Link>
          <Link to="/centers" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-700 dark:text-gray-200 font-medium">Pune Centers</Link>
          <Link to="/impact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-700 dark:text-gray-200 font-medium">Eco Impact</Link>
          <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex flex-col space-y-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-eco-500 text-white font-semibold"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-eco-500 text-white font-semibold"
              >
                Sign In / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
