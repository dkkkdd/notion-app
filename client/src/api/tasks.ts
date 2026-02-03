import { api } from "./client";
import type { Task } from "../types/tasks";

type FetchTasksParams = {
  projectId?: string | null;
  sectionId?: string | null;
  parentId?: string | null;
  isDone?: boolean;
  deadline?: string;
  userId?: string;
};

export const tasksApi = {
  fetchTasks: (params?: FetchTasksParams) => {
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
  createTask: (data: Partial<Task>) => api.post<Task>("/tasks", data),

  updateInfo: (id: string, data: Partial<Task>) =>
    api.patch<Task>(`/tasks/${id}`, data),

  updateStatus: (id: string, isDone: boolean) =>
    api.patch<Task>(`/tasks/${id}/status`, { isDone }),

  deleteTask: (id: string) => api.delete(`/tasks/${id}`),
  fetchTodayTasks: () => {
    const today = new Date().toISOString().split("T")[0];
    return tasksApi.fetchTasks({ deadline: today, isDone: false });
  },

  fetchAllCompleted: () => tasksApi.fetchTasks({ isDone: true }),

  fetchProjectTasks: (projectId: string, showCompleted = false) =>
    tasksApi.fetchTasks({
      projectId,
      ...(showCompleted ? {} : { isDone: false }),
    }),

  fetchInboxTasks: () => tasksApi.fetchTasks({ projectId: null }),
};
