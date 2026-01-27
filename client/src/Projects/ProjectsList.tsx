import type { Project } from "../types/project";
import { ProjectItem } from "../components/features/ProjectCard";

import {} from "../components/features/GeneralMenu";
import {
  ProjectMenuController,
  useProjectMenu,
} from "../components/features/ProjectMenu";
export function ProjectsList({ projects }: { projects: Project[] }) {
  const menu = useProjectMenu();

  return (
    <>
      <div className="flex  flex-col items-start list-none m-0 p-0 w-full">
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
