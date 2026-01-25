import { useAuthState, useAuthContext } from "../../context/AuthContext";
import { format, formatDistanceToNow } from "date-fns";
import { ConfirmModal } from "../ui/ConfirmModal";

import { useState, useRef } from "react";
import { UpdateUserInfo } from "./UpdateUserInfo";
import { ModalPortal } from "../ui/ModalPortal";
import { useTranslation } from "react-i18next";
import { CustomSelect } from "./CustomSelect";
import { localeMap } from "../../i18n";
import { enUS } from "date-fns/locale";
import { useProjectsContext } from "../../context/ProjectsContext";
import { useTasksState } from "../../context/TasksContext";
import type { Task } from "../../types/tasks";

export const applyTheme = (theme: string) => {
  const root = window.document.documentElement;

  // Определяем, нужно ли включить темный режим
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  if (isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  localStorage.setItem("theme", theme);
};
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
  const { t, i18n } = useTranslation();
  const currentLocale = localeMap[i18n.language] || enUS;
  const [openComfirmDelete, setOpenConfirmDelete] = useState(false);

  const { logoutUser, deleteUser } = useAuthContext();
  const { projects } = useProjectsContext();
  const { tasks } = useTasksState();

  const projectsCount = projects.length || 0;
  const undoneTasksCount =
    tasks.filter((t: Task) => t.isDone === false).length || 0;
  const btnRef = useRef<HTMLSpanElement>(null);

  const formattedDate = user?.createdAt
    ? format(new Date(user.createdAt), "d MMMM yyyy", { locale: currentLocale })
    : "";
  const timeAgo = user.createdAt
    ? formatDistanceToNow(new Date(user.createdAt), {
        addSuffix: true,
        locale: currentLocale,
      })
    : "";

  const LANG_OPTIONS = [
    { value: "en", label: "English", icon: "icon-language" },
    { value: "uk", label: "Українська", icon: "icon-language" },
    { value: "ru", label: "Русский", icon: "icon-language" },
    { value: "es", label: "Español", icon: "icon-language" },
    { value: "de", label: "Deutsch", icon: "icon-language" },
    { value: "pl", label: "Polski", icon: "icon-language" },
    { value: "fr", label: "Français", icon: "icon-language" },
  ];

  const THEME_OPTIONS = [
    {
      value: "light",
      label: t("theme_light"),
      icon: "icon-sun",
      color: "#ffab00",
    },
    {
      value: "dark",
      label: t("theme_dark"),
      icon: "icon-night",
      color: "#4270d1",
    },
    {
      value: "system",
      label: t("theme_system"),
      icon: "icon-cog",
      color: "#9e9e9e",
    },
  ];

  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme") || "system"
  );

  const handleThemeChange = (newTheme: string) => {
    setCurrentTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleLangChange = (langValue: string) => {
    i18n.changeLanguage(langValue);
  };

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
        className={`relative z-[100] bg-white dark:bg-[#242424] w-full max-w-[450px] rounded-lg border border-black/5 dark:border-white/5 
      transform transition-all duration-300 ease-out p-2 shadow-2xl
      ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <span
          onClick={onClose}
          className="icon-icons8-close absolute top-3 right-3 flex items-center justify-center leading-none bg-transparent p-[0.3em] rounded-[8px] cursor-pointer hover:bg-black/5 dark:hover:bg-[#82828241] text-black dark:text-white transition-colors"
        ></span>

        <div className="px-6 pb-6">
          <div className="flex items-center justify-between py-8">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-[#333] border border-gray-200 dark:border-[#222] rounded-lg flex items-center justify-center text-3xl font-bold text-black dark:text-white shadow-md">
                {user.userName?.charAt(0).toUpperCase() ||
                  user.email.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <h3 className="text-xl font-bold text-black dark:text-white">
                  {user.userName || "User"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <span
                ref={btnRef}
                onClick={() => setOpenForm(true)}
                className="icon-pencil text-gray-400 p-3 rounded-lg flex items-center justify-center leading-none bg-transparent rounded-[8px] cursor-pointer hover:bg-black/5 dark:hover:bg-[#82828241] transition-colors"
              ></span>
            </div>
          </div>

          <div className="space-y-3 -mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-[#2a2a2a] p-4 rounded-lg border border-black/5 dark:border-white/5 flex flex-col items-start ">
                <span className="icon-folder-open text-[#4270d1] text-lg mb-2"></span>
                <span className="text-2xl font-bold text-black dark:text-white">
                  {projectsCount}
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                  {t("projects_count")}
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-[#2a2a2a] p-4 rounded-lg border border-black/5 dark:border-white/5 flex flex-col items-start ">
                <span className="icon-pushpin text-[#9d174d] text-lg mb-2"></span>
                <span className="text-2xl font-bold text-black dark:text-white">
                  {undoneTasksCount}
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                  {t("active_tasks_count")}
                </span>
              </div>
            </div>

            <div className="bg-gray-50/50 dark:bg-[#2a2a2a]/50 p-4 rounded-lg border border-black/5 dark:border-white/5 flex items-center space-x-4">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <span className="icon-calendar text-[#4270d1]"></span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-gray-500 uppercase font-bold tracking-tight">
                  {t("joined")}
                </span>
                <span className="text-sm text-gray-800 dark:text-gray-300 font-medium">
                  {timeAgo}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-600 ">
                  {formattedDate}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2 ">
              <CustomSelect
                position="bottom-start"
                key="theme-select"
                symbol={currentTheme === "dark" ? "icon-night" : "icon-sun"}
                value={currentTheme}
                options={THEME_OPTIONS}
                onChange={handleThemeChange}
                border={false}
              />
              <CustomSelect
                position="bottom-start"
                key="language-select"
                symbol={"icon-language"}
                value={i18n.language}
                options={LANG_OPTIONS}
                onChange={handleLangChange}
                border={false}
              />

              <button
                onClick={() => alert("statistics")}
                type="button"
                className="focus:outline-none mb-6 relative w-full min-h-[38px] flex items-center justify-between gap-2 p-2 rounded cursor-pointer box-border bg-transparent text-gray-700 hover:bg-black/5 dark:hover:bg-[#333] m-0 border-none transition-colors"
              >
                <div className="flex items-center justify-start gap-2 overflow-hidden">
                  <span className="icon-prize shrink-0 opacity-70 text-gray-700 dark:text-white" />
                  <span className="truncate text-gray-700 dark:text-white">
                    {t("statistics")}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setOpenConfirm(true)}
                className="cursor-pointer w-full py-3 px-4 bg-[#4270d1]/5 hover:bg-[#4270d1] text-[#4270d1] hover:text-white rounded-lg transition-all flex items-center justify-center space-x-2 font-bold border border-[#4270d1]/10 hover:border-[#4270d1] shadow-sm"
              >
                <span className="icon-user-minus"></span>
                <span className="text-sm">{t("logout")}</span>
              </button>

              <button
                onClick={() => setOpenConfirmDelete(true)}
                className="cursor-pointer w-full py-3 px-4 bg-[#9d174d]/5 hover:bg-[#9d174d] text-[#9d174d] hover:text-white rounded-lg transition-all flex items-center justify-center space-x-2 font-bold border border-[#9d174d]/10 hover:border-[#9d174d] shadow-sm"
              >
                <span className="icon-bin2"></span>
                <span className="text-sm">{t("delete_account")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Модалки Confirm и UpdateUserInfo */}
      {openComfirm && (
        <ModalPortal>
          <ConfirmModal
            title={t("logout_confirm_title")}
            message={t("logout_confirm_msg")}
            variant="warning"
            cancelText={t("cancel")}
            confirmText={t("logout")}
            onConfirm={logoutUser}
            onClose={() => setOpenConfirm(false)}
          />
        </ModalPortal>
      )}
      {openComfirmDelete && (
        <ModalPortal>
          <ConfirmModal
            title={t("delete_confirm_title")}
            message={t("delete_confirm_msg")}
            variant="danger"
            cancelText={t("cancel")}
            confirmText={t("confirm_delete_btn")}
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
