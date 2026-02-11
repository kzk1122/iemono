"use client";

import Link from "next/link";
import { Item, ExpiryStatus } from "@/types";
import { LOCATION_MAP } from "@/lib/constants";
import { getExpiryStatus, getDaysUntilExpiry, formatExpiryLabel } from "@/lib/expiry";

interface ItemCardProps {
  item: Item;
  warningDays: number;
  onDelete: (id: string) => void;
}

const statusStyles: Record<ExpiryStatus, string> = {
  expired: "border-red-500/50 bg-red-500/5",
  warning: "border-yellow-500/50 bg-yellow-500/5",
  ok: "border-zinc-700 bg-zinc-800/60",
  none: "border-zinc-700 bg-zinc-800/60",
};

const badgeStyles: Record<ExpiryStatus, string> = {
  expired: "bg-red-500/20 text-red-400",
  warning: "bg-yellow-500/20 text-yellow-400",
  ok: "bg-emerald-500/20 text-emerald-400",
  none: "",
};

export default function ItemCard({ item, warningDays, onDelete }: ItemCardProps) {
  const status = getExpiryStatus(item.expiryDate, warningDays);
  const days = getDaysUntilExpiry(item.expiryDate);
  const location = LOCATION_MAP[item.location];

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${statusStyles[status]}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-zinc-100">
            {item.name}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
            {location && (
              <span>
                {location.emoji} {location.label}
              </span>
            )}
            <span>x{item.quantity}</span>
            {item.expiryDate && (
              <span>
                📅 {item.expiryDate.replace(/-/g, "/")}
              </span>
            )}
          </div>
          {item.memo && (
            <p className="mt-1 truncate text-xs text-zinc-500">{item.memo}</p>
          )}
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
              href={`/items/${item.id}/edit`}
              className="rounded-lg bg-zinc-700 px-2.5 py-1 text-xs text-zinc-300 hover:bg-zinc-600"
            >
              編集
            </Link>
            <button
              onClick={() => onDelete(item.id)}
              className="rounded-lg bg-zinc-700 px-2.5 py-1 text-xs text-red-400 hover:bg-red-500/20"
            >
              削除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
