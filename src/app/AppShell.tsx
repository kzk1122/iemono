"use client";

import { useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import NotificationBanner from "@/components/NotificationBanner";
import { useItems } from "@/hooks/useItems";
import { useSettings } from "@/hooks/useSettings";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { items } = useItems();
  const { settings } = useSettings();

  useEffect(() => {
    const root = document.documentElement;

    if (settings.theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const apply = (e: MediaQueryList | MediaQueryListEvent) => {
        root.classList.toggle("dark", e.matches);
      };
      apply(mq);
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }

    root.classList.toggle("dark", settings.theme === "dark");
  }, [settings.theme]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col border-x border-zinc-300 bg-zinc-50 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-zinc-950/50">
      <NotificationBanner
        items={items}
        enabled={settings.notificationsEnabled}
      />
      <main className="flex-1 px-4 pb-24 pt-4">{children}</main>
      <BottomNav />
    </div>
  );
}
