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
import { useProjectsContext } from "../../../context/ProjectsContext";
import { Select } from "../../Select";
import { useTranslation } from "react-i18next";
import { MenuItem } from "../../ui/MenuItem";
import { FILTER_OPTIONS } from "../../../utils/dateFormatters";

interface ProjectMenuProps {
  anchorEl: HTMLElement | null;
  resetMenu: () => void;
  isFavorite: boolean | undefined;
  onToggleFavorite: () => void;
  onEdit: () => void;
  closeMenu: () => void;
  onDelete: () => void;
  additionalItems?: React.ReactNode;
}

export function ProjectMenu({
  anchorEl,
  resetMenu,
  closeMenu,
  isFavorite,
  onToggleFavorite,
  onEdit,
  onDelete,

  additionalItems,
}: ProjectMenuProps) {
  const { showAll, setShowAll } = useProjectsContext();

  const { t } = useTranslation();
  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open: Boolean(anchorEl),
    onOpenChange: (open) => !open && resetMenu(),
    elements: { reference: anchorEl },
    whileElementsMounted: autoUpdate,
    placement: "right-start",
    middleware: [offset(4), flip(), shift()],
  });

  const dismiss = useDismiss(context, {
    outsidePress: (event) => {
      return !(event.target as HTMLElement)?.closest(
        "[data-floating-ui-portal]",
      );
    },
  });

  const role = useRole(context);

  const { getFloatingProps } = useInteractions([dismiss, role]);

  if (!anchorEl) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={context} modal={false}>
        <ul
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            zIndex: 2000,
            opacity: isPositioned ? 1 : 0,
            visibility: isPositioned ? "visible" : "hidden",
          }}
          {...getFloatingProps()}
          className="transition-opacity duration-200 z-[999] pointer-events-auto min-w-[20em] max-w-[20em] bg-white dark:bg-[#232323] border border-black/10 dark:border-[#444] rounded-md p-1 shadow-xl outline-none shadow-black/5 dark:shadow-black/40"
        >
          <MenuItem
            icon="icon-pencil"
            onClick={() => {
              onEdit();
              closeMenu();
            }}
          >
            {t("edit")}
          </MenuItem>

          <MenuItem
            icon="icon-bookmark"
            onClick={() => {
              onToggleFavorite();
              resetMenu();
            }}
          >
            {isFavorite ? t("remove_from_favorites") : t("add_to_favorites")}
          </MenuItem>

          <div className="flex justify-center w-full">
            <Select
              position="right-start"
              border={false}
              symbol="icon-flag"
              value={showAll ? "all" : "active"}
              options={FILTER_OPTIONS}
              onChange={(val) => {
                const isAll = val === "all";
                setShowAll(isAll);
                closeMenu();
              }}
            />
          </div>

          <MenuItem icon="icon-stats-bars" onClick={resetMenu}>
            {t("activity_log")}
          </MenuItem>

          {additionalItems && (
            <div className="border-t border-black/5 dark:border-white/5 my-1 mx-1" />
          )}
          {additionalItems}

          <MenuItem
            icon="icon-bin"
            onClick={() => {
              onDelete();
              closeMenu();
            }}
            variant="danger"
          >
            {t("delete")}
          </MenuItem>
        </ul>
      </FloatingFocusManager>
    </FloatingPortal>
  );
}
