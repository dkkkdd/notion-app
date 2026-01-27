import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react";
import { useProjectsContext } from "../../context/ProjectsContext";
import { CustomSelect } from "./CustomSelect";
import { useState } from "react";
import { ModalPortal } from "../ui/ModalPortal";
import { ConfirmModal } from "../ui/ConfirmModal";
import { ProjectForm } from "./ProjectFrom";
import { useTranslation } from "react-i18next";
interface GlobalMenuProps {
  anchorEl: HTMLElement | null; // Элемент, у которого надо открыться
  isOpen: boolean;
  isFavorite: boolean;
  onClose: () => void;
  onSelect?: () => void;
  onToggleFavorite: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProjectMenu = ({
  anchorEl,
  isOpen,
  isFavorite,
  onToggleFavorite,
  onClose,
  onSelect,
  onEdit,
  onDelete,
}: GlobalMenuProps) => {
  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open: isOpen,
    onOpenChange: (open) => !open && onClose(),
    elements: {
      reference: anchorEl,
    },
    whileElementsMounted: autoUpdate,
    placement: "right-start",
    middleware: [offset(4), flip(), shift()],
  });

  const { t } = useTranslation();
  const { showAll, setShowAll } = useProjectsContext();
  const FILTER_OPTIONS = [
    {
      icon: "icon-list",
      value: "all",
      label: t("show_all_tasks"),
      color: "#4270d1",
    },
    {
      icon: "icon-list2",
      value: "active",
      label: t("show_active_tasks"),
      color: "#9d174d",
    },
  ];

  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getFloatingProps } = useInteractions([dismiss, role]);

  if (!isOpen) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={context} modal={false}>
        <div
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            zIndex: 2000,
            opacity: isPositioned ? 1 : 0,
            visibility: isPositioned ? "visible" : "hidden",
          }}
          {...getFloatingProps()}
          // ГЛАВНЫЙ КОНТЕЙНЕР: bg-white для светлой, dark:bg-[#232323] для темной
          className="transition-opacity duration-200 z-[100] min-w-[20em] max-w-[20em] bg-white dark:bg-[#232323] border border-black/10 dark:border-[#444] rounded-md p-1 shadow-xl outline-none shadow-black/5 dark:shadow-black/40"
        >
          {/* Пункты: текст меняется gray-700 -> white, ховер black/5 -> #333 */}
          <div
            onClick={onEdit}
            className="w-full text-left p-2 hover:bg-black/5 dark:hover:bg-[#333] cursor-pointer text-gray-700 dark:text-white rounded transition-colors flex items-center gap-2"
          >
            <span className="icon-pencil opacity-[0.7]"> </span>
            {t("edit")}
          </div>

          <div
            onClick={() => {
              onToggleFavorite();
              onClose();
            }}
            className="w-full text-left p-2 hover:bg-black/5 dark:hover:bg-[#333] cursor-pointer text-gray-700 dark:text-white rounded transition-colors flex items-center gap-2"
          >
            <span className="icon-bookmark opacity-[0.7]"> </span>
            {isFavorite ? t("remove_from_favorites") : t("add_to_favorites")}
          </div>

          <div
            onClick={onClose}
            className="w-full text-left p-2 hover:bg-black/5 dark:hover:bg-[#333] cursor-pointer text-gray-700 dark:text-white rounded transition-colors flex items-center gap-2"
          >
            <span className="icon-books opacity-[0.7]"> </span>
            {t("add_section")}
          </div>
          {onSelect && (
            <div
              onClick={() => {
                onSelect();
                onClose();
              }}
              className="w-full text-left p-2 hover:bg-black/5 dark:hover:bg-[#333] cursor-pointer text-gray-700 dark:text-white rounded transition-colors flex items-center gap-2"
            >
              <span className="icon-bookmarks opacity-[0.7]"> </span>
              {t("start_selection")}
            </div>
          )}

          <div className="flex justify-center w-full">
            <CustomSelect
              position="right-start"
              border={false}
              key="priority-select"
              symbol={"icon-flag"}
              value={showAll ? "all" : "active"}
              options={FILTER_OPTIONS}
              onChange={(val) => {
                const isAll = val === "all";
                setShowAll(isAll);
                localStorage.setItem("showAll", isAll ? "true" : "false");
              }}
            />
          </div>

          <div
            onClick={onClose}
            className="w-full text-left p-2 hover:bg-black/5 dark:hover:bg-[#333] cursor-pointer text-gray-700 dark:text-white rounded transition-colors flex items-center gap-2"
          >
            <span className="icon-stats-bars opacity-[0.7]"> </span>
            {t("activity_log")}
          </div>

          {/* Разделитель: адаптивный цвет */}
          <div className="border-t border-black/5 dark:border-white/5 my-1 mx-1"></div>

          <div
            onClick={onDelete}
            className="w-full text-left p-2 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer text-red-500 dark:text-red-400 rounded transition-colors flex items-center gap-2"
          >
            <span className="icon-bin"> </span>
            {t("delete")}
          </div>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
};
export function useProjectMenu() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);

  return {
    anchor,
    projectId,
    isOpen: Boolean(anchor),

    open: (el: HTMLElement, id: string) => {
      setAnchor(el);
      setProjectId(id);
    },

    close: () => {
      setAnchor(null);
    },

    reset: () => {
      setAnchor(null);
      setProjectId(null);
    },
  };
}

export function ProjectMenuController({
  anchor,
  projectId,
  onClose,
  onSelect,
  onReset,
}: {
  anchor: HTMLElement | null;
  projectId: string | null;
  onClose: () => void;
  onSelect?: () => void;
  onReset: () => void;
}) {
  const { projects, toggleFavorite, deleteProject, updateProject } =
    useProjectsContext();

  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { t } = useTranslation();

  const project = projects.find((p) => p.id === projectId);

  if (!projectId) return null;

  return (
    <>
      {anchor && project && (
        <ModalPortal>
          <ProjectMenu
            anchorEl={anchor}
            isOpen
            onSelect={onSelect}
            isFavorite={project.favorites}
            onClose={onClose}
            onToggleFavorite={() =>
              toggleFavorite(project.id, !project.favorites)
            }
            onEdit={() => {
              setEditing(true);
              onClose();
            }}
            onDelete={() => {
              setConfirmDelete(true);
              onClose();
            }}
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
              onReset();
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
            onSubmit={(data: any) => {
              updateProject(project.id, data);
              setEditing(false);
              onReset();
            }}
            onClose={() => setEditing(false)}
          />
        </ModalPortal>
      )}
    </>
  );
}
