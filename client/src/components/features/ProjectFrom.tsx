import { useState } from "react";
import type { Project } from "../../types/project";
import { ProjectFormUi } from "../ui/ProjectFrom";
import { OPTIONS } from "../utils/priorities";

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
    <ProjectFormUi
      mode={mode}
      options={OPTIONS}
      count={count}
      color={color}
      name={name}
      isSubmitting={isSubmitting}
      setColor={setColor}
      setName={setName}
      onClose={onClose}
      handleSubmit={handleSubmit}
    />
  );
};
