"use client";

import { useState, useRef, useEffect } from "react";

interface CalendarPickerProps {
  value: string; // "YYYY-MM-DD" or ""
  onChange: (value: string) => void;
}

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(year: number, month: number, day: number) {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function parseDate(value: string) {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  return { year: y, month: m - 1, day: d };
}

export default function CalendarPicker({ value, onChange }: CalendarPickerProps) {
  const parsed = parseDate(value);
  const today = new Date();
  const [viewYear, setViewYear] = useState(parsed?.year ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.month ?? today.getMonth());
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 外側クリックで閉じる
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const selectDay = (day: number) => {
    onChange(formatDate(viewYear, viewMonth, day));
    setOpen(false);
  };

  const clear = () => {
    onChange("");
    setOpen(false);
  };

  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());

  const displayValue = value
    ? `${parsed!.year}年${parsed!.month + 1}月${parsed!.day}日`
    : "";

  return (
    <div ref={ref} className="relative">
      {/* トリガー */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg border border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 px-3 py-2.5 text-sm text-left outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
      >
        <span className={value ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-500"}>
          {value ? `📅 ${displayValue}` : "日付を選択..."}
        </span>
        <span className="text-zinc-400 dark:text-zinc-500">▼</span>
      </button>

      {/* カレンダー本体 */}
      {open && (
        <div className="absolute left-0 right-0 z-50 mt-1 rounded-xl border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 p-3 shadow-xl">
          {/* ヘッダー: 月移動 */}
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              ◀
            </button>
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              {viewYear}年 {viewMonth + 1}月
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              ▶
            </button>
          </div>

          {/* 曜日ヘッダー */}
          <div className="mb-1 grid grid-cols-7 text-center text-xs text-zinc-400 dark:text-zinc-500">
            {WEEKDAYS.map((d) => (
              <span key={d} className="py-1">
                {d}
              </span>
            ))}
          </div>

          {/* 日付グリッド */}
          <div className="grid grid-cols-7 gap-0.5">
            {/* 空白セル */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <span key={`blank-${i}`} />
            ))}
            {/* 日付 */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = formatDate(viewYear, viewMonth, day);
              const isSelected = dateStr === value;
              const isToday = dateStr === todayStr;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={`flex h-8 w-full items-center justify-center rounded-lg text-sm transition-colors ${
                    isSelected
                      ? "bg-emerald-600 font-semibold text-white"
                      : isToday
                        ? "bg-zinc-200 dark:bg-zinc-700 font-semibold text-emerald-400"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* フッター */}
          <div className="mt-2 flex justify-between border-t border-zinc-200 dark:border-zinc-700 pt-2">
            <button
              type="button"
              onClick={() => {
                setViewYear(today.getFullYear());
                setViewMonth(today.getMonth());
                selectDay(today.getDate());
              }}
              className="rounded-lg px-3 py-1 text-xs text-emerald-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              今日
            </button>
            {value && (
              <button
                type="button"
                onClick={clear}
                className="rounded-lg px-3 py-1 text-xs text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              >
                クリア
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
