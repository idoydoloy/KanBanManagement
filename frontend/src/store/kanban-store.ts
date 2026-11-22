import { create } from "zustand";
import { Task, CreateTaskInput, UpdateTaskInput, TaskFilters } from "@/types/task";

interface KanbanState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (filters?: TaskFilters) => Promise<void>;
  fetchTaskById: (id: string) => Promise<Task | null>;
  addTask: (input: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useKanbanStore = create<KanbanState>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,
  fetchTasks: async () => {},
  fetchTaskById: async () => null,
  addTask: async () => {},
  updateTask: async () => {},
  deleteTask: async () => {},
}));
