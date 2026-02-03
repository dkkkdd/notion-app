import { useTranslation } from "react-i18next";
import { MobileDrawer } from "../../../features/MobileDrawer";
import { UpdateUserInfoForm } from "./UpdateUserForm";
import type { UpdateUserInfoProps } from "../../../types/updateUserInfo";

export const UpdateUserInfoMobile = ({
  isOpen,
  onClose,
}: UpdateUserInfoProps) => {
  const { t } = useTranslation();

  return (
    <MobileDrawer
      onClose={onClose}
      open={isOpen}
      drawerDescription={t("update_profile")}
      drawerTitle={t("edit_profile")}
    >
      <div className="px-3 pt-2 pb-safe flex flex-col gap-4">
        <UpdateUserInfoForm onClose={onClose} />
      </div>
    </MobileDrawer>
  );
};
