import type { Project } from "../types/project";
import { ProjectItem } from "../components/features/ProjectCard";
import { useProjectsContext } from "../context/ProjectsContext";
import { useEffect } from "react";
import {} from "../components/features/GeneralMenu";
import {
  ProjectMenuController,
  useProjectMenu,
} from "../components/features/ProjectMenu";
export function ProjectsList({ projects }: { projects: Project[] }) {
  const { setSelectedProjectId } = useProjectsContext();
  const menu = useProjectMenu();

  useEffect(() => {
    if (projects.length === 0) {
      setSelectedProjectId(null);
    }
  }, [projects.length]);

  return (
    <>
      <div className="flex flex-col items-start list-none m-0 p-0 w-full">
        {projects.map((p) => (
          <ProjectItem
            key={p.id}
            project={p}
            onOpenMenu={(el) => menu.open(el, p.id)}
            isMenuOpen={menu.projectId === p.id && menu.isOpen}
          />
        ))}
      </div>

      <ProjectMenuController
        anchor={menu.anchor}
        projectId={menu.projectId}
        onClose={menu.close}
        onReset={menu.reset}
      />
    </>
  );
}
