import { useTranslation } from "react-i18next";
import { QuickBtn } from "../../utils/QuickBtn";

interface QuickDateButtonsProps {
  dates: {
    today: string;
    tomorrow: string;
    weekend: string;
    nextWeek: string;
    nextWeekLabel: string;
  };
  currentDate: string | null | undefined;
  onDateSelect: (date: string | null) => void;
  onTimeSelect: (time: string | null) => void;
  onClose?: () => void;

  variant?: "grid" | "vertical";
}

export const QuickDateButtons = ({
  dates,
  currentDate,
  onDateSelect,
  onTimeSelect,
  onClose,
  variant = "grid",
}: QuickDateButtonsProps) => {
  const { t } = useTranslation();

  const handleClick = (date: string) => {
    onDateSelect(date);
    onClose?.();
  };

  const buttons = [
    {
      label: t("today"),
      icon: "icon-calendar-_2",
      color: "text-[#00c853]",
      value: dates.today,
    },
    {
      label: t("tomorrow"),
      icon: "icon-calendar-_5",
      color: "text-[#ffab00]",
      value: dates.tomorrow,
    },
    {
      label: t("this_weekend"),
      icon: "icon-calendar-_4",
      color: "text-blue-500",
      value: dates.weekend,
    },
    {
      label: dates.nextWeekLabel,
      icon: "icon-calendar-_3",
      color: "text-[#673ab7]",
      value: dates.nextWeek,
    },
  ];

  const containerClass =
    variant === "grid"
      ? "grid grid-cols-2 gap-1"
      : "flex flex-col gap-2 overflow-x-auto px-1";

  return (
    <div className={containerClass}>
      {buttons.map((btn) => (
        <QuickBtn
          key={btn.value}
          label={btn.label}
          icon={btn.icon}
          color={btn.color}
          isActive={currentDate === btn.value}
          onClick={() => handleClick(btn.value)}
        />
      ))}

      {currentDate && (
        <QuickBtn
          icon="icon-icons8-close"
          label={t("delete")}
          color="text-[#ff4444]"
          onClick={() => {
            onDateSelect(null);
            onTimeSelect(null);
            onClose?.();
          }}
        />
      )}
    </div>
  );
};
