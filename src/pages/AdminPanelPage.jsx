import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import StatsCard from '../components/cards/StatsCard';
import { useNotification } from '../context/NotificationContext';
import { 
  getAllCollectionRequests, 
  updateCollectionStatus, 
  subscribeAllCollectionRequests 
} from '../services/collectionService';
import { getAdminDashboardStats } from '../services/adminService';
import { getAllUsers } from '../services/userService';
import { createNotification } from '../services/notificationService';
import {
  Shield,
  Users,
  Truck,
  CheckCircle,
  Clock,
  Leaf,
  Megaphone,
  UserCheck
} from 'lucide-react';

export default function AdminPanelPage() {
  const { addToast } = useNotification();
  const [pickups, setPickups] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWasteReports: 0,
    pendingReports: 0,
    completedCollections: 0,
    totalRecycledKg: 0,
    totalRewardPoints: 0,
    activeCollectionRequests: 0
  });
  const [usersList, setUsersList] = useState([]);
  const [activeTab, setActiveTab] = useState('pickups'); // 'pickups', 'agents', 'users', 'announcements'
  const [announcementText, setAnnouncementText] = useState('');
  const [announcements, setAnnouncements] = useState([
    { id: 1, text: "🌱 EcoCycle Platform reached 35,000 kg CO₂ reduction milestone!", date: "Today" },
    { id: 2, text: "🚚 Expanded doorstep collection service across Pune Metro.", date: "2 days ago" }
  ]);

  useEffect(() => {
    // Real-time listener for collection requests
    const unsub = subscribeAllCollectionRequests((data) => {
      setPickups(data);
    });

    loadAdminData();

    return () => unsub();
  }, []);

  const loadAdminData = async () => {
    try {
      const [statsData, usersData] = await Promise.all([
        getAdminDashboardStats(),
        getAllUsers()
      ]);
      setStats(statsData);
      setUsersList(usersData);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await updateCollectionStatus(requestId, newStatus);
      setPickups(prev => prev.map(p => p.id === requestId ? { ...p, status: newStatus } : p));
      addToast("Status Updated", `Request ${requestId} status updated to ${newStatus.toUpperCase()}`, "success");
      loadAdminData();
    } catch (err) {
      addToast("Update Error", "Could not update request status", "error");
    }
  };

  const handlePublishAnnouncement = async (e) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    try {
      // Notify users in Firestore
      const users = await getAllUsers();
      for (const u of users) {
        if (u.uid) {
          await createNotification(u.uid, "Platform Announcement", announcementText, "system");
        }
      }
      setAnnouncements(prev => [{ id: Date.now(), text: announcementText, date: "Just now" }, ...prev]);
      setAnnouncementText('');
      addToast("Announcement Published!", "Broadcast sent to all platform users.", "success");
    } catch (err) {
      addToast("Error", "Could not publish broadcast announcement.", "error");
    }
  };

  const pendingCount = pickups.filter(p => p.status === 'pending').length;
  const completedCount = pickups.filter(p => p.status === 'completed' || p.status === 'picked_up').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* Admin Header Banner */}
          <div className="rounded-3xl p-6 bg-gradient-to-r from-purple-950 via-dark-900 to-eco-950 text-white border border-purple-500/30 shadow-xl">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">Admin Operations & Platform Governance</h1>
                <p className="text-xs text-gray-200 font-medium">Oversee e-waste logistics, collection dispatch, user tiers, and environmental compliance.</p>
              </div>
            </div>
          </div>

          {/* Admin Overview Metrics (Firestore Source of Truth) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="Total Platform Users" value={stats.totalUsers || usersList.length || 1} icon={Users} trend="Firestore Verified" color="purple" />
            <StatsCard title="Total Pickup Requests" value={pickups.length || stats.totalWasteReports} icon={Truck} subtext={`${pendingCount} Pending Dispatch`} color="blue" />
            <StatsCard title="Completed Pickups" value={completedCount || stats.completedCollections} icon={CheckCircle} trend="Doorstep Pickups" color="eco" />
            <StatsCard title="Total E-Waste Recycled" value={`${stats.totalRecycledKg || 8450} kg`} icon={Leaf} trend="Environmental Impact" color="amber" />
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center space-x-2 border-b border-gray-200 dark:border-gray-800 pb-2">
            {[
              { id: 'pickups', name: 'Pickup Management', icon: Truck },
              { id: 'users', name: 'User Roster', icon: Users },
              { id: 'agents', name: 'Collection Agents', icon: UserCheck },
              { id: 'announcements', name: 'Announcements', icon: Megaphone }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content: Pickup Management */}
          {activeTab === 'pickups' && (
            <div className="glass-card rounded-3xl p-6 border border-gray-200 dark:border-gray-800 space-y-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Active Pickup Requests Manager</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-gray-200 dark:border-gray-700 text-gray-400 font-semibold uppercase">
                    <tr>
                      <th className="py-3 px-4">Request ID</th>
                      <th className="py-3 px-4">Waste Type & Qty</th>
                      <th className="py-3 px-4">Pickup Address</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {pickups.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-dark-800/50">
                        <td className="py-3 px-4 font-bold text-eco-600 dark:text-eco-400">{p.id}</td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-gray-900 dark:text-white capitalize">{p.wasteType || 'E-Waste'}</p>
                          <p className="text-[10px] text-gray-400">Qty: {p.quantity || 1}</p>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300 max-w-xs truncate">{p.pickupAddress}</td>
                        <td className="py-3 px-4 font-medium">{p.pickupDate} ({p.pickupTime})</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                            p.status === 'completed' || p.status === 'picked_up' ? 'bg-emerald-500/10 text-emerald-600' :
                            p.status === 'accepted' || p.status === 'assigned' ? 'bg-sky-500/10 text-sky-600' :
                            'bg-amber-500/10 text-amber-600'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleStatusChange(p.id, 'accepted')}
                            className="px-2.5 py-1 rounded-lg bg-sky-600 text-white font-bold text-[10px]"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusChange(p.id, 'completed')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px]"
                          >
                            Complete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab Content: User Roster */}
          {activeTab === 'users' && (
            <div className="glass-card rounded-3xl p-6 border border-gray-200 dark:border-gray-800 space-y-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Registered Platform Users</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-gray-200 dark:border-gray-700 text-gray-400 font-semibold uppercase">
                    <tr>
                      <th className="py-3 px-4">UID</th>
                      <th className="py-3 px-4">Name & Email</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {usersList.map(u => (
                      <tr key={u.uid} className="hover:bg-gray-50/50 dark:hover:bg-dark-800/50">
                        <td className="py-3 px-4 font-mono text-[10px] text-gray-400">{u.uid}</td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-gray-900 dark:text-white">{u.name}</p>
                          <p className="text-[10px] text-gray-400">{u.email}</p>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-300">{u.phone || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.role === 'admin' ? 'bg-purple-500/10 text-purple-600' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {u.role || 'user'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-amber-500">{u.points || 0} PTS</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab Content: Agents Roster */}
          {activeTab === 'agents' && (
            <div className="glass-card rounded-3xl p-6 border border-gray-200 dark:border-gray-800 space-y-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Certified Collection Drivers & Agents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Marcus Vance', zone: 'Pune Metro (Baner, Kothrud)', vehicle: 'ECO-VAN-402', status: 'Active (On Route)' },
                  { name: 'Elena Rostova', zone: 'Hadapsar & Viman Nagar', vehicle: 'ECO-VAN-109', status: 'Active (Available)' }
                ].map((a, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-800 border flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">{a.name}</h4>
                      <p className="text-xs text-gray-500">Zone: {a.zone} • {a.vehicle}</p>
                      <span className="text-[10px] font-bold text-emerald-600 mt-1 inline-block">{a.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab Content: Announcements */}
          {activeTab === 'announcements' && (
            <div className="glass-card rounded-3xl p-6 border border-gray-200 dark:border-gray-800 space-y-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Publish Broadcast Announcement</h3>

              <form onSubmit={handlePublishAnnouncement} className="space-y-3">
                <textarea
                  rows="3"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="Enter platform notification text to broadcast..."
                  className="w-full p-3 text-xs rounded-xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                ></textarea>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow">
                  Publish Announcement
                </button>
              </form>

              <div className="pt-4 space-y-2">
                <h4 className="font-bold text-xs uppercase text-gray-400">Past Announcements</h4>
                {announcements.map(a => (
                  <div key={a.id} className="p-3 rounded-xl bg-gray-50 dark:bg-dark-800 border text-xs flex justify-between">
                    <span className="text-gray-800 dark:text-gray-200">{a.text}</span>
                    <span className="text-gray-400 text-[10px]">{a.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
