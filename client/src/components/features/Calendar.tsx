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
  const { date, setDate, time, setIsCalOpen } = props;
  const todayStr = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const tomorrowStr = useMemo(
    () => format(addDays(new Date(), 1), "yyyy-MM-dd"),
    []
  );
  const weekendStr = useMemo(
    () => format(nextSaturday(new Date()), "yyyy-MM-dd"),
    []
  );
  const nextWeekStr = useMemo(
    () => format(addDays(new Date(), 7), "yyyy-MM-dd"),
    []
  );
  const nextWeekDayNameStr = useMemo(
    () => `Next ${format(addDays(new Date(), 7), "EEEE")}`,
    []
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (setIsCalOpen) setIsCalOpen(open);
  }, [open, setIsCalOpen]);

  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open: open,
    onOpenChange: setOpen, // Это само будет менять true/false
    placement: "bottom-start", // bottom-start обычно стабильнее для форм
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
  useEffect(() => {
    if (!time) return;

    const now = new Date();
    const [selectedHours, selectedMinutes] = time.split(":").map(Number);
    const selectedTimeToday = new Date();
    selectedTimeToday.setHours(selectedHours, selectedMinutes, 0, 0);

    // Если даты нет или она сегодняшняя, а время уже прошло — ставим завтра
    if (!date || date === todayStr) {
      if (selectedTimeToday < now) {
        setDate(tomorrowStr);
      } else if (!date) {
        setDate(todayStr);
      }
    }
    // Если дата завтрашняя, а время выбрали будущее — возвращаем на сегодня
    else if (date === tomorrowStr && selectedTimeToday > now) {
      setDate(todayStr);
    }
  }, [time, date, setDate, todayStr, tomorrowStr]);

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

  const safeDate = date ? new Date(date) : null;

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
      todayStr={todayStr}
      tomorrowStr={tomorrowStr}
      weekendStr={weekendStr}
      nextWeekStr={nextWeekStr}
      nextWeekDayNameStr={nextWeekDayNameStr}
      timeOptions={timeOptions}
    />
  );
};
