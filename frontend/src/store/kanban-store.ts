import { create } from "zustand";
import { Task, TaskFilters, TaskPriority, TaskStatus } from "@/types/task";
import { taskApi } from "@/services/task-api";

interface KanbanState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  search: string;
  statusFilter: string;
  priorityFilter: string;

  fetchTasks: (customFilters?: TaskFilters) => Promise<void>;
  setSearch: (search: string) => void;
  setStatusFilter: (status: string) => void;
  setPriorityFilter: (priority: string) => void;
  resetFilters: () => void;
}

export const useKanbanStore = create<KanbanState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  search: "",
  statusFilter: "all",
  priorityFilter: "all",

  fetchTasks: async (customFilters?: TaskFilters) => {
    set({ isLoading: true, error: null });
    try {
      const { search, statusFilter, priorityFilter } = get();

      const activeFilters: TaskFilters = {
        search: customFilters?.search ?? (search ? search : undefined),
        status:
          customFilters?.status ??
          (statusFilter !== "all" ? (statusFilter as TaskStatus) : undefined),
        priority:
          customFilters?.priority ??
          (priorityFilter !== "all" ? (priorityFilter as TaskPriority) : undefined),
      };

      const tasks = await taskApi.getTasks(activeFilters);
      set({ tasks, isLoading: false, error: null });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal memuat daftar tugas";
      set({ error: message, isLoading: false });
    }
  },

  setSearch: (search: string) => {
    set({ search });
    get().fetchTasks();
  },

  setStatusFilter: (statusFilter: string) => {
    set({ statusFilter });
    get().fetchTasks();
  },

  setPriorityFilter: (priorityFilter: string) => {
    set({ priorityFilter });
    get().fetchTasks();
  },

  resetFilters: () => {
    set({ search: "", statusFilter: "all", priorityFilter: "all" });
    get().fetchTasks({ search: undefined, status: undefined, priority: undefined });
  },
}));
