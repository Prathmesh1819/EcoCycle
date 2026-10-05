import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import StatsCard from '../components/cards/StatsCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';
import { subscribeUserCollectionRequests, getUserCollectionRequests } from '../services/collectionService';
import { getUserWasteReports } from '../services/wasteService';
import {
  RefreshCw as Recycling,
  Award,
  Leaf,
  CheckCircle,
  Truck,
  Sparkles,
  MapPin,
  Gift,
  History,
  ArrowUpRight,
  Clock,
  ChevronRight,
  PlusCircle,
  PackageCheck
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { user, firebaseUser } = useAuth();
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseUser?.uid) {
      setLoading(false);
      return;
    }

    // Subscribe to real-time updates for user's collection requests
    const unsubscribe = subscribeUserCollectionRequests(firebaseUser.uid, (data) => {
      setPickups(data);
      setLoading(false);
    });

    // Initial fetch fallback
    getUserCollectionRequests(firebaseUser.uid)
      .then(res => {
        if (res && res.length > 0) setPickups(res);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    return () => unsubscribe();
  }, [firebaseUser?.uid]);

  const completedCount = pickups.filter(p => p.status === 'completed' || p.status === 'picked_up').length;
  const itemsCount = user?.items_recycled_count || (pickups.length > 0 ? pickups.length : 0);
  const co2Saved = user?.co2_saved_kg || (completedCount * 4.5);

  const monthlyData = [
    { month: 'Jan', items: 0, co2: 0.0 },
    { month: 'Feb', items: 0, co2: 0.0 },
    { month: 'Mar', items: 0, co2: 0.0 },
    { month: 'Apr', items: 0, co2: 0.0 },
    { month: 'May', items: 0, co2: 0.0 },
    { month: 'Jun', items: itemsCount, co2: co2Saved }
  ];

  const categoryData = [
    { name: 'E-Waste', value: itemsCount > 0 ? 50 : 0, color: '#16a34a' },
    { name: 'Plastic', value: itemsCount > 0 ? 25 : 0, color: '#0284c7' },
    { name: 'Paper/Glass', value: itemsCount > 0 ? 15 : 0, color: '#f59e0b' },
    { name: 'Metal', value: itemsCount > 0 ? 10 : 0, color: '#9333ea' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* User Greeting & Rank Banner */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-eco-950 via-emerald-900 to-dark-900 text-white relative overflow-hidden border border-eco-500/30 shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-eco-500/20 border border-eco-400/30 text-emerald-300 text-xs font-bold mb-3">
                  <Award className="w-3.5 h-3.5" />
                  <span>{user?.eco_tier || 'Eco Beginner'}</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Welcome back, {user?.full_name?.split(' ')[0] || 'Eco Hero'}! 👋
                </h1>
                <p className="text-sm text-gray-200 mt-1 max-w-xl font-medium">
                  You have diverted <span className="text-emerald-400 font-extrabold">{co2Saved} kg of CO₂</span> from landfills. Keep up the awesome work!
                </p>
              </div>

              <Link
                to="/request-pickup"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-eco-500 to-emerald-500 hover:from-eco-400 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-eco-500/30 transition-all transform hover:-translate-y-0.5 flex items-center space-x-2 shrink-0"
              >
                <Truck className="w-4 h-4" />
                <span>Schedule New Pickup</span>
              </Link>
            </div>
          </div>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: 'Request Pickup', path: '/request-pickup', icon: Truck, color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
              { label: 'AI Scan E-Waste', path: '/ai-identify', icon: Sparkles, color: 'bg-sky-500/10 text-sky-500 border-sky-500/20' },
              { label: 'Pune Centers', path: '/centers', icon: MapPin, color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
              { label: 'Redeem Rewards', path: '/rewards', icon: Gift, color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
              { label: 'Recycling History', path: '/history', icon: History, color: 'bg-rose-500/10 text-rose-500 border-rose-500/20' }
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link
                  key={idx}
                  to={action.path}
                  className="glass-card p-4 rounded-2xl border text-center flex flex-col items-center justify-center space-y-2 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  <div className={`p-3 rounded-2xl border ${action.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{action.label}</span>
                </Link>
              );
            })}
          </div>

          {/* KPI Metric Cards */}
          {loading ? (
            <LoadingSkeleton type="cards" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Items Recycled"
                value={itemsCount}
                icon={Recycling}
                subtext="Start recycling to level up"
                color="eco"
              />
              <StatsCard
                title="Reward Points"
                value={`${user?.reward_points || user?.points || 0} PTS`}
                icon={Award}
                subtext="Firestore Verified Balance"
                color="amber"
              />
              <StatsCard
                title="CO₂ Emissions Saved"
                value={`${co2Saved} kg`}
                icon={Leaf}
                subtext="Direct environmental impact"
                color="blue"
              />
              <StatsCard
                title="Completed Pickups"
                value={completedCount}
                icon={CheckCircle}
                subtext="Doorstep pickups completed"
                color="purple"
              />
            </div>
          )}

          {/* Analytics Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Monthly Trend Area Chart */}
            <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Monthly Recycling Activity</h3>
                  <p className="text-xs text-gray-500">Track items recycled & CO₂ impact over time</p>
                </div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Firebase Firestore Sync</span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ecoColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="co2" name="CO₂ Saved (kg)" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#ecoColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Waste Category Donut Chart */}
            <div className="glass-card rounded-3xl p-6 border border-gray-200 dark:border-gray-800 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">Recycled Categories</h3>
                <p className="text-xs text-gray-500">Breakdown by waste category</p>
              </div>

              <div className="h-48 w-full my-4 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                {categoryData.map((cat, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
                    <span className="text-gray-600 dark:text-gray-300">{cat.name} ({cat.value}%)</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Active Pickups & Status List */}
          <div className="glass-card rounded-3xl p-6 border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Your Doorstep Pickups</h3>
                <p className="text-xs text-gray-500">Live status of your requested collections from Firestore</p>
              </div>
              <Link to="/history" className="text-xs font-bold text-eco-600 dark:text-eco-400 hover:underline flex items-center gap-1">
                View All History <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {pickups.length > 0 ? (
              <div className="space-y-3">
                {pickups.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-eco-500/10 text-eco-500 flex items-center justify-center font-bold border">
                        <Truck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white capitalize">{item.wasteType || 'E-Waste Pickup'}</h4>
                          <span className="px-2 py-0.5 rounded-md bg-gray-200 dark:bg-dark-700 text-[10px] font-bold text-gray-600 dark:text-gray-300">
                            {item.id}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{item.pickupAddress}</p>
                        <p className="text-[11px] text-eco-600 dark:text-eco-400 font-semibold mt-1">
                          Scheduled: {item.pickupDate} ({item.pickupTime})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase ${
                        item.status === 'completed' || item.status === 'picked_up' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                        item.status === 'accepted' || item.status === 'assigned' ? 'bg-sky-500/10 text-sky-600 border border-sky-500/20' :
                        'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`}>
                        {item.status}
                      </span>
                      <Link
                        to={`/history?id=${item.id}`}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-200/50 dark:bg-dark-700 hover:bg-gray-300 transition-colors"
                      >
                        Track
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Clean Empty State Card */
              <div className="text-center py-8 px-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-eco-500/10 text-eco-600 dark:text-eco-400 flex items-center justify-center mx-auto border border-eco-500/20">
                  <PackageCheck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">No Pickups Scheduled Yet</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  You haven't scheduled any doorstep e-waste pickups in Pune yet. Book your first pickup to start earning Eco Points!
                </p>
                <Link
                  to="/request-pickup"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-eco-600 to-emerald-600 text-white font-bold text-xs shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Schedule Your First Pickup</span>
                </Link>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
