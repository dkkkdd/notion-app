import { memo } from "react";

export const TaskSkeleton = memo(() => {
  return (
    <div className="task-group flex flex-col animate-pulse">
      <div
        className="task-card p-4 border border-black/10 dark:border-[#88888846] rounded-lg bg-gray-50 
      dark:bg-[#2a2a2a] mb-2"
      >
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-gray-300 dark:bg-[#333] rounded-md flex-shrink-0" />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="h-4 bg-gray-300 dark:bg-[#333] rounded w-3/4 mb-2" />

                <div className="flex gap-2 flex-wrap">
                  <div className="h-3 bg-gray-300 dark:bg-[#333] rounded w-20" />
                  <div className="h-3 bg-gray-300 dark:bg-[#333] rounded w-24" />
                </div>
              </div>

              <div className="flex gap-1 flex-shrink-0">
                <div className="w-8 h-8 bg-gray-300 dark:bg-[#333] rounded" />
                <div className="w-8 h-8 bg-gray-300 dark:bg-[#333] rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
