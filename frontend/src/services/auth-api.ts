import { LoginInput, User } from "@/types/auth";

export const authApi = {
  async login(input: LoginInput): Promise<{ message: string; user: User }> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Gagal masuk ke akun");
    }
    return data;
  },

  async logout(): Promise<void> {
    await fetch("/api/auth/logout", { method: "POST" });
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Sesi tidak valid");
    }
    return data;
  },
};
