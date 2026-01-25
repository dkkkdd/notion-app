import { useTranslation } from "react-i18next";

interface AddTaskBtnProps {
  onOpenForm: () => void;
}

export const AddTaskBtn = ({ onOpenForm }: AddTaskBtnProps) => {
  const { t } = useTranslation();
  return (
    <button
      onClick={onOpenForm}
      className="group w-full flex items-center gap-3 py-2  cursor-pointer transition-all focus:outline-none"
    >
      <div
        className="flex items-center justify-center w-[22px] h-[22px] rounded-full 
                    border border-[#9d174d] text-[#9d174d]
                    group-hover:bg-[#9d174d] transition-all duration-200"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          className="group-hover:text-white transition-colors"
        >
          <line x1="6" y1="2" x2="6" y2="10" />
          <line x1="2" y1="6" x2="10" y2="6" />
        </svg>
      </div>

      <span className="text-[14px] font-medium dark:text-white/50 text-black/70 group-hover:text-[#9d174d] transition-colors">
        {t("add_task")}
      </span>
    </button>
  );
};
