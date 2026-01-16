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

interface GlobalMenuProps {
  anchorEl: HTMLElement | null; // Элемент, у которого надо открыться
  isOpen: boolean;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProjectMenu = ({
  anchorEl,
  isOpen,
  isFavorite,
  onToggleFavorite,
  onClose,
  onEdit,
  onDelete,
}: GlobalMenuProps) => {
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => !open && onClose(),
    elements: {
      reference: anchorEl, // Просто передаем элемент из стейта
    },
    whileElementsMounted: autoUpdate,
    placement: "right",

    middleware: [offset(4), flip(), , shift()],
  });

  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getFloatingProps } = useInteractions([dismiss, role]);

  if (!isOpen) return null;
  console.log("menu render");
  return (
    <FloatingPortal>
      <FloatingFocusManager context={context} modal={false}>
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="z-[100] min-w-[20em] min-h-[fit-content] max-w-[20em] !bg-[#232323] border border-[#444] rounded-md p-1 shadow-xl outline-none"
        >
          <div
            onClick={() => {
              onEdit();
              // onClose();
            }}
            className="w-full text-left p-2 hover:bg-[#333] cursor-pointer text-white rounded "
          >
            <span className="icon-pencil"> </span>Edit
          </div>
          <div
            onClick={() => {
              onToggleFavorite();
              onClose();
            }}
            className="w-full text-left p-2 hover:bg-[#333] cursor-pointer text-white rounded "
          >
            <span className="icon-bookmark"> </span>
            {isFavorite ? "Remove from favorites" : "Add to Favorites"}
          </div>

          <div className="border-[0.5px] my-1 text-[#555]/60"></div>
          <div
            onClick={() => {
              onDelete();
              // onClose();
            }}
            className="w-full text-left p-2 hover:bg-[#333]  cursor-pointer text-red-400 rounded "
          >
            <span className="icon-bin"> </span>Delete
          </div>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
};
