import type { TaskMode } from "../../context/ProjectsContext";
interface SidebarNavigationProps {
  onChangeMode: (id: TaskMode, n: null) => void;
  mode: string;
}
const NAV_ITEMS = [
  { id: "inbox", label: "Inbox", icon: "icon-price-tag" },
  { id: "today", label: "Today", icon: "icon-calendar-_1" },
  { id: "completed", label: "Completed", icon: "icon-checkmark" },
] as const;
export const SidebarNavigation = ({
  onChangeMode,
  mode,
}: SidebarNavigationProps) => {
  return NAV_ITEMS.map((i) => {
    return (
      <div
        key={i.id}
        onClick={() => onChangeMode(i.id as TaskMode, null)}
        className={`${
          mode === i.id ? "!bg-[#9d174d]/15 text-white" : "text-white/70"
        } flex items-center gap-3 p-2 cursor-pointer hover:bg-[#363636] w-full rounded-lg transition-colors`}
      >
        <span className={i.icon}> </span>
        {i.label}
      </div>
    );
  });
};
