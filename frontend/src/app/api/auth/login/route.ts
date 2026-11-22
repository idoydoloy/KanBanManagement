import { NextResponse } from "next/server";
import mockDb from "@/data/mock-db.json";
import { setSessionCookie } from "@/lib/mock-session";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const user = mockDb.users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Email atau password salah." },
        { status: 401 }
      );
    }

    await setSessionCookie(user.id);

    const { password: _, ...safeUser } = user;
    return NextResponse.json({
      message: "Login berhasil",
      user: safeUser,
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}
