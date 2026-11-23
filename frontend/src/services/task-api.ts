import { ApiResponse } from "@/types/api";
import { CreateTaskInput, Task, TaskFilters, UpdateTaskInput } from "@/types/task";

export const taskApi = {
  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    const query = new URLSearchParams();
    if (filters?.status) query.set("status", filters.status);
    if (filters?.priority) query.set("priority", filters.priority);
    if (filters?.q) query.set("q", filters.q);
    if (filters?.assigneeId) query.set("assigneeId", filters.assigneeId);

    const res = await fetch(`/api/tasks?${query.toString()}`);
    const data: ApiResponse<{ tasks: Task[]; total: number }> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Gagal mengambil data task");
    }
    return data.data.tasks;
  },

  async getTaskById(id: string): Promise<Task> {
    const res = await fetch(`/api/tasks/${id}`);
    const data: ApiResponse<{ task: Task }> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Gagal memuat detail task");
    }
    return data.data.task;
  },

  async createTask(input: CreateTaskInput): Promise<Task> {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data: ApiResponse<{ task: Task }> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Gagal membuat task");
    }
    return data.data.task;
  },

  async updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data: ApiResponse<{ task: Task }> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Gagal memperbarui task");
    }
    return data.data.task;
  },

  async deleteTask(id: string): Promise<void> {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });
    const data: ApiResponse<null> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Gagal menghapus task");
    }
  },
};
