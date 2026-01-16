import { useEffect, useState } from "react";
import type { Task } from "../types/tasks";
import { tasksApi } from "../api/tasks";

export function useTasks(userId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    tasksApi
      .fetchTasks({ userId })
      .then((fetchedTasks) => {
        let result = fetchedTasks;
        setTasks(result);
      })
      .catch((err) => console.error("Load error:", err))
      .finally(() => setLoading(false));
  }, [userId]);

  const create = async (data: {
    title: string;
    projectId: string | null;
    deadline?: Date | null;
    reminderAt?: string | null;
    comment?: string | null;
    priority?: number;
    completedAt?: Date | null | undefined;
  }) => {
    const nextOrder =
      tasks.length > 0 ? Math.max(...tasks.map((t) => t.order ?? 0)) + 1 : 0;
    const temp: Task = {
      id: "temp-" + Date.now(),
      title: data.title,
      isDone: false,
      userId,
      priority: data.priority || 1,
      comment: data.comment || null,
      projectId: data.projectId,
      order: nextOrder,
      deadline: data.deadline
        ? (data.deadline instanceof Date
            ? data.deadline
            : new Date(data.deadline)
          ).toISOString()
        : null,
      reminderAt: data.reminderAt || null,
      completedAt: data.completedAt,
    };

    setTasks((p) => [...p, temp]);

    try {
      const real = await tasksApi.createTask({
        title: data.title,
        userId,
        order: nextOrder,
        projectId: data.projectId || null,
        deadline: data.deadline,
        reminderAt: data.reminderAt,
        comment: data.comment,
        priority: data.priority,
      });
      setTasks((p) => p.map((x) => (x.id === temp.id ? real : x)));
    } catch {
      setTasks((p) => p.filter((x) => x.id !== temp.id));
    }
  };

  const remove = async (id: string) => {
    const snapshot = tasks;
    setTasks((p) => p.filter((x) => x.id !== id));
    try {
      await tasksApi.deleteTask(id);
    } catch {
      setTasks(snapshot);
    }
  };
  const update = async (id: string, data: Partial<Task>) => {
    const snapshot = tasks;
    setTasks((p) => p.map((x) => (x.id === id ? { ...x, ...data } : x)));

    try {
      await tasksApi.updateInfo(id, data);
    } catch {
      setTasks(snapshot);
    }
  };

  const updateDone = async (id: string, isDone: boolean) => {
    const snapshot = [...tasks];

    setTasks((p) => p.map((t) => (t.id === id ? { ...t, isDone } : t)));
    try {
      await tasksApi.updateStatus(id, isDone);
    } catch {
      setTasks(snapshot);
    }
  };

  return {
    tasks,
    loading,
    createTask: create,
    deleteTask: remove,
    updateTask: update,
    updateDone,
  };
}
