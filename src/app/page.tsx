"use client";

import Dashboard from "@/components/Dashboard";
import { useItems } from "@/hooks/useItems";
import { useSettings } from "@/hooks/useSettings";

export default function HomePage() {
  const { items, loaded } = useItems();
  const { settings } = useSettings();

  if (!loaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="text-zinc-500">読み込み中...</span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">🏠 ホーム</h1>
      <Dashboard items={items} warningDays={settings.notificationDays} />
    </div>
  );
}
