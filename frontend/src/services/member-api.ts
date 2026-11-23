import { ApiResponse } from "@/types/api";
import { CreateMemberInput, Member, UpdateMemberInput } from "@/types/member";

export const memberApi = {
  async getMembers(): Promise<Member[]> {
    const res = await fetch("/api/members");
    const data: ApiResponse<{ members: Member[]; total: number }> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Gagal memuat daftar anggota");
    }
    return data.data.members;
  },

  async addMember(input: CreateMemberInput): Promise<Member> {
    const res = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data: ApiResponse<{ member: Member }> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Gagal menambahkan anggota");
    }
    return data.data.member;
  },

  async updateMember(id: string, input: UpdateMemberInput): Promise<Member> {
    const res = await fetch(`/api/members/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data: ApiResponse<{ member: Member }> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Gagal memperbarui data anggota");
    }
    return data.data.member;
  },

  async updateMemberStatus(id: string, isActive: boolean): Promise<Member> {
    const res = await fetch(`/api/members/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    const data: ApiResponse<{ member: Member }> = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Gagal memperbarui status anggota");
    }
    return data.data.member;
  },
};
