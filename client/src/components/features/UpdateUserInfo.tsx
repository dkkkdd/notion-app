import { useState, useEffect } from "react";
import { useAuthContext, useAuthState } from "../../context/AuthContext";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react";

interface UpdateUserInfoProps {
  anchorEl: HTMLElement | null; // элемент у которого надо открыться
  isOpen: boolean;
  onClose: () => void;
  // onEdit: () => void;
}

export const UpdateUserInfo = ({
  isOpen,
  onClose,
  anchorEl,
}: UpdateUserInfoProps) => {
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => !open && onClose(),
    elements: {
      reference: anchorEl,
    },
    whileElementsMounted: autoUpdate,
    placement: "bottom",
    middleware: [offset(4), flip(), shift()],
  });
  const { updateUserInfo } = useAuthContext();
  const { user } = useAuthState();
  const [userName, setUserName] = useState(user?.userName || "");
  const [userEmail, setUserEmail] = useState(user?.email || "");

  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getFloatingProps } = useInteractions([dismiss, role]);
  useEffect(() => {
    if (user) {
      setUserName(user.userName || "");
      setUserEmail(user.email || "");
    }
  }, [user]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserInfo({ userName, email: userEmail });
    onClose();
  };
  return (
    <FloatingPortal>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            ref={refs.setFloating}
            style={{ ...floatingStyles, zIndex: 2000 }}
            {...getFloatingProps()}
            className="animate-in fade-in zoom-in duration-200"
          >
            <form
              className="form min-w-[300px] shadow-2xl bg-[#242424]"
              onSubmit={handleSubmit}
            >
              <legend>Update Profile</legend>

              <label>
                <input
                  required
                  placeholder=""
                  type="text"
                  className="input"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <span>Username</span>
              </label>

              <label>
                <input
                  required
                  placeholder=""
                  type="email"
                  className="input"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
                <span>Email</span>
              </label>

              <div className="flex flex-col gap-2 mt-4">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#9d174d] cursor-pointer text-white font-bold rounded-lg hover:bg-[#831340] transition-all transform active:scale-95"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 text-sm hover:text-white transition-colors py-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </FloatingFocusManager>
      )}
    </FloatingPortal>
  );
};
