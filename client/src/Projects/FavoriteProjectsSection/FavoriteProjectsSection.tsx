import "./favorites.css";
import { ProjectsList } from "../ProjectsList";
import { useState, useRef, useLayoutEffect } from "react";
import { useProjectsContext } from "../../context/ProjectsContext"; // Наш склад данных

export const FavoriteProjects = () => {
  const { projects } = useProjectsContext();
  const [showProjects, setShowProjects] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const favProjects = projects.filter((p) => p.favorites);

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    wrapperRef.current.style.maxHeight = showProjects
      ? `${wrapperRef.current.scrollHeight}px`
      : "0px";
  }, [showProjects, favProjects.length]);

  return (
    <div className="nav-item">
      {" "}
      {/* Вернул класс */}
      <div className="fav-project-section">
        {" "}
        {/* Вернул класс */}
        <div className="projects-fav">
          <div className="favproject-section-title">Favorite projects</div>
          <div className="fav-event-btn">
            <div
              className="hide-fav-btn tip"
              onClick={() => setShowProjects((p) => !p)}
            >
              <span
                className="close icon-reshot-icon-arrow-chevron-right-WDGHUKQ634"
                style={{
                  transform: showProjects ? "rotate(90deg)" : "rotate(0deg)",
                }}
              ></span>
            </div>
          </div>
        </div>
      </div>
      <div ref={wrapperRef} className="projects-wrapper">
        {/* Вернул класс для анимации */}

        <ProjectsList projects={favProjects} />
      </div>
    </div>
  );
};
