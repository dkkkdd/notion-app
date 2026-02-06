import { memo } from "react";

export const TaskLoader = memo(() => {
  return (
    <div className="w-full flex justify-center pt-24">
      <div className="w-10 h-10 border-4 border-black/20 dark:border-white/20 border-t-black dark:border-t-white rounded-full animate-spin" />
    </div>
  );
});
