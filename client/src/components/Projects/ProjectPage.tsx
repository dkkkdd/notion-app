import { ProjectsSection } from "./ProjectSection";
import { FavoriteProjects } from "./FavoriteProjectsSection";
import { UserInfo } from "../User/UserInfo";
import { ModalPortal } from "../../features/ModalPortal";
import { UserBtn } from "../User/UserBtn";
import { useState } from "react";

export const ProjectPage = () => {
  const [showUserInfo, setShowUserInfo] = useState(false);
  return (
    <>
      {showUserInfo && (
        <ModalPortal>
          <UserInfo
            isOpen={showUserInfo}
            onClose={() => setShowUserInfo(false)}
          />
        </ModalPortal>
      )}

      <div className="py-5">
        <UserBtn onClick={() => setShowUserInfo(true)} />
        <div className="p-2 rounded-2xl bg-[#eee] dark:bg-[#232323] mb-5">
          <FavoriteProjects />
        </div>
        <div className="p-2 rounded-2xl bg-[#eee] dark:bg-[#232323]">
          <ProjectsSection />
        </div>
      </div>
    </>
  );
};
