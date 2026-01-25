import { CustomSelect } from "../features/CustomSelect";
import { formatDateLabel, dateColor } from "../utils/dateFormatters";
import { format } from "date-fns";
import { QuickBtn } from "../utils/QuickBtn";
import DatePicker from "react-datepicker";
import { FloatingPortal } from "@floating-ui/react";
import { useTranslation } from "react-i18next";
import i18n, { localeMap } from "../../i18n";
import { enUS } from "date-fns/locale";

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

  const { t } = useTranslation();
  const currentLocale = localeMap[i18n.language] || enUS;

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
              dateColor(formatDateLabel(date ?? null, t)).color === "#ffbbf2d9"
                ? undefined
                : dateColor(formatDateLabel(date ?? null, t)).color,
          }}
          className="focus:outline-none cursor-pointer min-h-[38px] flex justify-between items-center gap-2 bg-transparent border-[0.5px] border-black/20 dark:border-[#d0d0d05a]/60 rounded px-3 h-[35px] w-fit text-sm hover:border-black/40 dark:hover:border-[#888]"
        >
          <div className="truncate flex gap-2 items-center">
            <span
              className={`${
                dateColor(formatDateLabel(date ?? null, t)).icon
              } text-[1.5em] opacity-70`}
            />
            {date || time
              ? `${formatDateLabel(date ?? null, t)} ${time ? time : ""}`
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
              className="icon-icons8-close bg-black/10 dark:bg-[#444] p-1.5 text-black dark:text-white rounded-md hover:bg-black/20 dark:hover:bg-[#555]"
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
              visibility: isPositioned ? "visible" : "hidden",
              opacity: isPositioned ? 1 : 0,
            }}
            {...getFloatingProps()}
            className="z-[9999] flex flex-col gap-2 bg-white dark:bg-[#242424] border border-black/10 dark:border-[#d0d0d05a]/60 rounded-xl p-3 shadow-2xl w-[300px]"
          >
            <div className="flex justify-center overflow-hidden">
              <DatePicker
                locale={currentLocale}
                selected={safeDate}
                onChange={(d: Date | null) => {
                  if (!d) return;
                  setDate(format(d, "yyyy-MM-dd"));
                }}
                inline
                minDate={new Date()}
              />
            </div>

            {/* Сетки кнопок - поменял border-white/5 на адаптивный */}
            <div className="grid grid-cols-2 gap-1 border-t border-black/5 dark:border-white/5 pt-2">
              <QuickBtn
                label={t("today")}
                icon="icon-calendar-_2"
                color="text-[#00c853]"
                isActive={date === todayStr}
                onClick={() => {
                  setDate(todayStr);
                  setOpen(false);
                }}
              />
              <QuickBtn
                label={t("tomorrow")}
                icon="icon-calendar-_5"
                color="text-[#ffab00]"
                isActive={date === tomorrowStr}
                onClick={() => {
                  setDate(tomorrowStr);
                  setOpen(false);
                }}
              />
              <QuickBtn
                label={t("this_weekend")}
                icon="icon-calendar-_4"
                color="text-blue-500"
                isActive={date === weekendStr}
                onClick={() => {
                  setDate(weekendStr);
                  setOpen(false);
                }}
              />
              <QuickBtn
                label={nextWeekDayNameStr}
                icon="icon-calendar-_3"
                color="text-[#673ab7]"
                isActive={date === nextWeekStr}
                onClick={() => {
                  setDate(nextWeekStr);
                  setOpen(false);
                }}
              />
            </div>

            {/* Секция времени - поменял цвета текста и бордеров */}
            <div className="mt-2 pt-3 border-t border-black/5 dark:border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-black/40 dark:text-white/40 uppercase font-bold tracking-widest">
                  {t("reminder")}
                </span>
                {time && (
                  <button
                    onClick={() => setTime("")}
                    className="text-[10px] cursor-pointer text-[#9d174d] hover:underline"
                  >
                    {t("remove")}
                  </button>
                )}
              </div>
              <CustomSelect
                position="left"
                value={time === undefined ? null : time}
                options={timeOptions}
                onChange={setTime}
                placeholder={t("set_time")}
                symbol="icon-clock"
              />
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
