import { useState } from "react";
import type { Section } from "@/types/section";
import { sectionApi } from "@/api/section";

export function useSections(initialSections: Section[] = []) {
  const [sections, setSections] = useState<Section[]>(initialSections);

  const createSection = async (title: string, projectId: string) => {
    const tempId = `temp-${Date.now()}`;
    const tempSection: Section = {
      id: tempId,
      title: title.trim(),
      order: sections.length,
      projectId,
    };

    setSections((prev) => [...prev, tempSection]);

    try {
      const real = await sectionApi.createSection({
        title,
        projectId,
        order: tempSection.order,
      });

      setSections((prev) => prev.map((s) => (s.id === tempId ? real : s)));
    } catch (error) {
      setSections((prev) => prev.filter((s) => s.id !== tempId));
      console.error("Failed to create section:", error);
    }
  };

  const updateSection = async (id: string, data: Partial<Section>) => {
    const snapshot = sections;
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s)),
    );

    try {
      await sectionApi.updateSection(id, data);
    } catch (error) {
      setSections(snapshot);
      console.error("Failed to update section:", error);
    }
  };

  const deleteSection = async (id: string) => {
    const snapshot = sections;
    setSections((prev) => prev.filter((s) => s.id !== id));

    try {
      await sectionApi.deleteSection(id);
    } catch (error) {
      setSections(snapshot);
      console.error("Failed to delete section:", error);
    }
  };

  return {
    sections,
    setSections,
    createSection,
    updateSection,
    deleteSection,
  };
}
