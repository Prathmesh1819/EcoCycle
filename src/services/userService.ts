import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { UserProfile, UserRole } from "../types/firebase";
import { sanitizeData } from "./utils";

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!uid) return null;
  try {
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Unable to fetch user profile.");
  }
};

export const createUserProfile = async (profile: UserProfile): Promise<UserProfile> => {
  if (!profile.uid) throw new Error("User UID is required to create a profile.");

  // Guarantee role = 'user' and points = 0 for client registration profile documents
  const role: UserRole = "user";
  const points: number = 0;

  const dataToSave = sanitizeData({
    uid: profile.uid,
    name: profile.name || "",
    email: profile.email || "",
    phone: profile.phone || "",
    address: profile.address || "",
    profileImage: profile.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(profile.name || 'User')}`,
    role: role,
    points: points,
    co2SavedKg: profile.co2SavedKg || 0,
    itemsRecycledCount: profile.itemsRecycledCount || 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  const currentAuthUser = auth.currentUser;

  // Detailed step 2 development logging
  console.log("[FIRESTORE DEBUG]", {
    uid: profile.uid,
    currentUserUid: currentAuthUser?.uid,
    email: currentAuthUser?.email,
    path: `users/${profile.uid}`,
    authenticated: !!currentAuthUser,
  });

  console.log("[FIRESTORE PROFILE DEBUG]", {
    fields: Object.keys(dataToSave),
    role: dataToSave.role,
    roleType: typeof dataToSave.role,
    points: dataToSave.points,
    pointsType: typeof dataToSave.points,
  });

  if (!currentAuthUser) {
    throw new Error("[FIRESTORE_PROFILE_ERROR] Cannot create profile: Firebase Auth state is unauthenticated (auth.currentUser is null).");
  }

  if (currentAuthUser.uid !== profile.uid) {
    throw new Error(`[FIRESTORE_PROFILE_ERROR] Cannot create profile: Auth UID mismatch (auth.currentUser.uid ${currentAuthUser.uid} !== target profile UID ${profile.uid}).`);
  }

  const docRef = doc(db, "users", profile.uid);
  
  try {
    await setDoc(docRef, dataToSave);
    console.log("✅ FIRESTORE SETDOC SUCCESSFUL for users/" + profile.uid);
    return dataToSave as UserProfile;
  } catch (err: any) {
    console.error("❌ FIRESTORE SETDOC PERMISSION DENIED for users/" + profile.uid);
    console.error(" - Error Code:", err?.code);
    console.error(" - Error Message:", err?.message);
    throw err;
  }
};

export const updateUserProfile = async (
  uid: string, 
  updates: Partial<UserProfile>
): Promise<void> => {
  if (!uid) throw new Error("User ID is required.");

  // Prevent regular profile updates from altering sensitive administrative fields directly
  const { role, points, uid: _, ...allowedUpdates } = updates;

  const sanitized = sanitizeData({
    ...allowedUpdates,
    updatedAt: serverTimestamp()
  });

  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, sanitized);
};

export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const colRef = collection(db, "users");
    const snap = await getDocs(colRef);
    return snap.docs.map(doc => doc.data() as UserProfile);
  } catch (error) {
    console.error("Error getting all users:", error);
    throw new Error("Unable to load user registry.");
  }
};

export const subscribeUserProfile = (
  uid: string, 
  callback: (profile: UserProfile | null) => void
) => {
  if (!uid) return () => {};
  const docRef = doc(db, "users", uid);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as UserProfile);
    } else {
      callback(null);
    }
  }, (err) => {
    console.error("User profile subscription error:", err);
  });
};
