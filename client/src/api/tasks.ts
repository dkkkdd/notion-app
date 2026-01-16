import { api } from "./client";
import type { Task } from "../types/tasks";

export const tasksApi = {
  // get tasks with filters
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

  // create new task with basic info
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
      params.isDone = false; // Тянем только активные
    }
    return tasksApi.fetchTasks(params);
  },
  // toggle checkbox
  updateStatus: (id: string, isDone: boolean) =>
    api.patch<Task>(`/tasks/${id}`, { isDone }),

  // general update
  updateInfo: (id: string, data: Partial<Task>) =>
    api.patch<Task>(`/tasks/${id}`, data),

  // remove task from db
  deleteTask: (id: string) => api.delete(`/tasks/${id}`),

  // helper to get items without a project (inbox)
  fetchInboxTasks: () => tasksApi.fetchTasks({ projectId: null }),
};
