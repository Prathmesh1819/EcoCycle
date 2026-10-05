import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { RefreshCw as Recycling, Lock, Mail, User, Phone, MapPin, ArrowRight, CheckCircle2, Shield, Truck } from 'lucide-react';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  
  const [mode, setMode] = useState(initialMode); // 'login', 'signup', 'forgot'
  const [role, setRole] = useState('user'); // UI role tab selection
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [submittedForgot, setSubmittedForgot] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, signup, resetPassword } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'forgot') {
      try {
        const res = await resetPassword(email);
        setLoading(false);
        if (res.success) {
          setSubmittedForgot(true);
          addToast("Password Reset Sent", "Check your email for reset instructions.", "info");
        } else {
          addToast("Reset Failed", res.error || "Unable to send reset email.", "error");
        }
      } catch (err) {
        setLoading(false);
        addToast("Error", "Could not send reset password email.", "error");
      }
      return;
    }

    if (mode === 'login') {
      const res = await login(email, password);
      setLoading(false);
      if (res.success) {
        const userRole = res.profile?.role || role;
        addToast("Welcome back!", `Logged in successfully as ${userRole.toUpperCase()}`, "success");
        navigate(userRole === 'admin' ? '/admin' : userRole === 'collector' || userRole === 'agent' ? '/agent' : '/dashboard');
      } else {
        addToast("Login Failed", res.error || "Invalid credentials", "error");
      }
    } else {
      // Registration enforces role = 'user' under section 4 requirement
      const res = await signup(fullName, email, password, 'user', phoneNumber, address);
      setLoading(false);
      if (res.success) {
        addToast("Account Created", "Welcome to EcoCycle AI!", "success");
        navigate('/dashboard');
      } else {
        addToast("Signup Failed", res.error || "Could not register account", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md glass-card rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-eco-600 to-emerald-500 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-eco-500/20">
              <Recycling className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Eco Account' : 'Reset Password'}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {mode === 'login' ? 'Sign in to access your recycling dashboard' : mode === 'signup' ? 'Join the zero e-waste movement today' : 'Enter your email to receive a recovery link'}
            </p>
          </div>

          {/* Role Selector Tabs (Only for login view context) */}
          {mode === 'login' && (
            <div className="grid grid-cols-3 gap-1 bg-gray-100 dark:bg-dark-800 p-1.5 rounded-2xl mb-6 border border-gray-200 dark:border-gray-700 text-xs">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`py-2 rounded-xl font-semibold transition-all ${role === 'user' ? 'bg-eco-500 text-white shadow' : 'text-gray-500'}`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setRole('agent')}
                className={`py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1 ${role === 'agent' ? 'bg-sky-600 text-white shadow' : 'text-gray-500'}`}
              >
                <Truck className="w-3 h-3" /> Agent
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1 ${role === 'admin' ? 'bg-purple-600 text-white shadow' : 'text-gray-500'}`}
              >
                <Shield className="w-3 h-3" /> Admin
              </button>
            </div>
          )}

          {/* Forgot Password Confirmation Notice */}
          {mode === 'forgot' && submittedForgot ? (
            <div className="text-center py-6 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Email Verification Sent</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                We have sent password reset instructions to <span className="font-semibold text-gray-800 dark:text-gray-200">{email}</span>. Please check your inbox.
              </p>
              <button
                onClick={() => { setMode('login'); setSubmittedForgot(false); }}
                className="text-xs font-bold text-eco-600 dark:text-eco-400 hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Alex Rivera"
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-eco-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="9876543210"
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-eco-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Pickup Address</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Baner Road, Pune"
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-eco-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-eco-500"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Password *</label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] text-eco-600 dark:text-eco-400 font-semibold hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-eco-500"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-eco-600 to-emerald-600 hover:from-eco-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-eco-500/25 transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Recovery Email'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Mode Switch Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 text-center text-xs text-gray-500">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="font-bold text-eco-600 dark:text-eco-400 hover:underline">
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="font-bold text-eco-600 dark:text-eco-400 hover:underline">
                  Sign In
                </button>
              </p>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
