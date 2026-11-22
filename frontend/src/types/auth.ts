export type Role = "admin" | "member";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  division_id: string;
  division_name?: string;
  created_at?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
