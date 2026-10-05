export type UserRole = 'user' | 'admin' | 'collector';

export type WasteType = 'plastic' | 'paper' | 'glass' | 'metal' | 'e-waste' | 'organic' | 'other';

export type WasteReportStatus = 'pending' | 'assigned' | 'collected' | 'processing' | 'recycled' | 'rejected';

export type CollectionRequestStatus = 'pending' | 'assigned' | 'accepted' | 'picked_up' | 'completed' | 'cancelled';

export type RecyclingRecordStatus = 'processing' | 'recycled' | 'completed';

export type NotificationType = 'collection' | 'recycling' | 'reward' | 'system';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImage?: string;
  role: UserRole;
  points: number;
  co2SavedKg?: number;
  itemsRecycledCount?: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface WasteReport {
  id?: string;
  userId: string;
  userName: string;
  wasteType: WasteType;
  description: string;
  quantity: number;
  imageUrl: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: WasteReportStatus;
  assignedCollectorId: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface CollectionRequest {
  id?: string;
  userId: string;
  wasteReportId: string;
  pickupAddress: string;
  pickupDate: string;
  pickupTime: string;
  wasteType: string;
  quantity: number;
  status: CollectionRequestStatus;
  collectorId: string;
  notes: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface RecyclingRecord {
  id?: string;
  wasteReportId: string;
  userId: string;
  wasteType: string;
  quantity: number;
  recycledQuantity: number;
  recyclingMethod: string;
  processingCenter: string;
  status: RecyclingRecordStatus;
  createdAt?: any;
  completedAt?: any;
}

export interface RewardItem {
  id?: string;
  name: string;
  description: string;
  pointsRequired: number;
  imageUrl: string;
  isActive: boolean;
  createdAt?: any;
}

export interface NotificationItem {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt?: any;
}

export interface FeedbackItem {
  id?: string;
  userId: string;
  name: string;
  email: string;
  message: string;
  rating: number;
  createdAt?: any;
}
