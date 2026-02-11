"use client";

interface FilterChipProps {
  label: string;
  emoji?: string;
  active: boolean;
  onClick: () => void;
}

export default function FilterChip({
  label,
  emoji,
  active,
  onClick,
}: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
        active
          ? "bg-emerald-600 text-white"
          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
      }`}
    >
      {emoji && <span>{emoji}</span>}
      {label}
    </button>
  );
}
