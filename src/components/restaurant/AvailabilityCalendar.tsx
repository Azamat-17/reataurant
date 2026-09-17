"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDownIcon } from "@/components/ui/icons";

interface Props {
  restaurantId: string;
  selectedDate: string | undefined; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
}

interface MonthData {
  capacity: number | null;
  days: Record<string, { booked: boolean }>;
}

const WEEKDAYS_RU = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const WEEKDAYS_KY = ["Дш", "Шш", "Шр", "Бш", "Жм", "Иш", "Жк"];

function toMonthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function AvailabilityCalendar({ restaurantId, selectedDate, onSelectDate }: Props) {
  const locale = useLocale();
  const t = useTranslations("reservation");
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [monthData, setMonthData] = useState<MonthData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/restaurants/${restaurantId}/availability-month?month=${toMonthKey(cursor)}`);
        const data = res.ok ? await res.json() : null;
        if (!cancelled) setMonthData(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [restaurantId, cursor]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
  const todayKey = toDateKey(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  const monthLabel = cursor.toLocaleDateString(locale === "ky" ? "ru-RU" : "ru-RU", {
    month: "long",
    year: "numeric",
  });

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const weekdays = locale === "ky" ? WEEKDAYS_KY : WEEKDAYS_RU;

  return (
    <div className="rounded-xl border border-border p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold capitalize text-foreground">{monthLabel}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="Предыдущий месяц"
          >
            <ChevronDownIcon className="h-3.5 w-3.5 rotate-90" />
          </button>
          <button
            type="button"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="Следующий месяц"
          >
            <ChevronDownIcon className="h-3.5 w-3.5 -rotate-90" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted">
        {weekdays.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day == null) return <div key={`blank-${i}`} />;

          const dateKey = toDateKey(year, month, day);
          const isPast = dateKey < todayKey;
          const dayInfo = monthData?.days[String(day)];
          const isBooked = dayInfo?.booked ?? false;
          const isSelected = dateKey === selectedDate;

          return (
            <button
              key={dateKey}
              type="button"
              disabled={isPast || isBooked}
              onClick={() => onSelectDate(dateKey)}
              title={dayInfo ? (isBooked ? t("dateBooked") : t("dateFree")) : undefined}
              className={`flex h-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                isPast
                  ? "cursor-not-allowed text-gray-300"
                  : isSelected
                    ? "bg-brand text-white"
                    : isBooked
                      ? "cursor-not-allowed bg-gray-200 text-gray-500"
                      : "bg-accent-green/15 text-accent-green-dark hover:bg-accent-green/25"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {loading && <p className="mt-2 text-[11px] text-muted">{t("checkingAvailability")}</p>}

      <div className="mt-2 flex items-center gap-3 text-[11px] text-muted">
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-accent-green/40" /> {t("legendFree")}
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" /> {t("legendFull")}
        </span>
      </div>
    </div>
  );
}
