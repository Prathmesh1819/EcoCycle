import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import BadgeCard from '../components/cards/BadgeCard';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { getActiveRewards, redeemRewardTransaction } from '../services/rewardService';
import {
  Gift,
  Trophy,
  Users
} from 'lucide-react';

export default function RewardSystemPage() {
  const { user, firebaseUser } = useAuth();
  const { addToast } = useNotification();
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveRewards()
      .then(res => {
        if (res) setCatalog(res);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const defaultCatalog = [
    { id: 'cat-001', name: 'Amazon ₹500 Gift Voucher', description: 'Redeem points for an instant Amazon shopping gift card.', pointsRequired: 500, imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=400&q=80', isActive: true },
    { id: 'cat-002', name: 'Plant 5 Native Trees in Pune', description: 'Fund 5 native trees planted in urban Pune green zones.', pointsRequired: 250, imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80', isActive: true },
    { id: 'cat-003', name: 'Solar Power Bank 10,000mAh', description: 'Eco-friendly portable charger powered by solar cells.', pointsRequired: 800, imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=400&q=80', isActive: true },
    { id: 'cat-004', name: 'Eco-Hero Certificate & Badge', description: 'Official certified Zero E-Waste Hero recognition.', pointsRequired: 100, imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=400&q=80', isActive: true }
  ];

  const rewardsList = catalog.length > 0 ? catalog : defaultCatalog;

  const badges = [
    { id: 1, title: 'E-Waste Warrior', description: 'Recycle your first electronic device.', pointsReward: 50, unlocked: true, icon: '🛡️' },
    { id: 2, title: 'Rare Metal Saver', description: 'Divert over 20 kg of e-waste metals.', pointsReward: 100, unlocked: true, icon: '💎' },
    { id: 3, title: 'Zero Waste Champion', description: 'Complete 5 doorstep pickups.', pointsReward: 150, unlocked: false, progress: '3/5', icon: '🏆' },
    { id: 4, title: 'Battery Guardian', description: 'Recycle at least 10 lithium batteries.', pointsReward: 80, unlocked: false, progress: '4/10', icon: '🔋' }
  ];

  const leaderboard = [
    { rank: 1, name: user?.full_name || 'Registered Eco Member', points: user?.reward_points || user?.points || 50, avatar: user?.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=EcoUser' }
  ];

  const handleRedeem = async (item) => {
    if (!firebaseUser?.uid) {
      addToast("Authentication Required", "Please log in to redeem rewards.", "error");
      return;
    }

    const currentPts = user?.reward_points || user?.points || 0;
    if (currentPts < item.pointsRequired) {
      addToast("Insufficient Points", `You need ${item.pointsRequired} points for this reward. Available: ${currentPts} PTS`, "error");
      return;
    }

    try {
      const voucherCode = `ECO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      await redeemRewardTransaction(firebaseUser.uid, item.id || 'cat-001');
      addToast("Reward Redeemed! 🎉", `Voucher Code: ${voucherCode}`, "success");
    } catch (err) {
      console.error("Redemption error:", err);
      addToast("Redemption Error", err.message || "Could not process reward redemption.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* Points Header Banner */}
          <div className="rounded-3xl p-8 bg-gradient-to-r from-amber-600 via-orange-600 to-eco-900 text-white border border-amber-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3 backdrop-blur-sm">
                <Gift className="w-3.5 h-3.5" />
                <span>Eco Rewards Marketplace</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Your Reward Balance</h1>
              <p className="text-xs text-amber-100 mt-1 font-medium">Every recycled device earns points towards gift cards, clean energy gear, and tree planting.</p>
            </div>

            <div className="px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-200 block">Available Points</span>
              <span className="text-4xl font-black text-white">{user?.reward_points || user?.points || 0} PTS</span>
            </div>
          </div>

          {/* Points Reference Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { title: 'Smartphone', pts: '40 PTS' },
              { title: 'Laptop / PC', pts: '100 PTS' },
              { title: 'Battery Pack', pts: '20 PTS' },
              { title: 'Monitor / TV', pts: '60 PTS' }
            ].map((p, i) => (
              <div key={i} className="glass-card p-4 rounded-2xl border text-center border-gray-200 dark:border-gray-800">
                <span className="text-xs font-medium text-gray-500 block">{p.title}</span>
                <span className="text-lg font-black text-eco-600 dark:text-eco-400">{p.pts}</span>
              </div>
            ))}
          </div>

          {/* Rewards Catalog */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Redeemable Rewards & Vouchers</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {rewardsList.map(item => {
                const currentPts = user?.reward_points || user?.points || 0;
                const canAfford = currentPts >= item.pointsRequired;
                return (
                  <div key={item.id} className="glass-card rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 flex flex-col justify-between hover:shadow-xl transition-all duration-300">
                    <div>
                      <div className="h-36 relative overflow-hidden">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500 text-white font-bold text-xs shadow">
                          {item.pointsRequired} PTS
                        </span>
                      </div>
                      <div className="p-5 space-y-2">
                        <span className="text-[10px] font-bold text-eco-600 dark:text-eco-400 uppercase tracking-wider">Marketplace</span>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-snug">{item.name}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.description}</p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <button
                        onClick={() => handleRedeem(item)}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all shadow ${
                          canAfford
                            ? 'bg-gradient-to-r from-eco-600 to-emerald-600 hover:from-eco-500 hover:to-emerald-500 text-white'
                            : 'bg-gray-200 dark:bg-dark-800 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? 'Redeem Voucher' : `Need ${item.pointsRequired - currentPts} More PTS`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gamified Eco Badges & Leaderboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Badges Section */}
            <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-gray-200 dark:border-gray-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>Eco-Badges & Achievements</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {badges.map(badge => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="glass-card rounded-3xl p-6 border border-gray-200 dark:border-gray-800 space-y-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-eco-500" />
                <span>Community Leaderboard</span>
              </h3>

              <div className="space-y-3">
                {leaderboard.map(u => (
                  <div key={u.rank} className="p-3 rounded-2xl bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        u.rank === 1 ? 'bg-amber-400 text-amber-950' : u.rank === 2 ? 'bg-eco-500 text-white' : 'bg-gray-300 dark:bg-dark-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {u.rank}
                      </span>
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">{u.name}</span>
                    </div>
                    <span className="text-xs font-black text-eco-600 dark:text-eco-400">{u.points} PTS</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
