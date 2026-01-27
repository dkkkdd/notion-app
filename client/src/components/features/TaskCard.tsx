import React, { memo, useCallback, useRef, useState } from "react";
import type { Task } from "../../types/tasks";
import { useTasksActions } from "../../context/TasksContext";
import { PRIORITY_OPTIONS } from "../utils/priorities";
import { GlobalDropdown } from "./TaskMenu";
import { TaskCardUi } from "../ui/TaskCard";
import { formatDateLabel, dateColor } from "../utils/dateFormatters";
import { useProjectsContext } from "../../context/ProjectsContext";
import { TaskInfo } from "../features/TaskInfo";
import { ModalPortal } from "../ui/ModalPortal";

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  isEditing: boolean;
  onDeleteRequest: () => void;
  onAddSubtask?: () => void;
  selectionMode?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  setShowSubTasks?: () => void; // Теперь это просто функция без аргументов
  showSubTasks?: boolean;
  // isMenuOpen: boolean;
}

export const TaskCard = memo(
  ({
    task,
    onEdit,
    isEditing,
    onDeleteRequest,
    onAddSubtask,
    selected,
    selectionMode,
    onSelect,
    setShowSubTasks,
    showSubTasks,
  }: // isMenuOpen,
  TaskCardProps) => {
    const { updateDone, updateTask } = useTasksActions();
    const { mode, projects, changeMode } = useProjectsContext();
    const [openTaskInfo, setOpenTaskInfo] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCalOpen, setIsCalOpen] = useState(false);
    const btnRef = useRef<HTMLSpanElement>(null);

    const handleToggle = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();

        if (task.subtasks && task.subtasks.length > 0) {
          task.subtasks.forEach((s) => {
            if (!task.isDone) {
              updateDone(s.id, true);
            }
          });
        }

        updateDone(task.id, !task.isDone);
      },
      [task.id, task.isDone, task.subtasks, updateDone]
    );
    const handleDate = useCallback(
      (newDate: string | null) => {
        updateTask(task.id, { deadline: newDate });
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
    const subCount = task.subtasks?.length || 0;
    const subDone = task.subtasks?.filter((t) => t.isDone === true).length || 0;
    const handleSelectClick = (e: React.MouseEvent) => {
      if (!selectionMode) return;
      e.stopPropagation();
      onSelect?.();
    };

    return (
      <>
        <TaskCardUi
          {...task}
          showSubTasks={showSubTasks}
          setShowSubTasks={setShowSubTasks}
          subCount={subCount}
          subDone={subDone}
          selectionMode={selectionMode}
          selected={selected}
          onSelect={handleSelectClick}
          onEdit={onEdit}
          setOpenTaskInfo={setOpenTaskInfo}
          btnRef={btnRef}
          isCalOpen={isCalOpen}
          setIsCalOpen={setIsCalOpen}
          updateDate={handleDate}
          updateTime={handleTime}
          priorityBg={baseColor?.bg}
          priorityColor={baseColor?.color}
          isMenuOpen={isMenuOpen}
          changeProject={(prodId) => {
            changeMode(prodId === null ? "inbox" : "project", prodId);
          }}
          onMenuClick={handleMenuClick}
          updateDone={handleToggle}
          dateColor={dateColor}
          mode={mode}
          projects={projects}
          formatDateLabel={formatDateLabel}
        />

        {openTaskInfo && (
          <ModalPortal>
            <TaskInfo
              isOpen={openTaskInfo}
              task={task}
              projects={projects}
              onClose={() => setOpenTaskInfo(false)}
            />
          </ModalPortal>
        )}

        {isMenuOpen && btnRef.current && (
          <GlobalDropdown
            isCalOpen={isCalOpen}
            setIsCalOpen={setIsCalOpen}
            updateDate={handleDate}
            updateTime={handleTime}
            task={task}
            isOpen={isMenuOpen}
            anchorEl={btnRef.current}
            onClose={() => setIsMenuOpen(false)}
            onEdit={() => {
              onEdit();
              setIsMenuOpen(false);
            }}
            onDelete={() => {
              onDeleteRequest();
              setIsMenuOpen(false);
            }}
            onAddSubtask={onAddSubtask}
          />
        )}
      </>
    );
  }
);
