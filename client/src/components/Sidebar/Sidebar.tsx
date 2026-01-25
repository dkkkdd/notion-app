import { useProjectsContext } from "../../context/ProjectsContext";
import { FavoriteProjects } from "../../Projects/FavoriteProjectsSection/FavoriteProjectsSection";
import { ProjectsSection } from "../../Projects/ProjectSection";
import { useState } from "react";
import { SidebarNavigation } from "../ui/SidebarNavigation";
import { ModalPortal } from "../ui/ModalPortal";
import { AddTaskBtn } from "../ui/AddTaskBtn";
import { useAuthState } from "../../context/AuthContext";
import { TaskForm } from "../features/TaskForm";
import { UserInfo } from "../features/UserInfo";
import { useTasksActions } from "../../context/TasksContext";

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const { user } = useAuthState();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const { mode, changeMode } = useProjectsContext();
  const { createTask } = useTasksActions();
  const [openForm, setOpenForm] = useState(false);

  return (
    <aside
      className={`
        
        relative shrink-0 transition-all duration-350 ease-in-out
        bg-[#eee] dark:bg-[#232323] 
        ${collapsed ? "w-0" : "w-[22em]"}
      `}
    >
      <div
        className={`
          h-full w-full p-4 overflow-y-auto transition-all duration-350 ease-in-out
          ${
            collapsed
              ? "opacity-0 -translate-x-[200%]"
              : "opacity-100 translate-x-0"
          }
        `}
      >
        {/* User Info */}
        <div className="mb-6 font-semibold">
          <span
            className="w-full flex items-center gap-2 cursor-pointer group"
            onClick={() => setShowUserInfo(true)}
          >
            <div className="w-10 h-10 bg-[#999] dark:bg-[#333] border border-[#888] dark:border-[#222] rounded-lg flex items-center justify-center text-xl font-bold text-white shadow-md transition-transform group-hover:scale-105">
              {user?.userName?.charAt(0).toUpperCase() ||
                user?.email.charAt(0).toUpperCase()}
            </div>
            <span className="text-[#4270d1] truncate">
              {user?.userName || user?.email.split("@")[0]}
            </span>
          </span>
        </div>

        {/* Add Task */}
        <div className="flex flex-col items-start justify-center pl-[5px] mb-2">
          <AddTaskBtn onOpenForm={() => setOpenForm(true)} />
        </div>

        {/* Navigation */}
        <div className="space-y-1">
          <SidebarNavigation
            onChangeMode={(id, n) => changeMode(id, n)}
            mode={mode}
          />
          <FavoriteProjects />
          <ProjectsSection />
        </div>
      </div>

      {/* Modals */}
      {openForm && (
        <ModalPortal>
          <div
            className="fixed inset-0 px-5 pt-[10%] pl-[20%] z-[999] "
            onClick={() => setOpenForm(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <TaskForm
                formMode="create"
                onClose={() => setOpenForm(false)}
                onSubmit={async (data: any) => {
                  await createTask(data);
                  setOpenForm(false);
                }}
              />
            </div>
          </div>
        </ModalPortal>
      )}

      {showUserInfo && (
        <ModalPortal>
          <UserInfo
            isOpen={showUserInfo}
            onClose={() => setShowUserInfo(false)}
          />
        </ModalPortal>
      )}
    </aside>
  );
}
