import type { Task } from "../types/tasks";
import { useMemo } from "react";
import { useTasksState } from "../context/TasksContext";
import { useProjectsContext } from "../context/ProjectsContext";

function isToday(date: string | null) {
  if (date === null) return false;
  const d = new Date(date);
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  return (
    d.getFullYear() === currentYear &&
    d.getMonth() === currentMonth &&
    d.getDate() === currentDay
  );
}
export function useFilteredTasks() {
  const { tasks, loading } = useTasksState();
  const { mode, selectedProjectId } = useProjectsContext();

  const filteredTasks = useMemo(() => {
    if (loading) return [];

    switch (mode) {
      case "inbox":
        return tasks.filter((t: Task) => !t.projectId && !t.isDone);

      case "today":
        return tasks.filter((t: Task) => !t.isDone && isToday(t.deadline));

      case "completed":
        return tasks.filter((t: Task) => t.isDone);

      case "project":
        return tasks.filter(
          (t: Task) => t.projectId === selectedProjectId && !t.isDone
        );

      default:
        return [];
    }
  }, [tasks, mode, selectedProjectId, loading]);

  return {
    tasks: filteredTasks,
    ready: !loading,
  };
}
