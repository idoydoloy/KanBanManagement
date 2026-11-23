import { NextResponse } from "next/server";
import { getCurrentUserFromCookie } from "@/lib/mock-session";

export async function GET() {
  const user = await getCurrentUserFromCookie();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Sesi tidak ditemukan atau telah kedaluwarsa.", errors: [] },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Profil berhasil diambil.",
    data: {
      user,
    },
  });
}
