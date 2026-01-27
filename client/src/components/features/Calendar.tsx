import { useState, useMemo, useEffect } from "react";
import type { ReactNode } from "react";
import { addDays, nextSaturday, format } from "date-fns";
import { CalendarUi } from "../ui/Calendar";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useInteractions,
  useClick,
  useDismiss,
} from "@floating-ui/react";

import { useTranslation } from "react-i18next";

interface CustomCalendarProps {
  date: string | null | undefined;
  time: string | null | undefined;
  setIsCalOpen?: (val: boolean) => void;
  setDate: (val: string | null) => void;
  setTime: (val: string) => void;
  children?: ReactNode;
}

const STEP = 30;

export const CustomCalendar = (props: CustomCalendarProps) => {
  const { t, i18n } = useTranslation();
  const { date, setIsCalOpen } = props;
  const currentDeadlineStr = date ? format(new Date(date), "yyyy-MM-dd") : null;

  const [open, setOpen] = useState(false);
  // Внутри CustomCalendar
  const dates = useMemo(() => {
    const now = new Date();
    const nextWeekDate = addDays(now, 7);
    const dayName = format(nextWeekDate, "EEEE").toLowerCase(); // получаем 'monday'

    return {
      today: format(now, "yyyy-MM-dd"),
      tomorrow: format(addDays(now, 1), "yyyy-MM-dd"),
      weekend: format(nextSaturday(now), "yyyy-MM-dd"),
      nextWeek: format(nextWeekDate, "yyyy-MM-dd"),
      // Используем t() для динамической строки
      nextWeekLabel: t("next_week_label", { day: t(dayName) }),
    };
  }, [open, t, i18n.language]);

  useEffect(() => {
    if (setIsCalOpen) setIsCalOpen(open);
  }, [open, setIsCalOpen]);

  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open: open,
    onOpenChange: setOpen,
    placement: "bottom-start",
    whileElementsMounted: autoUpdate,
    strategy: "fixed",
    middleware: [offset(4), flip(), shift({ padding: 10 })],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  const timeOptions = useMemo(() => {
    const options = Array.from({ length: (24 * 60) / STEP }, (_, i) => {
      const totalMinutes = i * STEP;
      const h = Math.floor(totalMinutes / 60)
        .toString()
        .padStart(2, "0");
      const m = (totalMinutes % 60).toString().padStart(2, "0");
      return { value: `${h}:${m}`, label: `${h}:${m}`, icon: "icon-clock" };
    });

    const now = new Date();
    let hours = now.getHours();
    let minutes = Math.ceil(now.getMinutes() / STEP) * STEP;
    if (minutes === 60) {
      hours = (hours + 1) % 24;
      minutes = 0;
    }

    const sString = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    const idx = options.findIndex((o) => o.value === sString);

    if (idx === -1) return options;
    return [...options.slice(idx), ...options.slice(0, idx)];
  }, [open]); // Пересчитываем только при открытии

  const safeDate = currentDeadlineStr ? new Date(currentDeadlineStr) : null;

  return (
    <CalendarUi
      {...props}
      open={open}
      setOpen={setOpen}
      safeDate={safeDate}
      isPositioned={isPositioned}
      refs={refs}
      floatingStyles={floatingStyles}
      getReferenceProps={getReferenceProps}
      getFloatingProps={getFloatingProps}
      todayStr={dates.today}
      tomorrowStr={dates.tomorrow}
      weekendStr={dates.weekend}
      nextWeekStr={dates.nextWeek}
      nextWeekDayNameStr={dates.nextWeekLabel}
      timeOptions={timeOptions}
    />
  );
};
