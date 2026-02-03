import { api } from "./client";
import type { Section } from "../types/section";
import { tasksApi } from "./tasks";
import type { Task } from "../types/tasks";

export const SectionApi = {
  createSection: (data: {
    title: string;
    userId: string;
    order: number;
    projectId: string;
  }) => api.post<Section>("/sections", data),

  fetchTodayTasks: () => {
    const today = new Date().toISOString().split("T")[0];
    return tasksApi.fetchTasks({ deadline: today, isDone: false });
  },

  fetchAllCompleted: () => tasksApi.fetchTasks({ isDone: true }),
  fetchProjectTasks: (projectId: string, showCompleted: boolean = false) => {
    const params: Record<string, unknown> = { projectId };
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
