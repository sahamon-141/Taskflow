import api from "./api";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type Status = "TODO" | "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  createdAt: string;
}

export interface TaskPageResponse {
  content: Task[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface TaskFilterParams {
  page?: number;
  size?: number;
  search?: string;
  status?: Status | "ALL";
  priority?: Priority | "ALL";
  sortBy?: "createdAt" | "dueDate";
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string; // ISO string e.g. "2026-06-01T18:00:00"
}

export interface UpdateTaskPayload {
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string; // ISO string e.g. "2026-06-01T18:00:00"
}

export const taskService = {
  getTasks: async (params: TaskFilterParams): Promise<TaskPageResponse> => {
    const queryParams: Record<string, any> = {
      page: params.page ?? 0,
      size: params.size ?? 20,
    };

    if (params.search?.trim()) {
      queryParams.search = params.search;
    }
    if (params.status && params.status !== "ALL") {
      queryParams.status = params.status;
    }
    if (params.priority && params.priority !== "ALL") {
      queryParams.priority = params.priority;
    }
    if (params.sortBy) {
      queryParams.sortBy = params.sortBy;
    }

    const response = await api.get<TaskPageResponse>("/api/tasks", {
      params: queryParams,
    });
    return response.data;
  },

  getTask: async (taskId: string): Promise<Task> => {
    const response = await api.get<Task>(`/api/tasks/${taskId}`);
    return response.data;
  },

  createTask: async (payload: CreateTaskPayload): Promise<Task> => {
    const response = await api.post<Task>("/api/tasks", payload);
    return response.data;
  },

  updateTask: async (taskId: string, payload: UpdateTaskPayload): Promise<Task> => {
    const response = await api.put<Task>(`/api/tasks/${taskId}`, payload);
    return response.data;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await api.delete(`/api/tasks/${taskId}`);
  },
};
