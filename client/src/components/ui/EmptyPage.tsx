const EMPTY_STATES = {
  inbox: {
    title: "All caught up!",
    desc: "Your inbox is clear. Time to plan something new.",
    icon: "icon-price-tag",
  },
  today: {
    title: "Nothing for today",
    desc: "You've finished everything on your plate. Take a break!",
    icon: "icon-calendar-_1",
  },
  completed: {
    title: "No completed tasks",
    desc: "Get to work and start checking things off!",
    icon: "icon-checkmark",
  },
  default: {
    title: "No tasks found",
    desc: "Start by creating a new task to stay on track.",
    icon: "icon-heart-svgrepo-com",
  },
} as const;
export const EmptyState = ({
  mode,
  onOpenForm,
}: {
  mode: string;
  onOpenForm: () => void;
}) => {
  // берем конфиг по ключу или дефолтный
  const content =
    EMPTY_STATES[mode as keyof typeof EMPTY_STATES] || EMPTY_STATES.default;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center select-none animate-in fade-in duration-500">
      <div className="bg-white/5 p-6 rounded-full mb-4">
        <span
          className={`${content.icon} text-[3em] text-[#9d174d] opacity-50`}
        />
      </div>
      <h3 className="text-xl font-semibold text-white/90 mb-1">
        {content.title}
      </h3>
      <p className="text-sm text-white/40 max-w-[200px] leading-relaxed">
        {content.desc}
      </p>
      {mode !== "completed" && (
        <button
          onClick={onOpenForm}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 mt-3 
                   hover:border-[#9d174d]/50 hover:bg-[#9d174d]/5 transition-all duration-200
                   text-[13px] text-white/40 hover:text-[#9d174d] cursor-pointer"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="6" y1="2" x2="6" y2="10" />
            <line x1="2" y1="6" x2="10" y2="6" />
          </svg>
          Or add your first task
        </button>
      )}
    </div>
  );
};
