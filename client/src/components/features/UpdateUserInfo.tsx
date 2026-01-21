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
  const { refs, floatingStyles, context, isPositioned } = useFloating({
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
            style={{
              ...floatingStyles,
              zIndex: 2000,

              opacity: isPositioned ? 1 : 0,
              visibility: isPositioned ? "visible" : "hidden",
            }}
            {...getFloatingProps()}
            className="transition-opacity duration-200"
          >
            <form
              className="bg-[#242424] w-full min-w-[320px] max-w-[400px] p-6 rounded-lg border border-white/5 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in duration-200"
              onSubmit={handleSubmit}
            >
              {/* Header - Стиль как в ConfirmModal */}
              <h2 className=" text-2 text-white border-b  border-[#d0d0d05a]/60 mb-2 pb-2">
                Update Profile
              </h2>

              {/* Body - Поля ввода */}
              <div className="flex flex-col gap-4">
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
                      className="peer w-full p-[0.9em] text-[0.8em] rounded-[10px] bg-transparent outline outline-1 outline-white/10 focus:outline-2 focus:outline-[#4270d1] transition-all"
                      onChange={(e) => setUserName(e.target.value)}
                    />
                    <span className="absolute top-[0.55em] left-[0.5em] px-[0.5em] bg-[#242424] text-gray-500 transition-all pointer-events-none peer-focus:-top-[0.7em] peer-focus:text-[0.75em] peer-focus:text-[#4270d1] peer-[:not(:placeholder-shown)]:-top-[0.7em] peer-[:not(:placeholder-shown)]:text-[0.75em]">
                      Your name
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
                      autoComplete="username"
                      type="text"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="peer w-full p-[0.9em] text-[0.8em] rounded-[10px] bg-transparent outline outline-1 outline-white/10 focus:outline-2 focus:outline-[#4270d1] transition-all"
                    />
                    <span className="absolute top-[0.55em] left-[0.5em] px-[0.5em] bg-[#242424] text-gray-500 transition-all pointer-events-none peer-focus:-top-[0.7em] peer-focus:text-[0.75em] peer-focus:text-[#4270d1] peer-[:not(:placeholder-shown)]:-top-[0.7em] peer-[:not(:placeholder-shown)]:text-[0.75em]">
                      Email
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions - Стиль как в ConfirmModal */}
              <div className="flex gap-3 justify-end mt-2">
                <button
                  type="button"
                  className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="cursor-pointer px-6 py-2.5 text-sm font-bold rounded-xl text-white transition-all bg-[#9d174d] hover:shadow-[0_0_15px_rgba(255,100,139,0.4)] active:scale-95 disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </FloatingFocusManager>
      )}
    </FloatingPortal>
  );
};
