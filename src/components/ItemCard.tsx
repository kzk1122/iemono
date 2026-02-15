"use client";

import Link from "next/link";
import { Item, ExpiryStatus } from "@/types";
import { CATEGORY_MAP, LOCATION_MAP } from "@/lib/constants";
import { getExpiryStatus, getDaysUntilExpiry, formatExpiryLabel } from "@/lib/expiry";

interface ItemCardProps {
  item: Item;
  onDelete: (id: string) => void;
}

const statusStyles: Record<ExpiryStatus, string> = {
  expired: "border-red-500/50 bg-red-500/5",
  today: "border-orange-500/50 bg-orange-500/5",
  warning: "border-yellow-500/50 bg-yellow-500/5",
  ok: "border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/60",
  none: "border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/60",
};

const badgeStyles: Record<ExpiryStatus, string> = {
  expired: "bg-red-500/20 text-red-400",
  today: "bg-orange-500/20 text-orange-400",
  warning: "bg-yellow-500/20 text-yellow-400",
  ok: "bg-emerald-500/20 text-emerald-400",
  none: "",
};

export default function ItemCard({ item, onDelete }: ItemCardProps) {
  const status = getExpiryStatus(item.expiryDate, item.alertDays);
  const days = getDaysUntilExpiry(item.expiryDate);
  const category = CATEGORY_MAP[item.category];
  const location = LOCATION_MAP[item.location];

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${statusStyles[status]}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {/* カテゴリアイコン */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-200/50 dark:bg-zinc-700/50 text-xl">
            {category?.emoji ?? "📦"}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {item.name}
              </h3>
              <span className="shrink-0 text-xs text-zinc-500">
                x{item.quantity}{item.unit}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              {category && (
                <span
                  className="rounded px-1.5 py-0.5"
                  style={{
                    backgroundColor: `${category.color}15`,
                    color: category.color,
                  }}
                >
                  {category.label}
                </span>
              )}
              {location && (
                <span className="text-zinc-500 dark:text-zinc-400">
                  {location.emoji} {location.label}
                </span>
              )}
              {item.expiryDate && (
                <span className="text-zinc-500 dark:text-zinc-400">
                  📅 {item.expiryDate.replace(/-/g, "/")}
                </span>
              )}
            </div>
            {item.memo && (
              <p className="mt-1 truncate text-xs text-zinc-500">{item.memo}</p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          {status !== "none" && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeStyles[status]}`}
            >
              {formatExpiryLabel(days)}
            </span>
          )}
          <div className="flex gap-1">
            <Link
              href={`/items/edit?id=${item.id}`}
              className="rounded-lg bg-zinc-200 dark:bg-zinc-700 px-2.5 py-1 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600"
            >
              編集
            </Link>
            <button
              onClick={() => onDelete(item.id)}
              className="rounded-lg bg-zinc-200 dark:bg-zinc-700 px-2.5 py-1 text-xs text-red-400 hover:bg-red-500/20"
            >
              削除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
