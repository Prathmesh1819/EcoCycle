import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';
import { Search, Bell, Sun, Moon, Award, Sparkles, X, Check, Shield, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, switchRole } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { addToast } = useNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const mockNotifications = [
    { id: 1, title: "Welcome to EcoCycle AI Pune! 🎉", time: "Just now", message: "Your account is active. You earned +50 Welcome Eco Points!", read: false },
    { id: 2, title: "Doorstep Pickup Service Available", time: "Today", message: "Schedule doorstep e-waste pickups anywhere in Pune, Maharashtra.", read: false }
  ];

  const [notifications, setNotifications] = useState(mockNotifications);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/history?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast("Notifications Updated", "All notifications marked as read.", "success");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-20 w-full glass-panel border-b border-gray-200/50 dark:border-gray-800/50 px-6 py-3.5 flex items-center justify-between">
      
      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Global Search (Pickup ID, device, status, Pune area)..."
          className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-eco-500/50 transition-all placeholder:text-gray-400"
        />
      </form>

      {/* Right Action Icons & Badges */}
      <div className="flex items-center space-x-4">
        
        {/* User Points Badge */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold shadow-sm">
          <Award className="w-4 h-4 text-amber-500" />
          <span>{user?.reward_points || 0} Eco Points</span>
        </div>

        {/* Role Switcher Pill - Strictly visible ONLY for Admin users */}
        {user?.role === 'admin' && (
          <div className="hidden lg:flex items-center bg-gray-100 dark:bg-dark-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 text-xs">
            <button
              onClick={() => switchRole('user')}
              className={`px-2 py-1 rounded-lg ${user?.role === 'user' ? 'bg-eco-500 text-white font-semibold' : 'text-gray-500'}`}
            >
              User
            </button>
            <button
              onClick={() => switchRole('agent')}
              className={`px-2 py-1 rounded-lg ${user?.role === 'agent' ? 'bg-sky-600 text-white font-semibold' : 'text-gray-500'}`}
            >
              Agent
            </button>
            <button
              onClick={() => switchRole('admin')}
              className={`px-2 py-1 rounded-lg ${user?.role === 'admin' ? 'bg-purple-600 text-white font-semibold' : 'text-gray-500'}`}
            >
              Admin
            </button>
          </div>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300 hover:text-eco-500 transition-colors border border-gray-200 dark:border-gray-700"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300 hover:text-eco-500 transition-colors border border-gray-200 dark:border-gray-700"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 glass-card rounded-2xl p-4 shadow-2xl z-50 border border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-200/50 dark:border-gray-700/50 pb-2">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</h4>
                <button
                  onClick={markAllRead}
                  className="text-xs text-eco-600 dark:text-eco-400 font-medium hover:underline flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark Read
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl border text-xs transition-colors ${
                      n.read
                        ? 'bg-transparent border-transparent opacity-60'
                        : 'bg-eco-500/5 border-eco-500/20 text-gray-900 dark:text-gray-100 font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-eco-600 dark:text-eco-400">{n.title}</span>
                      <span className="text-[10px] text-gray-400">{n.time}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
