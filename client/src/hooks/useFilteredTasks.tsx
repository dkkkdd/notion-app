import { useMemo } from "react";
import { isToday } from "date-fns";
import type { Task } from "@/types/tasks";
import { useTasksState } from "@/context/TasksContext";
import { useProjectsContext } from "@/context/ProjectsContext";

export function useFilteredTasks() {
  const { tasks, loading } = useTasksState();
  const { mode, selectedProjectId, showAll } = useProjectsContext();

  const filteredTasks = useMemo(() => {
    if (!tasks) return null;

    const now = new Date();
    if (mode === "projects") return [];

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
      type FlatTask = Task & {
        isFlat: boolean;
        isStandaloneSubtask: boolean;
        parentName: string | null;
      };
      const allItems: FlatTask[] = [];

      const processTask = (task: Task, parentName?: string) => {
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

      tasks.forEach((parent: Task) => {
        processTask(parent);
        parent.subtasks?.forEach((sub: Task) => processTask(sub, parent.title));
      });

      return allItems.sort(
        (a: Task, b: Task) => Number(a.isDone) - Number(b.isDone),
      );
    }

    const filtered = tasks.filter((t: Task) => {
      if (!matchesPage(t)) return false;
      return showAll ? true : !t.isDone;
    });

    return filtered.sort(
      (a: Task, b: Task) => Number(a.isDone) - Number(b.isDone),
    );
  }, [tasks, mode, selectedProjectId, loading, showAll]);
  // const ready =
  //   !loading && (tasks.length > 0 ? filteredTasks.length > 0 : true);

  return { tasks: filteredTasks, ready: tasks !== null };
}
