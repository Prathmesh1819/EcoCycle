import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Truck,
  Sparkles,
  MapPin,
  Gift,
  History,
  Shield,
  BarChart3,
  Settings,
  LogOut,
  Leaf,
  Users,
  QrCode
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const role = user?.role || 'user';

  const userNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Request Pickup', path: '/request-pickup', icon: Truck },
    { name: 'AI Scanner', path: '/ai-identify', icon: Sparkles },
    { name: 'Recycling Centers', path: '/centers', icon: MapPin },
    { name: 'Rewards Catalog', path: '/rewards', icon: Gift },
    { name: 'Recycling History', path: '/history', icon: History },
    { name: 'Eco Impact', path: '/impact', icon: Leaf },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const agentNav = [
    { name: 'Agent Dashboard', path: '/agent', icon: Truck },
    { name: 'Assigned Pickups', path: '/history', icon: History },
    { name: 'Recycling Centers', path: '/centers', icon: MapPin },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const adminNav = [
    { name: 'Admin Dashboard', path: '/admin', icon: Shield },
    { name: 'Manage Pickups', path: '/history', icon: History },
    { name: 'Platform Analytics', path: '/impact', icon: BarChart3 },
    { name: 'Recycling Centers', path: '/centers', icon: MapPin },
    { name: 'Rewards System', path: '/rewards', icon: Gift },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const currentNav = role === 'admin' ? adminNav : role === 'agent' ? agentNav : userNav;

  return (
    <aside className="w-64 glass-panel border-r border-gray-200/50 dark:border-gray-800/50 h-screen sticky top-0 flex flex-col justify-between p-4 z-30 hidden md:flex">
      <div>
        {/* Brand Header */}
        <div className="flex items-center space-x-3 px-2 py-4 mb-4 border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-eco-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-eco-500/20">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-gray-900 dark:text-white leading-tight">EcoCycle AI</h1>
            <p className="text-xs text-eco-600 dark:text-eco-400 font-semibold capitalize">{role} Portal</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {currentNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-eco-600 to-emerald-600 text-white shadow-md shadow-eco-500/20 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-800 hover:text-eco-600 dark:hover:text-eco-400'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Card & Logout */}
      <div className="pt-4 border-t border-gray-200/50 dark:border-gray-800/50 space-y-3">
        <div className="flex items-center space-x-3 px-2 py-1">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={user?.full_name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-eco-500/30"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.full_name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors border border-rose-200 dark:border-rose-900/50"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
