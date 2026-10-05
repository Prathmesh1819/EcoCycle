import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw as Recycling, Heart, Shield, Sparkles, Globe, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-eco-600 to-emerald-500 flex items-center justify-center text-white shadow-lg">
                <Recycling className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">EcoCycle AI</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering individuals and enterprises to dispose of electronic waste responsibly using Google Gemini AI, doorstep pickups, and gamified eco-rewards.
            </p>
            <div className="flex items-center space-x-3 text-xs text-eco-400">
              <Shield className="w-4 h-4" />
              <span>Certified E-Steward Partner & Zero Waste Compliant</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/ai-identify" className="hover:text-eco-400 transition-colors">AI E-Waste Scanner</Link></li>
              <li><Link to="/request-pickup" className="hover:text-eco-400 transition-colors">Request Doorstep Pickup</Link></li>
              <li><Link to="/centers" className="hover:text-eco-400 transition-colors">Find Recycling Centers</Link></li>
              <li><Link to="/rewards" className="hover:text-eco-400 transition-colors">Eco-Rewards Marketplace</Link></li>
              <li><Link to="/impact" className="hover:text-eco-400 transition-colors">Environmental Analytics</Link></li>
            </ul>
          </div>

          {/* Col 3: Portals */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Portals & Roles</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/dashboard" className="hover:text-eco-400 transition-colors">User Dashboard</Link></li>
              <li><Link to="/agent" className="hover:text-eco-400 transition-colors">Collection Agent Portal</Link></li>
              <li><Link to="/admin" className="hover:text-eco-400 transition-colors">Admin Governance</Link></li>
              <li><Link to="/history" className="hover:text-eco-400 transition-colors">Recycling Certificates</Link></li>
              <li><Link to="/settings" className="hover:text-eco-400 transition-colors">Account Settings</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact & Support</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-eco-400" />
                <span>support@ecocycle.ai</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-eco-400" />
                <span>+1 (800) 555-ECO-CYCLE</span>
              </li>
              <li className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-eco-400" />
                <span>San Francisco, CA & Global Operations</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} EcoCycle AI Inc. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Built for a cleaner planet with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>and Gemini AI</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
