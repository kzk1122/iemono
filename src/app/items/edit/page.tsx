"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ItemForm from "@/components/ItemForm";
import { useItems } from "@/hooks/useItems";

function EditItemContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { getItem, updateItem, loaded } = useItems();
  const router = useRouter();

  if (!loaded) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="text-zinc-500">読み込み中...</span>
      </div>
    );
  }

  const item = id ? getItem(id) : null;

  if (!item) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-zinc-500">
        <span className="mb-2 text-4xl">❓</span>
        <p className="text-sm">アイテムが見つかりません</p>
        <button
          onClick={() => router.push("/items")}
          className="mt-3 rounded-lg bg-zinc-200 dark:bg-zinc-700 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600"
        >
          一覧に戻る
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">✏️ アイテムを編集</h1>
      <ItemForm
        initialData={item}
        onSubmit={(data) => {
          updateItem(id!, data);
        }}
      />
    </div>
  );
}

export default function EditItemPage() {
  return (
    <Suspense>
      <EditItemContent />
    </Suspense>
  );
}
