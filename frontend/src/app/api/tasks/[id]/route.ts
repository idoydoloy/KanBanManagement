import { NextResponse } from "next/server";
import mockDb from "@/data/mock-db.json";
import { getCurrentUserFromCookie } from "@/lib/mock-session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUserFromCookie();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const task = mockDb.tasks.find((t) => t.id === id && t.division_id === user.division_id);
  if (!task) return NextResponse.json({ error: "Tugas tidak ditemukan" }, { status: 404 });

  return NextResponse.json(task);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUserFromCookie();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const taskIndex = mockDb.tasks.findIndex(
    (t) => t.id === id && t.division_id === user.division_id
  );
  if (taskIndex === -1) {
    return NextResponse.json({ error: "Tugas tidak ditemukan" }, { status: 404 });
  }

  const updates = await request.json();
  const existing = mockDb.tasks[taskIndex];

  const updatedTask = {
    ...existing,
    ...updates,
    division_id: existing.division_id, // Prevent tampering division
  };

  mockDb.tasks[taskIndex] = updatedTask;
  return NextResponse.json(updatedTask);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUserFromCookie();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const taskIndex = mockDb.tasks.findIndex(
    (t) => t.id === id && t.division_id === user.division_id
  );
  if (taskIndex === -1) {
    return NextResponse.json({ error: "Tugas tidak ditemukan" }, { status: 404 });
  }

  mockDb.tasks.splice(taskIndex, 1);
  return NextResponse.json({ success: true, message: "Tugas berhasil dihapus" });
}
