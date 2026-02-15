"use client";

import Link from "next/link";
import { Item } from "@/types";
import { getExpiryStatus, getDaysUntilExpiry } from "@/lib/expiry";
import { CATEGORIES, CATEGORY_MAP, STORAGE_LOCATIONS, EXPIRY_CATEGORIES } from "@/lib/constants";
import StatCard from "@/components/ui/StatCard";

interface DashboardProps {
  items: Item[];
}

export default function Dashboard({ items }: DashboardProps) {
  const total = items.length;
  const expiredCount = items.filter(
    (i) => getExpiryStatus(i.expiryDate, i.alertDays) === "expired"
  ).length;
  const warningCount = items.filter((i) => {
    const s = getExpiryStatus(i.expiryDate, i.alertDays);
    return s === "today" || s === "warning";
  }).length;

  // カテゴリ別
  const categoryStats = CATEGORIES.map((cat) => ({
    ...cat,
    count: items.filter((i) => i.category === cat.id).length,
  })).filter((c) => c.count > 0);

  // 賞味期限タイムライン（食品・薬のみ）
  const expiryItems = items
    .filter(
      (i) =>
        (EXPIRY_CATEGORIES as readonly string[]).includes(i.category) &&
        i.expiryDate
    )
    .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
    .slice(0, 6);

  // 保管場所別
  const locationCounts = STORAGE_LOCATIONS.map((loc) => ({
    ...loc,
    count: items.filter((i) => i.location === loc.id).length,
  })).filter((l) => l.count > 0);

  return (
    <div className="space-y-6">
      {/* 日付 */}
      <p className="text-xs text-zinc-500">
        {new Date().toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "short",
        })}
      </p>

      {/* 統計カード */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="総アイテム" value={total} emoji="📦" />
        <StatCard
          label="期限注意"
          value={warningCount}
          emoji="⚡"
          color="text-yellow-400"
        />
        <StatCard
          label="期限切れ"
          value={expiredCount}
          emoji="🔥"
          color="text-red-400"
        />
      </div>

      {/* 賞味期限タイムライン */}
      {expiryItems.length > 0 && (
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            <span>📅</span> 賞味期限タイムライン
          </h2>
          <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            {expiryItems.map((item, idx) => {
              const days = getDaysUntilExpiry(item.expiryDate)!;
              const status = getExpiryStatus(item.expiryDate, item.alertDays);
              const barColor =
                status === "expired"
                  ? "#FF4757"
                  : status === "today"
                    ? "#FF6B4A"
                    : status === "warning"
                      ? "#FBBF24"
                      : "#4A9FFF";
              const maxDays = 30;
              const barWidth = Math.max(
                5,
                Math.min(100, ((maxDays - Math.min(days, maxDays)) / maxDays) * 100)
              );
              const cat = CATEGORY_MAP[item.category];

              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    idx < expiryItems.length - 1 ? "border-b border-zinc-200/60 dark:border-zinc-800/60" : ""
                  }`}
                >
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm"
                    style={{ backgroundColor: `${barColor}15` }}
                  >
                    {cat?.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {item.name}
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%`, backgroundColor: barColor }}
                      />
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-sm font-bold" style={{ color: barColor }}>
                      {days < 0
                        ? `${Math.abs(days)}日超過`
                        : days === 0
                          ? "今日"
                          : `${days}日`}
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {item.expiryDate}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* カテゴリ別 */}
      {categoryStats.length > 0 && (
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            <span>📊</span> カテゴリ別
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {categoryStats.map((cat) => (
              <Link
                key={cat.id}
                href={`/items?category=${cat.id}`}
                className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/30 p-3 transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-800/60"
              >
                <span className="text-xl">{cat.emoji}</span>
                <div>
                  <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
                    {cat.label}
                  </div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: cat.color }}
                  >
                    {cat.count}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 保管場所別 */}
      {locationCounts.length > 0 && (
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            <span>🏠</span> 保管場所
          </h2>
          <div className="flex flex-wrap gap-2">
            {locationCounts.map((loc) => (
              <div
                key={loc.id}
                className="flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/30 px-3 py-1.5 text-xs"
              >
                <span>{loc.emoji}</span>
                <span className="text-zinc-500 dark:text-zinc-400">{loc.label}</span>
                <span className="font-bold text-blue-400">{loc.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
