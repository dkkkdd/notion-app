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

import "./Sidebar.css";
import { useTasksActions } from "../../context/TasksContext";

export function Sidebar({ collapsed }: { collapsed: boolean }) {
  const { user } = useAuthState();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const { mode, changeMode } = useProjectsContext();
  const { createTask } = useTasksActions();
  const [openForm, setOpenForm] = useState(false);
  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-inner">
        <div className="sidebar-user">
          <span
            className="w-full flex items-center gap-2 cursor-pointer "
            onClick={() => setShowUserInfo(true)}
          >
            <div className="w-10 h-10 bg-[#333] border border-[#222] rounded-lg flex items-center justify-center text-3xl font-bold text-white shadow-xl">
              {user?.userName?.charAt(0).toUpperCase() ||
                user?.email.charAt(0).toUpperCase()}
            </div>
            <span className="!text-[#4270d1]"> {user?.userName}</span>
          </span>
        </div>
        <div className="flex flex-col items-start justify-center pl-[5px]">
          <AddTaskBtn onOpenForm={() => setOpenForm(true)} />
        </div>
        <SidebarNavigation
          onChangeMode={(id, n) => changeMode(id, n)}
          mode={mode}
        />

        <FavoriteProjects />
        <ProjectsSection />
      </div>
      {openForm && (
        <ModalPortal>
          <div
            className="absolute inset-0 px-5 pt-[10%] z-999"
            onClick={() => setOpenForm(false)}
          >
            <TaskForm
              formMode="create"
              onClose={() => {
                setOpenForm(false);
              }}
              onSubmit={async (data: {}) => {
                await createTask(data);
                setOpenForm(false);
              }}
            />
          </div>
        </ModalPortal>
      )}
      <ModalPortal>
        <UserInfo
          isOpen={showUserInfo}
          onClose={() => setShowUserInfo(false)}
        />
      </ModalPortal>
    </aside>
  );
}
