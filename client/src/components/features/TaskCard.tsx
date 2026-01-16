import React, { memo, useCallback, useRef, useState } from "react";
import type { Task } from "../../types/tasks";
import { useTasksActions } from "../../context/TasksContext";
import { PRIORITY_OPTIONS } from "../utils/priorities";
import { GlobalDropdown } from "./TaskMenu";
import { TaskCardUi } from "../ui/TaskCard";
import { formatDateLabel, dateColor } from "../utils/dateFormatters";
import { useProjectsContext } from "../../context/ProjectsContext";

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  isEditing: boolean;
  onDeleteRequest: () => void;
  // isMenuOpen: boolean;
}

export const TaskCard = memo(
  ({
    task,
    onEdit,
    isEditing,
    onDeleteRequest,
  }: // isMenuOpen,
  TaskCardProps) => {
    const { updateDone, updateTask } = useTasksActions();
    const { mode, setMode, projects, setSelectedProjectId } =
      useProjectsContext();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCalOpen, setIsCalOpen] = useState(false);
    const btnRef = useRef<HTMLSpanElement>(null);

    const handleToggle = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        updateDone(task.id, !task.isDone);
      },
      [task.id, task.isDone, updateDone]
    );
    const handleDate = useCallback(
      (newDate: string | null) => {
        updateTask(task.id, { deadline: newDate });
        setIsCalOpen(true);
      },
      [task.id, updateTask]
    );

    const handleTime = useCallback(
      (newTime: string) => {
        updateTask(task.id, { reminderAt: newTime });
      },
      [task.id, updateTask]
    );

    const handleMenuClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsMenuOpen(true);
    };

    if (isEditing) return null;

    const baseColor = PRIORITY_OPTIONS.find((option) => {
      return task.priority === option.value ? option.color : null;
    });

    if (isEditing) {
      return null;
    }
    return (
      <>
        <TaskCardUi
          {...task}
          onEdit={onEdit}
          btnRef={btnRef}
          isCalOpen={isCalOpen}
          setIsCalOpen={setIsCalOpen}
          updateDate={handleDate}
          updateTime={handleTime}
          priorityBg={baseColor?.bg}
          priorityColor={baseColor?.color}
          isMenuOpen={isMenuOpen}
          changeProject={(prodId) => {
            setSelectedProjectId(prodId);
            setMode(prodId === null ? "inbox" : "project");
          }}
          onMenuClick={handleMenuClick}
          updateDone={handleToggle}
          dateColor={dateColor}
          mode={mode}
          projects={projects}
          formatDateLabel={formatDateLabel}
        />
        {/* Глобальное меню рендерится только если эта карточка открыта */}
        {isMenuOpen && btnRef.current && (
          <GlobalDropdown
            isCalOpen={isCalOpen}
            setIsCalOpen={setIsCalOpen}
            updateDate={handleDate}
            updateTime={handleTime}
            task={task}
            isOpen={isMenuOpen}
            anchorEl={btnRef.current} // Передаем физическую кнопку
            onClose={() => setIsMenuOpen(false)}
            onEdit={() => {
              onEdit();
              setIsMenuOpen(false);
            }}
            onDelete={() => {
              onDeleteRequest();
              setIsMenuOpen(false);
            }}
          />
        )}
      </>
    );
  }
);
