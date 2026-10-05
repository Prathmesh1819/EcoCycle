import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  deleteDoc,
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { FeedbackItem } from "../types/firebase";
import { sanitizeData } from "./utils";

export const submitFeedback = async (
  userId: string,
  name: string,
  email: string,
  message: string,
  rating: number = 5
): Promise<FeedbackItem> => {
  if (!userId) throw new Error("User must be logged in to submit feedback.");
  if (!message || message.trim().length === 0) throw new Error("Feedback message cannot be empty.");

  const payload = sanitizeData({
    userId,
    name: name || "Anonymous",
    email: email || "",
    message: message.trim(),
    rating: Number(rating) || 5,
    createdAt: serverTimestamp()
  });

  const docRef = await addDoc(collection(db, "feedback"), payload);
  return { id: docRef.id, ...payload } as FeedbackItem;
};

export const getAllFeedback = async (): Promise<FeedbackItem[]> => {
  try {
    const q = query(collection(db, "feedback"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as FeedbackItem);
  } catch (error) {
    console.error("Error fetching all feedback:", error);
    const snap = await getDocs(collection(db, "feedback"));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as FeedbackItem);
  }
};

export const getUserFeedback = async (userId: string): Promise<FeedbackItem[]> => {
  if (!userId) return [];
  try {
    const q = query(collection(db, "feedback"), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as FeedbackItem);
  } catch (error) {
    console.error("Error fetching user feedback:", error);
    return [];
  }
};

export const deleteUserFeedback = async (feedbackId: string): Promise<void> => {
  if (!feedbackId) return;
  await deleteDoc(doc(db, "feedback", feedbackId));
};
