"use client";

import { useState, useEffect, useCallback } from "react";
import { Settings } from "@/types";
import { DEFAULT_SETTINGS, STORAGE_KEYS } from "@/lib/constants";

const SETTINGS_CHANGE_EVENT = "iemono-settings-change";

function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    setLoaded(true);
  }, []);

  // 他のフックインスタンスからの変更を検知して同期
  useEffect(() => {
    const handleChange = () => {
      setSettings(loadSettings());
    };
    window.addEventListener(SETTINGS_CHANGE_EVENT, handleChange);
    return () => window.removeEventListener(SETTINGS_CHANGE_EVENT, handleChange);
  }, []);

  const updateSettings = useCallback((data: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...data };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(next));
      queueMicrotask(() => {
        window.dispatchEvent(new CustomEvent(SETTINGS_CHANGE_EVENT));
      });
      return next;
    });
  }, []);

  return { settings, loaded, updateSettings };
}
