import { CreateTaskInput, Task, TaskFilters, UpdateTaskInput } from "@/types/task";

export const taskApi = {
  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    const query = new URLSearchParams();
    if (filters?.status) query.set("status", filters.status);
    if (filters?.priority) query.set("priority", filters.priority);
    if (filters?.search) query.set("search", filters.search);

    const res = await fetch(`/api/tasks?${query.toString()}`);
    if (!res.ok) throw new Error("Gagal mengambil data task");
    return res.json();
  },

  async getTaskById(id: string): Promise<Task> {
    const res = await fetch(`/api/tasks/${id}`);
    if (!res.ok) throw new Error("Gagal memuat detail task");
    return res.json();
  },

  async createTask(input: CreateTaskInput): Promise<Task> {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Gagal membuat task");
    return res.json();
  },

  async updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Gagal memperbarui task");
    return res.json();
  },

  async deleteTask(id: string): Promise<void> {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Gagal menghapus task");
  },
};
