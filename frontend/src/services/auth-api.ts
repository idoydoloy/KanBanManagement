import { ApiResponse } from "@/types/api";
import { LoginInput, User } from "@/types/auth";

export const authApi = {
  async login(input: LoginInput): Promise<{ message: string; user: User }> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const data: ApiResponse<{ user: User }> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Gagal masuk ke akun");
    }
    return { message: data.message, user: data.data.user };
  },

  async logout(): Promise<void> {
    await fetch("/api/auth/logout", { method: "POST" });
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch("/api/auth/me");
    const data: ApiResponse<{ user: User }> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Sesi tidak valid");
    }
    return { user: data.data.user };
  },
};
