import type { Project } from "../../types/project";
import "./date.css";
import { CustomSelect } from "../features/CustomSelect";
import { CustomCalendar } from "../features/Calendar";
import "react-datepicker/dist/react-datepicker.css";
import { PRIORITY_OPTIONS } from "../utils/priorities";
import TextareaAutosize from "react-textarea-autosize";
import { useTranslation } from "react-i18next";

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
  isSubTaskForm: boolean;
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
  isSubTaskForm,
  setComment,
  projects,
  containerRef,
  isSubmitting,
  handleSubmit,
  onClose,
  titleRef,
}: TaskFormUiProps) => {
  console.log("task form render");
  const { t } = useTranslation();

  return (
    <form
      ref={containerRef}
      className="bg-white dark:bg-[#1f1f1f] mt-1 round-2  relative p-5 border-[0.5px] border-black/10 dark:border-[#d0d0d05a]/60 rounded-lg shadow-xl !max-w-[838px]"
      id="task-form"
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}
    >
      <p className="text-2 text-black dark:text-white border-b border-black/10 dark:border-[#d0d0d05a]/60 mb-2 pb-2">
        {mode === "edit" ? t("edit_task") : t("add_task")}
      </p>

      <div
        className="absolute top-4 right-4 icon-icons8-close flex items-center justify-center leading-none bg-transparent p-[0.3em] rounded-[8px] cursor-pointer hover:bg-black/5 dark:hover:bg-[#82828241] text-black dark:text-white transition-colors"
        onClick={onClose}
      ></div>

      <div>
        <label>
          <input
            ref={titleRef}
            className="w-full bg-transparent outline-none text-black dark:text-white"
            id="task-title"
            placeholder={t("task_title_placeholder")}
            autoFocus
            value={name}
            maxLength={170}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
          />
        </label>

        <label>
          <TextareaAutosize
            placeholder={t("comment_placeholder")}
            minRows={1}
            maxRows={10}
            value={comment || undefined}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            className="resize-none w-full bg-transparent outline-none text-black dark:text-[#fff] text-[0.9em]"
          />
        </label>

        <div className="flex gap-2 text-[#888] text-[0.8rem] max-w-[100%] sm:max-w-[50%]">
          <div className="flex flex-col items-center gap-2">
            <CustomSelect
              position="bottom-start"
              key="priority-select"
              symbol={"icon-flag"}
              value={priority}
              options={PRIORITY_OPTIONS.map((opt) => ({
                ...opt,
                label: t(opt.label.toLowerCase()),
              }))}
              onChange={setPriority}
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            <CustomCalendar
              time={time}
              setTime={setTime}
              date={date}
              setDate={setDate}
            />
          </div>

          {!isSubTaskForm && (
            <div className="flex flex-col gap-2">
              <CustomSelect
                position="bottom-start"
                key="project-select"
                symbol={"icon-heart-svgrepo-com"}
                value={projectId}
                placeholder={t("inbox")}
                options={[
                  { value: null, label: t("inbox"), icon: "icon-inbox" },
                  ...projects.map((p) => ({
                    value: p.id,
                    label: p.title,
                    color: p.color,
                  })),
                ]}
                onChange={setProjectId}
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end mt-4">
          <button
            className="cursor-pointer px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t("cancel")}
          </button>
          <button
            className="focus:outline-none focus:border-[#888] focus:ring-1 focus:ring-white/20 cursor-pointer px-5 py-2 bg-[#9d174d] hover:shadow-[0_0_10px_#9d174d] disabled:opacity-50 disabled:hover:shadow-none rounded-lg text-white font-medium"
            type="submit"
            disabled={!name.trim() || isSubmitting}
          >
            {isSubmitting
              ? "..."
              : mode === "create"
              ? t("add_btn")
              : t("save_btn")}
          </button>
        </div>
      </div>
    </form>
  );
};
