import { NextResponse } from "next/server";
import mockDb from "@/data/mock-db.json";
import { getCurrentUserFromCookie } from "@/lib/mock-session";

export async function GET() {
  const user = await getCurrentUserFromCookie();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Hanya Admin yang dapat mengakses menu anggota." },
      { status: 403 }
    );
  }

  const members = mockDb.users
    .filter((u) => u.division_id === user.division_id)
    .map(({ password: _, ...safe }) => safe);

  return NextResponse.json(members);
}

export async function POST(request: Request) {
  const user = await getCurrentUserFromCookie();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  if (!body.name?.trim() || !body.email?.trim()) {
    return NextResponse.json(
      { error: "Nama dan email anggota wajib diisi" },
      { status: 400 }
    );
  }

  const newMember = {
    id: `usr-${Date.now()}`,
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    password: "password123",
    role: body.role === "admin" ? ("admin" as const) : ("member" as const),
    division_id: user.division_id,
    division_name: user.division_name,
    avatar: body.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    status: "active" as const,
  };

  mockDb.users.push(newMember);
  const { password: _, ...safeMember } = newMember;
  return NextResponse.json(safeMember, { status: 201 });
}
