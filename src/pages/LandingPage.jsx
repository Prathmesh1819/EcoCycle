import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import {
  RefreshCw as Recycling,
  Sparkles,
  Truck,
  Gift,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  MapPin,
  Leaf,
  CheckCircle2,
  Users,
  Award,
  Zap
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100 flex flex-col selection:bg-eco-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
        
        {/* Background Decorative Glow Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-eco-500/20 via-emerald-400/10 to-ocean-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card border border-eco-500/30 text-eco-700 dark:text-eco-300 text-xs sm:text-sm font-bold shadow-sm glow-pulse">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>AI-Powered Zero E-Waste Ecosystem</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white">
              Recycle Electronics.{' '}
              <span className="gradient-text">Protect Tomorrow.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 font-normal leading-relaxed">
              Dispose your electronic waste responsibly while earning Eco Rewards. Powered by Google Gemini AI to identify hazards, value, and material recovery.
            </p>

            {/* Hero CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/request-pickup"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-eco-600 via-emerald-600 to-ocean-600 hover:from-eco-500 hover:to-ocean-500 text-white font-bold text-base shadow-xl shadow-eco-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-2"
              >
                <Truck className="w-5 h-5" />
                <span>Request Pickup</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/centers"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-card text-gray-800 dark:text-white hover:text-eco-500 font-bold text-base transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-2 border border-gray-200 dark:border-gray-700"
              >
                <MapPin className="w-5 h-5 text-eco-500" />
                <span>Find Recycling Centers</span>
              </Link>
            </div>

            {/* Mini Trust Stats */}
            <div className="pt-8 flex items-center justify-center space-x-6 text-xs font-semibold text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> EPA Certified Partners</span>
              <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> Instant Gemini AI Evaluation</span>
            </div>

          </div>

          {/* Feature Showcase Grid Cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card rounded-3xl p-8 border border-gray-200/80 dark:border-gray-800 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-eco-600 to-emerald-400 flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-eco-500/20">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Gemini AI Identification</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Snap a photo of your old device. Gemini AI detects the model, toxicity hazards, estimated resale value, and whether to repair, donate, or recycle.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-8 border border-gray-200/80 dark:border-gray-800 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-ocean-500 to-sky-400 flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-ocean-500/20">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Doorstep Pickups</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Schedule a convenient date and time. Certified collection agents will collect your items directly from your home with real-time GPS tracking.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-8 border border-gray-200/80 dark:border-gray-800 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-amber-500/20">
                <Gift className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Eco-Rewards & Certificates</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Earn Eco Points for every device recycled. Redeem for eco-friendly vouchers, plant real trees, and download official CO₂ impact certificates.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Live Platform Impact Counters */}
      <section className="py-16 bg-gradient-to-r from-eco-900 via-dark-900 to-ocean-950 text-white border-y border-eco-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-black text-emerald-400">8,450+ kg</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider">E-Waste Diverted</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-black text-sky-400">35,490 kg</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider">CO₂ Saved</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-black text-amber-400">1,610</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider">Trees Planted</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-black text-purple-400">3,290+</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider">Successful Pickups</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">How EcoCycle Works</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Four simple steps to recycle your electronics responsibly and earn rewards.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: '01', title: 'Snap & Scan', desc: 'Upload a picture of your e-waste. Gemini AI identifies hazards and calculates point value.' },
            { step: '02', title: 'Book Pickup', desc: 'Select your preferred date, time slot, and address for doorstep collection.' },
            { step: '03', title: 'Agent Collects', desc: 'A certified driver collects your e-waste and scans your unique pickup QR code.' },
            { step: '04', title: 'Earn & Certificate', desc: 'Instant points deposited to your wallet along with an official PDF impact certificate.' }
          ].map((item, index) => (
            <div key={index} className="glass-card rounded-3xl p-6 relative border border-gray-200 dark:border-gray-800">
              <span className="text-4xl font-black text-eco-500/20 dark:text-eco-400/20 absolute top-4 right-6">{item.step}</span>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{item.title}</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
