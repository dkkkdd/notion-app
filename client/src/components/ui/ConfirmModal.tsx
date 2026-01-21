interface ConfirmModalProps {
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  title: string;
  message?: React.ReactNode; // Тело сообщения
  confirmText?: string; // Текст на главной кнопке
  cancelText?: string; // Текст на кнопке отмены
  variant?: "danger" | "primary" | "warning";
  isLoading?: boolean;
}

export const ConfirmModal = ({
  onConfirm,
  onClose,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) => {
  const variantStyles = {
    danger: "bg-[#9d174d] hover:shadow-[0_0_15px_rgba(157,23,77,0.4)]",
    primary: "bg-[#4270d1] hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]",
    warning: "bg-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.4)]",
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-start pt-[15%] z-[1000] p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#222] w-full max-w-[400px] p-6 rounded-lg border border-white/5 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <h2 className="text-xl font-bold text-white border-b border-white/10 pb-3">
          {title}
        </h2>

        {/* Body */}
        <div className="text-gray-400 text-sm leading-relaxed">
          {message || "Are you sure you want to proceed?"}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end mt-2">
          <button
            disabled={isLoading}
            className="cursor-pointer px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            onClick={onClose}
          >
            {cancelText}
          </button>

          <button
            disabled={isLoading}
            onClick={async () => {
              await onConfirm();
              onClose();
            }}
            className={`
              cursor-pointer px-6 py-2.5 text-sm font-bold rounded-lg text-white transition-all 
              active:scale-95 disabled:opacity-50 disabled:pointer-events-none
              ${variantStyles[variant]}
            `}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
