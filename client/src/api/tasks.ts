import { api } from "./client";
import type { Task } from "../types/tasks";

export const tasksApi = {
  fetchTasks: (params?: Record<string, any>) => {
    const query = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          query.append(key, value === null ? "null" : String(value));
        }
      });
    }

    return api.get<Task[]>(`/tasks?${query.toString()}`);
  },

  createTask: (data: {
    title: string;
    userId: string;
    order: number;
    sectionId?: string | null;
    projectId?: string | null;
    parentId?: string | null;
    priority?: number;
    deadline?: string | Date | null;
    comment?: string | null;
    reminderAt?: string | null;
  }) => api.post<Task>("/tasks", data),

  fetchTodayTasks: () => {
    const today = new Date().toISOString().split("T")[0];
    return tasksApi.fetchTasks({ deadline: today, isDone: false });
  },

  fetchAllCompleted: () => tasksApi.fetchTasks({ isDone: true }),
  fetchProjectTasks: (projectId: string, showCompleted: boolean = false) => {
    const params: any = { projectId };
    if (!showCompleted) {
      params.isDone = false;
    }
    return tasksApi.fetchTasks(params);
  },

  updateStatus: (id: string, isDone: boolean) =>
    api.patch<Task>(`/tasks/${id}`, { isDone }),

  updateInfo: (id: string, data: Partial<Task>) =>
    api.patch<Task>(`/tasks/${id}`, data),

  deleteTask: (id: string) => api.delete(`/tasks/${id}`),

  fetchInboxTasks: () => tasksApi.fetchTasks({ projectId: null }),
};
