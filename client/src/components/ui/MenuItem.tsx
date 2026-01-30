interface MenuItemProps {
  children: React.ReactNode;
  icon: string;
  onClick: () => void;
  variant?: string;
}

export const MenuItem = ({
  icon,
  onClick,
  children,
  variant = "default",
}: MenuItemProps) => {
  return (
    <li
      onClick={onClick}
      className={`w-full text-left p-2 cursor-pointer rounded transition-colors flex items-center gap-2 ${
        variant === "danger"
          ? "hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400"
          : "hover:bg-black/5 dark:hover:bg-[#333] text-gray-700 dark:text-white"
      }`}
    >
      <span className={`${icon} opacity-[0.7]`} />
      {children}
    </li>
  );
};
