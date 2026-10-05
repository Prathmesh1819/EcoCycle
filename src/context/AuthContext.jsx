import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  resetPassword as sendFirebaseResetPassword 
} from '../services/authService';
import { 
  getUserProfile, 
  createUserProfile, 
  updateUserProfile as updateFirestoreProfile,
  subscribeUserProfile 
} from '../services/userService';
import { awardUserPoints } from '../services/rewardService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Maintain authentication state using onAuthStateChanged
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setFirebaseUser(fbUser);
        try {
          let profile = await getUserProfile(fbUser.uid);
          if (!profile) {
            profile = await createUserProfile({
              uid: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Eco User',
              email: fbUser.email || '',
              phone: '',
              address: '',
              role: 'user',
              points: 0
            });
          }
          setUserProfile(profile);
        } catch (err) {
          console.error("Error loading user profile on auth change:", err);
        }
      } else {
        setFirebaseUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Real-time listener for user profile changes (e.g. points, role changes)
  useEffect(() => {
    if (!firebaseUser?.uid) return;
    const unsubProfile = subscribeUserProfile(firebaseUser.uid, (updatedProfile) => {
      if (updatedProfile) {
        setUserProfile(updatedProfile);
      }
    });
    return () => unsubProfile();
  }, [firebaseUser?.uid]);

  // Derived normalized user object for seamless UI compatibility
  const normalizedUser = userProfile ? {
    ...userProfile,
    id: userProfile.uid,
    full_name: userProfile.name || userProfile.email?.split('@')[0] || 'Eco Hero',
    reward_points: userProfile.points || 0,
    co2_saved_kg: userProfile.co2SavedKg || 0,
    items_recycled_count: userProfile.itemsRecycledCount || 0,
    avatar_url: userProfile.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userProfile.name || 'User')}`,
    eco_tier: (userProfile.points || 0) >= 1000 ? 'Platinum Eco-Hero' : (userProfile.points || 0) >= 300 ? 'Gold Eco-Hero' : 'Eco Beginner'
  } : null;

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { user, profile } = await loginUser(email, password);
      setFirebaseUser(user);
      setUserProfile(profile);
      setLoading(false);
      return { success: true, profile };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, password, phone = '', address = '') => {
    setLoading(true);
    try {
      const { user, profile } = await registerUser(email, password, name, phone, address);
      setFirebaseUser(user);
      setUserProfile(profile);
      setLoading(false);
      return { success: true, profile };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Backwards compatible signup method alias
  const signup = async (fullName, email, password, role = 'user', phone = '', address = '') => {
    return await register(fullName, email, password, phone, address);
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setFirebaseUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendFirebaseResetPassword(email);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateProfile = async (updatedFields) => {
    if (!firebaseUser?.uid) return;
    try {
      await updateFirestoreProfile(firebaseUser.uid, updatedFields);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const addRewardPoints = async (points) => {
    if (!firebaseUser?.uid || points <= 0) return;
    try {
      await awardUserPoints(firebaseUser.uid, points);
    } catch (err) {
      console.error("Failed to add points:", err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user: normalizedUser,
      firebaseUser,
      userProfile,
      loading,
      isAuthenticated: Boolean(firebaseUser),
      login,
      register,
      signup,
      logout,
      resetPassword,
      updateProfile,
      addRewardPoints
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
