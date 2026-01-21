import { CustomSelect } from "../features/CustomSelect";
type Option = {
  value: string;
  label: string;
  color?: string;
};
interface ProjectFormProps {
  mode: "create" | "edit";
  options: Option[];
  count: number;
  name: string;
  color: string;
  isSubmitting: boolean;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const ProjectFormUi = ({
  mode,
  options,
  name,
  color,
  setColor,
  count,
  setName,
  isSubmitting,

  onClose,
  handleSubmit,
}: ProjectFormProps) => {
  return (
    <div
      className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[40em] min-w-fit bg-[#242424] p-5 rounded-lg shadow-xl"
      >
        {/* Title */}
        <h2 className=" text-2 text-white border-b  border-[#d0d0d05a]/60 mb-2 pb-2">
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
            Color
            <CustomSelect
              position="bottom-start"
              symbol="dot"
              value={color}
              options={options.map((o) => ({
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
              className="cursor-pointer px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="cursor-pointer  px-6 py-2  bg-[#9d174d] hover:shadow-[0_0_10px_#9d174d] disabled:opacity-50 disabled:hover:shadow-none rounded-lg text-white transition-all"
            >
              {isSubmitting ? "..." : mode === "create" ? "Add" : "Save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
