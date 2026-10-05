import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface AdminStats {
  totalUsers: number;
  totalWasteReports: number;
  pendingReports: number;
  completedCollections: number;
  totalRecycledKg: number;
  totalRewardPoints: number;
  activeCollectionRequests: number;
}

export const getAdminDashboardStats = async (): Promise<AdminStats> => {
  try {
    const [usersSnap, reportsSnap, requestsSnap, recyclingSnap] = await Promise.all([
      getDocs(collection(db, "users")),
      getDocs(collection(db, "waste_reports")),
      getDocs(collection(db, "collection_requests")),
      getDocs(collection(db, "recycling_records"))
    ]);

    const totalUsers = usersSnap.size;

    const reports = reportsSnap.docs.map(doc => doc.data());
    const totalWasteReports = reports.length;
    const pendingReports = reports.filter(r => r.status === "pending").length;

    const requests = requestsSnap.docs.map(doc => doc.data());
    const completedCollections = requests.filter(r => r.status === "completed" || r.status === "picked_up").length;
    const activeCollectionRequests = requests.filter(r => r.status === "pending" || r.status === "assigned" || r.status === "accepted").length;

    const recycling = recyclingSnap.docs.map(doc => doc.data());
    const totalRecycledKg = recycling.reduce((acc, curr) => acc + (Number(curr.recycledQuantity) || Number(curr.quantity) || 0), 0);

    const users = usersSnap.docs.map(doc => doc.data());
    const totalRewardPoints = users.reduce((acc, curr) => acc + (Number(curr.points) || 0), 0);

    return {
      totalUsers,
      totalWasteReports,
      pendingReports,
      completedCollections,
      totalRecycledKg,
      totalRewardPoints,
      activeCollectionRequests
    };
  } catch (error) {
    console.error("Error computing admin stats from Firestore:", error);
    return {
      totalUsers: 0,
      totalWasteReports: 0,
      pendingReports: 0,
      completedCollections: 0,
      totalRecycledKg: 0,
      totalRewardPoints: 0,
      activeCollectionRequests: 0
    };
  }
};
