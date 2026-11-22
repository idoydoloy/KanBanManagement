import { create } from "zustand";
import { CreateTaskInput, Task, TaskFilters, TaskPriority, TaskStatus, UpdateTaskInput } from "@/types/task";
import { taskApi } from "@/services/task-api";

interface KanbanState {
  tasks: Task[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  search: string;
  statusFilter: string;
  priorityFilter: string;

  selectedTask: Task | null;
  isCreateOpen: boolean;
  isDetailOpen: boolean;
  isDeleteConfirmOpen: boolean;

  fetchTasks: (customFilters?: TaskFilters) => Promise<void>;
  addTask: (input: CreateTaskInput) => Promise<boolean>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  moveTaskStatus: (id: string, newStatus: TaskStatus) => Promise<boolean>;

  setSearch: (search: string) => void;
  setStatusFilter: (status: string) => void;
  setPriorityFilter: (priority: string) => void;
  resetFilters: () => void;

  setSelectedTask: (task: Task | null) => void;
  openCreate: () => void;
  closeCreate: () => void;
  openDetail: (task: Task) => void;
  closeDetail: () => void;
  openDeleteConfirm: (task: Task) => void;
  closeDeleteConfirm: () => void;
}

export const useKanbanStore = create<KanbanState>((set, get) => ({
  tasks: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  search: "",
  statusFilter: "all",
  priorityFilter: "all",

  selectedTask: null,
  isCreateOpen: false,
  isDetailOpen: false,
  isDeleteConfirmOpen: false,

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

  addTask: async (input: CreateTaskInput) => {
    set({ isSubmitting: true, error: null });
    try {
      await taskApi.createTask(input);
      await get().fetchTasks();
      set({ isSubmitting: false, isCreateOpen: false });
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal menambahkan tugas baru";
      set({ error: message, isSubmitting: false });
      return false;
    }
  },

  updateTask: async (id: string, input: UpdateTaskInput) => {
    set({ isSubmitting: true, error: null });
    try {
      const updated = await taskApi.updateTask(id, input);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
        selectedTask: state.selectedTask?.id === id ? updated : state.selectedTask,
        isSubmitting: false,
      }));
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal memperbarui tugas";
      set({ error: message, isSubmitting: false });
      return false;
    }
  },

  deleteTask: async (id: string) => {
    set({ isSubmitting: true, error: null });
    try {
      await taskApi.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        selectedTask: null,
        isDetailOpen: false,
        isDeleteConfirmOpen: false,
        isSubmitting: false,
      }));
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal menghapus tugas";
      set({ error: message, isSubmitting: false });
      return false;
    }
  },

  moveTaskStatus: async (id: string, newStatus: TaskStatus) => {
    const previousTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)),
    }));

    try {
      await taskApi.updateTask(id, { status: newStatus });
      return true;
    } catch {
      set({ tasks: previousTasks, error: "Gagal memindahkan status tugas" });
      return false;
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

  setSelectedTask: (task: Task | null) => set({ selectedTask: task }),
  openCreate: () => set({ isCreateOpen: true, error: null }),
  closeCreate: () => set({ isCreateOpen: false }),
  openDetail: (task: Task) => set({ selectedTask: task, isDetailOpen: true, error: null }),
  closeDetail: () => set({ isDetailOpen: false }),
  openDeleteConfirm: (task: Task) => set({ selectedTask: task, isDeleteConfirmOpen: true }),
  closeDeleteConfirm: () => set({ isDeleteConfirmOpen: false }),
}));
