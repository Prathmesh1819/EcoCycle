import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import Toast from './components/common/Toast';
import EcoBotChat from './components/ai/EcoBotChat';
import ProtectedRoute from './components/common/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import RequestPickupPage from './pages/RequestPickupPage';
import AiIdentifyPage from './pages/AiIdentifyPage';
import RecyclingCentersPage from './pages/RecyclingCentersPage';
import RewardSystemPage from './pages/RewardSystemPage';
import HistoryPage from './pages/HistoryPage';
import AdminPanelPage from './pages/AdminPanelPage';
import AgentPanelPage from './pages/AgentPanelPage';
import ImpactPage from './pages/ImpactPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen relative font-sans">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                
                {/* Protected User Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute allowedRoles={['user', 'agent', 'admin']}>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/request-pickup" element={
                  <ProtectedRoute allowedRoles={['user', 'agent', 'admin']}>
                    <RequestPickupPage />
                  </ProtectedRoute>
                } />
                <Route path="/ai-identify" element={<AiIdentifyPage />} />
                <Route path="/centers" element={<RecyclingCentersPage />} />
                <Route path="/rewards" element={
                  <ProtectedRoute allowedRoles={['user', 'agent', 'admin']}>
                    <RewardSystemPage />
                  </ProtectedRoute>
                } />
                <Route path="/history" element={
                  <ProtectedRoute allowedRoles={['user', 'agent', 'admin']}>
                    <HistoryPage />
                  </ProtectedRoute>
                } />
                
                {/* Strictly Protected Admin & Agent Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPanelPage />
                  </ProtectedRoute>
                } />
                <Route path="/agent" element={
                  <ProtectedRoute allowedRoles={['agent', 'admin']}>
                    <AgentPanelPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/impact" element={<ImpactPage />} />
                <Route path="/settings" element={
                  <ProtectedRoute allowedRoles={['user', 'agent', 'admin']}>
                    <SettingsPage />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>

              <Toast />
              <EcoBotChat />
            </div>
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
