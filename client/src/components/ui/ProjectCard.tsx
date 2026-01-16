interface ProjectCardProps {
  title: string;
  color: string;
  isSelected: boolean;
  // setConfirmModal: (val: boolean) => void;
  // setEditing: (val: boolean) => void;
  isMenuOpen?: boolean;
  onSelect: () => void;
  onOpenMenu: (e: React.MouseEvent) => void;
  btnRef?: React.Ref<any>;
  actions?: React.ReactNode;
}

export function ProjectCardUI({
  title,
  color,
  isSelected,
  onSelect,
  onOpenMenu,
  isMenuOpen,
  btnRef,
  actions,
  ...rest
}: ProjectCardProps & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <div
      onClick={onSelect}
      className={`project ${isSelected ? "bg-[#ff648b]/30" : ""}`}
    >
      <div className="project-title">
        <span className="heart icon-heart-svgrepo-com" style={{ color }} />
        {title}
      </div>

      <span
        ref={btnRef}
        onClick={(e) => {
          rest.onClick?.(e);
          onOpenMenu(e);
        }}
        className={`project-actions tip icon-three-dots-punctuation-sign-svgrepo-com ${
          isMenuOpen ? "active" : ""
        }`}
      />

      {actions}
    </div>
  );
}
