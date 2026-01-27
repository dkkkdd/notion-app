import { ProjectCardUI } from "../ui/ProjectCard";
import { useProjectsContext } from "../../context/ProjectsContext";
import type { Project } from "../../types/project";
import { useCallback, useRef } from "react";
import { useTasksState } from "../../context/TasksContext";
import type { Task } from "../../types/tasks";

interface ProjectCardProps {
  project: Project;
  onOpenMenu: (el: HTMLDivElement) => void;
  isMenuOpen: boolean;
}
export function ProjectItem({
  project,
  onOpenMenu,
  isMenuOpen,
}: ProjectCardProps) {
  const { selectedProjectId, changeMode } = useProjectsContext();
  const btnRef = useRef<HTMLDivElement>(null);
  const handleMenuClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (btnRef.current) {
        onOpenMenu(btnRef.current); // передаём реальный элемент кнопки
      }
    },
    [onOpenMenu]
  );
  const { tasks } = useTasksState();
  const projectTasks = tasks.filter(
    (t: Task) => t.projectId === project.id && t.isDone === false
  ).length;

  return (
    <>
      <ProjectCardUI
        title={project.title}
        color={project.color}
        isSelected={selectedProjectId === project.id}
        onOpenMenu={handleMenuClick}
        projectTasks={projectTasks}
        btnRef={btnRef}
        isMenuOpen={isMenuOpen}
        onSelect={() => {
          // setSelectedProjectId(project.id);

          changeMode("project", project.id);
        }}
      />
    </>
  );
}
