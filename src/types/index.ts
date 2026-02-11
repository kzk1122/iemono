export interface Item {
  id: string;
  name: string;
  quantity: number;
  location: string;
  expiryDate: string; // ISO date string, empty if not set
  memo: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  notificationDays: number; // 何日前から通知するか
  notificationsEnabled: boolean;
}

export type ExpiryStatus = "expired" | "warning" | "ok" | "none";
