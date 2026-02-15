"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Item } from "@/types";
import {
  CATEGORIES,
  STORAGE_LOCATIONS,
  ALERT_DAYS_OPTIONS,
  EXPIRY_CATEGORIES,
} from "@/lib/constants";
import CalendarPicker from "@/components/ui/CalendarPicker";

interface ItemFormProps {
  initialData?: Item;
  onSubmit: (data: {
    name: string;
    category: string;
    location: string;
    quantity: number;
    unit: string;
    expiryDate: string;
    alertDays: number;
    memo: string;
  }) => void;
}

export default function ItemForm({ initialData, onSubmit }: ItemFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "food");
  const [location, setLocation] = useState(
    initialData?.location ?? STORAGE_LOCATIONS[0].id
  );
  const [quantity, setQuantity] = useState(initialData?.quantity ?? 1);
  const [unit, setUnit] = useState(initialData?.unit ?? "個");
  const [expiryDate, setExpiryDate] = useState(initialData?.expiryDate ?? "");
  const [alertDays, setAlertDays] = useState(initialData?.alertDays ?? 3);
  const [memo, setMemo] = useState(initialData?.memo ?? "");

  const showExpiry = (EXPIRY_CATEGORIES as readonly string[]).includes(category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      category,
      location,
      quantity,
      unit: unit.trim() || "個",
      expiryDate: showExpiry ? expiryDate : "",
      alertDays,
      memo: memo.trim(),
    });
    router.push("/items");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* アイテム名 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          アイテム名 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例: 牛乳"
          required
          className="w-full rounded-lg border border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      {/* カテゴリ */}
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          カテゴリ
        </label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`rounded-xl border px-2 py-2.5 text-center text-xs transition-colors ${
                category === cat.id
                  ? "border-current font-semibold"
                  : "border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
              style={
                category === cat.id
                  ? { color: cat.color, backgroundColor: `${cat.color}15`, borderColor: `${cat.color}40` }
                  : undefined
              }
            >
              <div className="mb-0.5 text-lg">{cat.emoji}</div>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 保管場所 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          保管場所
        </label>
        <div className="grid grid-cols-2 gap-2">
          {STORAGE_LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              type="button"
              onClick={() => setLocation(loc.id)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                location === loc.id
                  ? "border-emerald-500/40 bg-emerald-500/10 font-semibold text-emerald-400"
                  : "border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              <span className="text-base">{loc.emoji}</span> {loc.label}
            </button>
          ))}
        </div>
      </div>

      {/* 数量・単位 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            数量
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-700 text-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600"
            >
              -
            </button>
            <span className="min-w-[2rem] text-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-700 text-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600"
            >
              +
            </button>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            単位
          </label>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="個, 本, 袋..."
            className="w-full rounded-lg border border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* 賞味期限 (食品・薬のみ) */}
      {showExpiry && (
        <>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              賞味期限
            </label>
            <CalendarPicker value={expiryDate} onChange={setExpiryDate} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              通知タイミング（期限の何日前）
            </label>
            <div className="flex flex-wrap gap-2">
              {ALERT_DAYS_OPTIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setAlertDays(d)}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    alertDays === d
                      ? "border-emerald-500/40 bg-emerald-500/10 font-semibold text-emerald-400"
                      : "border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {d}日前
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* メモ */}
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          メモ
        </label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={2}
          placeholder="自由にメモを入力"
          className="w-full rounded-lg border border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 px-3 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      {/* ボタン */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
        >
          {initialData ? "更新する" : "追加する"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg bg-zinc-200 dark:bg-zinc-700 px-5 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
