"use client";

import ItemForm from "@/components/ItemForm";
import { useItems } from "@/hooks/useItems";

export default function NewItemPage() {
  const { addItem } = useItems();

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">➕ 食品を追加</h1>
      <ItemForm onSubmit={addItem} />
    </div>
  );
}
