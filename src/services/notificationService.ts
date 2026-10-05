import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { NotificationItem, NotificationType } from "../types/firebase";
import { sanitizeData } from "./utils";

export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: NotificationType = "system"
): Promise<NotificationItem> => {
  if (!userId) throw new Error("Target user ID is required.");

  const payload = sanitizeData({
    userId,
    title,
    message,
    type,
    read: false,
    createdAt: serverTimestamp()
  });

  const docRef = await addDoc(collection(db, "notifications"), payload);
  return { id: docRef.id, ...payload } as NotificationItem;
};

export const getUserNotifications = async (userId: string): Promise<NotificationItem[]> => {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as NotificationItem);
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    const fallbackQ = query(
      collection(db, "notifications"),
      where("userId", "==", userId)
    );
    const snap = await getDocs(fallbackQ);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as NotificationItem);
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  if (!notificationId) return;
  const docRef = doc(db, "notifications", notificationId);
  await updateDoc(docRef, { read: true });
};

export const subscribeUserNotifications = (
  userId: string,
  callback: (notifications: NotificationItem[]) => void
) => {
  if (!userId) return () => {};
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId)
  );

  return onSnapshot(q, (snap) => {
    const notifications = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as NotificationItem);
    callback(notifications);
  }, (err) => {
    console.error("Notifications listener error:", err);
  });
};
