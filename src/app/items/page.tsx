"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useItems } from "@/hooks/useItems";
import { useSettings } from "@/hooks/useSettings";
import { CATEGORIES, STORAGE_LOCATIONS } from "@/lib/constants";
import { getExpiryStatus } from "@/lib/expiry";
import ItemCard from "@/components/ItemCard";
import FilterChip from "@/components/ui/FilterChip";

type SortKey = "expiry" | "name" | "category" | "newest";

export default function ItemsPage() {
  return (
    <Suspense>
      <ItemsPageContent />
    </Suspense>
  );
}

function ItemsPageContent() {
  const { items, loaded, deleteItem } = useItems();
  const { settings } = useSettings();
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get("category") ?? "all";
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("expiry");
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = useMemo(() => {
    let result = [...items];

    // 期限切れ非表示
    if (!settings.showExpired) {
      result = result.filter(
        (i) => getExpiryStatus(i.expiryDate, i.alertDays) !== "expired"
      );
    }

    // フィルタ
    if (categoryFilter !== "all") {
      result = result.filter((i) => i.category === categoryFilter);
    }
    if (locationFilter !== "all") {
      result = result.filter((i) => i.location === locationFilter);
    }
    if (searchQuery) {
      result = result.filter((i) =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // ソート
    result.sort((a, b) => {
      if (sortBy === "expiry") {
        if (!a.expiryDate && !b.expiryDate) return 0;
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      }
      if (sortBy === "name") return a.name.localeCompare(b.name, "ja");
      if (sortBy === "category") return a.category.localeCompare(b.category);
      if (sortBy === "newest")
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

    return result;
  }, [items, categoryFilter, locationFilter, searchQuery, sortBy, settings.showExpired]);

  if (!loaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="text-zinc-500">読み込み中...</span>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    if (window.confirm("このアイテムを削除しますか？")) {
      deleteItem(id);
    }
  };

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">📋 アイテム一覧</h1>

      {/* 検索 */}
      <div className="relative mb-3">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40">
          🔍
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="アイテムを検索..."
          className="w-full rounded-lg border border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 py-2 pl-9 pr-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none focus:border-emerald-500"
        />
      </div>

      {/* フィルタトグル */}
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
            showFilters
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400"
          }`}
        >
          🎛️ フィルタ {showFilters ? "▲" : "▼"}
        </button>
        <span className="text-xs text-zinc-500">{filteredItems.length}件</span>
      </div>

      {/* フィルタパネル */}
      {showFilters && (
        <div className="mb-4 space-y-3 rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/30 p-4">
          {/* カテゴリ */}
          <div>
            <label className="mb-2 block text-xs text-zinc-500">カテゴリ</label>
            <div className="flex flex-wrap gap-1.5">
              <FilterChip
                label="すべて"
                active={categoryFilter === "all"}
                onClick={() => setCategoryFilter("all")}
              />
              {CATEGORIES.map((cat) => (
                <FilterChip
                  key={cat.id}
                  label={cat.label}
                  emoji={cat.emoji}
                  active={categoryFilter === cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                />
              ))}
            </div>
          </div>

          {/* 保管場所 */}
          <div>
            <label className="mb-2 block text-xs text-zinc-500">保管場所</label>
            <div className="flex flex-wrap gap-1.5">
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
          </div>

          {/* 並び替え */}
          <div>
            <label className="mb-2 block text-xs text-zinc-500">並び替え</label>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: "expiry", label: "期限順" },
                  { id: "name", label: "名前順" },
                  { id: "category", label: "カテゴリ順" },
                  { id: "newest", label: "新しい順" },
                ] as const
              ).map((s) => (
                <FilterChip
                  key={s.id}
                  label={s.label}
                  active={sortBy === s.id}
                  onClick={() => setSortBy(s.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* アイテムリスト */}
      {filteredItems.length === 0 ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center text-zinc-500">
          <span className="mb-2 text-4xl">🔍</span>
          <p className="text-sm">アイテムが見つかりません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
