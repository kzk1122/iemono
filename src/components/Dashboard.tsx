"use client";

import { Item } from "@/types";
import { getExpiryStatus } from "@/lib/expiry";
import { STORAGE_LOCATIONS } from "@/lib/constants";
import StatCard from "@/components/ui/StatCard";

interface DashboardProps {
  items: Item[];
  warningDays: number;
}

export default function Dashboard({ items, warningDays }: DashboardProps) {
  const total = items.length;
  const expiredCount = items.filter(
    (i) => getExpiryStatus(i.expiryDate, warningDays) === "expired"
  ).length;
  const warningCount = items.filter(
    (i) => getExpiryStatus(i.expiryDate, warningDays) === "warning"
  ).length;

  // 保管場所ごとの数
  const locationCounts = STORAGE_LOCATIONS.map((loc) => ({
    ...loc,
    count: items.filter((i) => i.location === loc.id).length,
  }));

  return (
    <div className="space-y-6">
      {/* 統計カード */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="合計" value={total} emoji="📦" />
        <StatCard
          label="期限切れ"
          value={expiredCount}
          emoji="🚨"
          color="text-red-400"
        />
        <StatCard
          label="期限間近"
          value={warningCount}
          emoji="⚠️"
          color="text-yellow-400"
        />
      </div>

      {/* 保管場所別 */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-zinc-400">
          保管場所別
        </h2>
        <div className="space-y-2">
          {locationCounts.map((loc) => (
            <div
              key={loc.id}
              className="flex items-center justify-between rounded-lg bg-zinc-800/60 px-4 py-3"
            >
              <span className="text-sm text-zinc-200">
                {loc.emoji} {loc.label}
              </span>
              <span className="text-sm font-semibold text-zinc-100">
                {loc.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
