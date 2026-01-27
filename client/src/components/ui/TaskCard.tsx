import React, { memo } from "react";
import { format } from "date-fns";
import type { Project } from "../../types/project";
import { CustomCalendar } from "../features/Calendar";
import { formatFullDate } from "../utils/dateFormatters";
import { useTranslation } from "react-i18next";

interface TaskCardUiProps {
  id: string;
  title: string;
  comment?: string | null;
  deadline?: string | null;
  reminderAt?: string | null;
  changeProject: (prod: string | null) => void;
  isMenuOpen?: boolean;
  updateDate: (date: string | null) => void;
  updateTime: (time: string) => void;
  updateDone: (e: React.MouseEvent) => void;
  isDone: boolean;
  selectionMode?: boolean;
  selected?: boolean;
  onSelect?: (e: React.MouseEvent) => void;
  dateColor: (
    label: string,
    dateInput?: string | Date | null,
    reminderAt?: string | null
  ) => { color: string; icon: string };
  formatDateLabel: (v: string, t: any) => string;
  onMenuClick: (e: React.MouseEvent) => void;
  onEdit: () => void;
  setOpenTaskInfo: (v: boolean) => void;
  btnRef?: React.Ref<any>;
  priorityColor: string | undefined;
  priorityBg: string | undefined;
  mode: string;
  isCalOpen: boolean;
  setIsCalOpen: (val: boolean) => void;
  completedAt?: Date | null | undefined;
  projectId?: string | null;
  projects: Project[] | null;
  subCount: number | null;
  subDone: number | null;
  setShowSubTasks?: () => void;
  showSubTasks?: boolean;
}

export const TaskCardUi = memo(function TaskCardUi(props: TaskCardUiProps) {
  const {
    title,
    comment,
    deadline,
    reminderAt,
    onMenuClick,
    onEdit,
    isCalOpen,
    setIsCalOpen,
    isMenuOpen,
    dateColor,
    updateDate,
    setOpenTaskInfo,
    updateTime,
    updateDone,
    showSubTasks,
    setShowSubTasks,
    isDone,
    completedAt,
    selected,
    selectionMode,
    onSelect,
    formatDateLabel,
    priorityColor,
    priorityBg,
    btnRef,
    changeProject,
    mode,
    projectId,
    subCount,
    subDone,
    projects,
  } = props;

  const { t } = useTranslation();
  const projectOfTask = projects?.find((p) => p.id === projectId);
  const color = projectOfTask?.color;
  const isCompletedMode = mode === "completed";
  const currentDeadlineStr = deadline
    ? format(new Date(deadline), "yyyy-MM-dd")
    : null;

  const meta = currentDeadlineStr
    ? dateColor(
        formatDateLabel(currentDeadlineStr, t),
        currentDeadlineStr,
        reminderAt
      )
    : { color: "currentColor", icon: "icon-calendar-_1" };
  const isDefaultColor = meta.color === "currentColor";

  return (
    <div
      onClick={(e) => {
        if (selectionMode) {
          onSelect?.(e);
        } else {
          setOpenTaskInfo(true);
        }
      }}
      className={`
        ${selected ? "!text-[#9d174d] " : "text-black dark:text-white"}
        group flex items-center justify-between py-2 border-b border-black/10 dark:border-[#88888846] w-full transition-colors relative cursor-pointer
        ${
          isDone
            ? "opacity-80 text-gray-400 dark:text-gray-500"
            : "text-black dark:text-white"
        }
      `}
    >
      {subCount !== 0 && mode !== "today" && (
        <div
          className="absolute left-[-2.2em] top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 group/arrow"
          onClick={(e) => {
            e.stopPropagation();
            setShowSubTasks?.();
          }}
        >
          <span
            className="transition-all duration-200 cursor-pointer p-1.5 rounded-md icon-reshot-icon-arrow-chevron-right-WDGHUKQ634 text-black/40 dark:text-[#777] hover:bg-black/5 dark:hover:bg-[#82828241] hover:text-black dark:hover:text-white"
            style={{
              transform: showSubTasks ? "rotate(90deg)" : "rotate(0deg)",
            }}
          />
        </div>
      )}

      <div className="flex items-center gap-4 text-[1em] overflow-hidden">
        {selectionMode && (
          <div
            className={`
      min-w-5 h-5 rounded-lg border flex items-center justify-center
      ${
        selected
          ? "bg-[#9d174d] border-[#610c2e] text-white"
          : "border-black/30 dark:border-white/30"
      }
    `}
          >
            {selected && <span className="icon-icons8-checkmark text-xs" />}
          </div>
        )}

        {!selectionMode && (
          <span
            onClick={updateDone}
            className="min-w-[1.2em] min-h-[1.2em] border rounded-full cursor-pointer flex items-center justify-center transition-transform active:scale-90"
            style={{ borderColor: priorityColor, backgroundColor: priorityBg }}
          />
        )}

        <div className="flex flex-col flex-wrap min-w-0">
          <span
            className={`${
              isDone ? "line-through text-gray-400" : ""
            } font-normal leading-tight truncate`}
          >
            {title}
          </span>
          {comment && (
            <div className="text-[0.9em] opacity-70 leading-normal text-gray-600 dark:text-gray-400 truncate">
              {comment}
            </div>
          )}

          {(subCount !== 0 ||
            currentDeadlineStr ||
            (isCompletedMode && completedAt) ||
            mode === "today") && (
            <div className="flex items-center text-[0.9em] gap-2 mt-1 w-full flex-wrap">
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
                  disabled={selectionMode}
                >
                  <CustomCalendar
                    date={currentDeadlineStr}
                    setDate={updateDate}
                    time={reminderAt}
                    setTime={updateTime}
                  >
                    <span className="flex items-center gap-1 cursor-pointer">
                      <span className={meta.icon} />
                      {formatDateLabel(currentDeadlineStr, t)}
                      {reminderAt && (
                        <span className="ml-1 opacity-80">{reminderAt}</span>
                      )}
                    </span>
                  </CustomCalendar>
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
                    changeProject(projectId || null);
                  }}
                  className="px-1.5 py-0.5 text-[10px] flex items-center gap-1 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer rounded-md transition-colors"
                >
                  <span
                    style={{ color: color || "#888" }}
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
          )}
        </div>
      </div>

      {
        <div className={`flex items-center`}>
          <button
            onClick={onEdit}
            className={`opacity-0 group-hover:opacity-100 text-gray-800 dark:text-white icon-pencil p-2 rounded-md cursor-pointer hover:bg-black/5 dark:hover:bg-[#82828241]   ${
              selectionMode ? "!opacity-0 pointer-events-none" : ""
            }`}
          />

          <div
            className={` ${
              selectionMode ? "opacity-0 pointer-events-none" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <CustomCalendar
              date={currentDeadlineStr}
              setDate={updateDate}
              time={reminderAt}
              setIsCalOpen={setIsCalOpen}
              setTime={updateTime}
            >
              <button
                onClick={() => setIsCalOpen(true)}
                className={`
                ${
                  isCalOpen
                    ? "opacity-100 bg-black/5 dark:bg-[#82828241]"
                    : "opacity-0 group-hover:opacity-100"
                }
                  
                text-gray-800 dark:text-white icon-calendar-_1 p-2 rounded-md cursor-pointer hover:bg-black/5 dark:hover:bg-[#82828241] 
              `}
              />
            </CustomCalendar>
          </div>

          <button
            ref={btnRef}
            onClick={(e) => {
              onMenuClick(e);
              setIsCalOpen(false);
            }}
            className={`
            ${
              isMenuOpen
                ? "opacity-100 bg-black/5 dark:bg-[#82828241]"
                : "opacity-0 group-hover:opacity-100"
            }
            ${selectionMode ? "!opacity-0 pointer-events-none" : ""}
            text-gray-800 dark:text-white icon-three-dots-punctuation-sign-svgrepo-com p-2 rounded-md cursor-pointer hover:bg-black/5 dark:hover:bg-[#82828241] 
          `}
          />
        </div>
      }
    </div>
  );
});
