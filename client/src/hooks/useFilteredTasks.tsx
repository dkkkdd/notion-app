// import type { Task } from "../types/tasks";
import { useMemo } from "react";
import { useTasksState } from "../context/TasksContext";
import { useProjectsContext } from "../context/ProjectsContext";
import type { Task } from "../types/tasks";
import { isBefore, isToday, startOfToday } from "date-fns";

export function useFilteredTasks() {
  const { tasks, loading } = useTasksState();
  const { mode, selectedProjectId, showAll } = useProjectsContext();

  const filteredTasks = useMemo(() => {
    if (loading) return [];

    const todayStart = startOfToday();

    const checkDeadline = (task: Task) => {
      if (!task.deadline) return false;
      const d = new Date(task.deadline);

      switch (mode) {
        case "today":
          return isToday(d);
        case "overdue":
          return isBefore(d, todayStart) && !task.isDone;
        default:
          return false;
      }
    };

    if (mode === "today" || mode === "overdue") {
      const allItems: any[] = [];

      tasks.forEach((parent: any) => {
        if (checkDeadline(parent) && (showAll || !parent.isDone)) {
          allItems.push({
            ...parent,
            subtasks: [],
            isFlat: true,
          });
        }

        parent.subtasks?.forEach((sub: any) => {
          if (checkDeadline(sub) && (showAll || !sub.isDone)) {
            allItems.push({
              ...sub,
              isFlat: true,
              isStandaloneSubtask: true,

              parentName: parent.title,
            });
          }
        });
      });

      return allItems.sort((a, b) => Number(a.isDone) - Number(b.isDone));
    }

    const filtered = tasks.filter((t: Task) => {
      if (mode === "completed") return t.isDone;

      let matchesPage = false;
      if (mode === "inbox") matchesPage = !t.projectId;
      else if (mode === "project")
        matchesPage = t.projectId === selectedProjectId;

      if (!matchesPage) return false;
      return showAll ? true : !t.isDone;
    });

    return filtered.sort(
      (a: any, b: any) => Number(a.isDone) - Number(b.isDone)
    );
  }, [tasks, mode, selectedProjectId, loading, showAll]);

  return { tasks: filteredTasks, ready: !loading };
}
