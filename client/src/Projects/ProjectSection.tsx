import { useState, useRef, useEffect } from "react";
import { ProjectsList } from "./ProjectsList";
import { ProjectForm } from "../components/features/ProjectFrom";
import { useProjectsContext } from "../context/ProjectsContext";
import "./ProjectSection.css";

export function ProjectsSection() {
  const { projects, createProject } = useProjectsContext();
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
    <div className="nav-item">
      <div className="project-section">
        <div className="project-section-title">Projects</div>
        <div className="project-event-btn">
          <div
            className="hide-project-btn tip"
            onClick={() => setShowProjects(!showProjects)}
          >
            <span
              className="close icon-reshot-icon-arrow-chevron-right-WDGHUKQ634"
              style={{
                transform: showProjects ? "rotate(90deg)" : "rotate(0deg)",
              }}
            ></span>
          </div>
          <div
            className="add-project-btn tip"
            onClick={() => setShowForm(true)}
          >
            <span className="plus icon-icons8-close"></span>
          </div>
        </div>
      </div>

      <div ref={wrapperRef} className="projects-wrapper">
        <ProjectsList projects={projects} />
      </div>

      {showForm && (
        <ProjectForm
          mode="create"
          onClose={() => setShowForm(false)}
          onSubmit={async ({ title, color }) => {
            await createProject(title, 3, color, false);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}
