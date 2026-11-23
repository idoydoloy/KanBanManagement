import { NextResponse } from "next/server";
import mockDb from "@/data/mock-db.json";
import { getCurrentUserFromCookie } from "@/lib/mock-session";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUserFromCookie();
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", errors: [] },
      { status: 401 }
    );
  }

  if (user.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Forbidden: Hanya Admin yang dapat mengubah anggota.", errors: [] },
      { status: 403 }
    );
  }

  const { id } = await params;
  const memberIndex = mockDb.users.findIndex(
    (u) => u.id === id && u.divisionId === user.divisionId
  );

  if (memberIndex === -1) {
    return NextResponse.json(
      { success: false, message: "Anggota tidak ditemukan.", errors: [] },
      { status: 404 }
    );
  }

  const updates = await request.json();
  const existing = mockDb.users[memberIndex];

  const updatedMember = {
    ...existing,
    name: updates.name ? updates.name.trim() : existing.name,
    email: updates.email ? updates.email.trim().toLowerCase() : existing.email,
    role: updates.role ? updates.role : existing.role,
    divisionId: existing.divisionId,
  };

  mockDb.users[memberIndex] = updatedMember;
  const { password: _, ...safeMember } = updatedMember;

  return NextResponse.json({
    success: true,
    message: "Data Member berhasil diperbarui.",
    data: {
      member: safeMember,
    },
  });
}
