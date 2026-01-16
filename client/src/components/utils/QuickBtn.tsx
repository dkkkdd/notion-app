export const QuickBtn = ({ icon, label, color, isActive, onClick }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer text-xs transition-colors ${
      isActive
        ? "bg-white/10 ring-1 ring-white/10"
        : "bg-transparent opacity-70 hover:opacity-100"
    } ${color}`}
  >
    <span className={`${icon} text-[1.8em]`} />
    {label}
  </button>
);
