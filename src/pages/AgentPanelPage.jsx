import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import Modal from '../components/common/Modal';
import { fetchPickups, updatePickupStatus } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import {
  Truck,
  MapPin,
  CheckCircle2,
  QrCode,
  Navigation,
  Phone,
  Clock,
  Package,
  Check
} from 'lucide-react';

export default function AgentPanelPage() {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [pickups, setPickups] = useState([]);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activePickup, setActivePickup] = useState(null);

  useEffect(() => {
    fetchPickups()
      .then(res => {
        if (res.data) setPickups(res.data);
      })
      .catch(console.error);
  }, []);

  const handleAgentStatusUpdate = async (pickupId, status) => {
    try {
      const res = await updatePickupStatus(pickupId, { status, agent_name: user?.full_name || 'Marcus Vance' });
      if (res.success) {
        setPickups(prev => prev.map(p => p.id === pickupId ? { ...p, status } : p));
        addToast("Pickup Updated", `Marked as ${status}`, "success");
      }
    } catch (err) {
      addToast("Update Failed", "Could not update status", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Agent Header */}
          <div className="rounded-3xl p-6 bg-gradient-to-r from-sky-950 via-dark-900 to-eco-950 text-white border border-sky-500/30 shadow-xl">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-300 border border-sky-500/30">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">Collection Agent Dispatch Console</h1>
                <p className="text-xs text-gray-200 font-medium">Driver: {user?.full_name || 'Marcus Vance'} • Vehicle: {user?.vehicle_number || 'ECO-VAN-402'}</p>
              </div>
            </div>
          </div>

          {/* Assigned Pickup Queue */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Assigned Doorstep Route ({pickups.length})</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pickups.map(p => (
                <div key={p.id} className="glass-card rounded-3xl p-6 border border-gray-200 dark:border-gray-800 space-y-4 flex flex-col justify-between">
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-bold">
                        {p.pickup_id}
                      </span>
                      <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                        p.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600' :
                        p.status === 'Collected' ? 'bg-purple-500/10 text-purple-600' :
                        'bg-sky-500/10 text-sky-600'
                      }`}>
                        {p.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-base text-gray-900 dark:text-white">{p.item_name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{p.category} • Condition: {p.condition}</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-dark-800 rounded-2xl border text-xs space-y-1.5">
                      <p className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5 font-medium">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0" /> {p.address}
                      </p>
                      <p className="text-gray-500 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-sky-400 shrink-0" /> Window: {p.preferred_date} ({p.preferred_time_slot})
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-gray-200/50 dark:border-gray-700/50 flex flex-wrap gap-2">
                    <a
                      href={`https://maps.google.com/?q=${p.gps_latitude || 37.7749},${p.gps_longitude || -122.4194}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-200 font-bold text-xs flex items-center gap-1 hover:bg-gray-200"
                    >
                      <Navigation className="w-3.5 h-3.5 text-sky-500" /> Navigate
                    </a>

                    <button
                      onClick={() => { setActivePickup(p); setQrModalOpen(true); }}
                      className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 shadow"
                    >
                      <QrCode className="w-3.5 h-3.5" /> Scan Verification QR
                    </button>

                    <button
                      onClick={() => handleAgentStatusUpdate(p.id, 'Collected')}
                      className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs"
                    >
                      Mark Picked Up
                    </button>

                    <button
                      onClick={() => handleAgentStatusUpdate(p.id, 'Completed')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Mark Recycled
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* QR Verification Modal */}
          <Modal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} title="Verify Handover QR Code">
            {activePickup && (
              <div className="text-center space-y-4 py-4">
                <div className="p-8 border-2 border-dashed border-sky-500/40 rounded-3xl bg-sky-500/5 inline-block">
                  <QrCode className="w-24 h-24 text-sky-500 mx-auto animate-pulse" />
                  <p className="text-xs font-bold text-sky-600 dark:text-sky-400 mt-3">Scan User's App QR Code</p>
                </div>
                <p className="text-xs text-gray-500">
                  Verifying Pickup ID: <span className="font-bold text-gray-800 dark:text-gray-200">{activePickup.pickup_id}</span>
                </p>
                <button
                  onClick={() => {
                    handleAgentStatusUpdate(activePickup.id, 'Collected');
                    setQrModalOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm"
                >
                  Confirm QR Match & Mark Collected
                </button>
              </div>
            )}
          </Modal>

        </main>
      </div>
    </div>
  );
}
