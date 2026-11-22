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
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const memberIndex = mockDb.users.findIndex(
    (u) => u.id === id && u.division_id === user.division_id
  );

  if (memberIndex === -1) {
    return NextResponse.json({ error: "Anggota tidak ditemukan" }, { status: 404 });
  }

  const { status } = await request.json();
  if (status !== "active" && status !== "inactive") {
    return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
  }

  mockDb.users[memberIndex].status = status;
  return NextResponse.json({ success: true, message: "Status anggota berhasil diperbarui" });
}
