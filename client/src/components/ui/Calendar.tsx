import { CustomSelect } from "../features/CustomSelect";
import { formatDateLabel, dateColor } from "../utils/dateFormatters";
import { format } from "date-fns";
import { QuickBtn } from "../utils/QuickBtn";
import DatePicker from "react-datepicker";
import { FloatingPortal } from "@floating-ui/react";
interface CalendarUiProps {
  date: string | null | undefined;
  time: string | null | undefined;
  setDate: (val: string | null) => void;
  setTime: (val: string) => void;
  open: boolean;
  setOpen: (val: boolean) => void;
  safeDate: Date | null;
  isPositioned: boolean;
  todayStr: string;
  tomorrowStr: string;
  weekendStr: string;
  nextWeekStr: string;
  nextWeekDayNameStr: string;
  timeOptions: any[];
  refs: any;
  floatingStyles: React.CSSProperties;
  getReferenceProps: any;
  getFloatingProps: any;
  children?: React.ReactNode;
}

export const CalendarUi = (props: CalendarUiProps) => {
  const {
    date,
    time,
    setDate,
    setTime,
    open,
    setOpen,
    safeDate,
    isPositioned,
    refs,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
    todayStr,
    tomorrowStr,
    weekendStr,
    nextWeekStr,
    nextWeekDayNameStr,
    timeOptions,
    children,
  } = props;
  return (
    <>
      {children ? (
        <div
          ref={refs.setReference}
          {...getReferenceProps()}
          className="inline-flex"
        >
          {children}
        </div>
      ) : (
        <button
          ref={refs.setReference}
          {...getReferenceProps()}
          type="button"
          style={{
            color:
              dateColor(formatDateLabel(date ?? null)).color === "#ffbbf2d9"
                ? "#ffffffda"
                : dateColor(formatDateLabel(date ?? null)).color,
          }}
          className="focus:outline-none cursor-pointer flex justify-between items-center gap-2 bg-[#242424] border-[0.5px] border-[#d0d0d05a]/60 rounded-lg px-3 h-[38px] w-fit text-sm hover:border-[#888]"
        >
          <div className="truncate flex gap-2 items-center">
            <span
              className={`${
                dateColor(formatDateLabel(date ?? null)).icon
              } text-[1.5em] opacity-70`}
            />
            {/* Здесь date || time и так отсекают undefined/null для логики строки */}
            {date || time
              ? `${formatDateLabel(date ?? null)} ${time ? time : ""}`
              : ""}
          </div>
          {date && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setDate(null);
                setTime("");
              }}
              className="icon-icons8-close bg-[#444] p-1.5 text-white rounded-md hover:bg-[#555]"
            />
          )}
        </button>
      )}
      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              // КЛЮЧЕВОЙ МОМЕНТ: скрываем, пока не встал в нужную позицию
              visibility: isPositioned ? "visible" : "hidden",
              opacity: isPositioned ? 1 : 0,
            }}
            {...getFloatingProps()}
            className="z-[9999] flex flex-col gap-2 bg-[#242424] border border-[#d0d0d05a]/60 rounded-xl p-3 shadow-2xl w-[300px]"
          >
            <div className="flex justify-center overflow-hidden">
              <DatePicker
                selected={safeDate}
                onChange={(d: Date | null) => {
                  if (!d) return;
                  setDate(format(d, "yyyy-MM-dd"));
                  // Если хочешь закрывать сразу после выбора даты:
                  // setOpen(false);
                }}
                inline
                minDate={new Date()}
              />
            </div>

            <div className="grid grid-cols-2 gap-1 border-t border-white/5 pt-2">
              <QuickBtn
                label="Today"
                icon="icon-calendar-_2"
                color="text-[#00c853]"
                isActive={date === todayStr}
                onClick={() => {
                  setDate(todayStr);
                  setOpen(false);
                }}
              />
              <QuickBtn
                label="Tomorrow"
                icon="icon-calendar-_5"
                color="text-[#ffab00]"
                isActive={date === tomorrowStr}
                onClick={() => {
                  setDate(tomorrowStr);
                  setOpen(false);
                }}
              />
              <QuickBtn
                label="This Weekend"
                icon="icon-calendar-_4"
                color="text-blue-500"
                isActive={date === weekendStr}
                onClick={() => {
                  setDate(weekendStr);
                  setOpen(false);
                }}
              />
              <QuickBtn
                label={nextWeekDayNameStr} // Динамическое имя: Next Tuesday, Next Monday и т.д.
                icon="icon-calendar-_3"
                color="text-[#673ab7]"
                isActive={date === nextWeekStr}
                onClick={() => {
                  setDate(nextWeekStr);
                  setOpen(false);
                }}
              />
            </div>

            <div className="mt-2 pt-3 border-t border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">
                  Reminder
                </span>
                {time && (
                  <button
                    onClick={() => setTime("")}
                    className="text-[10px] text-[#ff648b] hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              <CustomSelect
                position="left"
                value={time === undefined ? null : time}
                options={timeOptions}
                onChange={setTime}
                placeholder="Set time"
                symbol="icon-clock"
              />
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
