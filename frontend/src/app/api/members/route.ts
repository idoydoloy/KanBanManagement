import { NextResponse } from "next/server";
import mockDb from "@/data/mock-db.json";
import { getCurrentUserFromCookie } from "@/lib/mock-session";
import { Member } from "@/types/member";

export async function GET() {
  const user = await getCurrentUserFromCookie();
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized", errors: [] },
      { status: 401 }
    );
  }

  if (user.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Forbidden: Hanya Admin yang dapat mengakses menu anggota.", errors: [] },
      { status: 403 }
    );
  }

  const members: Member[] = mockDb.users
    .filter((u) => u.divisionId === user.divisionId)
    .map(({ password: _, ...safe }) => safe as unknown as Member);

  return NextResponse.json({
    success: true,
    message: "Daftar Member berhasil diambil.",
    data: {
      members,
      total: members.length,
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

  if (user.role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Forbidden", errors: [] },
      { status: 403 }
    );
  }

  const body = await request.json();
  if (!body.name?.trim() || !body.email?.trim()) {
    return NextResponse.json(
      { success: false, message: "Nama dan email anggota wajib diisi.", errors: [] },
      { status: 400 }
    );
  }

  const newMember = {
    id: `usr-${Date.now()}`,
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    password: body.password || "password123",
    role: "member" as const,
    divisionId: user.divisionId || "div-it",
    divisionName: user.divisionName || "Information Technology",
    avatar: body.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    isActive: true,
  };

  mockDb.users.push(newMember);
  const { password: _, ...safeMember } = newMember;

  return NextResponse.json(
    {
      success: true,
      message: "Member berhasil dibuat.",
      data: {
        member: safeMember,
      },
    },
    { status: 201 }
  );
}
