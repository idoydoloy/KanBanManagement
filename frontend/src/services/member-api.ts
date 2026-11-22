import { Member } from "@/types/member";

export const memberApi = {
  async getMembers(): Promise<Member[]> {
    const res = await fetch("/api/members");
    if (!res.ok) throw new Error("Gagal memuat daftar anggota");
    return res.json();
  },

  async addMember(input: { name: string; email: string; role: string }): Promise<Member> {
    const res = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Gagal menambahkan anggota");
    return res.json();
  },

  async updateMember(id: string, input: Partial<Member>): Promise<Member> {
    const res = await fetch(`/api/members/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Gagal memperbarui data anggota");
    return res.json();
  },

  async updateMemberStatus(id: string, status: "active" | "inactive"): Promise<void> {
    const res = await fetch(`/api/members/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Gagal memperbarui status anggota");
  },
};
