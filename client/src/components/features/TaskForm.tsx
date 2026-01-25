import { useState, useEffect, useRef } from "react";
import type { Task } from "../../types/tasks";
import { useProjectsContext } from "../../context/ProjectsContext";
import { TaskFormUi } from "../ui/TaskForm";
import { format } from "date-fns";

export interface TaskFormProps {
  formMode: "create" | "edit";
  initiaTask?: Task;
  parentId?: string | null;
  onSubmit: (data: {
    title: string;
    projectId: string | null;
    deadline?: string | null;
    reminderAt?: string | null;
    comment?: string | null;
    priority?: number;
    parentId?: string | null;
  }) => void | Promise<void>;
  onClose: () => void;
}

export const TaskForm = ({
  formMode,
  initiaTask,
  parentId = null,
  onSubmit,
  onClose,
}: TaskFormProps) => {
  const { mode } = useProjectsContext();
  const { selectedProjectId, projects } = useProjectsContext();
  const [name, setName] = useState(initiaTask?.title ?? "");
  const [date, setDate] = useState(initiaTask?.deadline ?? null);
  const [time, setTime] = useState(initiaTask?.reminderAt ?? null);
  const [comment, setComment] = useState(initiaTask?.comment ?? null);

  const [priority, setPriority] = useState(initiaTask?.priority ?? 1);
  const [projectId, setProjectId] = useState(selectedProjectId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerRef = useRef<HTMLFormElement>(null);
  const initialSelectedId = useRef(selectedProjectId);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedProjectId !== initialSelectedId.current) {
      onClose();
    }
  }, [selectedProjectId, onClose]);

  useEffect(() => {
    if (mode === "today" && formMode === "create") {
      setDate(format(new Date(), "yyyy-MM-dd"));
    }
  }, [mode, formMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      let finalDeadline = date;

      await onSubmit({
        title: name,
        projectId,
        priority,
        deadline: finalDeadline,
        reminderAt: time,
        comment: comment,
        parentId: initiaTask?.parentId || parentId,
      });

      if (formMode !== "edit") {
        setName("");
        setComment(null);
        setPriority(1);

        setTime(null);
        setTimeout(() => {
          titleRef.current?.focus();
        }, 0);
        if (mode === "today") {
          setDate(format(new Date(), "yyyy-MM-dd"));
        } else {
          setDate(null);
        }
      }
    } catch (error) {
      console.error("Failed to submit task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const isSubTask = !!(parentId || initiaTask?.parentId);
  return (
    <TaskFormUi
      mode={formMode}
      isSubTaskForm={isSubTask}
      name={name}
      setName={setName}
      priority={priority}
      setPriority={setPriority}
      date={date}
      setDate={setDate}
      time={time}
      setTime={setTime}
      comment={comment}
      setComment={setComment}
      projectId={projectId}
      textareaRef={textareaRef}
      containerRef={containerRef}
      setProjectId={setProjectId}
      projects={projects}
      isSubmitting={isSubmitting}
      handleSubmit={handleSubmit}
      onClose={onClose}
      titleRef={titleRef}
    />
  );
};
