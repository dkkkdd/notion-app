import { useMemo } from "react";
import { useTasksState } from "../context/TasksContext";
import { useProjectsContext } from "../context/ProjectsContext";
import type { Task } from "../types/tasks";
import { isToday } from "date-fns";

export function useFilteredTasks() {
  const { tasks, loading } = useTasksState();
  const { mode, selectedProjectId, showAll } = useProjectsContext();

  const filteredTasks = useMemo(() => {
    if (loading) return [];

    const now = new Date();

    const checkDeadline = (task: Task) => {
      if (!task.deadline) return false;
      const d = new Date(task.deadline);

      if (task.reminderAt) {
        const [h, m] = task.reminderAt.split(":").map(Number);
        d.setHours(h, m, 0, 0);
      } else {
        d.setHours(23, 59, 59, 999);
      }

      if (mode === "today") return isToday(new Date(task.deadline));
      if (mode === "overdue") return d < now && !task.isDone;
      return false;
    };

    const matchesPage = (t: Task) => {
      if (mode === "inbox") return !t.projectId;
      if (mode === "project") return t.projectId === selectedProjectId;
      return true;
    };

    if (mode === "today" || mode === "overdue" || mode === "completed") {
      const allItems: any[] = [];

      const processTask = (task: any, parentName?: string) => {
        let isMatch = false;

        if (mode === "completed") {
          isMatch = task.isDone;
        } else {
          isMatch = checkDeadline(task) && (showAll || !task.isDone);
        }

        if (isMatch) {
          allItems.push({
            ...task,
            subtasks: [],
            isFlat: true,
            isStandaloneSubtask: !!parentName,
            parentName: parentName || null,
          });
        }
      };

      tasks.forEach((parent: any) => {
        processTask(parent);
        parent.subtasks?.forEach((sub: any) => processTask(sub, parent.title));
      });

      return allItems.sort((a, b) => Number(a.isDone) - Number(b.isDone));
    }

    const filtered = tasks.filter((t: Task) => {
      if (!matchesPage(t)) return false;
      return showAll ? true : !t.isDone;
    });

    return filtered.sort(
      (a: any, b: any) => Number(a.isDone) - Number(b.isDone)
    );
  }, [tasks, mode, selectedProjectId, loading, showAll]);

  return { tasks: filteredTasks, ready: !loading };
}
