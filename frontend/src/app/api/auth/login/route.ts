import { NextResponse } from "next/server";
import mockDb from "@/data/mock-db.json";
import { setSessionCookie } from "@/lib/mock-session";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password wajib diisi.", errors: [] },
        { status: 400 }
      );
    }

    const user = mockDb.users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, message: "Email atau password salah.", errors: [] },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: "Akun ini telah dinonaktifkan.", errors: [] },
        { status: 403 }
      );
    }

    await setSessionCookie(user.id);

    const { password: _, ...safeUser } = user;
    return NextResponse.json({
      success: true,
      message: "Login berhasil.",
      data: {
        user: safeUser,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server.", errors: [] },
      { status: 500 }
    );
  }
}
