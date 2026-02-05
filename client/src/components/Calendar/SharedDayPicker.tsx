import { useMemo } from "react";
import { DayPicker } from "react-day-picker";
import { startOfDay } from "date-fns";
import { useTranslation } from "react-i18next";
import { localeMap } from "@/i18n";
import { enUS } from "date-fns/locale";
import "react-day-picker/dist/style.css";

interface SharedDayPickerProps {
  selected: Date | undefined;
  onSelect: (day: Date | undefined) => void;
  toDate?: Date;
  variant?: "desktop" | "mobile";
  hideCaption?: boolean;
}

export const SharedDayPicker = ({
  selected,
  onSelect,
  toDate,
  variant = "desktop",
  hideCaption = false,
}: SharedDayPickerProps) => {
  const { i18n } = useTranslation();

  const currentLocale = useMemo(
    () => localeMap[i18n.language] || enUS,
    [i18n.language],
  );

  const desktopStyles = {
    day: {
      cursor: "pointer",
      borderRadius: "50%",
      fontSize: "0.7rem",
      margin: "2px",
    },
    caption_label: {
      borderColor: "#ec4899",
    },
    selected: {
      fontWeight: "bold",
      borderColor: "#ec4899",
      backgroundColor: "#ec4899",
      color: "white",
    },
    today: {
      fontWeight: "bold",
      border: "1px solid #ec4899",
      color: "#ec4899",
    },
    disabled: {
      color: "#727272",
      cursor: "not-allowed",
    },
    day_outside: {
      color: "#a0a0a0",
      cursor: "not-allowed",
    },
  };

  const mobileStyles = {
    caption: { display: hideCaption ? "none" : "block" },
    day: {
      cursor: "pointer",
      borderRadius: "0.5rem",
    },
    selected: {
      backgroundColor: "#673ab7",
      color: "white",
    },
    today: {
      fontWeight: "bold",
      color: "#ff5722",
    },
  };
  const today = startOfDay(new Date());
  const styles = variant === "desktop" ? desktopStyles : mobileStyles;

  return (
    <DayPicker
      locale={currentLocale}
      lang={i18n.language}
      mode="single"
      selected={selected}
      onSelect={onSelect}
      showOutsideDays
      disabled={{ before: today }}
      toDate={toDate}
      className={
        variant === "desktop" ? "w-full h-[300px] overflow-y-auto" : "w-fit"
      }
      styles={styles}
    />
  );
};
