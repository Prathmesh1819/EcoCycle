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
import { CollectionRequest, CollectionRequestStatus } from "../types/firebase";
import { sanitizeData } from "./utils";

export const createCollectionRequest = async (
  requestData: Omit<CollectionRequest, "id" | "createdAt" | "updatedAt" | "status" | "collectorId">
): Promise<CollectionRequest> => {
  if (!requestData.userId) throw new Error("User must be logged in to create a collection request.");
  if (!requestData.pickupAddress) throw new Error("Pickup address is required.");
  if (!requestData.pickupDate) throw new Error("Pickup date is required.");

  const payload = sanitizeData({
    userId: requestData.userId,
    wasteReportId: requestData.wasteReportId || "",
    pickupAddress: requestData.pickupAddress,
    pickupDate: requestData.pickupDate,
    pickupTime: requestData.pickupTime || "10:00 AM - 12:00 PM",
    wasteType: requestData.wasteType || "e-waste",
    quantity: Number(requestData.quantity) || 1,
    status: "pending" as CollectionRequestStatus,
    collectorId: "",
    notes: requestData.notes || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  const docRef = await addDoc(collection(db, "collection_requests"), payload);

  return {
    id: docRef.id,
    ...payload
  } as CollectionRequest;
};

export const getUserCollectionRequests = async (userId: string): Promise<CollectionRequest[]> => {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, "collection_requests"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as CollectionRequest);
  } catch (error) {
    console.error("Error fetching user collection requests:", error);
    const fallbackQ = query(
      collection(db, "collection_requests"),
      where("userId", "==", userId)
    );
    const snap = await getDocs(fallbackQ);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as CollectionRequest);
  }
};

export const getAllCollectionRequests = async (): Promise<CollectionRequest[]> => {
  try {
    const q = query(collection(db, "collection_requests"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as CollectionRequest);
  } catch (error) {
    console.error("Error fetching all collection requests:", error);
    const snap = await getDocs(collection(db, "collection_requests"));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as CollectionRequest);
  }
};

export const updateCollectionStatus = async (
  requestId: string,
  status: CollectionRequestStatus,
  collectorId: string = ""
): Promise<void> => {
  if (!requestId) throw new Error("Request ID is required.");
  const docRef = doc(db, "collection_requests", requestId);

  const updates: Record<string, any> = {
    status,
    updatedAt: serverTimestamp()
  };

  if (collectorId) {
    updates.collectorId = collectorId;
  }

  await updateDoc(docRef, sanitizeData(updates));
};

export const subscribeUserCollectionRequests = (
  userId: string,
  callback: (requests: CollectionRequest[]) => void
) => {
  if (!userId) return () => {};
  const q = query(
    collection(db, "collection_requests"),
    where("userId", "==", userId)
  );

  return onSnapshot(q, (snap) => {
    const requests = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as CollectionRequest);
    callback(requests);
  }, (err) => {
    console.error("User collection requests listener error:", err);
  });
};

export const subscribeAllCollectionRequests = (
  callback: (requests: CollectionRequest[]) => void
) => {
  const colRef = collection(db, "collection_requests");
  return onSnapshot(colRef, (snap) => {
    const requests = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as CollectionRequest);
    callback(requests);
  }, (err) => {
    console.error("All collection requests listener error:", err);
  });
};
