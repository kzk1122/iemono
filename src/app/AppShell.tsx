"use client";

import BottomNav from "@/components/BottomNav";
import NotificationBanner from "@/components/NotificationBanner";
import { useItems } from "@/hooks/useItems";
import { useSettings } from "@/hooks/useSettings";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { items } = useItems();
  const { settings } = useSettings();

  return (
    <>
      <NotificationBanner
        items={items}
        warningDays={settings.notificationDays}
        enabled={settings.notificationsEnabled}
      />
      <main className="mx-auto max-w-md px-4 pb-24 pt-4">{children}</main>
      <BottomNav />
    </>
  );
}
