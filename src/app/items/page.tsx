"use client";

import { useState } from "react";
import { useItems } from "@/hooks/useItems";
import { useSettings } from "@/hooks/useSettings";
import { STORAGE_LOCATIONS } from "@/lib/constants";
import ItemCard from "@/components/ItemCard";
import FilterChip from "@/components/ui/FilterChip";

export default function ItemsPage() {
  const { items, loaded, deleteItem } = useItems();
  const { settings } = useSettings();
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!loaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="text-zinc-500">読み込み中...</span>
      </div>
    );
  }

  const filteredItems = items.filter((item) => {
    const matchesLocation =
      locationFilter === "all" || item.location === locationFilter;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLocation && matchesSearch;
  });

  const handleDelete = (id: string) => {
    if (window.confirm("このアイテムを削除しますか？")) {
      deleteItem(id);
    }
  };

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">📋 食品一覧</h1>

      {/* 検索 */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="食品名で検索..."
        className="mb-3 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-emerald-500"
      />

      {/* フィルター */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        <FilterChip
          label="すべて"
          active={locationFilter === "all"}
          onClick={() => setLocationFilter("all")}
        />
        {STORAGE_LOCATIONS.map((loc) => (
          <FilterChip
            key={loc.id}
            label={loc.label}
            emoji={loc.emoji}
            active={locationFilter === loc.id}
            onClick={() => setLocationFilter(loc.id)}
          />
        ))}
      </div>

      {/* アイテムリスト */}
      {filteredItems.length === 0 ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center text-zinc-500">
          <span className="mb-2 text-4xl">🍽️</span>
          <p className="text-sm">食品がありません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              warningDays={settings.notificationDays}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
