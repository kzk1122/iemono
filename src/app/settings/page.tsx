"use client";

import { useSettings } from "@/hooks/useSettings";
import { useItems } from "@/hooks/useItems";
import { ALERT_DAYS_OPTIONS } from "@/lib/constants";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { Settings } from "@/types";

const THEME_OPTIONS: { value: Settings["theme"]; label: string; icon: string }[] = [
  { value: "light", label: "ライト", icon: "☀️" },
  { value: "dark", label: "ダーク", icon: "🌙" },
  { value: "system", label: "システム", icon: "💻" },
];

export default function SettingsPage() {
  const { settings, loaded, updateSettings } = useSettings();
  const { items } = useItems();

  if (!loaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="text-zinc-500">読み込み中...</span>
      </div>
    );
  }

  const handleClearData = () => {
    if (
      window.confirm(
        "すべてのデータを削除しますか？この操作は取り消せません。"
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">⚙️ 設定</h1>

      <div className="space-y-6">
        {/* テーマ設定 */}
        <section className="rounded-xl bg-zinc-100 dark:bg-zinc-800/60 p-4">
          <h2 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            テーマ
          </h2>
          <div className="flex gap-2">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateSettings({ theme: opt.value })}
                className={`flex flex-1 flex-col items-center gap-1 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                  settings.theme === opt.value
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                }`}
              >
                <span className="text-lg">{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 通知設定 */}
        <section className="rounded-xl bg-zinc-100 dark:bg-zinc-800/60 p-4">
          <h2 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            通知設定
          </h2>
          <div className="space-y-4">
            <ToggleSwitch
              label="賞味期限の通知"
              checked={settings.notificationsEnabled}
              onChange={(checked) =>
                updateSettings({ notificationsEnabled: checked })
              }
            />
            <div>
              <label className="mb-1 block text-sm text-zinc-700 dark:text-zinc-300">
                デフォルト通知日数
              </label>
              <select
                value={settings.defaultAlertDays}
                onChange={(e) =>
                  updateSettings({
                    defaultAlertDays: Number(e.target.value),
                  })
                }
                className="rounded-lg border border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-emerald-500"
              >
                {ALERT_DAYS_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}日前
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* 表示設定 */}
        <section className="rounded-xl bg-zinc-100 dark:bg-zinc-800/60 p-4">
          <h2 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            表示設定
          </h2>
          <ToggleSwitch
            label="期限切れアイテムを表示"
            checked={settings.showExpired}
            onChange={(checked) =>
              updateSettings({ showExpired: checked })
            }
          />
        </section>

        {/* データ */}
        <section className="rounded-xl bg-zinc-100 dark:bg-zinc-800/60 p-4">
          <h2 className="mb-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400">データ</h2>
          <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
            登録アイテム数: {items.length}件
          </p>
          <button
            onClick={handleClearData}
            className="rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/30 transition-colors"
          >
            すべてのデータを削除
          </button>
        </section>

        {/* アプリ情報 */}
        <section className="rounded-xl bg-zinc-100 dark:bg-zinc-800/60 p-4">
          <h2 className="mb-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            アプリ情報
          </h2>
          <p className="text-sm text-zinc-500">Iemono v1.0.0</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-600">おうちにあるもの管理</p>
        </section>
      </div>
    </div>
  );
}
