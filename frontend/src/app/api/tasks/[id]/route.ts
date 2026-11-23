import { NextResponse } from "next/server";
import mockDb from "@/data/mock-db.json";
import { getCurrentUserFromCookie } from "@/lib/mock-session";
import { Task, TaskAssignee } from "@/types/task";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUserFromCookie();
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", errors: [] },
      { status: 401 }
    );
  }

  const { id } = await params;
  const task = (mockDb.tasks as unknown as Task[]).find(
    (t) => t.id === id && t.divisionId === user.divisionId
  );
  if (!task) {
    return NextResponse.json(
      { success: false, message: "Tugas tidak ditemukan.", errors: [] },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Detail task berhasil diambil.",
    data: {
      task,
    },
  });
}

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

  const { id } = await params;
  const taskList = mockDb.tasks as unknown as Task[];
  const taskIndex = taskList.findIndex(
    (t) => t.id === id && t.divisionId === user.divisionId
  );
  if (taskIndex === -1) {
    return NextResponse.json(
      { success: false, message: "Tugas tidak ditemukan.", errors: [] },
      { status: 404 }
    );
  }

  const updates = await request.json();
  const existing = taskList[taskIndex];

  let assignees = existing.assignees;
  if (Array.isArray(updates.assigneeIds)) {
    assignees = mockDb.users
      .filter((u) => updates.assigneeIds.includes(u.id))
      .map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        assignedAt: new Date().toISOString(),
      }));
  }

  const updatedTask: Task = {
    ...existing,
    title: updates.title !== undefined ? updates.title : existing.title,
    description: updates.description !== undefined ? updates.description : existing.description,
    status: updates.status !== undefined ? updates.status : existing.status,
    priority: updates.priority !== undefined ? updates.priority : existing.priority,
    dueDate: updates.dueDate !== undefined ? updates.dueDate : updates.due_date !== undefined ? updates.due_date : existing.dueDate,
    divisionId: existing.divisionId,
    assignees,
    updatedAt: new Date().toISOString(),
  };

  taskList[taskIndex] = updatedTask;

  return NextResponse.json({
    success: true,
    message: "Task berhasil diperbarui.",
    data: {
      task: updatedTask,
    },
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUserFromCookie();
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", errors: [] },
      { status: 401 }
    );
  }

  const { id } = await params;
  const taskList = mockDb.tasks as unknown as Task[];
  const taskIndex = taskList.findIndex(
    (t) => t.id === id && t.divisionId === user.divisionId
  );
  if (taskIndex === -1) {
    return NextResponse.json(
      { success: false, message: "Tugas tidak ditemukan.", errors: [] },
      { status: 404 }
    );
  }

  taskList.splice(taskIndex, 1);

  return NextResponse.json({
    success: true,
    message: "Task berhasil dihapus.",
    data: null,
  });
}
