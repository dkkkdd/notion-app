import i18next from "i18next";
import type { TFunction } from "i18next";
import { addDays } from "date-fns";
import { nextSaturday, format } from "date-fns";

export const FILTER_OPTIONS = [
  {
    icon: "icon-list",
    value: "all",
    label: i18next.t("show_all_tasks"),
    color: "#4270d1",
  },
  {
    icon: "icon-list2",
    value: "active",
    label: i18next.t("show_active_tasks"),
    color: "#9d174d",
  },
];

export const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const startOfWeek = (d: Date) => {
  const date = startOfDay(d);
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return date;
};

export const formatDateLabel = (
  dateInput: string | Date | null,
  t: TFunction,
): string => {
  if (!dateInput) return "";

  const now = startOfDay(new Date());
  const target = startOfDay(new Date(dateInput));

  const diffDays = Math.round(
    (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return t("today");
  if (diffDays === 1) return t("tomorrow");
  if (diffDays === -1) return t("yesterday");

  if (diffDays < -1) {
    return target.toLocaleDateString(i18next.language, {
      day: "numeric",
      month: "short",
      ...(now.getFullYear() === target.getFullYear()
        ? {}
        : { year: "numeric" }),
    });
  }

  const thisWeekStart = startOfWeek(now);
  const nextWeekStart = addDays(thisWeekStart, 7);

  if (target >= thisWeekStart && target < nextWeekStart) {
    const dayName = target
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    return t(dayName);
  }

  if (diffDays === 7) return t("next_week");

  return target.toLocaleDateString(i18next.language, {
    day: "numeric",
    month: "short",
    ...(now.getFullYear() === target.getFullYear() ? {} : { year: "numeric" }),
  });
};

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
  Monday: "rgb(3, 169, 244)",
  Tuesday: "rgb(0, 188, 212)",
  Wednesday: "rgb(0, 150, 136)",
  Thursday: "rgb(33, 150, 243)",
  Friday: "rgb(63, 81, 181)",
  Saturday: "rgb(121, 134, 203)",
  Sunday: "rgb(144, 164, 174)",
};

type SpecialLabel =
  | "Today"
  | "Tomorrow"
  | "Yesterday"
  | "Weekend"
  | "Next week";

export const SPECIAL_COLORS: Record<SpecialLabel, DateMeta> = {
  Today: {
    color: "rgb(0, 200, 83)",
    icon: "icon-calendar-_2",
  },
  Tomorrow: {
    color: "rgb(255, 171, 0)",
    icon: "icon-calendar-_5",
  },
  Yesterday: {
    color: "rgb(229, 57, 53)",
    icon: "icon-yesterday",
  },
  Weekend: {
    color: "rgba(44, 53, 183, 1)",
    icon: "icon-calendar-_4",
  },

  "Next week": {
    color: "rgba(148, 86, 255, 1)",
    icon: "icon-calendar-_3",
  },
};

const DEFAULT_META: DateMeta = {
  color: "#ffffffd9",
  icon: "icon-calendar-_1",
};

export const dateColor = (
  label: string,
  deadline?: string | Date | null,
  reminderAt?: string | null,
): DateMeta => {
  if (deadline) {
    const now = new Date();
    const targetDate = new Date(deadline);

    if (reminderAt && reminderAt.includes(":")) {
      const [hours, minutes] = reminderAt.split(":").map(Number);
      targetDate.setHours(hours, minutes, 0, 0);
    } else {
      targetDate.setHours(23, 59, 59, 999);
    }

    if (targetDate < now) {
      return SPECIAL_COLORS["Yesterday"];
    }

    if (label === i18next.t("today")) return SPECIAL_COLORS["Today"];
    if (label === i18next.t("tomorrow")) return SPECIAL_COLORS["Tomorrow"];
    if (label === i18next.t("next_week")) return SPECIAL_COLORS["Next week"];

    const isWeekend =
      label === i18next.t("saturday") || label === i18next.t("sunday");
    if (isWeekend) return SPECIAL_COLORS["Weekend"];

    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const foundDay = days.find((d) => i18next.t(d) === label);

    if (foundDay) {
      const englishKey = (foundDay.charAt(0).toUpperCase() +
        foundDay.slice(1)) as Weekday;
      return {
        color: WEEKDAY_COLORS[englishKey],
        icon: "icon-calendar-_3",
      };
    }

    return DEFAULT_META;
  }

  return DEFAULT_META;
};

export const formatFullDate = (dateInput: string | Date): string => {
  const date = new Date(dateInput);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  if (isToday) return `${i18next.t("today")} - ${timeStr}`;

  return date.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const generateDatePresets = () => {
  const now = new Date();
  const nextWeekDate = addDays(now, 7);
  const dayName = format(nextWeekDate, "EEEE").toLowerCase();
  return {
    today: format(now, "yyyy-MM-dd"),
    tomorrow: format(addDays(now, 1), "yyyy-MM-dd"),
    weekend: format(nextSaturday(now), "yyyy-MM-dd"),
    nextWeek: format(nextWeekDate, "yyyy-MM-dd"),
    nextWeekLabel: i18next.t("next_week_label", { day: i18next.t(dayName) }),
  };
};
