import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import {
  Settings,
  User,
  Moon,
  Sun,
  Globe,
  Bell,
  Lock,
  Save,
  CheckCircle2,
  Shield
} from 'lucide-react';

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { addToast } = useNotification();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || 'Alex Rivera',
    email: user?.email || 'alex.eco@ecocycle.ai',
    phone: user?.phone || '+1 (555) 234-5678',
    address: user?.address || '742 Evergreen Terrace, San Francisco, CA 94107',
    language: 'English',
    emailNotifs: true,
    smsNotifs: true,
    pickupNotifs: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    addToast("Settings Updated", "Your preferences have been saved.", "success");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-6 sm:p-8 max-w-4xl mx-auto w-full space-y-8">
          
          {/* Header Banner */}
          <div className="rounded-3xl p-6 bg-gradient-to-r from-eco-950 via-dark-900 to-ocean-950 text-white border border-eco-500/30 shadow-xl">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-eco-500/20 text-emerald-400 border border-eco-500/30">
                <Settings className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">Account & Platform Settings</h1>
            </div>
            <p className="text-xs text-gray-200 font-medium">Customize your profile, notification alerts, language, and theme preferences.</p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Profile Information */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 space-y-4">
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200/50 dark:border-gray-700/50 pb-2">
                <User className="w-5 h-5 text-eco-500" />
                <span>Profile & Contact Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-eco-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-eco-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-eco-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Default Pickup Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-eco-500"
                  />
                </div>
              </div>
            </div>

            {/* Appearance & Language */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 space-y-4">
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200/50 dark:border-gray-700/50 pb-2">
                <Globe className="w-5 h-5 text-sky-500" />
                <span>Appearance & Region</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-dark-800 border">
                  <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white">Theme Mode</p>
                    <p className="text-xs text-gray-500">{darkMode ? 'Dark Mode Active' : 'Light Mode Active'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="px-4 py-2 rounded-xl bg-eco-500 text-white font-bold text-xs shadow"
                  >
                    {darkMode ? 'Switch to Light' : 'Switch to Dark'}
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Language</label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-eco-500"
                  >
                    <option value="English">English (United States)</option>
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="French">French (Français)</option>
                    <option value="German">German (Deutsch)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 space-y-4">
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-200/50 dark:border-gray-700/50 pb-2">
                <Bell className="w-5 h-5 text-purple-500" />
                <span>Notification Preferences</span>
              </h3>

              <div className="space-y-3 text-xs font-medium text-gray-700 dark:text-gray-300">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailNotifs"
                    checked={formData.emailNotifs}
                    onChange={handleChange}
                    className="w-4 h-4 text-eco-600 rounded border-gray-300"
                  />
                  <span>Email notifications for pickup status updates & certificates</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="smsNotifs"
                    checked={formData.smsNotifs}
                    onChange={handleChange}
                    className="w-4 h-4 text-eco-600 rounded border-gray-300"
                  />
                  <span>SMS alert when collection agent is 10 mins away</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-eco-600 to-emerald-600 hover:from-eco-500 hover:to-emerald-500 text-white font-bold text-base shadow-xl shadow-eco-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          </form>

        </main>
      </div>
    </div>
  );
}
