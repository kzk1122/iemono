"use client";

import Dashboard from "@/components/Dashboard";
import { useItems } from "@/hooks/useItems";

export default function HomePage() {
  const { items, loaded } = useItems();

  if (!loaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="text-zinc-500">読み込み中...</span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2 text-xl font-bold">🏠 Iemono おうちにあるもの管理</h1>
      <Dashboard items={items} />
    </div>
  );
}
