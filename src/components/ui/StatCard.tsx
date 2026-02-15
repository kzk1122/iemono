interface StatCardProps {
  label: string;
  value: number;
  emoji: string;
  color?: string;
}

export default function StatCard({
  label,
  value,
  emoji,
  color = "text-zinc-900 dark:text-zinc-100",
}: StatCardProps) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-zinc-100 dark:bg-zinc-800/60 p-4">
      <span className="text-2xl">{emoji}</span>
      <span className={`mt-1 text-2xl font-bold ${color}`}>{value}</span>
      <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
    </div>
  );
}
