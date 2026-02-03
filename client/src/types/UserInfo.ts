export interface UserInfoBaseProps {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  setOpenConfirm: (value: boolean) => void;
  setOpenConfirmDelete: (value: boolean) => void;
  setOpenForm: (value: boolean) => void;
  projectsCount: number;
  undoneTasksCount: number;
  timeAgo: string;
  formattedDate: string;
  handleThemeChange: (theme: string | number | null) => void;
  currentTheme: string;
  handleLangChange: (lang: string | number | null) => void;
}

export interface UserInfoProps extends UserInfoBaseProps {
  onClose: () => void;
  isOpen: boolean;
  isSubModalOpen: boolean;
}
