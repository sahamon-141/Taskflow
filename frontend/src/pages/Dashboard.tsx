import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Icon } from "../components/Icon";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { taskService, Task, Priority, Status, TaskFilterParams } from "../services/taskService";
import { TaskModal } from "../components/TaskModal";
import { TaskDetailsModal } from "../components/TaskDetailsModal";
import { ConfirmDialog } from "../components/ConfirmDialog";

const PRIORITY_STYLES: Record<Priority, { bar: string; badgeBg: string; badgeText: string; label: string }> = {
  URGENT: { bar: "bg-error", badgeBg: "bg-error/15", badgeText: "text-error", label: "Urgent" },
  HIGH: { bar: "bg-tertiary", badgeBg: "bg-tertiary/15", badgeText: "text-tertiary", label: "High" },
  MEDIUM: { bar: "bg-primary", badgeBg: "bg-primary/15", badgeText: "text-primary", label: "Medium" },
  LOW: { bar: "bg-outline", badgeBg: "bg-outline/15", badgeText: "text-outline", label: "Low" },
};

const STATUS_STYLES: Record<Status, { bg: string; text: string; label: string }> = {
  TODO: { bg: "bg-surface-variant/30", text: "text-on-surface-variant", label: "TODO" },
  IN_PROGRESS: { bg: "bg-primary-container/20", text: "text-on-primary-container", label: "In Progress" },
  COMPLETED: { bg: "bg-secondary-container/20", text: "text-on-secondary-container", label: "Completed" },
  ARCHIVED: { bg: "bg-surface-variant/50", text: "text-on-surface-variant/70", label: "Archived" },
};

export function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Task lists and pagination
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Filters & Sorting state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "ALL">("ALL");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"createdAt" | "dueDate">("createdAt");

  // Modal control states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null); // Null for create, Task object for edit
  const [detailsTaskId, setDetailsTaskId] = useState<string | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [apiActionLoading, setApiActionLoading] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0); // Reset page on new search
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch tasks when filters/pagination/sorting changes
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const filterParams: TaskFilterParams = {
        page,
        size,
        search: debouncedSearch,
        status: statusFilter,
        priority: priorityFilter,
        sortBy,
      };
      const response = await taskService.getTasks(filterParams);
      setTasks(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load tasks from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, debouncedSearch, statusFilter, priorityFilter, sortBy]);

  // Add or edit task submission handler
  const handleSaveTask = async (data: {
    title: string;
    description: string;
    priority: Priority;
    status?: Status;
    dueDate: string;
  }) => {
    try {
      if (activeTask) {
        // Edit mode
        await taskService.updateTask(activeTask.id, {
          title: data.title,
          description: data.description,
          priority: data.priority,
          status: data.status || activeTask.status,
          dueDate: data.dueDate,
        });
        toast.success("Task updated successfully!");
      } else {
        // Create mode
        await taskService.createTask({
          title: data.title,
          description: data.description,
          priority: data.priority,
          dueDate: data.dueDate,
        });
        toast.success("Task created successfully!");
      }
      fetchTasks(); // Reload task grid
    } catch (err: any) {
      console.error(err);
      throw err; // Propagate error to Modal for inline display
    }
  };

  // Delete task action
  const handleDeleteConfirm = async () => {
    if (!deleteTaskId) return;
    setApiActionLoading(true);
    try {
      await taskService.deleteTask(deleteTaskId);
      toast.success("Task deleted successfully!");
      setDeleteTaskId(null);
      fetchTasks();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete task.");
    } finally {
      setApiActionLoading(false);
    }
  };

  // Helper date formatter for cards
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Top Navbar */}
      <nav className="bg-surface-container-low border-b border-outline-variant fixed top-0 left-0 w-full z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-5xl mx-auto h-16">
          <div className="flex items-center gap-10">
            <span className="text-[20px] font-bold text-primary tracking-tight">TaskFlow</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant hover:text-primary transition-all active:scale-90"
              aria-label="Toggle theme"
            >
              <Icon name={theme === "dark" ? "light_mode" : "dark_mode"} size={22} />
            </button>
            <div className="h-6 w-px bg-outline-variant" />
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-[13px] font-semibold text-on-surface-variant">
                {user?.name || user?.email}
              </span>
              <button
                onClick={logout}
                className="px-3.5 py-1.5 border border-outline-variant text-[11px] font-bold uppercase tracking-wider text-on-surface-variant hover:text-error hover:border-error/30 active:scale-95 transition-all rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto pt-24 px-4 md:px-6 pb-16">
        {/* Welcome Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <h1 className="text-[28px] md:text-[32px] font-extrabold text-on-surface mb-1">
              Welcome back{user?.name ? `, ${user.name}` : ""}
            </h1>
            <p className="text-on-surface-variant text-[14px]">
              {loading 
                ? "Checking your schedule..." 
                : `You have ${totalElements} task${totalElements !== 1 ? "s" : ""} registered in the system.`}
            </p>
          </div>
          <button
            onClick={() => {
              setActiveTask(null);
              setIsModalOpen(true);
            }}
            className="bg-primary text-on-primary px-6 py-3.5 rounded-xl text-[12px] font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/10 cursor-pointer"
          >
            <Icon name="add" size={18} />
            Add New Task
          </button>
        </header>

        {/* Filter Section */}
        <section className="bg-surface-container-low border border-outline-variant p-5 rounded-2xl mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Search Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold text-on-surface-variant px-1 uppercase tracking-wider">
                Search Tasks
              </label>
              <div className="relative">
                <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter by title or context..."
                  className="w-full bg-surface-bright border border-outline-variant rounded-lg pl-11 pr-4 py-2 text-[14px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-on-surface placeholder:text-outline"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold text-on-surface-variant px-1 uppercase tracking-wider">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as Status | "ALL");
                  setPage(0);
                }}
                className="w-full bg-surface-bright border border-outline-variant rounded-lg py-2 px-3 text-[14px] focus:outline-none focus:border-primary text-on-surface"
              >
                <option value="ALL">All Statuses</option>
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold text-on-surface-variant px-1 uppercase tracking-wider">
                Filter by Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value as Priority | "ALL");
                  setPage(0);
                }}
                className="w-full bg-surface-bright border border-outline-variant rounded-lg py-2 px-3 text-[14px] focus:outline-none focus:border-primary text-on-surface"
              >
                <option value="ALL">All Priorities</option>
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>

            {/* Sorting Filter */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold text-on-surface-variant px-1 uppercase tracking-wider">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as "createdAt" | "dueDate");
                  setPage(0);
                }}
                className="w-full bg-surface-bright border border-outline-variant rounded-lg py-2 px-3 text-[14px] focus:outline-none focus:border-primary text-on-surface"
              >
                <option value="createdAt">Created Date</option>
                <option value="dueDate">Due Date</option>
              </select>
            </div>
          </div>
        </section>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Icon name="progress_activity" className="animate-spin text-primary" size={40} />
            <span className="text-on-surface-variant text-[14px]">Loading tasks...</span>
          </div>
        ) : (
          /* Task Grid / Cards */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => {
                const priorityStyles = PRIORITY_STYLES[task.priority];
                const statusStyles = STATUS_STYLES[task.status];
                return (
                  <div
                    key={task.id}
                    className="group bg-surface-container border border-outline-variant rounded-xl p-5 flex flex-col justify-between relative overflow-hidden task-card-glow hover:border-primary/20 transition-all duration-300 min-h-[190px]"
                  >
                    {/* Left Accent Priority Line */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${priorityStyles.bar}`} />

                    <div>
                      {/* Priority and Action Menu */}
                      <div className="flex justify-between items-start mb-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full ${priorityStyles.badgeBg} ${priorityStyles.badgeText} text-[11px] font-bold uppercase tracking-wider`}
                        >
                          {priorityStyles.label}
                        </span>
                        
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                          <button
                            onClick={() => setDetailsTaskId(task.id)}
                            className="p-1.5 hover:bg-surface-variant rounded text-on-surface-variant hover:text-primary transition-colors"
                            title="View Details"
                          >
                            <Icon name="visibility" size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setActiveTask(task);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 hover:bg-surface-variant rounded text-on-surface-variant hover:text-primary transition-colors"
                            title="Edit Task"
                          >
                            <Icon name="edit" size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteTaskId(task.id)}
                            className="p-1.5 hover:bg-error/15 rounded text-on-surface-variant hover:text-error transition-colors"
                            title="Delete Task"
                          >
                            <Icon name="delete" size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Task Title */}
                      <h3 className="text-[17px] font-semibold text-on-surface group-hover:text-primary transition-colors leading-tight mb-2 line-clamp-1">
                        {task.title}
                      </h3>

                      {/* Task Description */}
                      <p className="text-on-surface-variant text-[13px] line-clamp-2 leading-relaxed mb-4">
                        {task.description || <span className="text-outline italic">No description</span>}
                      </p>
                    </div>

                    {/* Footer - Due Date and Status */}
                    <div className="flex justify-between items-center border-t border-outline-variant/30 pt-3 text-[12px]">
                      <span className="text-outline flex items-center gap-1 font-medium">
                        <Icon name="event" size={14} />
                        {formatDate(task.dueDate)}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded border ${statusStyles.bg} ${statusStyles.text} font-bold text-[10px] tracking-wide`}
                      >
                        {statusStyles.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {tasks.length === 0 && (
              <div className="py-24 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 mb-6 flex items-center justify-center bg-surface-container-high rounded-full border border-dashed border-outline-variant">
                  <Icon name="assignment_late" className="text-outline" size={32} />
                </div>
                <h3 className="text-[18px] font-semibold text-on-surface mb-2">No tasks found</h3>
                <p className="text-on-surface-variant text-[14px] max-w-sm mb-6">
                  Ready to optimize your workflow? Create a new task and start systematic tracking.
                </p>
                <button
                  onClick={() => {
                    setActiveTask(null);
                    setIsModalOpen(true);
                  }}
                  className="bg-secondary-container text-on-secondary-container px-6 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-95 active:scale-95 transition-all"
                >
                  <Icon name="add_circle" size={16} /> Create Task
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center items-center gap-4">
                <button
                  onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 border border-outline-variant rounded-lg text-[12px] font-bold uppercase tracking-wider flex items-center gap-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-on-surface-variant"
                >
                  <Icon name="chevron_left" size={18} /> Prev
                </button>
                <span className="text-[13px] font-semibold text-on-surface-variant">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 border border-outline-variant rounded-lg text-[12px] font-bold uppercase tracking-wider flex items-center gap-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-on-surface-variant"
                >
                  Next <Icon name="chevron_right" size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Task Creation/Editing Modal */}
      <TaskModal
        isOpen={isModalOpen}
        task={activeTask}
        onClose={() => {
          setIsModalOpen(false);
          setActiveTask(null);
        }}
        onSave={handleSaveTask}
      />

      {/* View Task Details Modal */}
      <TaskDetailsModal
        isOpen={detailsTaskId !== null}
        taskId={detailsTaskId}
        onClose={() => setDetailsTaskId(null)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteTaskId !== null}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action is permanent and cannot be undone."
        loading={apiActionLoading}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTaskId(null)}
      />
    </div>
  );
}
