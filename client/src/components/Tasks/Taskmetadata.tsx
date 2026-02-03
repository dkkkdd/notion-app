import { memo } from "react";
import { format } from "date-fns";
import type { TFunction } from "i18next";
import { Calendar } from "../Calendar/Calendar";
import { formatFullDate } from "../../utils/dateFormatters";
import { useTranslation } from "react-i18next";
import type { Project } from "../../types/project";

interface TaskMetadataProps {
  deadline?: string | null;
  reminderAt?: string | null;
  completedAt?: Date | null;
  subCount: number | null;
  subDone: number | null;
  projectId?: string | null;
  projects: Project[] | null;
  mode: string;
  isDone: boolean;
  isSelectionMode?: boolean;
  dateColor: (
    label: string,
    dateInput?: string | Date | null,
    reminderAt?: string | null,
  ) => { color: string; icon: string };
  formatDateLabel: (v: string, t: TFunction) => string;
  onDateUpdate: (date: string | null) => void;
  onTimeUpdate: (time: string | null) => void;
  onProjectClick: (projectId: string | null) => void;
}

export const TaskMetadata = memo(function TaskMetadata({
  deadline,
  reminderAt,
  completedAt,
  subCount,
  subDone,
  projectId,
  projects,
  mode,
  isDone,
  isSelectionMode,
  dateColor,
  formatDateLabel,
  onDateUpdate,
  onTimeUpdate,
  onProjectClick,
}: TaskMetadataProps) {
  const { t } = useTranslation();

  const projectOfTask = projects?.find((p) => p.id === projectId);
  const isCompletedMode = mode === "completed";
  const currentDeadlineStr = deadline
    ? format(new Date(deadline), "yyyy-MM-dd")
    : null;

  const meta = currentDeadlineStr
    ? dateColor(
        formatDateLabel(currentDeadlineStr, t),
        currentDeadlineStr,
        reminderAt,
      )
    : { color: "currentColor", icon: "icon-calendar-_1" };

  const isDefaultColor = meta.color === "currentColor";

  const shouldShowMetadata =
    subCount !== 0 ||
    currentDeadlineStr ||
    (isCompletedMode && completedAt) ||
    mode === "today" ||
    mode === "overdue";

  if (!shouldShowMetadata) return null;

  return (
    <div className="flex items-center text-[12px] md:text-[15px] gap-2 w-full flex-wrap">
      {subCount !== 0 && (
        <div className="text-gray-500 dark:text-[#777] flex items-center gap-1">
          <span className="icon-pie-chart" />
          {subDone}/{subCount}
        </div>
      )}

      {currentDeadlineStr && !isCompletedMode && (
        <button
          style={{
            color: isDone || isDefaultColor ? undefined : meta.color,
            pointerEvents: isDone ? "none" : "all",
          }}
          className={`flex items-center gap-1 ${
            isDone
              ? "text-gray-400 dark:text-gray-500"
              : isDefaultColor
                ? "text-gray-600 dark:text-gray-400"
                : ""
          }`}
          onClick={(e) => e.stopPropagation()}
          disabled={isSelectionMode}
        >
          <Calendar
            date={currentDeadlineStr}
            setDate={onDateUpdate}
            time={reminderAt}
            setTime={onTimeUpdate}
          >
            <span className="flex items-center cursor-pointer">
              <span className={meta.icon} />
              {formatDateLabel(currentDeadlineStr, t)}
              {reminderAt && (
                <span className="ml-1 opacity-80">{reminderAt}</span>
              )}
            </span>
          </Calendar>
        </button>
      )}

      {isCompletedMode && completedAt && (
        <span className="text-[10px] opacity-60 text-gray-500 dark:text-gray-400">
          {t("completed")}: {formatFullDate(completedAt)}
        </span>
      )}

      {(mode === "today" || isCompletedMode || mode === "overdue") && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onProjectClick(projectId || null);
          }}
          className="px-1.5 py-0.5 text-[8px] md:text-[10px] flex items-center gap-1 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer rounded-md transition-colors"
        >
          <span
            style={{ color: projectOfTask?.color || "#888" }}
            className={`icon-${
              projectOfTask?.title ? "heart-svgrepo-com" : "price-tag"
            }`}
          />
          <span className="opacity-60 text-gray-600 dark:text-gray-300">
            {projectOfTask?.title || "Inbox"}
          </span>
        </span>
      )}
    </div>
  );
});
