import { useAuthState, useAuthContext } from "../../context/AuthContext";
import { format, formatDistanceToNow } from "date-fns";
import { ConfirmModal } from "../ui/ConfirmModal";
import { enUS } from "date-fns/locale";
import { useState, useRef } from "react";
import { UpdateUserInfo } from "./UpdateUserInfo";
import { ModalPortal } from "../ui/ModalPortal";
export const UserInfo = ({
  onClose,
  isOpen,
}: {
  onClose: () => void;
  isOpen: boolean;
}) => {
  const { user } = useAuthState();

  if (!user) return;
  const [openComfirm, setOpenConfirm] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const [openComfirmDelete, setOpenConfirmDelete] = useState(false);

  const { logoutUser, deleteUser } = useAuthContext();
  const projectsCount = user?._count?.projects ?? 0;
  const undoneTasksCount = user?._count?.tasks ?? 0;
  const btnRef = useRef<HTMLSpanElement>(null);
  const formattedDate = user?.createdAt
    ? format(new Date(user.createdAt), "d MMMM yyyy", { locale: enUS })
    : "";
  const timeAgo = user.createdAt
    ? formatDistanceToNow(new Date(user.createdAt), {
        addSuffix: true,
        locale: enUS,
      })
    : "";

  if (!user) return null;

  return (
    <div
      className={`fixed inset-0 z-[1000] flex items-center justify-center transition-all duration-300 ease-in-out ${
        isOpen
          ? "opacity-100 visible backdrop-blur-sm bg-black/20"
          : "opacity-0 invisible backdrop-blur-0 bg-black/0"
      }`}
      onClick={() => {
        if (!openComfirm && !openComfirmDelete && !openForm) {
          onClose();
        }
      }}
    >
      <div
        className={`relative z-[100] bg-[#242424] w-full max-w-[450px] rounded-lg border border-white/5 
      transform transition-all duration-300 ease-out p-2
      ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <span
          onClick={onClose}
          className={"icon-icons8-close absolute top-2 right-2 tip"}
        ></span>

        <div className="px-6 pb-6 ">
          <div className="flex flex items-center justify-between py-8">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-[#333] border border-[#222] rounded-lg flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                {user.userName?.charAt(0).toUpperCase() ||
                  user.email.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <h3 className="text-xl font-bold text-white">
                  {user.userName || "User"}
                </h3>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
            <div className=" cursor-pointer group py-3 text-gray-100 px-4 hover:text-gray-200 rounded-lg transition-all flex items-center justify-center outline-none">
              <div className="flex items-center">
                <span
                  ref={btnRef}
                  onClick={() => {
                    setOpenForm(true);
                  }}
                  className="icon-pencil mr-3 text-gray-500  p-3 rounded-lg tip !text-[#777]"
                ></span>
              </div>
              <span className="icon-chevron-right text-xs opacity-30"></span>
            </div>
          </div>

          <div className="space-y-6 -mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#2a2a2a] p-4 rounded-lg border border-white/5 flex flex-col items-start ">
                <span className="icon-folder-open text-[#4270d1] text-lg mb-2"></span>
                <span className="text-2xl font-bold text-white">
                  {projectsCount}
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                  Projects
                </span>
              </div>

              <div className="bg-[#2a2a2a] p-4 rounded-lg border border-white/5 flex flex-col items-start ">
                <span className="icon-pushpin text-[#9d174d] text-lg mb-2"></span>
                <span className="text-2xl font-bold text-white">
                  {undoneTasksCount}
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                  Active tasks
                </span>
              </div>
            </div>

            <div className="bg-[#2a2a2a]/50 p-4 rounded-lg border border-white/5 flex items-center space-x-4">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <span className="icon-calendar text-[#4270d1]"></span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-500 uppercase font-bold tracking-tight">
                  Joined
                </span>
                <span className="text-sm text-gray-300 font-medium">
                  {timeAgo}
                </span>
                <span className="text-[10px] text-gray-600 ">
                  {formattedDate}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 ">
              <button
                onClick={() => alert("settings")}
                className=" cursor-pointer group w-full py-3 px-4 bg-[#333] hover:bg-[#444] text-gray-200 rounded-lg transition-all flex items-center justify-between outline-none"
              >
                <div className="flex items-center">
                  <span className="icon-cog mr-3 text-gray-500 group-hover:rotate-90 transition-transform duration-300"></span>
                  <span className="text-sm font-medium">Settings</span>
                </div>
                <span className="icon-chevron-right text-xs opacity-30"></span>
              </button>

              <button
                onClick={() => setOpenConfirm(true)}
                className="cursor-pointer w-full py-3 px-4 bg-[#4270d1]/5 hover:bg-[#4270d1] text-[#4270d1] hover:text-white rounded-lg transition-all flex items-center justify-center space-x-2 font-bold border border-[#4270d1]/10 hover:border-[#4270d1] shadow-sm"
              >
                <span className="icon-user-minus"></span>
                <span className="text-sm">Logout</span>
              </button>
              <button
                onClick={() => setOpenConfirmDelete(true)}
                className="cursor-pointer w-full py-3 px-4 bg-[#9d174d]/5 hover:bg-[#9d174d] text-[#9d174d] hover:text-white rounded-lg transition-all flex items-center justify-center space-x-2 font-bold border border-[#9d174d]/10 hover:border-[#9d174d] shadow-sm"
              >
                <span className="icon-bin2"></span>
                <span className="text-sm">Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {openComfirm && (
        <ModalPortal>
          <ConfirmModal
            title="Logout"
            message="Are you sure you want to leave your session?"
            variant="warning"
            confirmText="Logout"
            onConfirm={logoutUser}
            onClose={() => setOpenConfirm(false)}
          />
        </ModalPortal>
      )}
      {openComfirmDelete && (
        <ModalPortal>
          <ConfirmModal
            title="Delete Account"
            message="Are you sure you want to delete your account? This action cannot be undone."
            variant="danger"
            confirmText="Delete"
            onConfirm={() => deleteUser()}
            onClose={() => setOpenConfirmDelete(false)}
          />
        </ModalPortal>
      )}
      {openForm && btnRef.current && (
        <ModalPortal>
          <UpdateUserInfo
            anchorEl={btnRef.current}
            isOpen={openForm}
            onClose={() => setOpenForm(false)}
          />
        </ModalPortal>
      )}
    </div>
  );
};
