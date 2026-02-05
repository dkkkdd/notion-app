import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthActions, useAuthState } from "@/context/AuthProvider";
import { useIsMobile } from "@/hooks/useIsMobile";

export const UpdateUserInfoForm = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const { updateUserInfo } = useAuthActions();
  const { user } = useAuthState();
  const isMobile = useIsMobile();

  const [userName, setUserName] = useState(user?.userName || "");
  const [userEmail, setUserEmail] = useState(user?.email || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserInfo({ userName, email: userEmail });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
      <h2 className="text-2 text-black dark:text-white border-b border-black/10 dark:border-[#d0d0d05a]/60 mb-2 pb-2 ">
        {t("update_profile")}{" "}
      </h2>

      <div className="flex flex-col gap-4 mt-4">
        <div className="flex flex-col gap-1.5">
          <label className="relative block">
            <input
              minLength={3}
              maxLength={30}
              placeholder=" "
              required
              autoComplete="username"
              type="text"
              value={userName}
              className="peer w-full p-[0.9em] text-[0.8em] rounded-[10px] bg-transparent text-black dark:text-white outline outline-1 outline-black/20 dark:outline-white/10 focus:outline-2 focus:outline-[#4270d1] transition-all"
              onChange={(e) => setUserName(e.target.value)}
            />
            <span className="absolute top-[0.55em] left-[0.5em] px-[0.5em] bg-white dark:bg-[#242424] text-gray-500 transition-all pointer-events-none peer-focus:-top-[0.7em] peer-focus:text-[0.75em] peer-focus:text-[#4270d1] peer-[:not(:placeholder-shown)]:-top-[0.7em] peer-[:not(:placeholder-shown)]:text-[0.75em]">
              {t("your_name")}
            </span>
          </label>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="relative block">
            <input
              minLength={3}
              maxLength={30}
              placeholder=" "
              required
              autoComplete="email"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="peer w-full p-[0.9em] text-[0.8em] rounded-[10px] bg-transparent text-black dark:text-white outline outline-1 outline-black/20 dark:outline-white/10 focus:outline-2 focus:outline-[#4270d1] transition-all"
            />
            <span className="absolute top-[0.55em] left-[0.5em] px-[0.5em] bg-white dark:bg-[#242424] text-gray-500 transition-all pointer-events-none peer-focus:-top-[0.7em] peer-focus:text-[0.75em] peer-focus:text-[#4270d1] peer-[:not(:placeholder-shown)]:-top-[0.7em] peer-[:not(:placeholder-shown)]:text-[0.75em]">
              {t("email_label")}
            </span>
          </label>
        </div>
      </div>
      <div
        className={`flex gap-3 ${isMobile ? "flex-col" : "justify-end"} mt-6`}
      >
        <button type="button" onClick={onClose} className="...">
          {t("cancel")}
        </button>
        <button type="submit" className="...">
          {t("save_changes")}
        </button>
      </div>
    </form>
  );
};
