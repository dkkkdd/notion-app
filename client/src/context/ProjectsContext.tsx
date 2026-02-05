import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useProjects } from "@/hooks/useProjects";

export type TaskMode =
  | "project"
  | "inbox"
  | "today"
  | "completed"
  | "overdue"
  | "projects";

type ProjectsContextType = ReturnType<typeof useProjects> & {
  selectedProjectId: string | null;
  selectedProject: string | null;
  mode: TaskMode;
  setMode: (mode: TaskMode) => void;
  showAll: boolean;
  setShowAll: (val: boolean) => void;
  changeMode: (newMode: TaskMode, projectId?: string | null) => void;
};

const ProjectsContext = createContext<ProjectsContextType | null>(null);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const projectsData = useProjects();

  const [mode, setMode] = useState<TaskMode>(() => {
    const v = localStorage.getItem("mode") as TaskMode | null;
    return v ?? "inbox";
  });

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    () => {
      const val = localStorage.getItem("selectedProjectId");
      return val === "null" ? null : val;
    },
  );
  const selectedProject =
    projectsData.projects.find((p) => p.id === selectedProjectId)?.title ||
    null;
  const [showAll, setShowAll] = useState<boolean>(() => {
    return localStorage.getItem("showAll") === "true";
  });
  const changeMode = (newMode: TaskMode, projectId: string | null = null) => {
    setMode(newMode);
    setSelectedProjectId(projectId);
  };

  useEffect(() => {
    localStorage.setItem("selectedProjectId", selectedProjectId ?? "null");
  }, [selectedProjectId]);

  useEffect(() => {
    localStorage.setItem("showAll", String(showAll));
  }, [showAll]);
  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  return (
    <ProjectsContext.Provider
      value={{
        ...projectsData,
        selectedProjectId,
        selectedProject,
        mode,
        setMode,
        showAll,
        setShowAll,
        changeMode,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export const useProjectsContext = () => {
  const context = useContext(ProjectsContext);
  if (!context)
    throw new Error("useProjectsContext must be used within ProjectsProvider");
  return context;
};
