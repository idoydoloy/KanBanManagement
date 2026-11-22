import { NextResponse } from "next/server";
import mockDb from "@/data/mock-db.json";
import { getCurrentUserFromCookie } from "@/lib/mock-session";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUserFromCookie();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Hanya Admin yang dapat mengubah anggota." }, { status: 403 });
  }

  const { id } = await params;
  const memberIndex = mockDb.users.findIndex(
    (u) => u.id === id && u.division_id === user.division_id
  );

  if (memberIndex === -1) {
    return NextResponse.json({ error: "Anggota tidak ditemukan" }, { status: 404 });
  }

  const updates = await request.json();
  const existing = mockDb.users[memberIndex];

  const updatedMember = {
    ...existing,
    ...updates,
    division_id: existing.division_id, // Prevent altering division
  };

  mockDb.users[memberIndex] = updatedMember;
  const { password: _, ...safeMember } = updatedMember;
  return NextResponse.json(safeMember);
}
