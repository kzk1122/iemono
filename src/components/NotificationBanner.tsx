"use client";

import Link from "next/link";
import { Item } from "@/types";
import { getExpiryStatus } from "@/lib/expiry";

interface NotificationBannerProps {
  items: Item[];
  enabled: boolean;
}

export default function NotificationBanner({
  items,
  enabled,
}: NotificationBannerProps) {
  if (!enabled) return null;

  const expiredCount = items.filter(
    (item) => getExpiryStatus(item.expiryDate, item.alertDays) === "expired"
  ).length;
  const warningCount = items.filter((item) => {
    const s = getExpiryStatus(item.expiryDate, item.alertDays);
    return s === "today" || s === "warning";
  }).length;

  if (expiredCount === 0 && warningCount === 0) return null;

  return (
    <Link href="/items" className="block">
      <div className="mx-4 mt-2 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-lg">⚠️</span>
          <div className="text-yellow-200">
            {expiredCount > 0 && (
              <span className="font-semibold text-red-400">
                {expiredCount}件が期限切れ
              </span>
            )}
            {expiredCount > 0 && warningCount > 0 && <span> ・ </span>}
            {warningCount > 0 && (
              <span className="font-semibold text-yellow-400">
                {warningCount}件が期限間近
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
