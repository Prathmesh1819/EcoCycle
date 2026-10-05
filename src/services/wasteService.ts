import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { WasteReport, WasteReportStatus, WasteType } from "../types/firebase";
import { uploadStorageFile } from "./storageService";
import { sanitizeData } from "./utils";

export const createWasteReport = async (
  report: Omit<WasteReport, "id" | "createdAt" | "updatedAt" | "status" | "assignedCollectorId"> & {
    imageFile?: File | string;
  }
): Promise<WasteReport> => {
  if (!report.userId) throw new Error("User must be authenticated to submit a waste report.");
  if (!report.wasteType) throw new Error("Waste type is required.");
  if (!report.quantity || report.quantity <= 0) throw new Error("Quantity must be greater than 0.");

  let imageUrl = report.imageUrl || "";

  if (report.imageFile) {
    const tempId = `report_${Date.now()}`;
    imageUrl = await uploadStorageFile(report.imageFile, `waste_reports/${tempId}/${Date.now()}_img`);
  }

  const payload = sanitizeData({
    userId: report.userId,
    userName: report.userName || "Anonymous",
    wasteType: report.wasteType,
    description: report.description || "",
    quantity: Number(report.quantity),
    imageUrl: imageUrl,
    location: report.location || { latitude: 0, longitude: 0, address: "" },
    status: "pending" as WasteReportStatus,
    assignedCollectorId: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  const docRef = await addDoc(collection(db, "waste_reports"), payload);

  return {
    id: docRef.id,
    ...payload
  } as WasteReport;
};

export const getUserWasteReports = async (userId: string): Promise<WasteReport[]> => {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, "waste_reports"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as WasteReport);
  } catch (error) {
    console.error("Error fetching user waste reports:", error);
    // Fallback query if composite index is pending
    const fallbackQ = query(
      collection(db, "waste_reports"),
      where("userId", "==", userId)
    );
    const snap = await getDocs(fallbackQ);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as WasteReport);
  }
};

export const getAllWasteReports = async (): Promise<WasteReport[]> => {
  try {
    const q = query(collection(db, "waste_reports"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as WasteReport);
  } catch (error) {
    console.error("Error fetching all waste reports:", error);
    const snap = await getDocs(collection(db, "waste_reports"));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as WasteReport);
  }
};

export const updateWasteReportStatus = async (
  reportId: string,
  status: WasteReportStatus,
  assignedCollectorId: string = ""
): Promise<void> => {
  if (!reportId) throw new Error("Report ID is required.");
  const docRef = doc(db, "waste_reports", reportId);
  
  const updates: Record<string, any> = {
    status,
    updatedAt: serverTimestamp()
  };

  if (assignedCollectorId) {
    updates.assignedCollectorId = assignedCollectorId;
  }

  await updateDoc(docRef, sanitizeData(updates));
};

export const subscribeUserWasteReports = (
  userId: string,
  callback: (reports: WasteReport[]) => void
) => {
  if (!userId) return () => {};
  const q = query(
    collection(db, "waste_reports"),
    where("userId", "==", userId)
  );

  return onSnapshot(q, (snap) => {
    const reports = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as WasteReport);
    callback(reports);
  }, (err) => {
    console.error("User waste reports listener error:", err);
  });
};

export const subscribeAllWasteReports = (
  callback: (reports: WasteReport[]) => void
) => {
  const colRef = collection(db, "waste_reports");
  return onSnapshot(colRef, (snap) => {
    const reports = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as WasteReport);
    callback(reports);
  }, (err) => {
    console.error("All waste reports listener error:", err);
  });
};
