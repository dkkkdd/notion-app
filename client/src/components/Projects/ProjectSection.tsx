import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ModalPortal } from "@/features/ModalPortal";
import { ProjectsList } from "@/components/Projects/ProjectsList";
import { ProjectForm } from "@/components/Projects/ProjectForm";
import { useProjectsContext } from "@/context/ProjectsContext";

export function ProjectsSection() {
  const { t } = useTranslation();
  const { projects, createProject, changeMode } = useProjectsContext();
  const [showProjects, setShowProjects] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.maxHeight = showProjects
        ? `${wrapperRef.current.scrollHeight}px`
        : "0px";
    }
  }, [showProjects, projects.length]);

  return (
    <div className="py-2 z-999">
      <div className="flex items-center justify-between mb-1 px-2">
        <div className="text-gray-500">{t("projects_count")}</div>

        <div className="flex items-center gap-1">
          <div
            className="w-7 h-7 flex items-center justify-center rounded-md cursor-pointer transition-colors hover:bg-gray-200 dark:hover:bg-[#82828241] group"
            onClick={() => setShowProjects(!showProjects)}
          >
            <span
              className="icon-reshot-icon-arrow-chevron-right-WDGHUKQ634 text-[1.3em] transition-transform duration-250 ease-in-out text-gray-400 group-hover:text-black/70 dark:group-hover:text-white"
              style={{
                transform: showProjects ? "rotate(90deg)" : "rotate(0deg)",
              }}
            ></span>
          </div>

          <div
            className="w-7 h-7 flex items-center justify-center rounded-md cursor-pointer transition-colors hover:bg-gray-200 dark:hover:bg-[#82828241] group"
            onClick={() => setShowForm(true)}
          >
            <span className="icon-icons8-close text-lg rotate-45 text-gray-400 group-hover:text-black/70 dark:group-hover:text-white"></span>
          </div>
        </div>
      </div>

      <div
        ref={wrapperRef}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      >
        <ProjectsList projects={projects} />
      </div>

      <ModalPortal>
        <ProjectForm
          mode="create"
          open={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={async ({ title, color }) => {
            const newProject = await createProject(title, color, false);
            if (newProject) {
              changeMode("project", newProject.id);
            }
            setShowForm(false);
          }}
        />
      </ModalPortal>
    </div>
  );
}
