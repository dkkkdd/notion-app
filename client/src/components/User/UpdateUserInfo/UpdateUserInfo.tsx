import { useIsMobile } from "../../../hooks/useIsMobile";
import type { UpdateUserInfoProps } from "../../../types/updateUserInfo";
import { UpdateUserInfoDesktop } from "./UpdateUserInfoDesktop";
import { UpdateUserInfoMobile } from "./UpdateUserInfoMobile";

export const UpdateUserInfo = (props: UpdateUserInfoProps) => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <UpdateUserInfoMobile {...props} />
  ) : (
    <UpdateUserInfoDesktop {...props} />
  );
};
  