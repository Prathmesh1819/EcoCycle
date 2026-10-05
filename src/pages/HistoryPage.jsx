import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import Modal from '../components/common/Modal';
import CertificateGenerator from '../components/reports/CertificateGenerator';
import { useAuth } from '../context/AuthContext';
import { getUserCollectionRequests } from '../services/collectionService';
import {
  History,
  Search,
  Award,
  Download,
  Truck,
  PackageX,
  PlusCircle
} from 'lucide-react';

export default function HistoryPage() {
  const { user, firebaseUser } = useAuth();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [certModalOpen, setCertModalOpen] = useState(false);

  useEffect(() => {
    if (!firebaseUser?.uid) {
      setLoading(false);
      return;
    }

    getUserCollectionRequests(firebaseUser.uid)
      .then(res => {
        if (res) setPickups(res);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [firebaseUser?.uid]);

  const filteredPickups = pickups.filter(p => {
    const matchesSearch = searchQuery === '' || 
      (p.id && p.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.wasteType && p.wasteType.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.pickupAddress && p.pickupAddress.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || 
      (p.status && p.status.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-6">
          
          {/* Page Banner */}
          <div className="rounded-3xl p-6 bg-gradient-to-r from-eco-950 via-emerald-950 to-dark-900 text-white border border-eco-500/30 shadow-xl">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-eco-500/20 text-emerald-400 border border-eco-500/30">
                <History className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white">Recycling History & Timeline Tracker</h1>
            </div>
            <p className="text-xs text-gray-200 font-medium">
              Track the step-by-step progress of your e-waste requests from pickup to verified material recycling and certificate issuance.
            </p>
          </div>

          {/* Search & Status Filters */}
          <div className="glass-card rounded-2xl p-4 border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by pickup ID, device name, or category..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-eco-500"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0 overflow-x-auto">
              {['All', 'Pending', 'Accepted', 'Picked_Up', 'Completed'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    statusFilter === st
                      ? 'bg-eco-500 text-white shadow'
                      : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* History List Cards or Clean Empty State */}
          {filteredPickups.length > 0 ? (
            <div className="space-y-4">
              {filteredPickups.map(item => (
                <div key={item.id} className="glass-card rounded-3xl p-6 border border-gray-200 dark:border-gray-800 space-y-4 hover:shadow-lg transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/50 dark:border-gray-700/50 pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-2xl bg-eco-500/10 text-eco-500 flex items-center justify-center font-bold border border-eco-500/20">
                        <Truck className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-eco-500/10 text-eco-600 dark:text-eco-400 text-xs font-bold">
                            {item.id}
                          </span>
                          <span className="text-xs text-gray-400 font-medium capitalize">Category: {item.wasteType || 'E-Waste'}</span>
                        </div>
                        <h3 className="font-bold text-base text-gray-900 dark:text-white mt-1 capitalize">{item.wasteType || 'Doorstep Pickup'} (Qty: {item.quantity || 1})</h3>
                        <p className="text-xs text-gray-500">{item.pickupAddress}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <span className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase ${
                        item.status === 'completed' || item.status === 'picked_up' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                        item.status === 'accepted' || item.status === 'assigned' ? 'bg-sky-500/10 text-sky-600 border border-sky-500/20' :
                        'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`}>
                        {item.status}
                      </span>

                      <button
                        onClick={() => { setSelectedPickup(item); setCertModalOpen(true); }}
                        className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-eco-600 to-emerald-600 hover:from-eco-500 hover:to-emerald-500 text-white font-bold text-xs shadow-md transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Certificate</span>
                      </button>
                    </div>
                  </div>

                  {/* Timeline Step Indicator */}
                  <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs">
                    {[
                      { label: 'Requested', done: true },
                      { label: 'Accepted', done: item.status === 'accepted' || item.status === 'assigned' || item.status === 'picked_up' || item.status === 'completed' },
                      { label: 'Picked Up', done: item.status === 'picked_up' || item.status === 'completed' },
                      { label: 'Recycled', done: item.status === 'completed' }
                    ].map((step, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className={`h-2 rounded-full transition-colors ${step.done ? 'bg-eco-500' : 'bg-gray-200 dark:bg-dark-700'}`}></div>
                        <span className={`text-[11px] font-semibold ${step.done ? 'text-eco-600 dark:text-eco-400' : 'text-gray-400'}`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-eco-500/10 text-eco-600 dark:text-eco-400 flex items-center justify-center mx-auto border border-eco-500/20">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Recycling History Found</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                You haven't completed any e-waste recycling requests yet. Schedule a doorstep pickup to earn Eco Points and download official recycling certificates!
              </p>
              <Link
                to="/request-pickup"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-eco-600 to-emerald-600 text-white font-bold text-xs shadow-lg transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Schedule Doorstep Pickup</span>
              </Link>
            </div>
          )}

          {/* Certificate Modal */}
          <Modal isOpen={certModalOpen} onClose={() => setCertModalOpen(false)} title="Official E-Waste Recycling Certificate" maxWidth="max-w-4xl">
            {selectedPickup && <CertificateGenerator pickup={selectedPickup} user={user} />}
          </Modal>

        </main>
      </div>
    </div>
  );
}
