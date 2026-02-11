import { ExpiryStatus } from "@/types";

export function getExpiryStatus(
  expiryDate: string,
  warningDays: number
): ExpiryStatus {
  if (!expiryDate) return "none";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const diffMs = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "expired";
  if (diffDays <= warningDays) return "warning";
  return "ok";
}

export function getDaysUntilExpiry(expiryDate: string): number | null {
  if (!expiryDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  return Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function formatExpiryLabel(days: number | null): string {
  if (days === null) return "";
  if (days < 0) return `${Math.abs(days)}日超過`;
  if (days === 0) return "今日まで";
  return `あと${days}日`;
}
