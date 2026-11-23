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
      { success: false, message: "Forbidden", errors: [] },
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

  const body = await request.json();
  const nextIsActive =
    typeof body.isActive === "boolean"
      ? body.isActive
      : body.status === "active";

  mockDb.users[memberIndex].isActive = nextIsActive;
  const { password: _, ...safeMember } = mockDb.users[memberIndex];

  return NextResponse.json({
    success: true,
    message: nextIsActive
      ? "Member berhasil diaktifkan."
      : "Member berhasil dinonaktifkan dan seluruh session dicabut.",
    data: {
      member: safeMember,
    },
  });
}
