import { LoginInput, User } from "@/types/auth";

export const authApi = {
  async login(input: LoginInput): Promise<{ user: User }> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Gagal login");
    return res.json();
  },

  async logout(): Promise<void> {
    await fetch("/api/auth/logout", { method: "POST" });
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch("/api/auth/me");
    if (!res.ok) throw new Error("Sesi tidak valid");
    return res.json();
  },
};
