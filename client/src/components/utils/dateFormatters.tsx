// ======================
// date-utils.ts
// ======================

import i18next, { t } from "i18next";
import { addDays } from "date-fns";

/* ---------- helpers ---------- */
export const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const startOfWeek = (d: Date) => {
  const date = startOfDay(d);
  const day = date.getDay() || 7; // Mon=1 ... Sun=7
  date.setDate(date.getDate() - day + 1);
  return date;
};

/* ---------- label formatter ---------- */

export const formatDateLabel = (
  dateInput: string | Date | null,
  t: any
): string => {
  if (!dateInput) return "";

  const now = startOfDay(new Date());
  const target = startOfDay(new Date(dateInput));

  // Разница в днях
  const diffDays = Math.round(
    (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  // 1. Сначала проверяем конкретные именованные дни
  if (diffDays === 0) return t("today");
  if (diffDays === 1) return t("tomorrow");
  if (diffDays === -1) return t("yesterday");

  // 2. Если дата ПРОШЛАЯ (старее вчера), сразу возвращаем цифры
  if (diffDays < -1) {
    return target.toLocaleDateString(i18next.language, {
      day: "numeric",
      month: "short",
      ...(now.getFullYear() === target.getFullYear()
        ? {}
        : { year: "numeric" }),
    });
  }

  // 3. Для БУДУЩИХ дат на этой неделе оставляем название дня
  const thisWeekStart = startOfWeek(now);
  const nextWeekStart = addDays(thisWeekStart, 7);

  if (target >= thisWeekStart && target < nextWeekStart) {
    const dayName = target
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    return t(dayName);
  }

  if (diffDays === 7) return t("next_week");

  // Остальное (далекое будущее)
  return target.toLocaleDateString(i18next.language, {
    day: "numeric",
    month: "short",
    ...(now.getFullYear() === target.getFullYear() ? {} : { year: "numeric" }),
  });
};

/* ---------- colors & icons ---------- */
export type DateMeta = {
  color: string;
  icon: string;
};

type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export const WEEKDAY_COLORS: Record<Weekday, string> = {
  Monday: "rgb(3, 169, 244)", // sky blue
  Tuesday: "rgb(0, 188, 212)", // cyan
  Wednesday: "rgb(0, 150, 136)", // teal
  Thursday: "rgb(33, 150, 243)", // blue
  Friday: "rgb(63, 81, 181)", // indigo
  Saturday: "rgb(121, 134, 203)", // soft indigo
  Sunday: "rgb(144, 164, 174)", // blue-grey
};

type SpecialLabel =
  | "Today"
  | "Tomorrow"
  | "Yesterday"
  | "Weekend"
  | "Next week";

export const SPECIAL_COLORS: Record<SpecialLabel, DateMeta> = {
  Today: {
    color: "rgb(0, 200, 83)", // green
    icon: "icon-calendar-_2",
  },
  Tomorrow: {
    color: "rgb(255, 171, 0)", // amber
    icon: "icon-calendar-_5",
  },
  Yesterday: {
    color: "rgb(229, 57, 53)", // red
    icon: "icon-yesterday",
  },
  Weekend: {
    color: "rgba(44, 53, 183, 1)", // purple
    icon: "icon-calendar-_4",
  },

  "Next week": {
    color: "rgba(148, 86, 255, 1)", // purple
    icon: "icon-calendar-_3",
  },
};

const DEFAULT_META: DateMeta = {
  color: "currentColor",
  icon: "icon-calendar-_1",
};

/* ---------- meta resolver ---------- */
export const dateColor = (
  label: string,
  dateInput?: string | Date | null
): DateMeta => {
  // 1. Если есть дата, проверяем на реальную просрочку
  if (dateInput) {
    const now = startOfDay(new Date());
    const target = startOfDay(new Date(dateInput));

    if (target < now) {
      return SPECIAL_COLORS["Yesterday"]; // Красный для всего, что было до сегодня
    }
  }

  // 2. Если даты нет, работаем по старым добрым лейблам (для будущего)
  if (label === t("today")) return SPECIAL_COLORS["Today"];
  if (label === t("tomorrow")) return SPECIAL_COLORS["Tomorrow"];
  if (label === t("next_week")) return SPECIAL_COLORS["Next week"];

  const isWeekend = label === t("saturday") || label === t("sunday");
  if (isWeekend) return SPECIAL_COLORS["Weekend"];

  // 3. Поиск по дням недели (для будущего)
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const foundDay = days.find((d) => t(d) === label);

  if (foundDay) {
    const englishKey = foundDay.charAt(0).toUpperCase() + foundDay.slice(1);
    return {
      color: WEEKDAY_COLORS[englishKey as Weekday],
      icon: "icon-calendar-_3",
    };
  }

  return DEFAULT_META;
};
/* ---------- full date formatter ---------- */
export const formatFullDate = (dateInput: string | Date): string => {
  const date = new Date(dateInput);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  if (isToday) return `Today at ${timeStr}`;

  return date.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
