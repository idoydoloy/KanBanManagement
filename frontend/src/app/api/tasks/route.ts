import { NextResponse } from "next/server";
import mockDb from "@/data/mock-db.json";
import { getCurrentUserFromCookie } from "@/lib/mock-session";
import { Task, TaskAssignee } from "@/types/task";

export async function GET(request: Request) {
  const user = await getCurrentUserFromCookie();
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", errors: [] },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const q = (searchParams.get("q") || searchParams.get("search"))?.toLowerCase().trim();
  const assigneeId = searchParams.get("assigneeId");

  let tasks = (mockDb.tasks as unknown as Task[]).filter(
    (t) => t.divisionId === user.divisionId
  );

  if (status && status !== "all") {
    tasks = tasks.filter((t) => t.status === status);
  }
  if (priority && priority !== "all") {
    tasks = tasks.filter((t) => t.priority === priority);
  }
  if (q) {
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
    );
  }
  if (assigneeId) {
    tasks = tasks.filter((t) => t.assignees?.some((a) => a.id === assigneeId));
  }

  return NextResponse.json({
    success: true,
    message: "Daftar task berhasil diambil.",
    data: {
      tasks,
      total: tasks.length,
    },
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUserFromCookie();
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", errors: [] },
      { status: 401 }
    );
  }

  const body = await request.json();
  if (!body.title?.trim()) {
    return NextResponse.json(
      { success: false, message: "Judul tugas wajib diisi.", errors: [] },
      { status: 400 }
    );
  }

  const assigneeIds: string[] = body.assigneeIds || (body.assigned_to ? [body.assigned_to] : [user.id]);
  const matchedAssignees: TaskAssignee[] = mockDb.users
    .filter((u) => assigneeIds.includes(u.id))
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      assignedAt: new Date().toISOString(),
    }));

  const newTask: Task = {
    id: `tsk-${Date.now()}`,
    title: body.title.trim(),
    description: body.description?.trim() || null,
    status: body.status || "todo",
    priority: body.priority || "medium",
    divisionId: user.divisionId || "div-it",
    dueDate: body.dueDate || body.due_date || null,
    createdBy: user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignees: matchedAssignees,
  };

  (mockDb.tasks as unknown as Task[]).unshift(newTask);

  return NextResponse.json(
    {
      success: true,
      message: "Task berhasil dibuat.",
      data: {
        task: newTask,
      },
    },
    { status: 201 }
  );
}
