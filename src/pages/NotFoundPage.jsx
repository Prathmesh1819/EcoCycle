import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { RefreshCw as Recycling, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md glass-card rounded-3xl p-8 border border-gray-200 dark:border-gray-800 space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-eco-500/10 text-eco-500 flex items-center justify-center mx-auto border border-eco-500/20">
            <Recycling className="w-10 h-10 animate-spin" />
          </div>
          <div>
            <h1 className="text-5xl font-black text-gray-900 dark:text-white">404</h1>
            <h2 className="text-lg font-bold text-eco-600 dark:text-eco-400 mt-1">Page Recycled or Not Found</h2>
            <p className="text-xs text-gray-500 mt-2">
              The page you are looking for might have been moved or responsibly recycled into digital energy.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-eco-600 hover:bg-eco-500 text-white font-bold text-sm shadow-lg transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to EcoCycle Home</span>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
