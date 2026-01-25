interface ProjectCardProps {
  title: string;
  color: string;
  isSelected: boolean;
  isMenuOpen?: boolean;
  onSelect: () => void;
  onOpenMenu: (e: React.MouseEvent) => void;
  btnRef?: React.Ref<any>;
  actions?: React.ReactNode;
  projectTasks: number;
}

export function ProjectCardUI({
  title,
  color,
  isSelected,
  onSelect,
  onOpenMenu,
  isMenuOpen,
  btnRef,
  projectTasks,
  actions,
}: ProjectCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`group relative flex items-center justify-between w-full  p-2 rounded-lg cursor-pointer  ${
        isSelected
          ? "selected !bg-[#9d174d]/15"
          : "dark:hover:bg-[#363636] hover:bg-[#dedede]"
      } ${isMenuOpen ? "menu-active bg-[#dedede] dark:bg-[#363636]" : ""}`}
    >
      <div className="flex items-center gap-2 truncate flex-1 mr-2">
        <span
          className="heart icon-heart-svgrepo-com shrink-0"
          style={{ color }}
        />
        <span className="truncate text-black dark:text-[#dedede]">{title}</span>
      </div>

      <div className="relative text-black dark:text-white flex  items-center justify-center w-6 h-6 shrink-0 ml-auto">
        <span
          className={`
            group-hover:opacity-0  text-[0.8em] text-black/50 dark:text-white/40
            ${isMenuOpen ? "opacity-0 " : "opacity-100 "}
          `}
        >
          {projectTasks}
        </span>

        <span
          ref={btnRef}
          onClick={(e) => {
            e.stopPropagation();
            onOpenMenu(e);
          }}
          className={`text-black dark:text-white m-0 leading-none flex items-center justify-center bg-transparent p-[0.3em] text-[1.3em] rounded-[8px] cursor-pointer hover:bg-[#82828241] icon-three-dots-punctuation-sign-svgrepo-com absolute
          cursor-pointer rotate-90
            opacity-0  group-hover:opacity-100 
            ${isMenuOpen ? "!opacity-100 active bg-[#82828241]  p-1" : ""}
          `}
        />
      </div>

      {actions}
    </div>
  );
}
