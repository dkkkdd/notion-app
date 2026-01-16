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
import { addDays, nextSaturday, format } from "date-fns";
import { PRIORITY_OPTIONS } from "../utils/priorities";
import { useTasksActions } from "../../context/TasksContext";
import { CustomCalendar } from "./Calendar";
import { QuickBtn } from "../utils/QuickBtn";
import type { Task } from "../../types/tasks";
interface GlobalMenuProps {
  anchorEl: HTMLElement | null; // Элемент, у которого надо открыться
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  isCalOpen: boolean;
  setIsCalOpen: (val: boolean) => void;
  updateDate: (newDate: string | null) => void;
  updateTime: (newTime: string) => void;
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
}: GlobalMenuProps) => {
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: (open) => !open && onClose(),
    elements: {
      reference: anchorEl,
    },
    whileElementsMounted: autoUpdate,
    placement: "left",
    middleware: [offset(4), flip(), shift()],
  });
  const { updateTask } = useTasksActions();

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
            }}
            className="w-full text-left p-2 C cursor-pointer hover:bg-[#82828241] text-white rounded "
          >
            <span className="icon-pencil"> </span>Edit
          </div>
          <div
            onClick={() => {
              onEdit();
              // onCreateSubTask();
            }}
            className="w-full text-left p-2 C cursor-pointer hover:bg-[#82828241] text-white rounded "
          >
            <span className="icon-plus-svgrepo-com-1"> </span>Create sub-task
          </div>
          <div className="border-[0.5px]  border-[#444]/80 my-1"></div>
          <div className="my-3 px-2 font-semibold">
            Date
            <div className="flex gap-2">
              <QuickBtn
                icon="icon-calendar-_2"
                color="text-[#00c853]"
                isActive={task.deadline === format(new Date(), "yyyy-MM-dd")}
                onClick={() => {
                  updateDate(format(new Date(), "yyyy-MM-dd"));
                  setIsCalOpen(false);
                  onClose();
                }}
              />
              <QuickBtn
                icon="icon-calendar-_5"
                color="text-[#ffab00]"
                isActive={
                  task.deadline === format(addDays(new Date(), 1), "yyyy-MM-dd")
                }
                onClick={() => {
                  updateDate(format(addDays(new Date(), 1), "yyyy-MM-dd"));
                  setIsCalOpen(false);
                  onClose();
                }}
              />
              <QuickBtn
                icon="icon-calendar-_4"
                color="text-blue-500"
                isActive={
                  task.deadline ===
                  format(nextSaturday(new Date()), "yyyy-MM-dd")
                }
                onClick={() => {
                  updateDate(format(nextSaturday(new Date()), "yyyy-MM-dd"));
                  setIsCalOpen(false);
                  onClose();
                }}
              />
              <QuickBtn
                icon="icon-calendar-_3"
                color="text-[#673ab7]"
                isActive={
                  task.deadline === format(addDays(new Date(), 7), "yyyy-MM-dd")
                }
                onClick={() => {
                  updateDate(format(addDays(new Date(), 7), "yyyy-MM-dd"));
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
              <CustomCalendar
                date={task.deadline}
                setDate={updateDate} // Использует handleDate из родителя
                time={task.reminderAt}
                setIsCalOpen={setIsCalOpen}
                setTime={updateTime} // Использует handleTime из родителя
              >
                <span
                  onClick={() => setIsCalOpen(true)}
                  className={`   ${
                    isCalOpen ? "opacity-100 !bg-[#82828241] " : ""
                  }
                  !transition-none tip icon-three-dots-punctuation-sign-svgrepo-com p-2 rounded-md cursor-pointer hover:bg-[#82828241]`}
                />
              </CustomCalendar>
            </div>
          </div>
          <div className="my-3 px-2 font-semibold">
            Priority
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
                ? "bg-white/10 text-white "
                : "text-white/60 hover:bg-white/10"
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
          <div className="border-[0.5px] border-[#444]/80 my-1"></div>
          <div
            onClick={() => {
              onDelete();
            }}
            className="w-full text-left p-2 hover:bg-[#333] cursor-pointer text-red-400 rounded "
          >
            <span className="icon-bin"> </span>Delete
          </div>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
};
