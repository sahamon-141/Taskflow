import { useState, useEffect } from "react";
import { Icon } from "./Icon";
import { Priority, Status, Task } from "../services/taskService";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    description: string;
    priority: Priority;
    status?: Status;
    dueDate: string;
  }) => Promise<void>;
  task?: Task | null;
}

export function TaskModal({ isOpen, onClose, onSave, task }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [status, setStatus] = useState<Status>("TODO");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state if editing a task
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setStatus(task.status);
      
      // Convert backend date "2026-06-01T18:00:00" to "2026-06-01T18:00" for datetime-local input
      if (task.dueDate) {
        const datePart = task.dueDate.split(":");
        if (datePart.length > 2) {
          // Removes the seconds part e.g. "2026-06-01T18:00"
          setDueDate(task.dueDate.substring(0, 16));
        } else {
          setDueDate(task.dueDate);
        }
      } else {
        setDueDate("");
      }
    } else {
      // Clear fields for new task
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setStatus("TODO");
      // Default due date: tomorrow at 18:00
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(18, 0, 0, 0);
      const isoStr = tomorrow.toISOString(); // YYYY-MM-DDTHH:mm:ss.sssZ
      setDueDate(isoStr.substring(0, 16)); // YYYY-MM-DDTHH:mm
    }
    setError(null);
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError(null);

    // Format dueDate back to what the backend expects (YYYY-MM-DDTHH:mm:ss)
    let formattedDueDate = dueDate;
    if (dueDate && dueDate.length === 16) {
      formattedDueDate = `${dueDate}:00`;
    }

    try {
      await onSave({
        title,
        description,
        priority,
        ...(task ? { status } : {}), // only include status when editing
        dueDate: formattedDueDate,
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        "Failed to save task. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
        onClick={loading ? undefined : onClose} 
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-surface-container-high border border-outline-variant shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
          <h2 className="text-[20px] font-semibold text-on-surface">
            {task ? "Edit Task" : "New Task"}
          </h2>
          <button 
            onClick={onClose} 
            disabled={loading}
            className="text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50"
          >
            <Icon name="close" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-4 bg-error-container/20 border border-error/30 rounded-lg text-error text-[14px] flex items-center gap-2">
            <Icon name="error" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1">
            <label htmlFor="task-title" className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Title
            </label>
            <input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              type="text"
              required
              placeholder="What needs to be done?"
              className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 text-[14px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-on-surface"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label htmlFor="task-desc" className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Description
            </label>
            <textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={3}
              placeholder="Add some details..."
              className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 text-[14px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-on-surface resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Priority */}
            <div className="flex flex-col gap-1">
              <label htmlFor="task-priority" className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Priority
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                disabled={loading}
                className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 text-[14px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-on-surface appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dae2fd'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '20px',
                  backgroundRepeat: 'no-repeat',
                  paddingRight: '36px'
                }}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>

            {/* Status (Only in Edit mode) */}
            {task ? (
              <div className="flex flex-col gap-1">
                <label htmlFor="task-status" className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
                  Status
                </label>
                <select
                  id="task-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Status)}
                  disabled={loading}
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 text-[14px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-on-surface appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dae2fd'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '20px',
                    backgroundRepeat: 'no-repeat',
                    paddingRight: '36px'
                  }}
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
            ) : (
              /* Due Date (Create mode) - spanning full width or adjacent */
              <div className="flex flex-col gap-1">
                <label htmlFor="task-due-date" className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
                  Due Date
                </label>
                <input
                  id="task-due-date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={loading}
                  type="datetime-local"
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 text-[14px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-on-surface"
                />
              </div>
            )}
          </div>

          {/* Due Date (In Edit mode, since Status takes the 2nd slot in the grid) */}
          {task && (
            <div className="flex flex-col gap-1">
              <label htmlFor="task-due-date-edit" className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Due Date
              </label>
              <input
                id="task-due-date-edit"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={loading}
                type="datetime-local"
                className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 text-[14px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-on-surface"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant/30 mt-2">
            <button
              onClick={onClose}
              type="button"
              disabled={loading}
              className="px-5 py-2.5 text-on-surface-variant hover:text-on-surface text-[12px] font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-on-primary px-8 py-2.5 rounded-lg text-[12px] font-semibold uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Icon name="progress_activity" className="animate-spin" size={16} /> Saving...
                </>
              ) : (
                "Save Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
