import { useTranslation } from "react-i18next";
import type { TaskMode } from "../../context/ProjectsContext";

interface SidebarNavigationProps {
  onChangeMode: (id: TaskMode, n: null) => void;
  mode: string;
}

export const SidebarNavigation = ({
  onChangeMode,
  mode,
}: SidebarNavigationProps) => {
  const { t } = useTranslation();

  const NAV_ITEMS = [
    { id: "inbox", label: t("inbox"), icon: "icon-inbox" },
    { id: "today", label: t("today"), icon: "icon-calendar-_1" },
    { id: "completed", label: t("completed"), icon: "icon-checkmark" },
    { id: "overdue", label: t("overdue"), icon: "icon-history" },
  ] as const;

  return NAV_ITEMS.map((i) => {
    return (
      <div
        key={i.id}
        onClick={() => onChangeMode(i.id as TaskMode, null)}
        className={`${
          mode === i.id
            ? "bg-[#9d174d]/15 text-[#9d174d] dark:text-white"
            : "text-gray-700 dark:text-white/70"
        } flex items-center gap-3 p-2 cursor-pointer hover:bg-black/5 dark:hover:bg-[#363636] w-full rounded-lg m-0`}
      >
        <span className={i.icon}> </span>
        {i.label}
      </div>
    );
  });
};
