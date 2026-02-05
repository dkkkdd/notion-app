import { api } from "@/api/client";
import type { Project } from "@/types/project";

export const projectsApi = {
  fetchProjects: () => api.get<Project[]>("/projects"),
  fetchProjectBoard: (id: string) => api.get<Project>(`/projects/${id}`),
  createProject: (data: { title: string; color: string; favorites: boolean }) =>
    api.post<Project>("/projects", data),

  updateProject: (id: string, data: Partial<Project>) =>
    api.patch<Project>(`/projects/${id}`, data),

  deleteProject: (id: string) => api.delete(`/projects/${id}`),
};
