"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Item } from "@/types";
import { STORAGE_LOCATIONS } from "@/lib/constants";
import CalendarPicker from "@/components/ui/CalendarPicker";

interface ItemFormProps {
  initialData?: Item;
  onSubmit: (data: {
    name: string;
    quantity: number;
    location: string;
    expiryDate: string;
    memo: string;
  }) => void;
}

export default function ItemForm({ initialData, onSubmit }: ItemFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name ?? "");
  const [quantity, setQuantity] = useState(initialData?.quantity ?? 1);
  const [location, setLocation] = useState(
    initialData?.location ?? STORAGE_LOCATIONS[0].id
  );
  const [expiryDate, setExpiryDate] = useState(initialData?.expiryDate ?? "");
  const [memo, setMemo] = useState(initialData?.memo ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), quantity, location, expiryDate, memo: memo.trim() });
    router.push("/items");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 名前 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">
          食品名 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例: 牛乳"
          required
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      {/* 数量 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">
          数量
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-700 text-lg text-zinc-300 hover:bg-zinc-600"
          >
            -
          </button>
          <span className="min-w-[2rem] text-center text-lg font-semibold text-zinc-100">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-700 text-lg text-zinc-300 hover:bg-zinc-600"
          >
            +
          </button>
        </div>
      </div>

      {/* 保管場所 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">
          保管場所
        </label>
        <div className="flex flex-wrap gap-2">
          {STORAGE_LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              type="button"
              onClick={() => setLocation(loc.id)}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                location === loc.id
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {loc.emoji} {loc.label}
            </button>
          ))}
        </div>
      </div>

      {/* 賞味期限 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">
          賞味期限
        </label>
        <CalendarPicker value={expiryDate} onChange={setExpiryDate} />
      </div>

      {/* メモ */}
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">
          メモ
        </label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={2}
          placeholder="自由にメモを入力"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
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
          className="rounded-lg bg-zinc-700 px-5 py-2.5 text-sm text-zinc-300 hover:bg-zinc-600 transition-colors"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
}
