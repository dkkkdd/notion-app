import { useMemo } from "react";
import { useTranslation } from "react-i18next";
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
import { format } from "date-fns";
import type { Task } from "@/types/tasks";
import { PRIORITY_OPTIONS } from "@/utils/priorities";
import { generateDatePresets } from "@/utils/dateFormatters";
import { QuickBtn } from "@/utils/QuickBtn";
import { useTasksActions } from "@/context/TasksContext";
import { Calendar } from "@/components/Calendar/Calendar";

interface GlobalMenuProps {
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  isCalOpen: boolean;
  setIsCalOpen: (val: boolean) => void;
  updateDate: (newDate: string | null) => void;
  updateTime: (newTime: string | null) => void;
  onAddSubtask?: () => void;
}

export const GlobalDropdown = ({
  anchorEl,
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
  isCalOpen,
  setIsCalOpen,
  updateDate,
  updateTime,
  onAddSubtask,
}: GlobalMenuProps) => {
  const { refs, floatingStyles, context, isPositioned } = useFloating({
    open: isOpen,
    onOpenChange: (open) => !open && onClose(),
    elements: {
      reference: anchorEl,
    },
    whileElementsMounted: autoUpdate,
    placement: "left-end",
    middleware: [offset(4), flip(), shift()],
  });
  const { updateTask } = useTasksActions();
  const { t } = useTranslation();
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getFloatingProps } = useInteractions([dismiss, role]);
  const currentDeadlineStr = task.deadline
    ? format(new Date(task.deadline), "yyyy-MM-dd")
    : null;
  const dates = useMemo(() => generateDatePresets(), []);

  if (!isOpen) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={context} modal={false}>
        <div
          // eslint-disable-next-line react-hooks/refs
          ref={refs.setFloating}
          style={{
            ...floatingStyles,
            zIndex: 2000,
            opacity: isPositioned ? 1 : 0,
            visibility: isPositioned ? "visible" : "hidden",
          }}
          {...getFloatingProps()}
          className="transition-opacity duration-200 z-[100] min-w-[20em] min-h-[fit-content] max-w-[20em] bg-white dark:bg-[#232323] border border-black/10 dark:border-[#444] rounded-md p-1 shadow-xl outline-none"
        >
          <div
            onClick={() => onEdit()}
            className="w-full text-left p-2 cursor-pointer hover:bg-black/5 dark:hover:bg-[#82828241] text-black dark:text-white rounded"
          >
            <span className="icon-pencil"> </span>
            {t("edit")}
          </div>
          {onAddSubtask && (
            <div
              onClick={() => {
                onAddSubtask();
                onClose();
              }}
              className="w-full text-left p-2 cursor-pointer hover:bg-black/5 dark:hover:bg-[#82828241] text-black dark:text-white rounded"
            >
              <span className="icon-plus-svgrepo-com-1"> </span>
              {t("add_subtask")}
            </div>
          )}
          <div className="border-[0.5px] border-black/10 dark:border-[#444]/80 my-1"></div>

          <div className="my-3 px-2 font-semibold text-black dark:text-white">
            {t("due_date")}
            <div className="flex gap-2 outline-none mt-1">
              <QuickBtn
                icon="icon-calendar-_2"
                color="text-[#00c853]"
                isActive={currentDeadlineStr === dates.today}
                onClick={() => {
                  updateDate(dates.today);
                  setIsCalOpen(false);
                  onClose();
                }}
              />
              <QuickBtn
                icon="icon-calendar-_5"
                color="text-[#ffab00]"
                isActive={currentDeadlineStr === dates.tomorrow}
                onClick={() => {
                  updateDate(dates.tomorrow);
                  setIsCalOpen(false);
                  onClose();
                }}
              />
              <QuickBtn
                icon="icon-calendar-_4"
                color="text-blue-500"
                isActive={currentDeadlineStr === dates.weekend}
                onClick={() => {
                  updateDate(dates.weekend);
                  setIsCalOpen(false);
                  onClose();
                }}
              />
              <QuickBtn
                icon="icon-calendar-_3"
                color="text-[#673ab7]"
                isActive={currentDeadlineStr === dates.nextWeek}
                onClick={() => {
                  updateDate(dates.nextWeek);
                  setIsCalOpen(false);
                  onClose();
                }}
              />
              {task.deadline && (
                <QuickBtn
                  icon="icon-icons8-close"
                  color="text-[#ff4444]"
                  onClick={() => {
                    updateDate(null);
                    updateTime("");
                    onClose();
                  }}
                />
              )}
              <Calendar
                date={task.deadline}
                setDate={updateDate}
                time={task.reminderAt}
                setIsCalOpen={setIsCalOpen}
                setTime={updateTime}
              >
                <span
                  onClick={() => setIsCalOpen(true)}
                  className={`${
                    isCalOpen
                      ? "opacity-100 bg-black/5 dark:bg-[#82828241] "
                      : ""
                  }
                  !transition-none tip icon-three-dots-punctuation-sign-svgrepo-com p-2 rounded-md cursor-pointer hover:bg-black/5 dark:hover:bg-[#82828241] text-black dark:text-white`}
                />
              </Calendar>
            </div>
          </div>

          <div className="my-3 px-2 font-semibold text-black dark:text-white">
            {t("priority")}
            <div className="flex mt-1 gap-2">
              {PRIORITY_OPTIONS.map((p) => {
                return (
                  <div
                    onClick={() => {
                      updateTask(task.id, { priority: p.value });
                      onClose();
                    }}
                    key={p.value}
                    className={`
                      flex items-center gap-2 p-2 rounded-lg cursor-pointer text-xs
                      ${
                        p.value === task.priority
                          ? "bg-black/5 dark:bg-white/10 text-black dark:text-white"
                          : "text-gray-500 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/10"
                      }
                    `}
                    style={{
                      background:
                        p.value === task.priority && p.bg !== "transparent"
                          ? p.bg
                          : undefined,
                    }}
                  >
                    <span
                      className="icon-flag text-lg"
                      style={{ color: p.color }}
                    ></span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-[0.5px] border-black/10 dark:border-[#444]/80 my-1"></div>
          <div
            onClick={() => onDelete()}
            className="w-full text-left p-2 hover:bg-red-50 dark:hover:bg-[#333] cursor-pointer text-red-500 dark:text-red-400 rounded"
          >
            <span className="icon-bin"> </span>
            {t("delete")}
          </div>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
};
