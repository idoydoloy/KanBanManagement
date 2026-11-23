export type Role = "platform_admin" | "admin" | "member";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  divisionId: string | null;
  divisionName?: string | null;
  isActive: boolean;
  createdAt?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
