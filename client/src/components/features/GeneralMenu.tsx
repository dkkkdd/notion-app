import { useProjectsContext } from "../../context/ProjectsContext";
import { FloatingFocusManager, FloatingPortal } from "@floating-ui/react";

interface GlobalMenuProps {
  anchorEl: HTMLElement | null;
  mode: "inbox" | "today" | "completed" | "overdue";
  onClose: () => void;
}
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useInteractions,
} from "@floating-ui/react";
import { CustomSelect } from "./CustomSelect";
import { useTranslation } from "react-i18next";

function GlobalMenu({ anchorEl, onClose }: GlobalMenuProps) {
  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open: Boolean(anchorEl),
    onOpenChange: (open) => !open && onClose(),
    elements: {
      reference: anchorEl,
    },
    whileElementsMounted: autoUpdate,
    placement: "right-start",
    middleware: [offset(4), flip(), shift()],
  });

  const { t } = useTranslation();
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getFloatingProps } = useInteractions([dismiss, role]);

  if (!anchorEl) return null;

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
          className="transition-opacity duration-200 z-[100] bg-white dark:bg-[#232323] border border-black/10 dark:border-[#444] rounded-md p-1 shadow-xl min-w-[20em] outline-none shadow-black/5 dark:shadow-black/40"
        >
          <div
            onClick={onClose}
            className="w-full text-left p-2 hover:bg-black/5 dark:hover:bg-[#333] cursor-pointer text-gray-700 dark:text-white rounded flex items-center gap-2"
          >
            <span className="icon-books opacity-[0.7]"> </span>
            {t("add_section")}
          </div>

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
              }}
            />
          </div>

          <div
            onClick={onClose}
            className="w-full text-left p-2 hover:bg-black/5 dark:hover:bg-[#333] cursor-pointer text-gray-700 dark:text-white rounded flex items-center gap-2"
          >
            <span className="icon-stats-bars opacity-[0.7]"> </span>
            {t("activity_log")}
          </div>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
}

export function GlobalMenuController({
  anchor,
  mode,
  onClose,
}: {
  anchor: HTMLElement | null;
  mode: "inbox" | "today" | "completed" | "project" | "overdue";
  onClose: () => void;
}) {
  if (!anchor) return null;
  if (mode === "project") return null;

  return <GlobalMenu anchorEl={anchor} mode={mode} onClose={onClose} />;
}
