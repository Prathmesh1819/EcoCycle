import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc,
  updateDoc, 
  query, 
  where, 
  increment,
  runTransaction,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { RewardItem } from "../types/firebase";
import { uploadStorageFile } from "./storageService";
import { sanitizeData } from "./utils";

export const getActiveRewards = async (): Promise<RewardItem[]> => {
  try {
    const q = query(collection(db, "rewards"), where("isActive", "==", true));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as RewardItem);
  } catch (error) {
    console.error("Error fetching active rewards:", error);
    // Fallback if query fails
    const snap = await getDocs(collection(db, "rewards"));
    return snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }) as RewardItem)
      .filter(r => r.isActive !== false);
  }
};

export const getAllRewards = async (): Promise<RewardItem[]> => {
  try {
    const snap = await getDocs(collection(db, "rewards"));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as RewardItem);
  } catch (error) {
    console.error("Error fetching all rewards:", error);
    return [];
  }
};

export const createReward = async (
  reward: Omit<RewardItem, "id" | "createdAt"> & { imageFile?: File | string }
): Promise<RewardItem> => {
  let imageUrl = reward.imageUrl || "";

  if (reward.imageFile) {
    const tempId = `reward_${Date.now()}`;
    imageUrl = await uploadStorageFile(reward.imageFile, `rewards/${tempId}/reward_image`);
  }

  const payload = sanitizeData({
    name: reward.name,
    description: reward.description || "",
    pointsRequired: Number(reward.pointsRequired),
    imageUrl,
    isActive: reward.isActive !== false,
    createdAt: serverTimestamp()
  });

  const docRef = await addDoc(collection(db, "rewards"), payload);
  return { id: docRef.id, ...payload } as RewardItem;
};

/**
 * Redeems a reward safely using Firestore transaction to deduct points.
 */
export const redeemRewardTransaction = async (
  userId: string, 
  rewardId: string
): Promise<{ success: boolean; remainingPoints: number }> => {
  if (!userId || !rewardId) throw new Error("User ID and Reward ID are required.");

  const userRef = doc(db, "users", userId);
  const rewardRef = doc(db, "rewards", rewardId);

  return await runTransaction(db, async (transaction) => {
    const userDoc = await transaction.get(userRef);
    const rewardDoc = await transaction.get(rewardRef);

    if (!userDoc.exists()) throw new Error("User profile not found.");
    if (!rewardDoc.exists()) throw new Error("Reward item not found.");

    const userData = userDoc.data();
    const rewardData = rewardDoc.data();

    const currentPoints = userData.points || 0;
    const requiredPoints = rewardData.pointsRequired || 0;

    if (currentPoints < requiredPoints) {
      throw new Error(`Insufficient points balance. Required: ${requiredPoints}, Available: ${currentPoints}`);
    }

    const newPoints = currentPoints - requiredPoints;
    transaction.update(userRef, { 
      points: newPoints,
      updatedAt: serverTimestamp()
    });

    return { success: true, remainingPoints: newPoints };
  });
};

/**
 * Admin operation to award points to a user using Firestore increment.
 */
export const awardUserPoints = async (userId: string, pointsToAdd: number): Promise<void> => {
  if (!userId) throw new Error("User ID is required.");
  if (pointsToAdd <= 0) return;

  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    points: increment(pointsToAdd),
    updatedAt: serverTimestamp()
  });
};
