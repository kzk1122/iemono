export interface Item {
  id: string;
  name: string;
  category: string;
  location: string;
  quantity: number;
  unit: string;
  expiryDate: string; // ISO date string, empty if not set
  alertDays: number; // 何日前から通知するか (per-item)
  memo: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  defaultAlertDays: number;
  showExpired: boolean;
  notificationsEnabled: boolean;
  theme: "light" | "dark" | "system";
}

export type ExpiryStatus = "expired" | "today" | "warning" | "ok" | "none";
