import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProjectMenuController } from "@/components/Projects/Menu/ProjectMenuController";
import { MenuItem } from "@/components/Projects/Menu/MenuItem";

interface TaskListMenuProps {
  mode: string;
  selectedProjectId: string | null;
  onStartSelection: () => void;
}

export const TaskListMenu = ({
  mode,
  selectedProjectId,
  onStartSelection,
}: TaskListMenuProps) => {
  const { t } = useTranslation();
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const [menu, setMenu] = useState<{
    anchor: HTMLElement | null;
    projectId: string | null;
  }>({ anchor: null, projectId: null });

  const openMenu = (el: HTMLButtonElement | null, projectId: string) => {
    setMenu({ anchor: el, projectId });
  };

  if (mode !== "project") return;

  return (
    <div className="mx-auto max-w-[870px]">
      <button
        ref={btnRef}
        onClick={(e) => {
          if (selectedProjectId) {
            e.stopPropagation();
            openMenu(btnRef.current, selectedProjectId);
          }
        }}
        className="fixed top-5 right-5 z-111 flex items-center justify-center
             bg-transparent p-[0.3em] rounded-[8px]
             hover:bg-black/5 dark:hover:bg-[#82828241]
             text-black dark:text-white transition-colors"
      >
        <span className="icon-three-dots-punctuation-sign-svgrepo-com rotate-[90deg] text-[1.3em]" />
      </button>

      <ProjectMenuController
        anchor={menu.anchor}
        projectId={menu.projectId}
        setMenu={setMenu}
        closeMenu={() => setMenu({ anchor: null, projectId: menu.projectId })}
        additionalItems={
          <>
            <MenuItem icon="icon-books" onClick={() => console.log("k")}>
              {t("add_section")}
            </MenuItem>

            {menu.anchor && (
              <MenuItem
                icon="icon-bookmarks"
                onClick={() => {
                  onStartSelection();
                  setMenu({ anchor: null, projectId: null });
                }}
              >
                {t("start_selection")}
              </MenuItem>
            )}

            <div className="border-t border-black/5 dark:border-white/5 my-1 mx-1" />
          </>
        }
      />
    </div>
  );
};
