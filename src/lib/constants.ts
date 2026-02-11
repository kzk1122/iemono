export const STORAGE_LOCATIONS = [
  { id: "refrigerator", label: "冷蔵庫", emoji: "🧊" },
  { id: "freezer", label: "冷凍庫", emoji: "❄️" },
  { id: "pantry", label: "パントリー", emoji: "🗄️" },
  { id: "kitchen", label: "キッチン", emoji: "🍳" },
  { id: "other", label: "その他", emoji: "📦" },
] as const;

export const LOCATION_MAP = Object.fromEntries(
  STORAGE_LOCATIONS.map((loc) => [loc.id, loc])
) as Record<string, (typeof STORAGE_LOCATIONS)[number]>;

export const DEFAULT_SETTINGS = {
  notificationDays: 3,
  notificationsEnabled: true,
};

export const STORAGE_KEYS = {
  ITEMS: "iemono-items",
  SETTINGS: "iemono-settings",
} as const;
