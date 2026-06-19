import { useState, useEffect } from "react";
import { Icon } from "./Icon";
import { taskService, Task } from "../services/taskService";

interface TaskDetailsModalProps {
  isOpen: boolean;
  taskId: string | null;
  onClose: () => void;
}

export function TaskDetailsModal({ isOpen, taskId, onClose }: TaskDetailsModalProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && taskId) {
      const fetchDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await taskService.getTask(taskId);
          setTask(data);
        } catch (err: any) {
          console.error(err);
          setError("Failed to load task details. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    } else {
      setTask(null);
      setError(null);
    }
  }, [isOpen, taskId]);

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-error/15 text-error border-error/20";
      case "HIGH":
        return "bg-tertiary/15 text-tertiary border-tertiary/20";
      case "MEDIUM":
        return "bg-primary/15 text-primary border-primary/20";
      default:
        return "bg-outline/15 text-outline border-outline/20";
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-secondary-container/20 text-on-secondary-container border-secondary-container/30";
      case "IN_PROGRESS":
        return "bg-primary-container/20 text-on-primary-container border-primary-container/30";
      case "ARCHIVED":
        return "bg-surface-variant/40 text-on-surface-variant border-outline-variant/30";
      default:
        return "bg-surface-container-highest/50 text-on-surface-variant border-outline-variant/30";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-surface-container-high border border-outline-variant shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
          <h2 className="text-[20px] font-semibold text-on-surface flex items-center gap-2">
            <Icon name="assignment" className="text-primary" /> Task Details
          </h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <Icon name="close" />
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <Icon name="progress_activity" className="animate-spin text-primary" size={36} />
              <span className="text-on-surface-variant text-[14px]">Fetching details...</span>
            </div>
          )}

          {error && (
            <div className="py-6 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-error/15 text-error flex items-center justify-center">
                <Icon name="error" size={24} />
              </div>
              <p className="text-error font-medium">{error}</p>
              <button 
                onClick={onClose} 
                className="mt-2 px-4 py-2 border border-outline-variant text-[12px] font-semibold rounded-lg hover:bg-surface-variant transition-all text-on-surface"
              >
                Close Dialog
              </button>
            </div>
          )}

          {!loading && !error && task && (
            <div className="flex flex-col gap-6">
              {/* Title */}
              <div>
                <h3 className="text-[24px] font-bold text-on-surface tracking-tight leading-tight">
                  {task.title}
                </h3>
              </div>

              {/* Status and Priority Badges */}
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 text-[12px] font-bold rounded-full border ${getPriorityStyle(task.priority)}`}>
                  {task.priority} Priority
                </span>
                <span className={`px-3 py-1 text-[12px] font-bold rounded-full border ${getStatusStyle(task.status)}`}>
                  Status: {task.status.replace("_", " ")}
                </span>
              </div>

              {/* Description */}
              <div className="bg-surface-container/50 border border-outline-variant/30 rounded-xl p-4">
                <h4 className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                  Description
                </h4>
                <p className="text-on-surface text-[15px] leading-relaxed whitespace-pre-wrap">
                  {task.description || <span className="text-outline italic">No description provided.</span>}
                </p>
              </div>

              {/* Metadata (Due Date, Created Date) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-outline-variant/30 pt-4 text-[13px]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface-bright flex items-center justify-center text-on-surface-variant">
                    <Icon name="event" size={20} />
                  </div>
                  <div>
                    <span className="block text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                      Due Date
                    </span>
                    <span className="font-medium text-on-surface">{formatDate(task.dueDate)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface-bright flex items-center justify-center text-on-surface-variant">
                    <Icon name="schedule" size={20} />
                  </div>
                  <div>
                    <span className="block text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                      Created Date
                    </span>
                    <span className="font-medium text-on-surface">{formatDate(task.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="border-t border-outline-variant/30 pt-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="bg-primary text-on-primary px-6 py-2.5 rounded-lg text-[13px] font-semibold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
