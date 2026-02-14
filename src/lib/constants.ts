export const CATEGORIES = [
  { id: "food", label: "食品", emoji: "🍱", color: "#FF6B4A" },
  { id: "daily", label: "日用品", emoji: "🧴", color: "#4A9FFF" },
  { id: "electronics", label: "家電", emoji: "🔌", color: "#A855F7" },
  { id: "clothing", label: "衣類", emoji: "👕", color: "#F59E0B" },
  { id: "medicine", label: "薬・医療品", emoji: "💊", color: "#10B981" },
  { id: "other", label: "その他", emoji: "📦", color: "#6B7280" },
] as const;

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((cat) => [cat.id, cat])
) as Record<string, (typeof CATEGORIES)[number]>;

export const STORAGE_LOCATIONS = [
  { id: "fridge", label: "冷蔵庫", emoji: "❄️" },
  { id: "freezer", label: "冷凍庫", emoji: "🧊" },
  { id: "pantry", label: "パントリー", emoji: "🏠" },
  { id: "kitchen", label: "キッチン", emoji: "🍳" },
  { id: "bathroom", label: "洗面所", emoji: "🚿" },
  { id: "closet", label: "クローゼット", emoji: "🚪" },
  { id: "living", label: "リビング", emoji: "🛋️" },
  { id: "other", label: "その他", emoji: "📍" },
] as const;

export const LOCATION_MAP = Object.fromEntries(
  STORAGE_LOCATIONS.map((loc) => [loc.id, loc])
) as Record<string, (typeof STORAGE_LOCATIONS)[number]>;

export const ALERT_DAYS_OPTIONS = [1, 3, 5, 7, 14, 30] as const;

export const EXPIRY_CATEGORIES = ["food", "medicine"] as const;

export const DEFAULT_SETTINGS: {
  defaultAlertDays: number;
  showExpired: boolean;
  notificationsEnabled: boolean;
} = {
  defaultAlertDays: 3,
  showExpired: true,
  notificationsEnabled: true,
};

export const STORAGE_KEYS = {
  ITEMS: "iemono-items",
  SETTINGS: "iemono-settings",
} as const;
