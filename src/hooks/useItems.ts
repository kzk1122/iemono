"use client";

import { useState, useEffect, useCallback } from "react";
import { Item } from "@/types";
import { STORAGE_KEYS } from "@/lib/constants";

function loadItems(): Item[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ITEMS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveItems(items: Item[]) {
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
}

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(loadItems());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      saveItems(items);
    }
  }, [items, loaded]);

  const addItem = useCallback(
    (data: Omit<Item, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const newItem: Item = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      setItems((prev) => [newItem, ...prev]);
      return newItem;
    },
    []
  );

  const updateItem = useCallback(
    (id: string, data: Partial<Omit<Item, "id" | "createdAt">>) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, ...data, updatedAt: new Date().toISOString() }
            : item
        )
      );
    },
    []
  );

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const getItem = useCallback(
    (id: string) => {
      return items.find((item) => item.id === id) ?? null;
    },
    [items]
  );

  return { items, loaded, addItem, updateItem, deleteItem, getItem };
}
