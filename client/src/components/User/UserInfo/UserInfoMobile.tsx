import type { UserInfoProps } from "@/types/UserInfo";
import { MobileDrawer } from "@/features/MobileDrawer";
import { UserInfoBase } from "@/components/User/UserInfo/UserInfoBase";

export const UserInfoMobile = ({ ...props }: UserInfoProps) => {
  return (
    <MobileDrawer
      onClose={props.onClose}
      open={props.isOpen}
      drawerDescription="ld"
      drawerTitle="o"
    >
      <UserInfoBase
        anchorRef={props.anchorRef}
        setOpenConfirm={props.setOpenConfirm}
        setOpenConfirmDelete={props.setOpenConfirmDelete}
        setOpenForm={props.setOpenForm}
        projectsCount={props.projectsCount}
        undoneTasksCount={props.undoneTasksCount}
        timeAgo={props.timeAgo}
        formattedDate={props.formattedDate}
        handleThemeChange={props.handleThemeChange}
        currentTheme={props.currentTheme}
        handleLangChange={props.handleLangChange}
      />
    </MobileDrawer>
  );
};
