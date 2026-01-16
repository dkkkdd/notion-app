import type { Project } from "../types/project.ts";
import { ProjectItem } from "../components/features/ProjectCard.tsx";
import { useProjectsContext } from "../context/ProjectsContext.tsx";
import { useEffect, useState } from "react";
import { ProjectMenu } from "../components/features/ProjectMenu.tsx";
import { ProjectForm } from "./ProjectForm/ProjectForm.tsx";
import { ConfirmModal } from "../components/ui/ConfirmModal.tsx";

import { ModalPortal } from "../components/ui/ModalPortal.tsx";
// Оставляем только массив проектов. Всё остальное ProjectCard возьмет сам!
export function ProjectsList({ projects }: { projects: Project[] }) {
  const { setSelectedProjectId, deleteProject, updateProject, toggleFavorite } =
    useProjectsContext();

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuProjectId, setMenuProjectId] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<string | null>(null);
  const currentProject = projects.find((p) => p.id === menuProjectId);
  useEffect(() => {
    if (projects.length === 0) {
      setSelectedProjectId(null);
    }
  }, [projects.length]);
  return (
    <>
      <div className="projects">
        {projects.map((p) => (
          <ProjectItem
            key={p.id}
            project={p}
            onOpenMenu={(el) => {
              setMenuAnchor(el);
              setMenuProjectId(p.id);
            }}
            isMenuOpen={menuProjectId === p.id && Boolean(menuAnchor)}
          />
        ))}
      </div>

      {menuAnchor &&
        currentProject &&
        menuProjectId && ( // если нажали по кнопке и сылка на нее не нул то отображаем меню
          <ModalPortal>
            <ProjectMenu
              isFavorite={currentProject.favorites}
              onToggleFavorite={() =>
                toggleFavorite(currentProject.id, !currentProject.favorites)
              }
              isOpen={Boolean(menuAnchor)} // открыто ли меню тру ор фолс
              anchorEl={menuAnchor} //сылка на кнопку
              onClose={() => setMenuAnchor(null)} // при закрытии сбрасываем ее и меню иссчезает
              onEdit={() => {
                setEditing(menuProjectId);
                setMenuAnchor(null);
              }}
              onDelete={() => {
                setConfirmModal(menuProjectId);
                setMenuAnchor(null);
              }}
            />
          </ModalPortal>
        )}

      {confirmModal && currentProject && menuProjectId && (
        <ConfirmModal
          title="Delete Project"
          message={
            <>
              Project <b>"{currentProject.title}"</b> will be gone forever.
            </>
          }
          onConfirm={() => {
            deleteProject(menuProjectId);
            setMenuAnchor(null);
            setConfirmModal(null);
          }}
          variant="primary"
          onClose={() => setConfirmModal(null)}
          confirmText="Delete Now"
        />
      )}

      {editing && menuProjectId && (
        <ProjectForm
          mode="edit"
          initialProject={currentProject}
          onSubmit={(data) => updateProject(menuProjectId, data)}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
