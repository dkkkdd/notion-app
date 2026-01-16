// import { api } from "./client";
// import type { Section } from "../types/section";

// export const SectionApi = {

//   // create new task with basic info
//   createSection: (data: {
//     title: string;
//     userId: string;
//     order: number;
//     projectId: string;
//   }) => api.post<Section>("/sections", data),

//   fetchTodayTasks: () => {
//     const today = new Date().toISOString().split("T")[0];
//     return tasksApi.fetchTasks({ deadline: today, isDone: false });
//   },

//   fetchAllCompleted: () => tasksApi.fetchTasks({ isDone: true }),
//   fetchProjectTasks: (projectId: string, showCompleted: boolean = false) => {
//     const params: any = { projectId };
//     if (!showCompleted) {
//       params.isDone = false; // Тянем только активные
//     }
//     return tasksApi.fetchTasks(params);
//   },
//   // toggle checkbox
//   updateStatus: (id: string, isDone: boolean) =>
//     api.patch<Task>(`/tasks/${id}`, { isDone }),

//   // general update
//   updateInfo: (id: string, data: Partial<Task>) =>
//     api.patch<Task>(`/tasks/${id}`, data),

//   // remove task from db
//   deleteTask: (id: string) => api.delete(`/tasks/${id}`),

//   // helper to get items without a project (inbox)
//   fetchInboxTasks: () => tasksApi.fetchTasks({ projectId: null }),
// };
