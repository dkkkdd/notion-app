// ======================
// date-utils.ts
// ======================

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
export const formatDateLabel = (dateInput: string | Date | null): string => {
  if (!dateInput) return "";

  const now = startOfDay(new Date());
  const target = startOfDay(new Date(dateInput));

  const diffDays = (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";

  const thisWeekStart = startOfWeek(now);
  const nextWeekStart = new Date(thisWeekStart);
  nextWeekStart.setDate(thisWeekStart.getDate() + 7);

  // this week → weekday name
  if (target >= thisWeekStart && target < nextWeekStart) {
    return target.toLocaleDateString("en-GB", { weekday: "long" });
  }

  // same weekday next week
  if (diffDays === 7) return "Next week";

  // default → date
  const isSameYear = now.getFullYear() === target.getFullYear();
  return target.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    ...(isSameYear ? {} : { year: "numeric" }),
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
  color: "#ffffffd9",
  icon: "icon-calendar-_1",
};

/* ---------- meta resolver ---------- */
export const dateColor = (label: string): DateMeta => {
  const isWeekend = label === "Saturday" || label === "Sunday";
  if (label in SPECIAL_COLORS) {
    return SPECIAL_COLORS[label as SpecialLabel];
  }
  if (label in WEEKDAY_COLORS) {
    return {
      color: WEEKDAY_COLORS[label as Weekday],
      icon: isWeekend ? "icon-calendar-_4" : "icon-calendar-_3",
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
