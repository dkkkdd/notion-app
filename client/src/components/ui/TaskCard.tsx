import React, { memo } from "react";
import { format } from "date-fns";
import type { Project } from "../../types/project";
import { CustomCalendar } from "../features/Calendar";
import { formatFullDate } from "../utils/dateFormatters";

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
  dateColor: (label: string) => { color: string; icon: string };
  formatDateLabel: (v: string) => string;
  onMenuClick: (e: React.MouseEvent) => void;
  onEdit: () => void;
  btnRef?: React.Ref<any>;
  priorityColor: string | undefined;
  priorityBg: string | undefined;
  mode: string;
  isCalOpen: boolean;
  setIsCalOpen: (val: boolean) => void;
  completedAt?: Date | null | undefined;
  projectId?: string | null;
  projects: Project[] | null;
}

export const TaskCardUi = memo(function TaskCardUi({
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
  updateTime,
  updateDone,
  isDone,
  completedAt,
  formatDateLabel,
  priorityColor,
  priorityBg,
  btnRef,
  changeProject,
  mode,
  projectId,
  projects,
}: TaskCardUiProps) {
  const projectOfTask = projects?.find((p) => p.id === projectId);
  const color = projectOfTask?.color;
  const isCompletedMode = mode === "completed";
  const currentDeadlineStr = deadline
    ? format(new Date(deadline), "yyyy-MM-dd")
    : null;
  return (
    <>
      <div
        className={`${
          isDone ? "opacity-80 text-gray-400" : "text-white"
        } group flex items-center justify-between py-2 border-b border-[#88888846] w-full transition-colors relative `}
      >
        <div className="flex items-center gap-4 text-[1.1em]">
          <span
            onClick={updateDone}
            className="min-w-[1.2em] min-h-[1.2em] border-1 rounded-full cursor-pointer flex items-center justify-center transition-transform active:scale-90"
            style={{
              borderColor: priorityColor,
              backgroundColor: priorityBg,
            }}
          />

          <div className="flex flex-col flex-wrap">
            <span
              className={`${
                isDone ? "line-through" : ""
              } font-normal leading-tight`}
            >
              {title}
            </span>

            {comment && (
              <div className="text-[0.9em] opacity-70 leading-normal">
                {comment}
              </div>
            )}

            {/* Нижний ряд: Дата, Завершено и Проект */}
            <div className="flex items-center text-[0.9em] gap-2 mt-1 w-full">
              {/* Блок даты */}
              {currentDeadlineStr && !isCompletedMode && (
                <div
                  style={{
                    color: dateColor(formatDateLabel(currentDeadlineStr)).color,
                  }}
                  className={
                    isCompletedMode ? "pointer-events-none opacity-60" : ""
                  }
                >
                  <CustomCalendar
                    date={currentDeadlineStr}
                    setDate={updateDate}
                    time={reminderAt}
                    setTime={updateTime}
                  >
                    <span className="flex items-center gap-1 cursor-pointer">
                      <span className="icon-calendar-_1" />
                      {formatDateLabel(currentDeadlineStr)}
                      {reminderAt && (
                        <span className="ml-1 opacity-80">{reminderAt}</span>
                      )}
                    </span>
                  </CustomCalendar>
                </div>
              )}

              {/* Блок даты завершения */}
              {isCompletedMode && completedAt && (
                <span className="text-[10px] opacity-60">
                  Finished: {formatFullDate(completedAt)}
                </span>
              )}

              <div className="flex-1" />

              {(mode === "today" || isCompletedMode) && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    changeProject(projectId || null);
                  }}
                  className="px-1.5 py-0.5 text-[10px] flex items-center gap-1 hover:bg-white/10 cursor-pointer rounded-md transition-colors"
                >
                  <span
                    style={{ color: color || "#888" }}
                    className={`icon-${
                      projectOfTask?.title ? "heart-svgrepo-com" : "price-tag"
                    }`}
                  />
                  <span className="opacity-60">
                    {projectOfTask?.title ? projectOfTask.title : "Inbox"}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div
          className={`flex items-center gap-1 ${
            isCompletedMode ? "pointer-events-none opacity-0" : ""
          }`}
        >
          {/* Кнопка быстрого редактирования */}
          <span
            onClick={onEdit}
            className=" !transition-none opacity-0 group-hover:opacity-100 tip icon-pencil p-2 rounded-md cursor-pointer hover:bg-[#82828241]"
          />
          <CustomCalendar
            date={currentDeadlineStr}
            setDate={updateDate} // Использует handleDate из родителя
            time={reminderAt}
            setIsCalOpen={setIsCalOpen}
            setTime={updateTime} // Использует handleTime из родителя
          >
            <span
              onClick={() => setIsCalOpen(true)}
              className={`   ${
                isCalOpen
                  ? "opacity-100 !bg-[#82828241] "
                  : "opacity-0 group-hover:opacity-100"
              }
                  !transition-none opacity-0 group-hover:opacity-100 tip icon-calendar-_1 p-2 rounded-md cursor-pointer hover:bg-[#82828241]`}
            />
          </CustomCalendar>

          <span
            ref={btnRef}
            onClick={(e) => {
              onMenuClick(e);
              setIsCalOpen(false);
            }}
            className={`
                  ${
                    isMenuOpen
                      ? "opacity-100 !bg-[#82828241] "
                      : "opacity-0 group-hover:opacity-100"
                  }
              !transition-none tip icon-three-dots-punctuation-sign-svgrepo-com p-2 rounded-md cursor-pointer hover:bg-[#82828241]
            `}
          />
        </div>
      </div>
    </>
  );
});
