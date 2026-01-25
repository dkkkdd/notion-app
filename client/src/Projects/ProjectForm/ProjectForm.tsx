import { useState } from "react";
import { CustomSelect } from "../../components/features/CustomSelect";
import type { Project } from "../../types/project";
import { useTranslation } from "react-i18next";

type ColorOption = { value: string; label: string };
const OPTIONS: ColorOption[] = [
  { label: "Grey", value: "#8c8c8c" },
  { label: "Pink", value: "#ff69b4" },
  { label: "Red", value: "#ff4d4f" },
  { label: "Orange", value: "#fa8c16" },
  { label: "Yellow", value: "#fadb14" },
  { label: "Green", value: "#52c41a" },
  { label: "Teal", value: "#13c2c2" },
  { label: "Blue", value: "#1677ff" },
  { label: "Purple", value: "#722ed1" },
  { label: "Magenta", value: "#eb2f96" },
];

export interface ProjectFormProps {
  mode: "create" | "edit";
  initialProject?: Project;
  onSubmit: (data: { title: string; color: string }) => void | Promise<void>;
  onClose: () => void;
}

export const ProjectForm = ({
  mode,
  initialProject,
  onSubmit,
  onClose,
}: ProjectFormProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState(initialProject?.title ?? "");
  const [color, setColor] = useState(
    initialProject?.color ?? OPTIONS[0]?.value ?? "#8c8c8c"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit({ title: name, color });
      onClose();
    } catch (error) {
      console.error("Failed to submit project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const count = name.length;

  return (
    // Backdrop (modal)
    <div
      className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[600px] min-w-[320px] bg-[var(--backColor)] p-5 rounded-lg shadow-xl"
      >
        {/* Title */}
        <h2 className="text-xl font-medium border-b border-[#82828238] pb-2 mb-4 text-left">
          {mode === "create" ? "Add project" : "Edit project"}
        </h2>

        {/* Close button */}
        <div
          className="absolute top-5 right-5 tip icon-icons8-close text-xl cursor-pointer hover:bg-white/10 rounded-md p-1"
          onClick={onClose}
        />

        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-1.5">
            <input
              className="w-full bg-transparent p-3 h-auto border-[0.5px] border-[#d0d0d05a]/60 outline-none rounded-lg text-white block box-border"
              id="project-title"
              placeholder="Project name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <span
              className="text-[11px] self-start"
              style={{
                color:
                  count === 80 ? "#ff4d4f" : count > 65 ? "#fa8c16" : "#888",
              }}
            >
              {count}/80
            </span>
          </div>

          <div className="flex flex-col gap-2 items-start text-sm text-[#888]">
            {t("color")}
            <CustomSelect
              position="right"
              symbol="dot"
              value={color}
              options={OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
                color: o.value,
              }))}
              onChange={setColor}
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer px-3 py-2 border-[0.5px] border-[#888] rounded-lg"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="cursor-pointer  px-6 py-2  bg-[#ff648b] hover:shadow-[0_0_10px_#ff648b] disabled:opacity-50 disabled:hover:shadow-none rounded-lg text-white transition-all"
            >
              {isSubmitting ? "..." : mode === "create" ? "Add" : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
