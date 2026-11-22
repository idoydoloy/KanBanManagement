import { NextResponse } from "next/server";
import { getCurrentUserFromCookie } from "@/lib/mock-session";

export async function GET() {
  const user = await getCurrentUserFromCookie();

  if (!user) {
    return NextResponse.json(
      { error: "Sesi tidak ditemukan atau telah kedaluwarsa." },
      { status: 401 }
    );
  }

  return NextResponse.json({ user });
}
