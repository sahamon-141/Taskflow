import { Icon } from "./Icon";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/85 backdrop-blur-sm transition-opacity duration-200" 
        onClick={loading ? undefined : onCancel} 
      />
      
      {/* Dialog Content */}
      <div className="relative w-full max-w-md bg-surface-container-high border border-outline-variant shadow-2xl rounded-2xl overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-error/15 text-error flex items-center justify-center shrink-0">
            <Icon name="warning" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-[18px] font-semibold text-on-surface mb-2">{title}</h3>
            <p className="text-on-surface-variant text-[14px] leading-relaxed">{message}</p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-on-surface-variant hover:text-on-surface text-[13px] font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="bg-error text-on-error-container hover:bg-error/95 px-5 py-2.5 rounded-lg text-[13px] font-bold uppercase tracking-wider flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Icon name="progress_activity" className="animate-spin" size={16} /> Deleting...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
