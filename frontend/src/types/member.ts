import { Role } from "./auth";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  divisionId: string;
  isActive: boolean;
  createdAt?: string;
}

export interface CreateMemberInput {
  name: string;
  email: string;
  password?: string;
}

export interface UpdateMemberInput {
  name?: string;
  email?: string;
}
