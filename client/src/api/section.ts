import { api } from "@/api/client";
import type { Section } from "@/types/section";

export const sectionApi = {
  createSection: (data: { title: string; order: number; projectId: string }) =>
    api.post<Section>("/sections", data),

  updateSection: (id: string, data: Partial<Section>) =>
    api.patch<Section>(`/sections/${id}`, data),

  deleteSection: (id: string) => api.delete(`/sections/${id}`),
};
