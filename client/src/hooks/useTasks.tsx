import { useEffect, useState, useCallback } from "react";
import type { Task } from "../types/tasks";
import { tasksApi } from "../api/tasks";

export function useTasks(userId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const sortTasks = (list: Task[]): Task[] => {
    return [...list]
      .sort((a, b) => {
        if (a.isDone && b.isDone) {
          return (
            new Date(b.completedAt!).getTime() -
            new Date(a.completedAt!).getTime()
          );
        }

        if (a.isDone !== b.isDone) return a.isDone ? 1 : -1;

        return (a.order ?? 0) - (b.order ?? 0);
      })
      .map((node) => ({
        ...node,
        subtasks: node.subtasks ? sortTasks(node.subtasks) : [],
      }));
  };

  const updateNode = useCallback(
    (list: Task[], id: string, patch: Partial<Task> | null): Task[] => {
      return list
        .filter((node) => (patch === null ? node.id !== id : true))
        .map((node) => {
          if (node.id === id) return { ...node, ...patch };
          if (node.subtasks?.length) {
            return {
              ...node,
              subtasks: updateNode(node.subtasks, id, patch),
            };
          }
          return node;
        });
    },
    []
  );

  const addSubtaskNode = useCallback(
    (list: Task[], parentId: string, newNode: Task): Task[] => {
      return list.map((node) => {
        if (node.id === parentId) {
          return {
            ...node,
            subtasks: [...(node.subtasks || []), newNode],
          };
        }
        if (node.subtasks?.length) {
          return {
            ...node,
            subtasks: addSubtaskNode(node.subtasks, parentId, newNode),
          };
        }
        return node;
      });
    },
    []
  );

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      return;
    }

    setLoading(true);
    tasksApi
      .fetchTasks({ userId })
      .then((data) => setTasks(sortTasks(data)))
      .finally(() => setLoading(false));
  }, [userId]);

  const create = async (data: any) => {
    const tempId = `temp-${Date.now()}`;
    const nextOrder =
      tasks.length > 0 ? Math.max(...tasks.map((t) => t.order ?? 0)) + 1 : 0;

    const tempNode: Task = {
      ...data,
      id: tempId,
      isDone: false,
      userId,
      order: nextOrder,
      subtasks: [],
      completedAt: null,
    };
    setTasks((prev) => {
      const newList = data.parentId
        ? addSubtaskNode(prev, data.parentId, tempNode)
        : [...prev, tempNode];
      return sortTasks(newList);
    });

    try {
      const real = await tasksApi.createTask({
        ...data,
        userId,
        order: nextOrder,
      });

      setTasks((prev) => sortTasks(updateNode(prev, tempId, real)));
    } catch (err) {
      setTasks((prev) => updateNode(prev, tempId, null));
    }
  };

  const update = async (id: string, data: Partial<Task>) => {
    const snapshot = tasks;
    setTasks((prev) => updateNode(prev, id, data));

    try {
      await tasksApi.updateInfo(id, data);
    } catch {
      setTasks(snapshot);
    }
  };

  const updateDone = async (id: string, isDone: boolean) => {
    const snapshot = tasks;
    const patch: Partial<Task> = {
      isDone,
      completedAt: isDone ? new Date() : null,
    };

    setTasks((prev) => sortTasks(updateNode(prev, id, patch)));

    try {
      await tasksApi.updateStatus(id, isDone);
    } catch {
      setTasks(snapshot);
    }
  };
  const remove = async (id: string) => {
    const snapshot = tasks;

    setTasks((prev) => updateNode(prev, id, null));

    try {
      await tasksApi.deleteTask(id);
    } catch {
      setTasks(snapshot);
    }
  };

  return {
    tasks,
    loading,
    createTask: create,
    updateTask: update,
    updateDone,
    deleteTask: remove,
  };
}
