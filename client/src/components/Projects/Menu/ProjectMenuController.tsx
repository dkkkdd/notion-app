import { useState } from "react";
import { useProjectsContext } from "../../../context/ProjectsContext";
import { useTranslation } from "react-i18next";
import { ModalPortal } from "../../../features/ModalPortal";
import { ConfirmModal } from "../../ConfirmModal";
import { ProjectForm } from "../ProjectForm";
import { ProjectMenu } from "./ProjectMenu";
import type { Project } from "../../../types/project";

type MenuState = {
  anchor: HTMLElement | null;
  projectId: string | null;
};

interface ProjectFormData {
  title?: string;
  description?: string;
  color?: string;
}

export function ProjectMenuController({
  anchor,
  projectId,
  setMenu,
  additionalItems,
  closeMenu,
}: {
  additionalItems?: React.ReactNode;
  anchor: HTMLElement | null;
  projectId: string | null;
  setMenu: React.Dispatch<React.SetStateAction<MenuState>>;
  closeMenu: () => void;
}) {
  const { projects, toggleFavorite, deleteProject, updateProject } =
    useProjectsContext();

  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { t } = useTranslation();

  const project = projects.find((p: Project) => p.id === projectId);
  const isFavorite = project?.favorites;

  const onClose = () => {
    setMenu({ anchor: null, projectId: null });
  };
  if (!projectId) return null;

  return (
    <>
      {anchor && projectId && (
        <ModalPortal>
          <ProjectMenu
            anchorEl={anchor}
            // onClose={onClose}
            resetMenu={onClose}
            isFavorite={isFavorite}
            onToggleFavorite={() =>
              project && toggleFavorite(projectId, !project.favorites)
            }
            onEdit={() => setEditing(true)}
            onDelete={() => setConfirmDelete(true)}
            closeMenu={closeMenu}
            additionalItems={additionalItems}
          />
        </ModalPortal>
      )}

      {confirmDelete && project && (
        <ModalPortal>
          <ConfirmModal
            title={t("delete_project_title")}
            variant="primary"
            cancelText={t("cancel")}
            confirmText={t("delete_now")}
            message={t("delete_project_confirm", { title: project.title })}
            onConfirm={() => {
              deleteProject(project.id);
              setConfirmDelete(false);
              onClose();
            }}
            onClose={() => setConfirmDelete(false)}
          />
        </ModalPortal>
      )}

      {editing && project && (
        <ModalPortal>
          <ProjectForm
            mode="edit"
            initialProject={project}
            onSubmit={(data: ProjectFormData) => {
              updateProject(project.id, data);
              setEditing(false);
              onClose();
            }}
            onClose={() => setEditing(false)}
          />
        </ModalPortal>
      )}
    </>
  );
}
