import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useProjects } from "../hooks/useProjects";

export type TaskMode = "project" | "inbox" | "today" | "completed";

type ProjectsContextType = ReturnType<typeof useProjects> & {
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  mode: TaskMode;
  setMode: (mode: TaskMode) => void;
  changeMode: (newMode: TaskMode, projectId?: string | null) => void;
};

const ProjectsContext = createContext<ProjectsContextType | null>(null);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  // Теперь useProjects не принимает userId, он берет его из токена на бэкенде
  const projectsData = useProjects();

  const [mode, setMode] = useState<TaskMode>("inbox");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const changeMode = (newMode: TaskMode, projectId: string | null = null) => {
    setMode(newMode);
    setSelectedProjectId(projectId);
  };

  return (
    <ProjectsContext.Provider
      value={{
        ...projectsData,
        selectedProjectId,
        setSelectedProjectId,
        mode,
        setMode,
        changeMode,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}
// хук useProjectsContext оставляем без изменений
export const useProjectsContext = () => {
  const context = useContext(ProjectsContext);
  if (!context)
    throw new Error("useProjectsContext must be used within ProjectsProvider");
  return context;
};
