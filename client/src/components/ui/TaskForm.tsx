import type { Project } from "../../types/project";
import "./date.css";
import { CustomSelect } from "../features/CustomSelect";
import { CustomCalendar } from "../features/Calendar";
import "react-datepicker/dist/react-datepicker.css";
import { PRIORITY_OPTIONS } from "../utils/priorities";

interface TaskFormUiProps {
  mode: "create" | "edit";
  name: string;
  priority: number;
  date: string | null;
  time: string | null;
  projectId: string | null;
  projects: Project[];
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  containerRef: React.RefObject<HTMLFormElement | null>;
  isSubmitting: boolean;
  comment: string | null;
  setComment: (val: string) => void;
  setName: (val: string) => void;
  setPriority: (val: number) => void;
  setDate: (val: string | null) => void;

  setTime: (val: string) => void;
  setProjectId: (val: string | null) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  titleRef: React.RefObject<HTMLInputElement | null>;
}

export const TaskFormUi = ({
  mode,
  name,
  setName,
  priority,
  setPriority,
  date,
  setDate,
  time,
  setTime,
  projectId,
  setProjectId,
  comment,

  setComment,
  projects,
  textareaRef,
  containerRef,
  isSubmitting,
  handleSubmit,
  onClose,
  titleRef,
}: TaskFormUiProps) => {
  console.log("task form render");

  return (
    <div className="container">
      <form
        ref={containerRef}
        className="bg-[#1f1f1f] mt-1 round-2 relative p-5 border-[0.5px] border-[#d0d0d05a]/60 rounded-lg shadow-xl"
        id="task-form"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <p className=" text-2 text-white border-b  border-[#d0d0d05a]/60 mb-2 pb-2">
          {mode === "create" ? "Add task" : "Edit task"}
        </p>

        <div
          className="absolute top-4 right-4 icon-icons8-close tip"
          onClick={onClose}
        ></div>

        <div>
          <label>
            <input
              ref={titleRef}
              className="w-full bg-transparent outline-none"
              id="task-title"
              placeholder="To do something"
              autoFocus
              value={name}
              maxLength={170}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
          </label>

          <label>
            <textarea
              className="resize-none w-full bg-transparent outline-none !text-[#fff] !pb-0 !text-[0.8rem]"
              id="task-comment"
              ref={textareaRef}
              value={comment ?? ""}
              maxLength={300}
              onChange={(e) => {
                setComment(e.target.value);
              }}
              disabled={isSubmitting}
              placeholder="Add a description..."
              style={{
                minHeight: "1em",
                maxHeight: "20em",
                height: "2em",
              }}
            />
          </label>

          <div className="flex gap-2 text-[#888] text-[0.8rem] max-w-[50%]">
            <div className="flex flex-col  items-center gap-2 ">
              <CustomSelect
                position="bottom"
                key="priority-select"
                symbol={"icon-flag"}
                value={priority}
                options={PRIORITY_OPTIONS}
                onChange={setPriority}
              />
            </div>

            <div className="flex flex-col items-center gap-2 ">
              <CustomCalendar
                time={time}
                setTime={setTime}
                date={date}
                setDate={setDate}
              />
            </div>

            <div className="flex flex-col gap-2  ">
              <CustomSelect
                position="bottom"
                key="project-select"
                symbol={"icon-heart-svgrepo-com"}
                value={projectId}
                placeholder="Inbox"
                options={[
                  { value: null, label: "Inbox", icon: "icon-price-tag" },
                  ...projects.map((p) => ({
                    value: p.id,
                    label: p.title,
                    color: p.color,
                  })),
                ]}
                onChange={setProjectId}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end ">
            <button
              className="focus:outline-none focus:border-[#888] focus:ring-1 focus:ring-white/20 cursor-pointer px-3 py-2 border-[0.5px] border-[#888] rounded-lg"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className=" focus:outline-none focus:border-[#888] focus:ring-1 focus:ring-white/20 cursor-pointer px-5 py-2  bg-[#ff648b] hover:shadow-[0_0_10px_#ff648b] disabled:opacity-50 disabled:hover:shadow-none rounded-lg text-white "
              type="submit"
              disabled={!name.trim() || isSubmitting}
            >
              {isSubmitting ? "..." : mode === "create" ? "Add" : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
