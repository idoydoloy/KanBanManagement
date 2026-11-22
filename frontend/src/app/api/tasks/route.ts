import { NextResponse } from "next/server";
import mockDb from "@/data/mock-db.json";
import { getCurrentUserFromCookie } from "@/lib/mock-session";

export async function GET(request: Request) {
  const user = await getCurrentUserFromCookie();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const search = searchParams.get("search")?.toLowerCase().trim();

  let tasks = mockDb.tasks.filter((t) => t.division_id === user.division_id);

  if (status) {
    tasks = tasks.filter((t) => t.status === status);
  }
  if (priority) {
    tasks = tasks.filter((t) => t.priority === priority);
  }
  if (search) {
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(search) ||
        (t.description && t.description.toLowerCase().includes(search))
    );
  }

  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const user = await getCurrentUserFromCookie();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body.title?.trim()) {
    return NextResponse.json({ error: "Judul tugas wajib diisi" }, { status: 400 });
  }

  const newTask = {
    id: `tsk-${Date.now()}`,
    title: body.title.trim(),
    description: body.description?.trim() || "",
    status: body.status || "todo",
    priority: body.priority || "medium",
    division_id: user.division_id,
    assigned_to: body.assigned_to || user.id,
    assignee_name: body.assignee_name || user.name,
    due_date: body.due_date || "",
    created_by: user.id,
    created_at: new Date().toISOString(),
  };

  mockDb.tasks.unshift(newTask);
  return NextResponse.json(newTask, { status: 201 });
}
