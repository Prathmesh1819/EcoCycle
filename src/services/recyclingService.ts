import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { RecyclingRecord, RecyclingRecordStatus } from "../types/firebase";
import { sanitizeData } from "./utils";

export const createRecyclingRecord = async (
  recordData: Omit<RecyclingRecord, "id" | "createdAt" | "completedAt">
): Promise<RecyclingRecord> => {
  const payload = sanitizeData({
    wasteReportId: recordData.wasteReportId || "",
    userId: recordData.userId,
    wasteType: recordData.wasteType,
    quantity: Number(recordData.quantity) || 1,
    recycledQuantity: Number(recordData.recycledQuantity) || Number(recordData.quantity) || 1,
    recyclingMethod: recordData.recyclingMethod || "Standard E-waste Shredding & Refining",
    processingCenter: recordData.processingCenter || "Pune Central Eco Hub",
    status: (recordData.status || "processing") as RecyclingRecordStatus,
    createdAt: serverTimestamp()
  });

  const docRef = await addDoc(collection(db, "recycling_records"), payload);
  return { id: docRef.id, ...payload } as RecyclingRecord;
};

export const getUserRecyclingRecords = async (userId: string): Promise<RecyclingRecord[]> => {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, "recycling_records"),
      where("userId", "==", userId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as RecyclingRecord);
  } catch (error) {
    console.error("Error fetching recycling records:", error);
    return [];
  }
};

export const getAllRecyclingRecords = async (): Promise<RecyclingRecord[]> => {
  try {
    const snap = await getDocs(collection(db, "recycling_records"));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as RecyclingRecord);
  } catch (error) {
    console.error("Error fetching all recycling records:", error);
    return [];
  }
};

export const updateRecyclingRecordStatus = async (
  recordId: string,
  status: RecyclingRecordStatus
): Promise<void> => {
  if (!recordId) throw new Error("Record ID is required.");
  const docRef = doc(db, "recycling_records", recordId);

  const updates: Record<string, any> = {
    status
  };

  if (status === "completed" || status === "recycled") {
    updates.completedAt = serverTimestamp();
  }

  await updateDoc(docRef, sanitizeData(updates));
};
